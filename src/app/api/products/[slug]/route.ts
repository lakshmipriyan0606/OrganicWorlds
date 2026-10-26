import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/services/product-service";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Public product detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
