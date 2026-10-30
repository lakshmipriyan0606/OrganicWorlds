import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayPayment } from "@/lib/services/payment-service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized: Session required" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId && order.userId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: You do not own this order" }, { status: 403 });
    }

    const result = await verifyRazorpayPayment({
      orderId,
      gatewayOrderId: razorpayOrderId,
      gatewayPaymentId: razorpayPaymentId,
      gatewaySignature: razorpaySignature,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Payment signature verification failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
    });
  } catch (error) {
    console.error("Razorpay payment verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error during payment verification" },
      { status: 500 }
    );
  }
}
