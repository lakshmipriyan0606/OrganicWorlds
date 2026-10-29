import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRazorpayGatewayOrder } from "@/lib/services/payment-service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized: Session required" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "Valid orderId is required" },
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

    // Strict cross-account ownership check
    if (order.userId && order.userId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: You do not own this order" }, { status: 403 });
    }

    const gatewayOrder = await createRazorpayGatewayOrder(orderId);

    return NextResponse.json({
      success: true,
      ...gatewayOrder,
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to initiate payment gateway" },
      { status: 500 }
    );
  }
}
