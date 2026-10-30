import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listAdminOrders } from "@/lib/services/order-service";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const result = await listAdminOrders({ page, limit, status, search });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Admin orders list error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load orders" },
      { status: 500 }
    );
  }
}
