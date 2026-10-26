import { prisma } from "@/lib/prisma";

export interface CartCalculationItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CalculatedOrderItem {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  featuredImage: string;
}

export interface AuthoritativePriceSummary {
  items: CalculatedOrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  freeShippingQualified: boolean;
}

const DEFAULT_FREE_SHIPPING_THRESHOLD = 1500;
const STANDARD_SHIPPING_FEE = 99;

// Known legacy / demo ID aliases to ensure zero cart breakage from older client state
const LEGACY_PRODUCT_ALIASES: Record<string, string> = {
  "hibiscus-soap": "hibiscus-rosa-bath-soap",
  "neem-soap": "neem-bath-soap",
  "turmeric-soap": "vetti-veru-bath-soap",
  "coconut-soap": "coconut-bath-soap",
};

/**
 * Authoritatively calculates cart totals against database product records.
 * Never trusts prices, discounts, or subtotals sent from browser client.
 */
export async function calculateAuthoritativeCart(
  requestedItems: CartCalculationItem[]
): Promise<AuthoritativePriceSummary> {
  if (!requestedItems || requestedItems.length === 0) {
    throw new Error("EMPTY_CART: Cannot calculate price for empty items list");
  }

  // 1. Fetch live products from database (supporting both database IDs and slugs, plus aliases)
  const rawProductIds = requestedItems.map((item) => item.productId);
  const aliasTargets = rawProductIds.map((id) => LEGACY_PRODUCT_ALIASES[id] || id);
  const queryTokens = Array.from(new Set([...rawProductIds, ...aliasTargets]));

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { id: { in: queryTokens } },
        { slug: { in: queryTokens } },
      ],
      isPublished: true,
    },
    include: {
      variants: true,
    },
  });

  const productMap = new Map<string, (typeof products)[0]>();
  for (const p of products) {
    productMap.set(p.id, p);
    productMap.set(p.slug, p);
  }

  // Also bind all alias keys to the target product
  for (const [alias, target] of Object.entries(LEGACY_PRODUCT_ALIASES)) {
    const matched = productMap.get(target);
    if (matched) {
      productMap.set(alias, matched);
    }
  }

  // 2. Query free shipping threshold from homepage CMS if configured
  const announcementContent = await prisma.homepageContent.findUnique({
    where: { key: "announcement" },
  });

  let freeShippingThreshold = DEFAULT_FREE_SHIPPING_THRESHOLD;
  if (announcementContent?.data) {
    try {
      const parsed = JSON.parse(announcementContent.data);
      if (typeof parsed.freeShippingThreshold === "number") {
        freeShippingThreshold = parsed.freeShippingThreshold;
      }
    } catch {
      // Fallback to default
    }
  }

  // 3. Process each item with strict price and stock verification
  const calculatedItems: CalculatedOrderItem[] = [];
  let subtotal = 0;

  for (const req of requestedItems) {
    let product =
      productMap.get(req.productId) ||
      productMap.get(LEGACY_PRODUCT_ALIASES[req.productId] || "");

    // Resilient fallback for any older localStorage cart items
    if (!product) {
      const cleanToken = req.productId.replace(/-soap$/, "").toLowerCase();
      const fallbackProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: { contains: cleanToken } },
            { title: { contains: cleanToken } },
          ],
          isPublished: true,
        },
        include: { variants: true },
      });
      if (fallbackProduct) {
        product = fallbackProduct;
        productMap.set(req.productId, fallbackProduct);
      }
    }

    if (!product) {
      throw new Error(`PRODUCT_NOT_FOUND: Product ${req.productId} does not exist or is inactive`);
    }

    if (!product.inStock || product.stockQuantity < req.quantity) {
      throw new Error(`INSUFFICIENT_STOCK: ${product.title} only has ${product.stockQuantity} units available`);
    }

    let unitPrice = product.price;
    let variantName: string | undefined = undefined;
    let sku = product.sku;

    if (req.variantId) {
      const variant = product.variants.find((v) => v.id === req.variantId);
      if (!variant) {
        throw new Error(`VARIANT_NOT_FOUND: Variant ${req.variantId} not found on ${product.title}`);
      }
      if (!variant.inStock || variant.stockQuantity < req.quantity) {
        throw new Error(`INSUFFICIENT_STOCK: Variant ${variant.name} is out of stock`);
      }
      unitPrice = variant.price;
      variantName = variant.name;
      sku = variant.sku;
    }

    const itemTotal = unitPrice * req.quantity;
    subtotal += itemTotal;

    calculatedItems.push({
      productId: product.id,
      variantId: req.variantId,
      productName: product.title,
      variantName,
      sku,
      unitPrice,
      quantity: req.quantity,
      totalPrice: itemTotal,
      featuredImage: product.featuredImage,
    });
  }

  // 4. Calculate Shipping & Taxes
  const freeShippingQualified = subtotal >= freeShippingThreshold;
  const shippingAmount = freeShippingQualified ? 0 : STANDARD_SHIPPING_FEE;
  const discountAmount = 0; // Coupons can be extended here
  const taxAmount = 0; // Prices in INR are all-inclusive of GST
  const totalAmount = subtotal - discountAmount + shippingAmount + taxAmount;

  return {
    items: calculatedItems,
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount,
    shippingAmount,
    taxAmount,
    totalAmount: Math.round(totalAmount * 100) / 100,
    currency: "INR",
    freeShippingQualified,
  };
}
