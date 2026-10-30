import { NextRequest, NextResponse } from "next/server";
import {
  getPaginatedCatalog,
  getBestSellingProducts,
  CatalogFilterOptions,
} from "@/lib/services/product-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const isBestSellers =
      searchParams.get("bestSellers") === "true" ||
      searchParams.get("sortBy") === "best-sellers";
    const limitStr = searchParams.get("limit");
    const limit = limitStr ? parseInt(limitStr, 10) : 12;

    if (isBestSellers) {
      const bestSellers = await getBestSellingProducts(limit);
      return NextResponse.json({
        success: true,
        products: bestSellers,
        total: bestSellers.length,
      });
    }

    const categorySlug = searchParams.get("categorySlug") || undefined;
    const maxPriceStr = searchParams.get("maxPrice");
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const search = searchParams.get("search") || undefined;
    const sortByParam = searchParams.get("sortBy");
    const sortBy = (sortByParam as CatalogFilterOptions["sortBy"]) || "featured";
    const page = parseInt(searchParams.get("page") || "1", 10);

    const result = await getPaginatedCatalog({
      categorySlug,
      maxPrice,
      inStockOnly,
      search,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      products: result.products,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Public products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
