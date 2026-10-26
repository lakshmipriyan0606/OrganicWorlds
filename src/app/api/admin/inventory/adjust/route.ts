import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { adjustProductStock } from "@/lib/services/product-service";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { productId, delta, reason } = body;
    if (!productId || typeof delta !== "number" || !reason) {
      return NextResponse.json(
        { error: "productId, numeric delta, and reason are required" },
        { status: 400 }
      );
    }

    const updated = await adjustProductStock(productId, delta, reason, session.email);
    return NextResponse.json({
      success: true,
      stockQuantity: updated.stockQuantity,
      inStock: updated.inStock,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    return NextResponse.json({ error: msg || "Failed to adjust stock" }, { status: 500 });
  }
}
