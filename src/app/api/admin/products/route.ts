import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminProductList, createAdminProduct } from "@/lib/services/product-service";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const result = await getAdminProductList(page, limit, search, category);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const product = await createAdminProduct(body, session.email);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    if (msg.startsWith("SLUG_EXISTS") || msg.startsWith("SKU_EXISTS")) {
      return NextResponse.json({ error: msg }, { status: 409 });
    }
    console.error("Admin products POST error:", error);
    return NextResponse.json({ error: msg || "Failed to create product" }, { status: 400 });
  }
}
