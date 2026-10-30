import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminOrderById, updateAdminOrderStatus } from "@/lib/services/order-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const order = await getAdminOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Admin order detail error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { status, carrier, trackingNumber, trackingUrl } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updated = await updateAdminOrderStatus({
      orderId: id,
      status,
      carrier,
      trackingNumber,
      trackingUrl,
      actorEmail: session.email,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update order status" },
      { status: 400 }
    );
  }
}
