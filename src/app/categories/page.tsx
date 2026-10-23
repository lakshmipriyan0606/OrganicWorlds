import React from "react";
import { Container, Section } from "@/components/ui/Container";
import { CategoryCard } from "@/components/product/CategoryCard";
import { productCategories } from "@/config/products";

export const metadata = {
  title: "All Categories — Curated Botanical Collections | Pavishna Organic Worlds",
  description: "Browse Pavishna Organic Worlds offerings: Handcrafted Herbal Bath Soaps, Cold-Pressed Scalp Oils, and pure botanical essentials.",
};

export default function CategoriesPage() {
  return (
    <div className="bg-[#FAFBF9] text-[#1B1C19]">
      <section className="relative bg-gradient-to-b from-[#F2F6F3] to-[#FAFBF9] py-14 md:py-20 border-b border-[#E3E8E1] overflow-hidden">
        <Container className="relative z-10">
          <div className="max-w-2xl">
            <span className="eyebrow mb-2">Botanical Directory</span>
            <h1 className="font-display text-4xl sm:text-5xl text-forest-900 mb-4 tracking-tight">
              All Categories
            </h1>
            <p className="text-sm sm:text-base text-[#3E4640] leading-relaxed font-normal">
              Every category is shaped by botanical integrity, tactile plastic-free packaging, and mindful self-care rituals — from Ayurvedic root oils to 6-week cured soaps and optional soy candles.
            </p>
          </div>
        </Container>
      </section>

      <Section spacing="spacious">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {productCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
