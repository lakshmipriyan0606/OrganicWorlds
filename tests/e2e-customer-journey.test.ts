import { prisma } from "../src/lib/prisma";
import { calculateAuthoritativeCart } from "../src/lib/services/pricing-service";
import { computeRazorpaySignature } from "../src/lib/services/payment-service";

const BASE_URL = "http://localhost:3000";

async function runE2ECustomerJourney() {
  console.log("==================================================================");
  console.log("🛒 COMPLETE END-TO-END PATRON COMMERCE LIFECYCLE INTEGRATION TEST");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      if (detail) console.error(`     Detail: ${detail}`);
      failed++;
    }
  }

  try {
    const timestamp = Date.now();
    const patronName = "Meenakshi Sundaram";
    const patronEmail = `meenakshi_${timestamp}@example.com`;
    const patronPassword = "ArtisanalApothecary2026!Secure";
    const patronPhone = "+91 94433 12345";

    // -------------------------------------------------------------
    // STEP 1: Registration
    // -------------------------------------------------------------
    console.log("--- Step 1: Patron Registration ---");
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: patronName,
        email: patronEmail,
        password: patronPassword,
        phone: patronPhone,
      }),
    });

    assert(regRes.status === 201, "Registration succeeds with HTTP 201 Created", `Status: ${regRes.status}`);

    const regCookieHeader = regRes.headers.get("set-cookie") || "";
    const regSessionToken = (regCookieHeader.match(/pow_session=([^;]+)/) || [])[1];
    assert(!!regSessionToken, "Session cookie (pow_session) established upon registration");

    // Verify DB user record
    const userInDb = await prisma.user.findUnique({ where: { email: patronEmail } });
    assert(
      !!userInDb && userInDb.role === "CUSTOMER" && userInDb.name === patronName,
      "Patron registered in database with role 'CUSTOMER'"
    );

    // -------------------------------------------------------------
    // STEP 2: Authenticated Profile & Address Book
    // -------------------------------------------------------------
    console.log("\n--- Step 2: Address Book Setup ---");
    const addrRes = await fetch(`${BASE_URL}/api/account/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `pow_session=${regSessionToken}`,
      },
      body: JSON.stringify({
        fullName: patronName,
        addressLine1: "18 Pandian Salai, Tallakulam",
        addressLine2: "Beside Meenakshi Gardens",
        city: "Madurai",
        state: "Tamil Nadu",
        postalCode: "625002",
        phone: patronPhone,
        isDefault: true,
      }),
    });

    assert(addrRes.status === 200, "Patron successfully saves delivery address to address book");

    // -------------------------------------------------------------
    // STEP 3: Logout & Relogin Cycle
    // -------------------------------------------------------------
    console.log("\n--- Step 3: Logout & Relogin Session Cycle ---");
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `pow_session=${regSessionToken}`,
      },
    });
    assert(logoutRes.status === 200, "Logout succeeds and clears session cookie");

    const meAfterLogoutRes = await fetch(`${BASE_URL}/api/auth/me`);
    const meAfterLogout = await meAfterLogoutRes.json();
    assert(meAfterLogout.authenticated === false, "Session is invalidated after logout");

    // Relogin with credentials
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: patronEmail,
        password: patronPassword,
      }),
    });
    assert(loginRes.status === 200, "Patron logs back in successfully with registered credentials");

    const loginCookieHeader = loginRes.headers.get("set-cookie") || "";
    const activeSessionToken = (loginCookieHeader.match(/pow_session=([^;]+)/) || [])[1];
    assert(!!activeSessionToken, "Fresh authenticated session token issued upon relogin");

    // -------------------------------------------------------------
    // STEP 4: Product Discovery & Cart Authoritative Pricing
    // -------------------------------------------------------------
    console.log("\n--- Step 4: Catalog Discovery & Authoritative Cart Calculation ---");
    const product = await prisma.product.findFirst({
      where: { isPublished: true, stockQuantity: { gt: 10 } },
    });
    if (!product) throw new Error("No available product with stock > 10 for E2E test");

    const initialStock = product.stockQuantity;
    const orderQty = 2;

    const calcResult = await calculateAuthoritativeCart([
      {
        productId: product.id,
        quantity: orderQty,
      },
    ]);

    const expectedSubtotal = product.price * orderQty;
    const expectedShipping = expectedSubtotal >= 1500 ? 0 : 99;
    const expectedTotal = expectedSubtotal + expectedShipping;

    assert(
      calcResult.subtotal === expectedSubtotal,
      `Cart subtotal calculated authoritatively (₹${expectedSubtotal})`
    );
    assert(
      calcResult.totalAmount === expectedTotal,
      `Cart total amount includes shipping accurately (₹${expectedTotal})`
    );

    // -------------------------------------------------------------
    // STEP 5: Mandatory Checkout & Order Creation
    // -------------------------------------------------------------
    console.log("\n--- Step 5: Order Creation at Checkout ---");
    const checkoutRes = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `pow_session=${activeSessionToken}`,
      },
      body: JSON.stringify({
        customerName: patronName,
        email: patronEmail,
        phone: patronPhone,
        addressLine1: "18 Pandian Salai, Tallakulam",
        addressLine2: "Beside Meenakshi Gardens",
        city: "Madurai",
        state: "Tamil Nadu",
        postalCode: "625002",
        paymentMethod: "RAZORPAY",
        items: [
          {
            productId: product.id,
            quantity: orderQty,
          },
        ],
      }),
    });

    assert(checkoutRes.status === 200, "Order creation succeeds with HTTP 200 OK");
    const orderData = await checkoutRes.json();
    assert(!!orderData.orderId && !!orderData.orderNumber, "Order ID and Order Number received");

    // Database verification: verify order is bound exclusively to patron's user ID
    const dbOrder = await prisma.order.findUnique({
      where: { id: orderData.orderId },
      include: { items: true, payments: true },
    });

    assert(
      dbOrder?.userId === userInDb?.id,
      "Order record in database is strictly bound to patron's userId"
    );
    assert(
      dbOrder?.status === "PENDING_PAYMENT" && dbOrder?.paymentStatus === "PENDING",
      "Order initial status is PENDING_PAYMENT / PENDING"
    );

    // -------------------------------------------------------------
    // STEP 6: Razorpay Payment Gateway Order Initiation
    // -------------------------------------------------------------
    console.log("\n--- Step 6: Payment Gateway Order Initiation ---");
    const gatewayRes = await fetch(`${BASE_URL}/api/checkout/razorpay/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `pow_session=${activeSessionToken}`,
      },
      body: JSON.stringify({ orderId: orderData.orderId }),
    });

    assert(gatewayRes.status === 200, "Razorpay gateway order initiated successfully");
    const gatewayData = await gatewayRes.json();
    assert(!!gatewayData.gatewayOrderId, "Gateway order ID generated");

    // -------------------------------------------------------------
    // STEP 7: Payment Verification & Confirmation
    // -------------------------------------------------------------
    console.log("\n--- Step 7: Payment Verification & Atomic Confirmation ---");
    const mockPaymentId = `pay_e2e_${timestamp}`;
    const authenticSig = computeRazorpaySignature(gatewayData.gatewayOrderId, mockPaymentId);

    const verifyRes = await fetch(`${BASE_URL}/api/checkout/razorpay/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `pow_session=${activeSessionToken}`,
      },
      body: JSON.stringify({
        orderId: orderData.orderId,
        razorpayOrderId: gatewayData.gatewayOrderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: authenticSig,
      }),
    });

    assert(verifyRes.status === 200, "Payment verification succeeds with authentic HMAC signature");

    // Verify DB order status advanced to CONFIRMED
    const confirmedOrder = await prisma.order.findUnique({
      where: { id: orderData.orderId },
      include: { payments: true },
    });
    assert(
      confirmedOrder?.status === "CONFIRMED" && confirmedOrder?.paymentStatus === "PAID",
      "Order status advanced to CONFIRMED and paymentStatus to PAID"
    );
    assert(
      confirmedOrder?.payments[0]?.status === "SUCCESS",
      "Payment record status updated to SUCCESS"
    );

    // Verify stock decremented
    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
    assert(
      updatedProduct?.stockQuantity === initialStock - orderQty,
      `Product inventory decremented by ${orderQty} units (from ${initialStock} to ${updatedProduct?.stockQuantity})`
    );

    // -------------------------------------------------------------
    // STEP 8: Order Confirmation Page Access
    // -------------------------------------------------------------
    console.log("\n--- Step 8: Order Confirmation Page Access ---");
    const confPageRes = await fetch(`${BASE_URL}/order-confirmation/${orderData.orderId}`, {
      headers: {
        Cookie: `pow_session=${activeSessionToken}`,
      },
    });
    assert(confPageRes.status === 200, "Order confirmation page loads successfully for rightful owner");
    const confPageHtml = await confPageRes.text();
    assert(
      confPageHtml.includes(orderData.orderNumber),
      `Order confirmation HTML contains the authentic order number (${orderData.orderNumber})`
    );

    // -------------------------------------------------------------
    // STEP 9: Customer My Orders History Verification
    // -------------------------------------------------------------
    console.log("\n--- Step 9: Customer Order History in Sanctuary ---");
    const customerOrdersRes = await fetch(`${BASE_URL}/api/account/orders`, {
      headers: {
        Cookie: `pow_session=${activeSessionToken}`,
      },
    });

    assert(customerOrdersRes.status === 200, "Customer orders API (/api/account/orders) returns HTTP 200");
    const customerOrdersData = await customerOrdersRes.json();
    const placedOrder = customerOrdersData.orders?.find(
      (o: { id: string }) => o.id === orderData.orderId
    );

    assert(
      !!placedOrder,
      "Newly placed order appears in patron's account order history"
    );
    assert(
      placedOrder?.status === "CONFIRMED" && placedOrder?.totalAmount === expectedTotal,
      "Order in customer account displays CONFIRMED status with exact total amount"
    );

    console.log("\n==================================================================");
    console.log(`E2E COMMERCE LIFECYCLE RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================================\n");

    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (err) {
    console.error("E2E customer journey failed:", err);
    process.exit(1);
  }
}

runE2ECustomerJourney();
