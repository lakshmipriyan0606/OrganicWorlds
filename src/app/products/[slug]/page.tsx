import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ProductCard } from "@/components/product/ProductCard";
import { mockProducts, getProductBySlug as getMockProductBySlug } from "@/config/products";
import { getProductBySlug as getDbProductBySlug } from "@/lib/services/product-service";
import { ChevronRight } from "lucide-react";
import { Product } from "@/types/product";

export const instant = false;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mockProducts.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: Product | null = null;

  try {
    const dbProduct = await getDbProductBySlug(slug);
    if (dbProduct) {
      product = dbProduct as unknown as Product;
    }
  } catch (err) {
    console.error("DB product lookup error:", err);
  }

  if (!product) {
    product = (getMockProductBySlug(slug) as unknown as Product) || null;
  }

  if (!product) {
    notFound();
  }

  // Related products from same category or fallback
  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#FAFBF9] text-[#1A1C18] min-h-screen selection:bg-[#CEE9D9] selection:text-[#10271D]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-20">
        
        {/* Top Breadcrumbs & Tactile Specification Notation (Screen 3 Header) */}
        <div className="flex flex-wrap items-center justify-between gap-y-3 pb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#55423D]/80">
            <Link href="/" className="hover:text-[#263D32] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#AAA99F]" />
            <Link href="/shop" className="hover:text-[#263D32] transition-colors">Botanical Dispensary</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#AAA99F]" />
            <Link href={`/categories/${product.category}`} className="hover:text-[#263D32] transition-colors">
              {product.categoryLabel}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#AAA99F]" />
            <span className="text-[#263D32] font-bold truncate max-w-xs">{product.title}</span>
          </nav>

          <div className="hidden md:flex items-center gap-3 text-[#424844] text-[11px] font-semibold tracking-wider uppercase">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#426B50] animate-pulse" />
              SMALL BATCH DISTILLATION
            </span>
            <span>•</span>
            <span className="tracking-widest">DISPENSARY SPECIFICATION ST-12</span>
          </div>
        </div>

        {/* Product Details Component with Arched Gallery Stage & Regimen */}
        <ProductDetailView product={product} />

        {/* Related Offerings Section */}
        <div className="mt-20 pt-16 border-t border-[#E6E1D7]">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#263D32] block mb-1">
                Complete the Ritual
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1A1C18] font-normal tracking-tight">
                You May Also Appreciate
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-wider font-bold text-[#263D32] hover:text-[#10271D] underline underline-offset-4 cursor-pointer"
            >
              Browse All Offerings
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.slug} product={relProduct} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
