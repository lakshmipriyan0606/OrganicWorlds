import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  handleRazorpayWebhookEvent,
} from "@/lib/services/payment-service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("Invalid Razorpay webhook signature rejected");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const result = await handleRazorpayWebhookEvent(payload);

    return NextResponse.json({
      status: "ok",
      result,
    });
  } catch (error) {
    console.error("Razorpay webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal webhook processing error" },
      { status: 500 }
    );
  }
}
