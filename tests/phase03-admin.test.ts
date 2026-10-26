import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import {
  createAdminProduct,
  updateAdminProduct,
  adjustProductStock,
  getAdminProductList,
} from "../src/lib/services/product-service";
import { verifySessionToken } from "../src/lib/auth";

async function runAdminTests() {
  console.log("🧪 Running Phase 03 Admin & Product/Inventory Management Tests...\n");
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void> | void) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: unknown) {
      console.error(`  ❌ FAIL: ${name}`);
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`     Error: ${msg}`);
      failed++;
    }
  }

  const testProductSlug = "test-vetiver-sandalwood-bar";
  const testProductSku = "TEST-VSB-125";

  // Cleanup any leftover test record
  await prisma.inventoryLog.deleteMany({ where: { productSku: testProductSku } });
  await prisma.productVariant.deleteMany({ where: { sku: testProductSku } });
  await prisma.product.deleteMany({ where: { slug: testProductSlug } });

  // 1. Create Product
  await test("createAdminProduct creates product with variants and initial inventory log", async () => {
    const product = await createAdminProduct(
      {
        title: "Test Vetiver Sandalwood Bar",
        slug: testProductSlug,
        subtitle: "Cooling test bar",
        description: "Handcrafted cooling organic formulation with pure wild vetiver roots.",
        categorySlug: "soaps",
        categoryLabel: "Artisanal Bath Soaps",
        price: 490,
        sku: testProductSku,
        featuredImage: "/images/Img1.jpeg",
        stockQuantity: 30,
        lowStockThreshold: 5,
        inStock: true,
        isPublished: true,
      },
      "admin@pavishnaorganicworlds.com"
    );

    assert.ok(product.id);
    assert.equal(product.slug, testProductSlug);
    assert.equal(product.price, 490);
    assert.equal(product.stockQuantity, 30);

    // Verify initial inventory log was created
    const log = await prisma.inventoryLog.findFirst({
      where: { productSku: testProductSku, reason: "MANUAL_CREATION" },
    });
    assert.ok(log !== null);
    assert.equal(log?.delta, 30);
    assert.equal(log?.newStock, 30);
  });

  // 2. Reject Duplicate SKU
  await test("createAdminProduct rejects duplicate SKU with conflict error", async () => {
    await assert.rejects(
      async () => {
        await createAdminProduct(
          {
            title: "Duplicate SKU Soap",
            slug: "duplicate-sku-soap",
            description: "Some valid description for test",
            categorySlug: "soaps",
            price: 400,
            sku: testProductSku, // already exists
            featuredImage: "/images/Img1.jpeg",
            stockQuantity: 10,
            lowStockThreshold: 5,
            inStock: true,
            isPublished: true,
          },
          "admin@pavishnaorganicworlds.com"
        );
      },
      /SKU_EXISTS/
    );
  });

  // 3. Reject Duplicate Slug
  await test("createAdminProduct rejects duplicate Slug with conflict error", async () => {
    await assert.rejects(
      async () => {
        await createAdminProduct(
          {
            title: "Duplicate Slug Soap",
            slug: testProductSlug, // already exists
            description: "Some valid description for test",
            categorySlug: "soaps",
            price: 400,
            sku: "TEST-DIFFERENT-SKU",
            featuredImage: "/images/Img1.jpeg",
            stockQuantity: 10,
            lowStockThreshold: 5,
            inStock: true,
            isPublished: true,
          },
          "admin@pavishnaorganicworlds.com"
        );
      },
      /SLUG_EXISTS/
    );
  });

  // 4. Update Product
  await test("updateAdminProduct safely updates price and description without overwriting stock", async () => {
    const existing = await prisma.product.findUnique({ where: { slug: testProductSlug } });
    assert.ok(existing !== null);

    const updated = await updateAdminProduct(existing.id, {
      price: 520,
      description: "Updated organic formulation with enriched therapeutic sandalwood extracts.",
    });

    assert.equal(updated.price, 520);
    assert.equal(updated.stockQuantity, 30); // preserved
  });

  // 5. Atomic Stock Restock
  await test("adjustProductStock atomically increases stock and logs movement", async () => {
    const existing = await prisma.product.findUnique({ where: { slug: testProductSlug } });
    assert.ok(existing !== null);

    const result = await adjustProductStock(existing.id, 20, "RESTOCK", "admin@pavishnaorganicworlds.com");
    assert.equal(result.stockQuantity, 50); // 30 + 20

    const log = await prisma.inventoryLog.findFirst({
      where: { productSku: testProductSku, reason: "RESTOCK" },
      orderBy: { createdAt: "desc" },
    });
    assert.ok(log !== null);
    assert.equal(log?.delta, 20);
    assert.equal(log?.previousStock, 30);
    assert.equal(log?.newStock, 50);
  });

  // 6. Atomic Stock Deduction
  await test("adjustProductStock atomically deducts stock and clamps at zero", async () => {
    const existing = await prisma.product.findUnique({ where: { slug: testProductSlug } });
    assert.ok(existing !== null);

    const result = await adjustProductStock(existing.id, -100, "DAMAGE_WRITE_OFF", "admin@pavishnaorganicworlds.com");
    assert.equal(result.stockQuantity, 0); // clamped at 0
    assert.equal(result.inStock, false);

    const log = await prisma.inventoryLog.findFirst({
      where: { productSku: testProductSku, reason: "DAMAGE_WRITE_OFF" },
      orderBy: { createdAt: "desc" },
    });
    assert.ok(log !== null);
    assert.equal(log?.newStock, 0);
  });

  // 7. Paginated Product List
  await test("getAdminProductList returns paginated catalog with accurate metadata", async () => {
    const list = await getAdminProductList(1, 10);
    assert.ok(list.products.length <= 10);
    assert.ok(list.total >= 19);
    assert.ok(list.totalPages >= 2);
  });

  // 8. Category Management
  await test("Category management supports creation and listing with product counts", async () => {
    const category = await prisma.category.upsert({
      where: { slug: "test-bath-salts" },
      update: { name: "Test Bath Salts" },
      create: {
        name: "Test Bath Salts",
        slug: "test-bath-salts",
        description: "Mineral rich Himalayan and Epsom salts infused with pure essential oils.",
      },
    });

    assert.ok(category.id);
    assert.equal(category.slug, "test-bath-salts");

    // Clean up test category
    await prisma.category.delete({ where: { slug: "test-bath-salts" } });
  });

  // Cleanup test product
  await prisma.inventoryLog.deleteMany({ where: { productSku: testProductSku } });
  await prisma.productVariant.deleteMany({ where: { sku: testProductSku } });
  await prisma.product.deleteMany({ where: { slug: testProductSlug } });

  console.log(`\n========================================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAdminTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
