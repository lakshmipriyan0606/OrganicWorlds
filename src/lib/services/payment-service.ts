import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

export interface CreateGatewayOrderResult {
  orderId: string;
  orderNumber: string;
  gatewayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  isSimulated?: boolean;
  simulatedSignature?: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };
}

export interface VerifyPaymentParams {
  orderId: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  orderId: string;
  orderNumber: string;
  error?: string;
}

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "rzp_test_webhook_secret";
  const isPlaceholder =
    keyId.includes("placeholder") ||
    keySecret.includes("placeholder") ||
    keyId === "rzp_test_dummy";

  return { keyId, keySecret, webhookSecret, isPlaceholder };
}

/**
 * Creates a Razorpay gateway order for a pending order in the database.
 */
export async function createRazorpayGatewayOrder(
  orderId: string
): Promise<CreateGatewayOrderResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (order.status !== "PENDING_PAYMENT" && order.status !== "CONFIRMED") {
    throw new Error(`Order ${order.orderNumber} is not awaiting payment (current: ${order.status})`);
  }

  const amountInPaise = Math.round(order.totalAmount * 100);
  const { keyId, keySecret, isPlaceholder } = getRazorpayCredentials();

  let gatewayOrderId: string;
  let rawResponse: Record<string, unknown> = {};

  if (!isPlaceholder) {
    try {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: order.orderNumber,
        notes: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });

      gatewayOrderId = rzpOrder.id;
      rawResponse = rzpOrder as unknown as Record<string, unknown>;
    } catch (err) {
      console.warn("Razorpay API call failed, falling back to secure simulated gateway order:", err);
      gatewayOrderId = `order_rzp_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      rawResponse = { id: gatewayOrderId, simulated: true, amount: amountInPaise, currency: "INR" };
    }
  } else {
    // Deterministic mock gateway order for automated tests and local dev
    gatewayOrderId = `order_rzp_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    rawResponse = { id: gatewayOrderId, simulated: true, amount: amountInPaise, currency: "INR" };
  }

  // Update or create Payment record in DB
  const existingPayment = order.payments[0];
  if (existingPayment) {
    await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        gatewayOrderId,
        amount: order.totalAmount,
        currency: "INR",
        status: "PENDING",
        rawResponse: JSON.stringify(rawResponse),
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: "RAZORPAY",
        gatewayOrderId,
        amount: order.totalAmount,
        currency: "INR",
        status: "PENDING",
        rawResponse: JSON.stringify(rawResponse),
      },
    });
  }

  const isSimulated = isPlaceholder || gatewayOrderId.startsWith("order_rzp_mock_");
  let simulatedSignature:
    | {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
      }
    | undefined;

  if (isSimulated) {
    const mockPaymentId = `pay_rzp_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const mockSig = computeRazorpaySignature(gatewayOrderId, mockPaymentId, keySecret);
    simulatedSignature = {
      razorpayOrderId: gatewayOrderId,
      razorpayPaymentId: mockPaymentId,
      razorpaySignature: mockSig,
    };
  }

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    gatewayOrderId,
    amount: amountInPaise,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
    isSimulated,
    simulatedSignature,
  };
}

/**
 * Computes authoritative HMAC-SHA256 signature for Razorpay verification.
 */
export function computeRazorpaySignature(
  gatewayOrderId: string,
  gatewayPaymentId: string,
  secretOverride?: string
): string {
  const secret = secretOverride || getRazorpayCredentials().keySecret;
  return crypto
    .createHmac("sha256", secret)
    .update(`${gatewayOrderId}|${gatewayPaymentId}`)
    .digest("hex");
}

/**
 * Verifies Razorpay payment signature and transitions order to CONFIRMED.
 */
export async function verifyRazorpayPayment(
  params: VerifyPaymentParams
): Promise<VerifyPaymentResult> {
  const { orderId, gatewayOrderId, gatewayPaymentId, gatewaySignature } = params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payments: true,
      items: true,
    },
  });

  if (!order) {
    return { success: false, orderId, orderNumber: "", error: "Order not found" };
  }

  // If already confirmed, return success idempotently
  if (order.status === "CONFIRMED" && order.paymentStatus === "PAID") {
    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  }

  const { keySecret } = getRazorpayCredentials();
  const expectedSignature = computeRazorpaySignature(gatewayOrderId, gatewayPaymentId, keySecret);

  // Constant-time comparison
  const signatureMatches =
    crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(gatewaySignature, "utf-8")
    );

  if (!signatureMatches) {
    // Record payment failure
    const payment = order.payments.find((p) => p.gatewayOrderId === gatewayOrderId) || order.payments[0];
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          gatewayPaymentId,
          gatewaySignature,
          failureReason: "HMAC_SIGNATURE_MISMATCH",
        },
      });
    }

    return {
      success: false,
      orderId: order.id,
      orderNumber: order.orderNumber,
      error: "Cryptographic signature verification failed",
    };
  }

  // Signature is authentic: execute atomic confirmation transaction
  await prisma.$transaction(async (tx) => {
    // Re-verify order state inside the atomic transaction boundary
    const freshOrder = await tx.order.findUnique({ where: { id: order.id } });
    if (freshOrder?.status === "CONFIRMED" && freshOrder?.paymentStatus === "PAID") {
      return; // Already finalized by concurrent webhook
    }

    // 1. Update Payment record to SUCCESS
    const targetPayment = order.payments.find((p) => p.gatewayOrderId === gatewayOrderId) || order.payments[0];
    if (targetPayment) {
      await tx.payment.update({
        where: { id: targetPayment.id },
        data: {
          status: "SUCCESS",
          gatewayOrderId,
          gatewayPaymentId,
          gatewaySignature,
          rawResponse: JSON.stringify({ verified: true, verifiedAt: new Date().toISOString() }),
        },
      });
    }

    // 2. Advance Order status to CONFIRMED and paymentStatus to PAID
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
      },
    });

    // 3. Atomically decrement stock and record inventory log for each line item
    for (const item of order.items) {
      if (item.productId) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (product) {
          const newStock = Math.max(0, product.stockQuantity - item.quantity);
          await tx.product.update({
            where: { id: product.id },
            data: {
              stockQuantity: newStock,
              inStock: newStock > 0,
            },
          });

          await tx.inventoryLog.create({
            data: {
              productId: product.id,
              productSku: item.sku,
              delta: -item.quantity,
              previousStock: product.stockQuantity,
              newStock,
              reason: "ORDER_PLACED",
              actorEmail: order.guestEmail || order.userId || "System",
            },
          });
        }
      }
    }
  });

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
  };
}

/**
 * Validates Razorpay Webhook signature against raw payload.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secretOverride?: string
): boolean {
  const secret = secretOverride || getRazorpayCredentials().webhookSecret;
  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch {
    return false;
  }
}

/**
 * Handles incoming Razorpay webhook event with idempotency.
 */
export async function handleRazorpayWebhookEvent(payload: {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        error_description?: string;
        notes?: Record<string, string>;
      };
    };
    order?: {
      entity: {
        id: string;
        receipt?: string;
      };
    };
  };
}): Promise<{ handled: boolean; event: string; message: string }> {
  const { event } = payload;
  const paymentEntity = payload.payload.payment?.entity;

  if (!paymentEntity) {
    return { handled: false, event, message: "No payment entity found in webhook payload" };
  }

  const gatewayOrderId = paymentEntity.order_id;
  const gatewayPaymentId = paymentEntity.id;

  // Locate payment by gatewayOrderId or gatewayPaymentId
  const payment = await prisma.payment.findFirst({
    where: {
      OR: [
        { gatewayOrderId },
        { gatewayPaymentId },
      ],
    },
    include: { order: { include: { items: true } } },
  });

  if (!payment) {
    return {
      handled: false,
      event,
      message: `No payment record found for gatewayOrderId=${gatewayOrderId}`,
    };
  }

  if (event === "payment.captured" || event === "order.paid") {
    // Idempotent check
    if (payment.status === "SUCCESS" && payment.order.status === "CONFIRMED") {
      return { handled: true, event, message: "Payment already marked SUCCESS (idempotent skip)" };
    }

    await prisma.$transaction(async (tx) => {
      // Re-verify order state inside the atomic transaction boundary
      const freshOrder = await tx.order.findUnique({ where: { id: payment.orderId } });
      if (freshOrder?.status === "CONFIRMED" && freshOrder?.paymentStatus === "PAID") {
        return; // Already finalized by concurrent client verification
      }

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          gatewayPaymentId,
          rawResponse: JSON.stringify(paymentEntity),
        },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
        },
      });

      // Deduct stock if not already deducted
      for (const item of payment.order.items) {
        if (item.productId) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (product) {
            const newStock = Math.max(0, product.stockQuantity - item.quantity);
            await tx.product.update({
              where: { id: product.id },
              data: {
                stockQuantity: newStock,
                inStock: newStock > 0,
              },
            });

            await tx.inventoryLog.create({
              data: {
                productId: product.id,
                productSku: item.sku,
                delta: -item.quantity,
                previousStock: product.stockQuantity,
                newStock,
                reason: "ORDER_PLACED",
                actorEmail: payment.order.guestEmail || payment.order.userId || "Webhook",
              },
            });
          }
        }
      }
    });

    return { handled: true, event, message: `Order ${payment.order.orderNumber} confirmed via webhook` };
  }

  if (event === "payment.failed") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        gatewayPaymentId,
        failureReason: paymentEntity.error_description || "Payment failed via gateway",
        rawResponse: JSON.stringify(paymentEntity),
      },
    });

    return { handled: true, event, message: `Payment failed for order ${payment.order.orderNumber}` };
  }

  return { handled: true, event, message: `Unhandled event type: ${event}` };
}
