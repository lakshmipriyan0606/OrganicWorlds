import { NextRequest, NextResponse } from "next/server";
import { getOrderByTrackingToken } from "@/lib/services/order-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Tracking token is required" }, { status: 400 });
    }

    const trackingData = await getOrderByTrackingToken(token);
    if (!trackingData) {
      return NextResponse.json(
        { error: "No shipment found for the provided sanctuary tracking token" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, tracking: trackingData });
  } catch (error) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Public tracking error:", error);
    return NextResponse.json(
      { error: "Failed to query tracking information" },
      { status: 500 }
    );
  }
}
