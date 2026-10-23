"use client";

import React, { useState, useMemo } from "react";
import { Container, Section } from "@/components/ui/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { mockProducts, productCategories } from "@/config/products";
import { Search } from "lucide-react";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, sortBy, searchTerm]);

  return (
    <div className="bg-[#FAFBF9] text-[#1B1C19]">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-b from-[#F2F6F3] to-[#FAFBF9] py-14 md:py-20 border-b border-[#E3E8E1] overflow-hidden">
        <Container className="relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/5 text-emerald-900 text-[11px] font-bold tracking-widest uppercase border border-emerald-900/15 mb-3">
              Pavishna Botanical Catalog
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#0D3B2E] mb-4 tracking-tight font-bold">
              All Offerings
            </h1>
            <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-normal">
              Explore our 7 handcrafted herbal bath soaps, cold-pressed scalp elixirs, and optional companion aromatherapy candles. 100% natural, plastic-free, and chemical-free.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter Bar & Catalog */}
      <Section spacing="spacious">
        <Container>
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-10 border-b border-[#E3E8E1] gap-5">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#0D3B2E] text-white shadow-xs"
                    : "bg-white text-[#4A5568] border border-[#DCE3DB] hover:border-[#0D3B2E]"
                }`}
              >
                All ({mockProducts.length})
              </button>
              {productCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? "bg-[#0D3B2E] text-white shadow-xs"
                      : "bg-white text-[#4A5568] border border-[#DCE3DB] hover:border-[#0D3B2E]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input & Sorting Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Filter soaps, oils, candles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-white border border-[#DCE3DB] rounded-full text-xs text-[#1B1C19] focus:outline-none focus:border-[#0D3B2E] w-52 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#4A5568] uppercase tracking-wider font-bold">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#DCE3DB] rounded-full text-xs font-bold px-3.5 py-2 text-[#0D3B2E] focus:outline-none focus:border-[#0D3B2E] cursor-pointer shadow-2xs"
                >
                  <option value="featured">Curated &amp; Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} columns={3} />
          ) : (
            <div className="text-center py-20 bg-ivory-100 rounded-[3px] border border-[#E2DDD2]">
              <p className="font-display text-xl text-forest-900 mb-2">No botanical offerings found</p>
              <p className="text-xs text-[#3E4640] mb-6 font-normal">Try resetting your search term or selecting another ritual category.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                }}
                className="px-6 py-2.5 bg-forest-900 text-white text-xs uppercase tracking-wider font-bold rounded-[2px]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
