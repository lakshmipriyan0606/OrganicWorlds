import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { createSessionToken } from "../src/lib/auth";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runStep3AdminJourney() {
  console.log("===============================================================");
  console.log("🚀 STEP 3: ADMIN-TO-STOREFRONT JOURNEY VERIFICATION");
  console.log("===============================================================\n");

  const timestamp = Date.now();
  const testSlug = `step3-journey-product-${timestamp}`;
  const testSku = `SKU-STEP3-${timestamp}`;
  let createdProductId = "";
  let adminCookie = "";

  try {
    // 0. Ensure Admin Session
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    const token = await createSessionToken({
      userId: adminUser?.id || "admin_seed_id",
      email: adminUser?.email || "admin@pavishnaorganicworlds.com",
      role: "ADMIN",
      name: "Sanctuary Admin",
      tokenVersion: adminUser?.tokenVersion ?? 1,
    });
    adminCookie = `pow_session=${token}`;

    const headers = {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    };

    // 1. Create a product via POST /api/admin/products with a test product slug
    console.log("1. Creating product via POST /api/admin/products...");
    const createRes = await fetch(`${BASE_URL}/api/admin/products`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "Step 3 Test Botanical Elixir",
        slug: testSlug,
        subtitle: "Cold-pressed testing elixir",
        description: "Small batch Ayurvedic formulation created specifically for Step 3 verification.",
        categorySlug: "soaps",
        categoryLabel: "Artisanal Bath Soaps",
        price: 550,
        sku: testSku,
        featuredImage: "/images/products/vetti-veru.jpg",
        stockQuantity: 25,
        lowStockThreshold: 5,
        inStock: true,
        isPublished: true,
      }),
    });

    assert.equal(createRes.status, 201, `Expected status 201, got ${createRes.status}`);
    const createData = await createRes.json();
    assert.ok(createData.success, "Create response should indicate success");
    assert.ok(createData.product?.id, "Created product should have an id");
    createdProductId = createData.product.id;
    console.log(`   ✅ Product created with ID: ${createdProductId}, slug: ${testSlug}`);

    // 2. Verify it appears at /api/products (catalog) and /api/products/<slug> (detail)
    console.log("2. Verifying appearance in catalog and detail APIs...");
    const catalogRes = await fetch(`${BASE_URL}/api/products?search=${encodeURIComponent(testSlug)}`);
    assert.equal(catalogRes.status, 200, "Catalog request failed");
    const catalogData = await catalogRes.json();
    const foundInCatalog = catalogData.products?.some((p: { slug: string }) => p.slug === testSlug);
    assert.ok(foundInCatalog, `Product ${testSlug} must appear in /api/products`);

    const detailRes = await fetch(`${BASE_URL}/api/products/${testSlug}`);
    assert.equal(detailRes.status, 200, `Detail request for ${testSlug} failed`);
    const detailData = await detailRes.json();
    assert.ok(detailData.success, "Detail response should indicate success");
    assert.equal(detailData.product.slug, testSlug);
    assert.equal(detailData.product.price, 550);
    console.log("   ✅ Product verified in both catalog and detail endpoints");

    // 3. Update the price via PUT /api/admin/products/<id>
    console.log("3. Updating product price to ₹620 via PUT /api/admin/products/<id>...");
    const updateRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ price: 620 }),
    });
    assert.equal(updateRes.status, 200, "Price update request failed");
    const updateData = await updateRes.json();
    assert.equal(updateData.product.price, 620);
    console.log("   ✅ Price updated to ₹620");

    // 4. Verify the updated price appears at /api/products/<slug>
    console.log("4. Verifying updated price reflection at /api/products/<slug>...");
    const detailAfterPrice = await fetch(`${BASE_URL}/api/products/${testSlug}`);
    assert.equal(detailAfterPrice.status, 200);
    const detailAfterPriceData = await detailAfterPrice.json();
    assert.equal(detailAfterPriceData.product.price, 620, "Updated price must reflect at detail API");
    console.log("   ✅ Verified updated price ₹620 at /api/products/<slug>");

    // 5. Set offerPrice and verify the offer appears
    console.log("5. Setting offer price (price: ₹499, originalPrice: ₹620)...");
    const offerRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ price: 499, originalPrice: 620, badge: "Offer" }),
    });
    assert.equal(offerRes.status, 200);
    const detailAfterOffer = await fetch(`${BASE_URL}/api/products/${testSlug}`);
    const detailAfterOfferData = await detailAfterOffer.json();
    assert.equal(detailAfterOfferData.product.price, 499, "Offer price must reflect");
    assert.equal(detailAfterOfferData.product.originalPrice, 620, "Original price must reflect");
    console.log("   ✅ Verified offer price ₹499 (was ₹620)");

    // 6. Set stockQuantity = 0 and verify the product shows as out-of-stock
    console.log("6. Setting stockQuantity = 0...");
    const zeroStockRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ stockQuantity: 0 }),
    });
    assert.equal(zeroStockRes.status, 200);
    const detailZeroStock = await fetch(`${BASE_URL}/api/products/${testSlug}`);
    const detailZeroStockData = await detailZeroStock.json();
    assert.equal(detailZeroStockData.product.stockQuantity, 0);
    assert.equal(detailZeroStockData.product.inStock, false, "Product must be marked out of stock");
    console.log("   ✅ Verified product shows out-of-stock (inStock: false, stockQuantity: 0)");

    // 7. Restore stock and verify availability returns
    console.log("7. Restoring stockQuantity = 15...");
    const restoreStockRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ stockQuantity: 15 }),
    });
    assert.equal(restoreStockRes.status, 200);
    const detailRestoredStock = await fetch(`${BASE_URL}/api/products/${testSlug}`);
    const detailRestoredStockData = await detailRestoredStock.json();
    assert.equal(detailRestoredStockData.product.stockQuantity, 15);
    assert.equal(detailRestoredStockData.product.inStock, true, "Product must be marked in stock");
    console.log("   ✅ Verified availability restored (inStock: true, stockQuantity: 15)");

    // 8. Delete/archive the product and verify it disappears from catalog
    console.log("8. Deleting/archiving product via DELETE /api/admin/products/<id>...");
    const deleteRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: "DELETE",
      headers,
    });
    assert.equal(deleteRes.status, 200, "Delete/archive failed");

    const catalogAfterDelete = await fetch(`${BASE_URL}/api/products?search=${encodeURIComponent(testSlug)}`);
    const catalogAfterDeleteData = await catalogAfterDelete.json();
    const stillInCatalog = catalogAfterDeleteData.products?.some((p: { slug: string }) => p.slug === testSlug);
    assert.equal(stillInCatalog, false, "Archived product must NOT appear in published catalog");

    const detailAfterDelete = await fetch(`${BASE_URL}/api/products/${testSlug}`);
    assert.equal(detailAfterDelete.status, 404, "Archived product must return 404 on storefront detail");
    console.log("   ✅ Verified product disappears from catalog and returns 404 on detail");

    console.log("\n===============================================================");
    console.log("🎉 ALL 8 ADMIN-TO-STOREFRONT JOURNEY CHECKS PASSED!");
    console.log("===============================================================\n");
  } finally {
    // Guaranteed cleanup of synthetic test records
    console.log("🧹 Performing test data cleanup...");
    if (createdProductId) {
      await prisma.inventoryLog.deleteMany({ where: { productId: createdProductId } }).catch(() => {});
      await prisma.productVariant.deleteMany({ where: { productId: createdProductId } }).catch(() => {});
      await prisma.product.deleteMany({ where: { id: createdProductId } }).catch(() => {});
    }
    await prisma.product.deleteMany({ where: { slug: testSlug } }).catch(() => {});
    console.log("   ✅ Test cleanup complete.");
  }
}

runStep3AdminJourney().catch((err) => {
  console.error("Step 3 Admin Journey Failed:", err);
  process.exit(1);
});
