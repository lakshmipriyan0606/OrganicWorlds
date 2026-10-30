import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateAuthoritativeCart } from "@/lib/services/pricing-service";
import { checkoutSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate payload schema
    const validated = checkoutSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const parsed = validated.data;

    // 2. Mandatory Customer Session Verification
    // The customer ID is derived EXCLUSIVELY from the cryptographically verified session
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        {
          error: "AUTHENTICATION_REQUIRED",
          message: "Authentication is mandatory: Please sign in or register an account before placing an order.",
        },
        { status: 401 }
      );
    }

    const customerUserId = session.userId;

    // Rate limiting: max 10 order creations per minute per customer
    const rateCheck = checkRateLimit(`order:${customerUserId}`, { maxRequests: 10, intervalMs: 60000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many order requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    // 3. Authoritative price & stock recalculation
    const calculation = await calculateAuthoritativeCart(parsed.items);

    // 4. Generate unique order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `POW-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // 5. Atomic order persistence in database
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          user: { connect: { id: customerUserId } },
          guestName: parsed.customerName,
          guestEmail: parsed.email,
          guestPhone: parsed.phone,
          status: "PENDING_PAYMENT",
          paymentStatus: "PENDING",
          paymentMethod: parsed.paymentMethod || "RAZORPAY",
          subtotal: calculation.subtotal,
          discountAmount: calculation.discountAmount,
          shippingAmount: calculation.shippingAmount,
          taxAmount: calculation.taxAmount,
          totalAmount: calculation.totalAmount,
          currency: calculation.currency,
          shippingAddress: JSON.stringify({
            fullName: parsed.customerName,
            addressLine1: parsed.addressLine1,
            addressLine2: parsed.addressLine2 || null,
            city: parsed.city,
            state: parsed.state,
            postalCode: parsed.postalCode,
            phone: parsed.phone,
          }),
          billingAddress: JSON.stringify({
            fullName: parsed.customerName,
            addressLine1: parsed.addressLine1,
            addressLine2: parsed.addressLine2 || null,
            city: parsed.city,
            state: parsed.state,
            postalCode: parsed.postalCode,
            phone: parsed.phone,
          }),
          notes: parsed.notes || null,
          items: {
            create: calculation.items.map((item) => ({
              productId: item.productId,
              variantName: item.variantName || null,
              productName: item.productName,
              sku: item.sku,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              featuredImage: item.featuredImage,
            })),
          },
          payments: {
            create: {
              gateway: parsed.paymentMethod || "RAZORPAY",
              amount: calculation.totalAmount,
              currency: "INR",
              status: "PENDING",
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      return createdOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      currency: order.currency,
      status: order.status,
      message: "Order created successfully. Pending payment authorization.",
    });
  } catch (error: unknown) {
    console.error("Checkout create-order error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    const status =
      message.includes("INSUFFICIENT_STOCK") ||
      message.includes("PRODUCT_NOT_FOUND") ||
      message.includes("EMPTY_CART")
        ? 400
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
