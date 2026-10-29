import { test, expect } from "@playwright/test";
import { prisma } from "../src/lib/prisma";
import { createSessionToken } from "../src/lib/auth";

test.describe("Phase 7 & 8: Dynamic Admin Product Lifecycle & Storefront Synchronization", () => {
  const testSlug = `e2e-organic-test-${Date.now()}`;
  const testTitle = "E2E Organic Test Product";
  let createdProductId: string = "";
  let adminCookie: string = "";

  test.beforeAll(async () => {
    // Generate admin session cookie
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    const token = await createSessionToken({
      userId: adminUser?.id || "admin_seed_id",
      email: adminUser?.email || "admin@pavishnaorganicworlds.com",
      role: "ADMIN",
      name: "Sanctuary Admin",
      tokenVersion: 1,
    });
    adminCookie = `pow_session=${token}`;
  });

  test.afterAll(async () => {
    // Clean up only the synthetic test product
    if (createdProductId) {
      await prisma.inventoryLog.deleteMany({ where: { productId: createdProductId } }).catch(() => {});
      await prisma.productVariant.deleteMany({ where: { productId: createdProductId } }).catch(() => {});
      await prisma.product.delete({ where: { id: createdProductId } }).catch(() => {});
    }
  });

  test("Step 1 & 2: Create product at ₹500 and verify storefront display", async ({ request }) => {
    // 1. Create product via Admin API
    const createRes = await request.post("/api/admin/products", {
      headers: { Cookie: adminCookie },
      data: {
        title: testTitle,
        slug: testSlug,
        description: "Handcrafted cold-process Ayurvedic formulation for automated end-to-end verification.",
        categorySlug: "soaps",
        categoryLabel: "Artisanal Bath Soaps",
        price: 500,
        sku: `SKU-${Date.now()}`,
        featuredImage: "/images/products/vetti-veru.jpg",
        inStock: true,
        stockQuantity: 10,
        isPublished: true,
      },
    });

    expect(createRes.status()).toBe(201);
    const createData = await createRes.json();
    expect(createData.success).toBe(true);
    createdProductId = createData.product.id;
    expect(createData.product.price).toBe(500);
    expect(createData.product.stockQuantity).toBe(10);

    // 2. Verify on storefront catalog API
    const catalogRes = await request.get("/api/products");
    expect(catalogRes.status()).toBe(200);
    const catalogData = await catalogRes.json();
    const storefrontProduct = catalogData.products.find((p: { slug: string }) => p.slug === testSlug);
    expect(storefrontProduct).toBeDefined();
    expect(storefrontProduct.price).toBe(500);

    // 3. Verify on product detail API
    const detailRes = await request.get(`/api/products/${testSlug}`);
    expect(detailRes.status()).toBe(200);
    const detailData = await detailRes.json();
    expect(detailData.product.price).toBe(500);
    expect(detailData.product.stockQuantity).toBe(10);
    expect(detailData.product.inStock).toBe(true);
  });

  test("Step 3 & 4: Admin updates price to ₹450 and verifies storefront reflection", async ({ request }) => {
    // Update price to ₹450
    const updateRes = await request.put(`/api/admin/products/${createdProductId}`, {
      headers: { Cookie: adminCookie },
      data: {
        price: 450,
      },
    });

    expect(updateRes.status()).toBe(200);
    const updateData = await updateRes.json();
    expect(updateData.product.price).toBe(450);

    // Verify detail page reflects ₹450
    const detailRes = await request.get(`/api/products/${testSlug}`);
    expect(detailRes.status()).toBe(200);
    const detailData = await detailRes.json();
    expect(detailData.product.price).toBe(450);
  });

  test("Step 5 & 6: Admin sets offer price to ₹399 with original price ₹450", async ({ request }) => {
    // Set offer price ₹399 and originalPrice ₹450
    const offerRes = await request.put(`/api/admin/products/${createdProductId}`, {
      headers: { Cookie: adminCookie },
      data: {
        price: 399,
        originalPrice: 450,
      },
    });

    expect(offerRes.status()).toBe(200);
    const offerData = await offerRes.json();
    expect(offerData.product.price).toBe(399);
    expect(offerData.product.originalPrice).toBe(450);

    // Verify detail page shows selling price ₹399 and original price ₹450
    const detailRes = await request.get(`/api/products/${testSlug}`);
    expect(detailRes.status()).toBe(200);
    const detailData = await detailRes.json();
    expect(detailData.product.price).toBe(399);
    expect(detailData.product.originalPrice).toBe(450);
  });

  test("Step 7, 8 & 9: Admin sets stock to 0; purchase attempt is rejected", async ({ request, playwright }) => {
    // Set stock to 0
    const outOfStockRes = await request.put(`/api/admin/products/${createdProductId}`, {
      headers: { Cookie: adminCookie },
      data: {
        stockQuantity: 0,
        inStock: false,
      },
    });

    expect(outOfStockRes.status()).toBe(200);
    const outData = await outOfStockRes.json();
    expect(outData.product.stockQuantity).toBe(0);
    expect(outData.product.inStock).toBe(false);

    // Verify detail page shows out of stock
    const detailRes = await request.get(`/api/products/${testSlug}`);
    expect(detailRes.status()).toBe(200);
    const detailData = await detailRes.json();
    expect(detailData.product.inStock).toBe(false);
    expect(detailData.product.stockQuantity).toBe(0);

    // Customer attempt to create order with sold-out product is rejected
    // Create customer session and dedicated request context to prevent cookie contamination
    const customerUser = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
    const custToken = await createSessionToken({
      userId: customerUser?.id || "cust_id",
      email: customerUser?.email || "customer@example.com",
      role: "CUSTOMER",
      name: "Customer Patron",
      tokenVersion: 1,
    });

    const custRequest = await playwright.request.newContext({
      baseURL: "http://localhost:3000",
    });

    const orderRes = await custRequest.post("/api/checkout/create-order", {
      headers: { Cookie: `pow_session=${custToken}` },
      data: {
        customerName: "Customer Patron",
        email: customerUser?.email || "customer@example.com",
        phone: "9876543210",
        addressLine1: "123 Temple Road",
        city: "Madurai",
        state: "Tamil Nadu",
        postalCode: "625001",
        items: [{ productId: createdProductId, quantity: 1 }],
      },
    });

    expect(orderRes.status()).toBe(400);
    const orderData = await orderRes.json();
    expect(orderData.error).toContain("INSUFFICIENT_STOCK");
  });

  test("Step 10, 11 & 12: Restore stock to 10, remove offer, and verify persistent DB state", async ({ request }) => {
    // Restore stock to 10 and remove offer price (set price back to 450, originalPrice null)
    const restoreRes = await request.put(`/api/admin/products/${createdProductId}`, {
      headers: { Cookie: adminCookie },
      data: {
        price: 450,
        originalPrice: null,
        stockQuantity: 10,
        inStock: true,
      },
    });

    if (restoreRes.status() !== 200) {
      console.error("restoreRes error:", restoreRes.status(), await restoreRes.text());
    }

    expect(restoreRes.status()).toBe(200);
    const restoreData = await restoreRes.json();
    expect(restoreData.product.price).toBe(450);
    expect(restoreData.product.stockQuantity).toBe(10);
    expect(restoreData.product.inStock).toBe(true);

    // Verify fresh read directly from database
    const dbProduct = await prisma.product.findUnique({
      where: { id: createdProductId },
    });
    expect(dbProduct).not.toBeNull();
    expect(dbProduct?.price).toBe(450);
    expect(dbProduct?.originalPrice).toBeNull();
    expect(dbProduct?.stockQuantity).toBe(10);
    expect(dbProduct?.inStock).toBe(true);
  });

  test("Security: Unauthorized non-admin customer is blocked from product mutations", async ({ playwright }) => {
    const customerUser = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
    const custToken = await createSessionToken({
      userId: customerUser?.id || "cust_id",
      email: customerUser?.email || "customer@example.com",
      role: "CUSTOMER",
      name: "Customer Patron",
      tokenVersion: 1,
    });

    const custRequest = await playwright.request.newContext({
      baseURL: "http://localhost:3000",
      extraHTTPHeaders: {
        Cookie: `pow_session=${custToken}`,
      },
    });

    const unauthorizedRes = await custRequest.put(`/api/admin/products/${createdProductId}`, {
      data: { price: 10 },
    });

    expect(unauthorizedRes.status()).toBe(403);
  });
});
