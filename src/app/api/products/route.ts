import { NextRequest, NextResponse } from "next/server";
import { getPublishedCatalog, CatalogFilterOptions } from "@/lib/services/product-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const categorySlug = searchParams.get("categorySlug") || undefined;
    const maxPriceStr = searchParams.get("maxPrice");
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const search = searchParams.get("search") || undefined;
    const sortByParam = searchParams.get("sortBy");
    const sortBy = (sortByParam as CatalogFilterOptions["sortBy"]) || "featured";

    const products = await getPublishedCatalog({
      categorySlug,
      maxPrice,
      inStockOnly,
      search,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    });
  } catch (error) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Public products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
