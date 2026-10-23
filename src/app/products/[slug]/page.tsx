import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ProductGrid } from "@/components/product/ProductGrid";
import { mockProducts, getProductBySlug } from "@/config/products";
import { ChevronRight } from "lucide-react";

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
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products from same category or fallback
  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-600 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-forest-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link href="/shop" className="hover:text-forest-900 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link href={`/categories/${product.category}`} className="hover:text-forest-900 transition-colors">
            {product.categoryLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-forest-900 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Details Component */}
        <ProductDetailView product={product} />

        {/* Customer Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border">
            <div className="max-w-3xl">
              <span className="eyebrow mb-2">Verified Impressions</span>
              <h2 className="font-display text-2xl sm:text-3xl text-forest-900 mb-8">
                Customer Ritual Reviews
              </h2>

              <div className="space-y-6">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-6 bg-white border border-border rounded-[3px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-forest-900">{rev.author}</span>
                      <span className="text-xs text-neutral-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-warning text-xs mb-3">
                      {"★".repeat(rev.rating)}
                    </div>
                    <h4 className="font-display text-lg text-forest-900 mb-1">{rev.title}</h4>
                    <p className="text-sm text-charcoal-600 leading-relaxed font-light">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Offerings */}
        <div className="mt-24 pt-16 border-t border-border">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="eyebrow mb-2">Complete the Ritual</span>
              <h2 className="font-display text-2xl sm:text-3xl text-forest-900">
                You May Also Appreciate
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-wider font-semibold text-forest-900 hover:text-forest-700 underline underline-offset-4"
            >
              Browse All
            </Link>
          </div>

          <ProductGrid products={relatedProducts} columns={3} />
        </div>
      </Container>
    </div>
  );
}
