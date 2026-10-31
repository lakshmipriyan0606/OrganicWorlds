import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productCategories, getProductsByCategory } from "@/config/products";
import { getPublishedCatalog } from "@/lib/services/product-service";
import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product";
import { ArrowLeft } from "lucide-react";

export const instant = false;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return productCategories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  let categoryName = "";
  let categoryDesc: string | null = "";

  try {
    const dbCat = await prisma.category.findUnique({ where: { slug } });
    if (dbCat) {
      categoryName = dbCat.name;
      categoryDesc = dbCat.description;
    }
  } catch (err) {
    console.error("DB category lookup error:", err);
  }

  if (!categoryName) {
    const staticCat = productCategories.find((c) => c.slug === slug);
    if (!staticCat) {
      notFound();
    }
    categoryName = staticCat.name;
    categoryDesc = staticCat.description;
  }

  let products = await getPublishedCatalog({ categorySlug: slug });
  if (!products || products.length === 0) {
    products = (getProductsByCategory(slug) as unknown as typeof products) || [];
  }

  return (
    <div className="bg-[#FAFBF9] text-[#1B1C19]">
      {/* Category Hero */}
      <section className="relative bg-gradient-to-b from-[#F2F6F3] to-[#FAFBF9] py-14 md:py-20 border-b border-[#E3E8E1] overflow-hidden">
        <Container className="relative z-10">
          <div className="mb-6">
            <Link
              href="/categories"
              className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#3E4640] hover:text-forest-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-160 ease-out group-hover:-translate-x-1" />
              <span>All Categories</span>
            </Link>
          </div>

          <div className="max-w-2xl">
            <span className="eyebrow mb-2">Artisanal Collection</span>
            <h1 className="font-display text-4xl sm:text-5xl text-forest-900 mb-4 tracking-tight">
              {categoryName}
            </h1>
            <p className="text-sm sm:text-base text-[#3E4640] leading-relaxed font-normal">
              {categoryDesc}
            </p>
          </div>
        </Container>
      </section>

      {/* Product Grid */}
      <Section spacing="spacious">
        <Container>
          <div className="mb-8 flex justify-between items-center pb-4 border-b border-[#E2DDD2]">
            <span className="text-xs uppercase tracking-wider font-bold text-[#3E4640]">
              Showing {products.length} Handcrafted Formulations
            </span>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-wider font-bold text-forest-900 hover:text-forest-700 underline underline-offset-4"
            >
              Browse All Collections
            </Link>
          </div>

          <ProductGrid products={products as unknown as Product[]} columns={3} />
        </Container>
      </Section>
    </div>
  );
}
