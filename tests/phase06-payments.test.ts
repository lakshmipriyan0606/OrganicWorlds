import { prisma } from "../src/lib/prisma";
import {
  createRazorpayGatewayOrder,
  computeRazorpaySignature,
  verifyRazorpayPayment,
  verifyWebhookSignature,
  handleRazorpayWebhookEvent,
} from "../src/lib/services/payment-service";
import crypto from "crypto";

async function runTests() {
  console.log("🧪 Running Phase 06 Secure Payment Integration Tests...\n");
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
    // Setup test product and test order
    const product = await prisma.product.findFirst({ where: { isPublished: true } });
    if (!product) {
      throw new Error("No published product found in database for test");
    }

    const initialStock = product.stockQuantity;

    // 1. Create a test order in PENDING_PAYMENT state
    const testOrder = await prisma.order.create({
      data: {
        orderNumber: `POW-TEST-PAY-${Date.now()}`,
        status: "PENDING_PAYMENT",
        paymentStatus: "PENDING",
        guestName: "Arunachalam Murugan",
        guestEmail: "arunachalam@example.com",
        guestPhone: "+91 98401 99999",
        subtotal: 1200,
        shippingAmount: 100,
        totalAmount: 1300,
        shippingAddress: JSON.stringify({
          fullName: "Arunachalam Murugan",
          addressLine1: "12 Vaniyar Street",
          city: "Madurai",
          state: "Tamil Nadu",
          postalCode: "625001",
          phone: "+91 98401 99999",
        }),
        items: {
          create: [
            {
              productId: product.id,
              productName: product.title,
              sku: product.sku,
              unitPrice: product.price,
              quantity: 2,
              totalPrice: product.price * 2,
            },
          ],
        },
        payments: {
          create: {
            gateway: "RAZORPAY",
            amount: 1300,
            status: "PENDING",
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    // TEST 1: createRazorpayGatewayOrder generates gateway order and sets paise
    const gatewayOrder = await createRazorpayGatewayOrder(testOrder.id);
    assert(
      typeof gatewayOrder.gatewayOrderId === "string" && gatewayOrder.gatewayOrderId.length > 5,
      "createRazorpayGatewayOrder generates valid gatewayOrderId"
    );
    assert(
      gatewayOrder.amount === 130000,
      "createRazorpayGatewayOrder calculates exact amount in paise (₹1,300 -> 130,000 paise)",
      `Expected 130000, got ${gatewayOrder.amount}`
    );
    assert(
      gatewayOrder.currency === "INR",
      "createRazorpayGatewayOrder enforces INR currency"
    );

    // TEST 2: Payment record in DB updated with gatewayOrderId
    const paymentAfterCreate = await prisma.payment.findFirst({
      where: { orderId: testOrder.id },
    });
    assert(
      paymentAfterCreate?.gatewayOrderId === gatewayOrder.gatewayOrderId,
      "Database payment record is updated with generated gatewayOrderId"
    );

    // TEST 3: createRazorpayGatewayOrder rejects invalid orderId
    let invalidOrderError = false;
    try {
      await createRazorpayGatewayOrder("non-existent-order-id-9999");
    } catch {
      invalidOrderError = true;
    }
    assert(invalidOrderError, "createRazorpayGatewayOrder rejects nonexistent order ID");

    // TEST 4: HMAC Signature Computation & Cryptographic Verification
    const mockPaymentId = `pay_rzp_mock_${Date.now()}`;
    const validSignature = computeRazorpaySignature(gatewayOrder.gatewayOrderId, mockPaymentId);

    assert(
      typeof validSignature === "string" && validSignature.length === 64,
      "computeRazorpaySignature outputs 64-char hexadecimal SHA256 string"
    );

    // TEST 5: verifyRazorpayPayment confirms order on valid signature
    const verifyResult = await verifyRazorpayPayment({
      orderId: testOrder.id,
      gatewayOrderId: gatewayOrder.gatewayOrderId,
      gatewayPaymentId: mockPaymentId,
      gatewaySignature: validSignature,
    });

    assert(
      verifyResult.success === true,
      "verifyRazorpayPayment succeeds with authentic HMAC-SHA256 signature"
    );

    const orderAfterVerify = await prisma.order.findUnique({
      where: { id: testOrder.id },
      include: { payments: true },
    });

    assert(
      orderAfterVerify?.status === "CONFIRMED" && orderAfterVerify.paymentStatus === "PAID",
      "Order status advanced to CONFIRMED and paymentStatus to PAID"
    );

    assert(
      orderAfterVerify?.payments[0]?.status === "SUCCESS" &&
        orderAfterVerify.payments[0].gatewayPaymentId === mockPaymentId,
      "Payment record status updated to SUCCESS with recorded gatewayPaymentId"
    );

    // TEST 6: Stock deduction and inventory log recorded upon confirmation
    const productAfterPayment = await prisma.product.findUnique({ where: { id: product.id } });
    assert(
      productAfterPayment?.stockQuantity === initialStock - 2,
      "Product stock accurately decremented by purchased quantity",
      `Expected ${initialStock - 2}, got ${productAfterPayment?.stockQuantity}`
    );

    const inventoryLog = await prisma.inventoryLog.findFirst({
      where: { productId: product.id, reason: "ORDER_PLACED" },
      orderBy: { createdAt: "desc" },
    });
    assert(
      inventoryLog?.delta === -2,
      "InventoryLog record created with reason 'ORDER_PLACED' and delta -2"
    );

    // TEST 7: Idempotent verification does not duplicate stock decrement
    const idempotentResult = await verifyRazorpayPayment({
      orderId: testOrder.id,
      gatewayOrderId: gatewayOrder.gatewayOrderId,
      gatewayPaymentId: mockPaymentId,
      gatewaySignature: validSignature,
    });
    assert(
      idempotentResult.success === true,
      "verifyRazorpayPayment returns success idempotently on already confirmed order"
    );
    const productAfterIdempotent = await prisma.product.findUnique({ where: { id: product.id } });
    assert(
      productAfterIdempotent?.stockQuantity === initialStock - 2,
      "Idempotent verification preserves stock level without double-decrementing"
    );

    // TEST 8: Rejection of tampered / fraudulent signature
    const secondOrder = await prisma.order.create({
      data: {
        orderNumber: `POW-TEST-FRAUD-${Date.now()}`,
        status: "PENDING_PAYMENT",
        paymentStatus: "PENDING",
        subtotal: 500,
        shippingAmount: 100,
        totalAmount: 600,
        shippingAddress: testOrder.shippingAddress,
        payments: {
          create: {
            gateway: "RAZORPAY",
            amount: 600,
            status: "PENDING",
          },
        },
      },
    });

    const secondGatewayOrder = await createRazorpayGatewayOrder(secondOrder.id);
    const fraudulentSignature = "0000000000000000000000000000000000000000000000000000000000000000";

    const fraudResult = await verifyRazorpayPayment({
      orderId: secondOrder.id,
      gatewayOrderId: secondGatewayOrder.gatewayOrderId,
      gatewayPaymentId: `pay_fraud_${Date.now()}`,
      gatewaySignature: fraudulentSignature,
    });

    assert(
      fraudResult.success === false,
      "verifyRazorpayPayment rejects fraudulent/tampered HMAC signature"
    );

    const fraudOrder = await prisma.order.findUnique({
      where: { id: secondOrder.id },
      include: { payments: true },
    });
    assert(
      fraudOrder?.status === "PENDING_PAYMENT",
      "Order status remains PENDING_PAYMENT after failed signature check"
    );
    assert(
      fraudOrder?.payments[0]?.status === "FAILED",
      "Payment record status transitioned to FAILED"
    );

    // TEST 9: Webhook signature verification
    const webhookSecret = "test_webhook_secret_key_12345";
    const samplePayload = JSON.stringify({
      entity: "event",
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_webhook_test_1",
            order_id: secondGatewayOrder.gatewayOrderId,
            amount: 60000,
            currency: "INR",
            status: "captured",
          },
        },
      },
    });

    const validWebhookSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(samplePayload)
      .digest("hex");

    assert(
      verifyWebhookSignature(samplePayload, validWebhookSig, webhookSecret) === true,
      "verifyWebhookSignature returns true for valid webhook HMAC signature"
    );
    assert(
      verifyWebhookSignature(samplePayload, "invalid_sig_123", webhookSecret) === false,
      "verifyWebhookSignature returns false for altered webhook signature"
    );

    // TEST 10: Webhook event handling for payment.captured
    // Set secret in env temporarily for test
    process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
    const webhookResult = await handleRazorpayWebhookEvent(JSON.parse(samplePayload));
    assert(
      webhookResult.handled === true,
      "handleRazorpayWebhookEvent handles payment.captured successfully"
    );

    const orderAfterWebhook = await prisma.order.findUnique({
      where: { id: secondOrder.id },
    });
    assert(
      orderAfterWebhook?.status === "CONFIRMED" && orderAfterWebhook.paymentStatus === "PAID",
      "Order transitioned to CONFIRMED via webhook event"
    );

    // Cleanup test products stock
    await prisma.product.update({
      where: { id: product.id },
      data: { stockQuantity: initialStock, inStock: true },
    });

    // Delete test orders to keep DB clean
    await prisma.order.deleteMany({
      where: {
        orderNumber: { in: [testOrder.orderNumber, secondOrder.orderNumber] },
      },
    });
  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  }

  console.log("\n========================================");
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log("========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
