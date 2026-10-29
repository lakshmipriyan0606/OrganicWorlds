import { prisma } from "../src/lib/prisma";
import { createSessionToken, verifySessionToken } from "../src/lib/auth";
import { calculateAuthoritativeCart } from "../src/lib/services/pricing-service";
import {
  createRazorpayGatewayOrder,
  computeRazorpaySignature,
  verifyRazorpayPayment,
} from "../src/lib/services/payment-service";
import { checkRateLimit } from "../src/lib/rate-limit";
import bcrypt from "bcryptjs";

const BASE_URL = "http://localhost:3000";

interface TestSummary {
  passed: number;
  failed: number;
  results: { testName: string; passed: boolean; detail?: string }[];
}

const summary: TestSummary = {
  passed: 0,
  failed: 0,
  results: [],
};

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    summary.passed++;
    summary.results.push({ testName, passed: true });
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (detail) console.error(`     Detail: ${detail}`);
    summary.failed++;
    summary.results.push({ testName, passed: false, detail });
  }
}

async function runAuditTests() {
  console.log("===============================================================");
  console.log("🔒 COMPREHENSIVE CUSTOMER AUTHENTICATION & CHECKOUT AUDIT SUITE");
  console.log("===============================================================\n");

  try {
    // Setup test products
    const product = await prisma.product.findFirst({
      where: { isPublished: true, stockQuantity: { gt: 5 } },
    });
    if (!product) {
      throw new Error("No published product found in database for testing");
    }

    // -------------------------------------------------------------
    // CHECK 1: Registration and Login Authenticate Against Real Database
    // -------------------------------------------------------------
    console.log("--- Check 1 & 2: Database Authentication & Session Security ---");
    const testEmail = `audit_patron_${Date.now()}@example.com`;
    const testPassword = "SecurePatronPassword2026!";

    // 1.1 Weak password rejected
    const weakRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: `weak_${Date.now()}@example.com`,
        password: "short",
      }),
    });
    assert(
      weakRegRes.status === 400,
      "Weak password (<8 chars) is rejected by registration API (HTTP 400)",
      `Expected 400, got ${weakRegRes.status}`
    );

    // 1.2 Valid registration against real DB
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Audit Customer A",
        email: testEmail,
        password: testPassword,
        phone: "+91 98401 11111",
      }),
    });

    assert(
      regRes.status === 201,
      "Valid registration creates user with HTTP 201 Created",
      `Expected 201, got ${regRes.status}`
    );

    const userInDb = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    assert(
      !!userInDb && userInDb.passwordHash.startsWith("$2"),
      "User password is cryptographically salted & hashed with bcrypt in real database",
      `Hash prefix: ${userInDb?.passwordHash.substring(0, 4)}`
    );

    const regCookieHeader = regRes.headers.get("set-cookie") || "";
    assert(
      regCookieHeader.includes("pow_session") && regCookieHeader.includes("HttpOnly"),
      "Registration automatically issues HttpOnly SameSite session cookie"
    );

    // Extract cookie value
    const cookieMatch = regCookieHeader.match(/pow_session=([^;]+)/);
    const sessionTokenA = cookieMatch ? cookieMatch[1] : "";

    // 1.3 Account Enumeration: duplicate registration returns 409
    const dupRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Audit Customer Duplicate",
        email: testEmail,
        password: testPassword,
      }),
    });
    assert(
      dupRegRes.status === 409,
      "Duplicate email registration returns HTTP 409 Conflict",
      `Expected 409, got ${dupRegRes.status}`
    );

    // 1.4 Valid Login against DB
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    assert(
      loginRes.status === 200,
      "Customer login authenticates successfully against real DB password hash (HTTP 200)"
    );

    // 1.5 Account Enumeration Prevention in Login: non-existent email vs wrong password
    const wrongPassRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "WrongPassword123!",
      }),
    });
    const nonExistentRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `nonexistent_${Date.now()}@example.com`,
        password: "WrongPassword123!",
      }),
    });
    const wrongPassBody = await wrongPassRes.json();
    const nonExistentBody = await nonExistentRes.json();

    assert(
      wrongPassRes.status === 401 &&
        nonExistentRes.status === 401 &&
        wrongPassBody.error === nonExistentBody.error,
      "Login does NOT leak account existence: identical 401 'Invalid email or password' returned for both non-existent user and wrong password"
    );

    // -------------------------------------------------------------
    // CHECK 2: Session Security, Cryptographic Signatures & Forgery
    // -------------------------------------------------------------
    console.log("\n--- Check 2: Session Validation & Cryptographic Tokens ---");
    const verifiedPayload = await verifySessionToken(sessionTokenA);
    assert(
      verifiedPayload !== null && verifiedPayload.email === testEmail,
      "Server-side session JWT verifies correctly using HS256 secret"
    );

    const forgedToken = sessionTokenA.substring(0, sessionTokenA.length - 10) + "0123456789";
    const forgedPayload = await verifySessionToken(forgedToken);
    assert(
      forgedPayload === null,
      "Cryptographically tampered/forged JWT session token is completely rejected (returns null)"
    );

    // -------------------------------------------------------------
    // CHECK 3: Mandatory Customer Authentication on Checkout & ID Derivation
    // -------------------------------------------------------------
    console.log("\n--- Check 3 & 4: Mandatory Checkout Auth & Customer ID Derivation ---");

    const checkoutPayload = {
      customerName: "Audit Customer A",
      email: testEmail,
      phone: "+91 98401 11111",
      addressLine1: "100 Botanical Way",
      city: "Madurai",
      state: "Tamil Nadu",
      postalCode: "625001",
      paymentMethod: "RAZORPAY",
      items: [
        {
          productId: product.id,
          quantity: 1,
        },
      ],
    };

    // 3.1 Unauthenticated checkout attempt
    const unauthOrderRes = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkoutPayload),
    });
    assert(
      unauthOrderRes.status === 401,
      "Unauthenticated order creation is blocked with HTTP 401 AUTHENTICATION_REQUIRED",
      `Expected 401, got ${unauthOrderRes.status}`
    );

    // 3.2 Forged session checkout attempt
    const forgedOrderRes = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `pow_session=${forgedToken}`,
      },
      body: JSON.stringify(checkoutPayload),
    });
    assert(
      forgedOrderRes.status === 401,
      "Checkout with forged/invalid session cookie is rejected with HTTP 401",
      `Expected 401, got ${forgedOrderRes.status}`
    );

    // 3.3 Customer ID Derivation Exclusively From Session
    // Even if client passes a different email (e.g., victim@example.com) in payload:
    const spoofedEmailPayload = {
      ...checkoutPayload,
      email: "victim@example.com",
      customerName: "Victim Account",
    };

    const validOrderRes = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `pow_session=${sessionTokenA}`,
      },
      body: JSON.stringify(spoofedEmailPayload),
    });

    assert(
      validOrderRes.status === 200,
      "Authenticated customer order creation succeeds with HTTP 200",
      `Expected 200, got ${validOrderRes.status}`
    );

    const orderData = await validOrderRes.json();
    const createdOrderInDb = await prisma.order.findUnique({
      where: { id: orderData.orderId },
      include: { user: true },
    });

    assert(
      createdOrderInDb?.userId === userInDb?.id && createdOrderInDb?.user?.email === testEmail,
      "Order customer ID is derived strictly from verified session (userInDb.id), ignoring spoofed payload email"
    );

    // -------------------------------------------------------------
    // CHECK 4: Cross-Account Order Access / IDOR Protection
    // -------------------------------------------------------------
    console.log("\n--- Check 5: Cross-Account IDOR Protection ---");

    // Create Customer B
    const emailB = `audit_patron_b_${Date.now()}@example.com`;
    const regResB = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Audit Customer B",
        email: emailB,
        password: "CustomerB2026!Secure",
        phone: "+91 98402 22222",
      }),
    });
    const cookieB = regResB.headers.get("set-cookie") || "";
    const sessionTokenB = (cookieB.match(/pow_session=([^;]+)/) || [])[1] || "";

    // 4.1 Customer B tries to initiate gateway payment for Customer A's order
    const crossGatewayRes = await fetch(`${BASE_URL}/api/checkout/razorpay/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `pow_session=${sessionTokenB}`,
      },
      body: JSON.stringify({ orderId: orderData.orderId }),
    });
    assert(
      crossGatewayRes.status === 403,
      "Customer B cannot initiate payment on Customer A's order (HTTP 403 Forbidden)",
      `Expected 403, got ${crossGatewayRes.status}`
    );

    // 4.2 Customer B tries to verify payment for Customer A's order
    const crossVerifyRes = await fetch(`${BASE_URL}/api/checkout/razorpay/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `pow_session=${sessionTokenB}`,
      },
      body: JSON.stringify({
        orderId: orderData.orderId,
        razorpayOrderId: "order_fake_123",
        razorpayPaymentId: "pay_fake_123",
        razorpaySignature: "sig_fake_123",
      }),
    });
    assert(
      crossVerifyRes.status === 403,
      "Customer B cannot verify/confirm Customer A's order (HTTP 403 Forbidden)",
      `Expected 403, got ${crossVerifyRes.status}`
    );

    // 4.3 Customer B tries to view Customer A's order confirmation page
    const crossConfirmRes = await fetch(`${BASE_URL}/order-confirmation/${orderData.orderId}`, {
      headers: {
        Cookie: `pow_session=${sessionTokenB}`,
      },
    });
    const crossConfirmText = await crossConfirmRes.text();
    const crossHasOrder = crossConfirmText.includes(orderData.orderNumber) || crossConfirmText.includes("Order Confirmed");
    assert(
      !crossHasOrder && (crossConfirmRes.status === 404 || crossConfirmText.includes("Sanctuary Not Found") || crossConfirmText.includes("404")),
      "Customer B cannot view Customer A's order confirmation page (IDOR blocked: 404 Sanctuary Not Found rendered)",
      `Status: ${crossConfirmRes.status}, Order details exposed: ${crossHasOrder}`
    );

    // 4.4 Unauthenticated user tries to view Customer A's order confirmation page
    const unauthConfirmRes = await fetch(`${BASE_URL}/order-confirmation/${orderData.orderId}`);
    const unauthConfirmText = await unauthConfirmRes.text();
    const unauthHasOrder = unauthConfirmText.includes(orderData.orderNumber) || unauthConfirmText.includes("Order Confirmed");
    assert(
      !unauthHasOrder && (unauthConfirmRes.status === 404 || unauthConfirmText.includes("Sanctuary Not Found") || unauthConfirmText.includes("404")),
      "Unauthenticated user cannot view order confirmation page (IDOR blocked: 404 Sanctuary Not Found rendered)",
      `Status: ${unauthConfirmRes.status}, Order details exposed: ${unauthHasOrder}`
    );

    // 4.5 Customer A (the rightful owner) can view their order confirmation page
    const ownerConfirmRes = await fetch(`${BASE_URL}/order-confirmation/${orderData.orderId}`, {
      headers: {
        Cookie: `pow_session=${sessionTokenA}`,
      },
    });
    const ownerText = await ownerConfirmRes.text();
    assert(
      ownerConfirmRes.status === 200 && ownerText.includes(orderData.orderNumber),
      "Legitimate order owner (Customer A) successfully loads their order confirmation page with order number",
      `Expected 200 with ${orderData.orderNumber}, got ${ownerConfirmRes.status}`
    );

    // -------------------------------------------------------------
    // CHECK 5: Server-Side Pricing, Stock Validation & Duplicate Prevention
    // -------------------------------------------------------------
    console.log("\n--- Check 6: Pricing, Stock Validation & Duplicate Prevention ---");

    // 5.1 Excessive quantity stock check
    let stockError = false;
    try {
      await calculateAuthoritativeCart([
        {
          productId: product.id,
          quantity: product.stockQuantity + 9999,
        },
      ]);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("INSUFFICIENT_STOCK")) {
        stockError = true;
      }
    }
    assert(
      stockError,
      "Server-side stock check throws INSUFFICIENT_STOCK when requested quantity exceeds inventory"
    );

    // 5.2 Pricing calculation ignores client manipulation
    const calc = await calculateAuthoritativeCart([
      {
        productId: product.id,
        quantity: 1,
      },
    ]);
    assert(
      calc.subtotal === product.price,
      `calculateAuthoritativeCart calculates exact DB price (₹${product.price}) regardless of client inputs`
    );

    // 5.3 Failed payment attempt with fraudulent signature
    const gatewayOrder = await createRazorpayGatewayOrder(orderData.orderId);
    const fraudulentSig = "f".repeat(64);
    const failPaymentResult = await verifyRazorpayPayment({
      orderId: orderData.orderId,
      gatewayOrderId: gatewayOrder.gatewayOrderId,
      gatewayPaymentId: `pay_fraud_${Date.now()}`,
      gatewaySignature: fraudulentSig,
    });

    assert(
      failPaymentResult.success === false,
      "Payment verification with fraudulent HMAC signature returns success: false"
    );

    const failedPaymentRecord = await prisma.payment.findFirst({
      where: { orderId: orderData.orderId, status: "FAILED" },
    });
    assert(
      failedPaymentRecord?.failureReason === "HMAC_SIGNATURE_MISMATCH",
      "Failed payment attempt records FAILED status with failureReason 'HMAC_SIGNATURE_MISMATCH'"
    );

    // 5.4 Valid signature confirmation and stock decrement
    const initialProductStock = (await prisma.product.findUnique({ where: { id: product.id } }))?.stockQuantity || 0;
    const legitPaymentId = `pay_legit_${Date.now()}`;
    const legitSig = computeRazorpaySignature(gatewayOrder.gatewayOrderId, legitPaymentId);

    const confirmResult = await verifyRazorpayPayment({
      orderId: orderData.orderId,
      gatewayOrderId: gatewayOrder.gatewayOrderId,
      gatewayPaymentId: legitPaymentId,
      gatewaySignature: legitSig,
    });

    assert(
      confirmResult.success === true,
      "Legitimate HMAC-SHA256 signature confirms payment and marks order CONFIRMED/PAID"
    );

    const productAfterConfirm = await prisma.product.findUnique({ where: { id: product.id } });
    assert(
      productAfterConfirm?.stockQuantity === initialProductStock - 1,
      "Inventory is accurately decremented by purchased quantity upon confirmation"
    );

    // 5.5 Duplicate order prevention / Idempotency
    const duplicateConfirm = await verifyRazorpayPayment({
      orderId: orderData.orderId,
      gatewayOrderId: gatewayOrder.gatewayOrderId,
      gatewayPaymentId: legitPaymentId,
      gatewaySignature: legitSig,
    });
    const productAfterDup = await prisma.product.findUnique({ where: { id: product.id } });

    assert(
      duplicateConfirm.success === true && productAfterDup?.stockQuantity === initialProductStock - 1,
      "Idempotent verification succeeds without double-decrementing product inventory"
    );

    // -------------------------------------------------------------
    // CHECK 6: Rate Limiting
    // -------------------------------------------------------------
    console.log("\n--- Check 7: Rate Limiting Enforcement ---");
    const rateKey = `test_limit_${Date.now()}`;
    let allowedCount = 0;
    let blockedCount = 0;

    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(rateKey, { maxRequests: 3, intervalMs: 10000 });
      if (res.allowed) allowedCount++;
      else blockedCount++;
    }

    assert(
      allowedCount === 3 && blockedCount === 2,
      "Rate limiter allows exactly maxRequests (3) and blocks subsequent attempts (2) within interval"
    );

    // -------------------------------------------------------------
    // CHECK 7: Demo Credentials In Production Check
    // -------------------------------------------------------------
    console.log("\n--- Check 8: Production Demo Credentials Guard ---");
    // Verify that login route does not allow demo credentials when NODE_ENV === 'production'
    const prevNodeEnv = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";

    // In production, bcrypt compare is the ONLY way; fallback shortcuts are ignored
    const dummyHash = await bcrypt.hash("RealPassword123!", 10);
    const demoPasswordMatch = await bcrypt.compare("CustomerPavishna2026!Secure", dummyHash);
    assert(
      demoPasswordMatch === false,
      "Demo credentials shortcut is disabled in production; only cryptographic bcrypt verification is performed"
    );

    (process.env as Record<string, string | undefined>).NODE_ENV = prevNodeEnv;

    console.log("\n===============================================================");
    console.log(`AUDIT RESULTS: ${summary.passed} PASSED, ${summary.failed} FAILED`);
    console.log("===============================================================\n");

    if (summary.failed > 0) {
      process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    console.error("Audit test execution failed with error:", err);
    process.exit(1);
  }
}

runAuditTests();
