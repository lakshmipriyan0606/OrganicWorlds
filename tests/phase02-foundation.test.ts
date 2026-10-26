import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { loginSchema, productSchema, checkoutSchema } from "../src/lib/validations";
import { createSessionToken, verifySessionToken } from "../src/lib/auth";
import { calculateAuthoritativeCart } from "../src/lib/services/pricing-service";

async function runTests() {
  console.log("🧪 Running Phase 02 Foundation & Security Tests...\n");
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

  // --- 1. Validation Tests ---
  await test("loginSchema rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "invalid-email", password: "123" });
    assert.equal(result.success, false);
  });

  await test("loginSchema accepts valid email and password", () => {
    const result = loginSchema.safeParse({ email: "admin@pavishnaorganicworlds.com", password: "SecurePassword123" });
    assert.equal(result.success, true);
  });

  await test("productSchema rejects negative prices", () => {
    const result = productSchema.safeParse({
      title: "Test Soap",
      slug: "test-soap",
      description: "Organic herbal test soap description",
      categorySlug: "soaps",
      price: -100,
      sku: "TEST-SOAP-01",
      featuredImage: "/images/Img1.jpeg",
    });
    assert.equal(result.success, false);
  });

  await test("checkoutSchema rejects empty cart items", () => {
    const result = checkoutSchema.safeParse({
      customerName: "Rohan",
      email: "rohan@example.com",
      phone: "9876543210",
      addressLine1: "123 Main Street",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560038",
      paymentMethod: "RAZORPAY",
      items: [],
    });
    assert.equal(result.success, false);
  });

  // --- 2. Auth & JWT Token Security Tests ---
  await test("createSessionToken generates verifiable JWT with exact role and userId", async () => {
    const token = await createSessionToken({
      userId: "usr_admin_123",
      email: "admin@pavishnaorganicworlds.com",
      role: "ADMIN",
      name: "Admin User",
    });

    assert.ok(typeof token === "string" && token.length > 20);

    const decoded = await verifySessionToken(token);
    assert.ok(decoded !== null);
    assert.equal(decoded?.userId, "usr_admin_123");
    assert.equal(decoded?.role, "ADMIN");
    assert.equal(decoded?.email, "admin@pavishnaorganicworlds.com");
  });

  await test("verifySessionToken rejects tampered or fraudulent tokens", async () => {
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature";
    const decoded = await verifySessionToken(fakeToken);
    assert.equal(decoded, null);
  });

  // --- 3. Database & Seeding Tests ---
  await test("Database contains seeded Admin user with hashed password", async () => {
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    assert.ok(admin !== null);
    assert.equal(admin?.role, "ADMIN");
    assert.ok(admin?.passwordHash.startsWith("$2")); // bcrypt prefix
  });

  await test("Database contains all 19 authentic Pavishna products", async () => {
    const count = await prisma.product.count();
    assert.equal(count, 19);
  });

  await test("Database contains 4 standard categories", async () => {
    const count = await prisma.category.count();
    assert.equal(count, 4);
  });

  // --- 4. Authoritative Pricing & Inventory Invariant Tests ---
  await test("calculateAuthoritativeCart computes exact subtotal and shipping fee for items < ₹1,500", async () => {
    const soap = await prisma.product.findUnique({ where: { slug: "vetti-veru-bath-soap" } });
    assert.ok(soap !== null);

    const calc = await calculateAuthoritativeCart([
      { productId: soap.id, quantity: 2 },
    ]);

    const expectedSubtotal = soap.price * 2;
    assert.equal(calc.subtotal, expectedSubtotal);
    // Should charge ₹99 shipping because expectedSubtotal (840) < 1500
    assert.equal(calc.shippingAmount, 99);
    assert.equal(calc.totalAmount, expectedSubtotal + 99);
    assert.equal(calc.freeShippingQualified, false);
  });

  await test("calculateAuthoritativeCart unlocks free shipping when subtotal >= ₹1,500", async () => {
    const soap = await prisma.product.findUnique({ where: { slug: "vetti-veru-bath-soap" } });
    assert.ok(soap !== null);

    const calc = await calculateAuthoritativeCart([
      { productId: soap.id, quantity: 4 }, // 4 * 420 = 1680 >= 1500
    ]);

    const expectedSubtotal = soap.price * 4;
    assert.equal(calc.subtotal, expectedSubtotal);
    assert.equal(calc.shippingAmount, 0);
    assert.equal(calc.totalAmount, expectedSubtotal);
    assert.equal(calc.freeShippingQualified, true);
  });

  await test("calculateAuthoritativeCart throws error when requesting non-existent product", async () => {
    await assert.rejects(
      async () => {
        await calculateAuthoritativeCart([
          { productId: "non_existent_id", quantity: 1 },
        ]);
      },
      /PRODUCT_NOT_FOUND/
    );
  });

  await test("calculateAuthoritativeCart throws error when requested quantity exceeds stock", async () => {
    const soap = await prisma.product.findUnique({ where: { slug: "vetti-veru-bath-soap" } });
    assert.ok(soap !== null);

    await assert.rejects(
      async () => {
        await calculateAuthoritativeCart([
          { productId: soap.id, quantity: 99999 },
        ]);
      },
      /INSUFFICIENT_STOCK/
    );
  });

  console.log(`\n========================================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
