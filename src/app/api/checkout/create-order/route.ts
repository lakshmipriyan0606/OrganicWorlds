import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { calculateAuthoritativeCart } from "@/lib/services/pricing-service";
import { checkoutSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. Validate payload schema
    const parsed = checkoutSchema.parse(body);

    // 2. Authoritative price & stock recalculation
    const calculation = await calculateAuthoritativeCart(parsed.items);

    // 3. Resolve user identity: session, existing email match, or optional inline registration
    let finalUserId = session?.userId;

    if (!finalUserId && parsed.email) {
      const cleanEmail = parsed.email.toLowerCase().trim();
      const existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
        select: { id: true },
      });

      if (existingUser) {
        finalUserId = existingUser.id;
      } else if (parsed.createAccount && parsed.password && parsed.password.length >= 6) {
        try {
          const passwordHash = await bcrypt.hash(parsed.password, 10);
          const newUser = await prisma.user.create({
            data: {
              name: parsed.customerName,
              email: cleanEmail,
              passwordHash,
              role: "CUSTOMER",
              phone: parsed.phone,
            },
          });
          finalUserId = newUser.id;

          // Automatically establish session cookie
          await setSessionCookie({
            userId: newUser.id,
            email: newUser.email,
            role: "CUSTOMER",
            name: newUser.name,
          });
        } catch (regErr) {
          console.warn("Inline account creation skipped:", regErr);
        }
      }
    }

    if (!finalUserId) {
      return NextResponse.json(
        {
          error: "AUTHENTICATION_REQUIRED",
          message: "Authentication is mandatory: Please sign in or create an account to place your order.",
        },
        { status: 401 }
      );
    }

    // 4. Generate unique order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `POW-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // 5. Atomic order persistence in database
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          user: { connect: { id: finalUserId } },
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
