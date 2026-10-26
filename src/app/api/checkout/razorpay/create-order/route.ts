import { NextRequest, NextResponse } from "next/server";
import { createRazorpayGatewayOrder } from "@/lib/services/payment-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "Valid orderId is required" },
        { status: 400 }
      );
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
