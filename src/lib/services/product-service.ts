import { prisma } from "@/lib/prisma";
import { Prisma, Product, ProductVariant, Category } from "@prisma/client";
import { z } from "zod";
import { productSchema } from "@/lib/validations";

export type ProductWithRelations = Product & {
  variants?: ProductVariant[];
  category?: Category | null;
};

export interface CatalogFilterOptions {
  categorySlug?: string;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
  sortBy?: "featured" | "price-low" | "price-high" | "rating";
}

/**
 * Public catalog query returning active, published products.
 */
export async function getPublishedCatalog(options: CatalogFilterOptions = {}) {
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (options.categorySlug && options.categorySlug !== "all") {
    where.categorySlug = options.categorySlug;
  }

  if (options.maxPrice) {
    where.price = { lte: options.maxPrice };
  }

  if (options.inStockOnly) {
    where.inStock = true;
  }

  if (options.search) {
    where.OR = [
      { title: { contains: options.search } },
      { subtitle: { contains: options.search } },
      { description: { contains: options.search } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (options.sortBy === "price-low") {
    orderBy = { price: "asc" };
  } else if (options.sortBy === "price-high") {
    orderBy = { price: "desc" };
  } else if (options.sortBy === "rating") {
    orderBy = { rating: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      variants: true,
      category: true,
    },
  });

  return products.map(formatProductResponse);
}

/**
 * Fetch a single product by unique slug.
 */
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      category: true,
    },
  });

  if (!product) return null;
  return formatProductResponse(product);
}

/**
 * Admin: Paginated list with search, filter, and stock status.
 */
export async function getAdminProductList(page = 1, limit = 20, search = "", category = "") {
  const skip = (page - 1) * limit;
  const where: Prisma.ProductWhereInput = {};

  if (search.trim()) {
    where.OR = [
      { title: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  if (category && category !== "all") {
    where.categorySlug = category;
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        variants: true,
        category: true,
      },
    }),
  ]);

  return {
    products: products.map(formatProductResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Admin: Create a new product with variant relations & initial inventory log.
 */
export async function createAdminProduct(input: z.infer<typeof productSchema>, actorEmail?: string) {
  const validated = productSchema.parse(input);

  // Check unique slug and sku
  const existingSlug = await prisma.product.findUnique({ where: { slug: validated.slug } });
  if (existingSlug) {
    throw new Error(`SLUG_EXISTS: A product with slug '${validated.slug}' already exists`);
  }

  const existingSku = await prisma.product.findUnique({ where: { sku: validated.sku } });
  if (existingSku) {
    throw new Error(`SKU_EXISTS: A product with SKU '${validated.sku}' already exists`);
  }

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        subtitle: validated.subtitle || null,
        description: validated.description,
        categoryId: validated.categoryId || null,
        categorySlug: validated.categorySlug,
        categoryLabel: validated.categoryLabel || null,
        price: validated.price,
        originalPrice: validated.originalPrice || null,
        sku: validated.sku,
        badge: validated.badge || null,
        featuredImage: validated.featuredImage,
        images: JSON.stringify(validated.images || [validated.featuredImage]),
        inStock: validated.inStock,
        stockQuantity: validated.stockQuantity,
        lowStockThreshold: validated.lowStockThreshold,
        isPublished: validated.isPublished,
        ingredientsSummary: validated.ingredientsSummary || null,
        ritualSteps: validated.ritualSteps ? JSON.stringify(validated.ritualSteps) : null,
        soapSpecs: validated.soapSpecs ? JSON.stringify(validated.soapSpecs) : null,
        variants: validated.variants && validated.variants.length > 0
          ? {
              create: validated.variants.map((v) => ({
                name: v.name,
                sku: v.sku,
                price: v.price,
                stockQuantity: v.stockQuantity,
                inStock: v.inStock,
              })),
            }
          : undefined,
      },
      include: { variants: true },
    });

    await tx.inventoryLog.create({
      data: {
        productId: product.id,
        productSku: product.sku,
        delta: product.stockQuantity,
        previousStock: 0,
        newStock: product.stockQuantity,
        reason: "MANUAL_CREATION",
        actorEmail: actorEmail || "admin",
      },
    });

    return formatProductResponse(product);
  });
}

/**
 * Admin: Update existing product without accidentally overwriting stock.
 */
export async function updateAdminProduct(
  id: string,
  input: Partial<z.infer<typeof productSchema>>
) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error(`PRODUCT_NOT_FOUND: Product ${id} not found`);
  }

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id },
      data: {
        title: input.title,
        slug: input.slug,
        subtitle: input.subtitle,
        description: input.description,
        categoryId: input.categoryId,
        categorySlug: input.categorySlug,
        categoryLabel: input.categoryLabel,
        price: input.price,
        originalPrice: input.originalPrice,
        sku: input.sku,
        badge: input.badge,
        featuredImage: input.featuredImage,
        images: input.images ? JSON.stringify(input.images) : undefined,
        inStock: input.inStock,
        lowStockThreshold: input.lowStockThreshold,
        isPublished: input.isPublished,
        ingredientsSummary: input.ingredientsSummary,
        ritualSteps: input.ritualSteps ? JSON.stringify(input.ritualSteps) : undefined,
        soapSpecs: input.soapSpecs ? JSON.stringify(input.soapSpecs) : undefined,
      },
      include: { variants: true },
    });

    return formatProductResponse(updated);
  });
}

/**
 * Adjust stock safely using an atomic transaction and audit log.
 */
export async function adjustProductStock(
  productId: string,
  delta: number,
  reason: string,
  actorEmail?: string
) {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    const previousStock = product.stockQuantity;
    const newStock = Math.max(0, previousStock + delta);
    const inStock = newStock > 0;

    const updated = await tx.product.update({
      where: { id: productId },
      data: {
        stockQuantity: newStock,
        inStock,
      },
    });

    await tx.inventoryLog.create({
      data: {
        productId,
        productSku: product.sku,
        delta,
        previousStock,
        newStock,
        reason,
        actorEmail: actorEmail || "system",
      },
    });

    return updated;
  });
}

function formatProductResponse(product: ProductWithRelations) {
  let images: string[] = [];
  try {
    images = product.images ? JSON.parse(product.images) : [product.featuredImage];
  } catch {
    images = [product.featuredImage];
  }

  let ritualSteps: string[] = [];
  try {
    ritualSteps = product.ritualSteps ? JSON.parse(product.ritualSteps) : [];
  } catch {
    ritualSteps = [];
  }

  let soapSpecs: Record<string, unknown> | null = null;
  try {
    soapSpecs = product.soapSpecs ? JSON.parse(product.soapSpecs) : null;
  } catch {
    soapSpecs = null;
  }

  return {
    ...product,
    images,
    ritualSteps,
    soapSpecs,
  };
}
