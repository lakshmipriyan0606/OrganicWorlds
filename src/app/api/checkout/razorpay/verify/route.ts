import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPayment } from "@/lib/services/payment-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters" },
        { status: 400 }
      );
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
