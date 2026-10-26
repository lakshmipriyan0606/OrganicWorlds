"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types/product";

interface PavishnaBestSellersProps {
  onQuickAdd: (product: Product) => void;
}

const bestSellerItems = [
  {
    id: "pav-soap-03",
    title: "Neem Soap",
    subtitle: "Purifying & Refreshing",
    price: 390,
    image: "/images/img4.jpeg",
    slug: "neem-bath-soap",
    categoryLabel: "Artisanal Soap",
  },
  {
    id: "pav-soap-02",
    title: "Hibiscus Soap",
    subtitle: "Brightening & Nourishing",
    price: 450,
    image: "/images/img3.jpeg",
    slug: "hibiscus-rosa-bath-soap",
    categoryLabel: "Artisanal Soap",
  },
  {
    id: "pav-soap-01",
    title: "Turmeric Soap",
    subtitle: "Glow & Protection",
    price: 420,
    image: "/images/turmeric-soap-bar.jpg",
    slug: "vetti-veru-bath-soap",
    categoryLabel: "Artisanal Soap",
  },
  {
    id: "pav-soap-05",
    title: "Coconut Soap",
    subtitle: "Gentle & Moisturizing",
    price: 380,
    image: "/images/img2.jpeg",
    slug: "coconut-bath-soap",
    categoryLabel: "Artisanal Soap",
  },
];

export function PavishnaBestSellers({ onQuickAdd }: PavishnaBestSellersProps) {
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (item: typeof bestSellerItems[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      featuredImage: item.image,
      images: [item.image],
      slug: item.slug,
      categoryLabel: item.categoryLabel,
      rating: 5.0,
      reviewCount: 48,
    } as Product);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-16 lg:py-22 border-b border-[#EAE3D6]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D281E] block mb-2">
              BEST SELLERS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#0D281E] font-normal leading-tight">
              Loved by Nature. <span className="italic text-[#1A4533]">Chosen by You.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4E5B52] mt-1.5 font-normal">
              Our most loved products, crafted with pure botanicals.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D281E] hover:text-[#1A4533] pb-1 border-b border-[#0D281E] hover:border-[#1A4533] transition-colors w-fit"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Cards Row (Responsive Horizontal Scroll on mobile, 4-col on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellerItems.map((item) => {
            const isAdded = addedId === item.id;
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between bg-white rounded-2xl p-3 sm:p-4 border border-[#E5DFD4] shadow-xs hover:shadow-xl hover:shadow-[#0D281E]/8 hover:border-[#0D281E]/30 hover:-translate-y-1.5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <div>
                  {/* Photo with Smooth Scale */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F5F2EA] mb-3">
                    <Link href={`/products/${item.slug}`} className="block w-full h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  {/* Title */}
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-display text-base sm:text-lg font-medium text-[#0D281E] group-hover:text-[#1A4533] transition-colors leading-snug line-clamp-1 mb-0.5">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Subtitle */}
                  <p className="text-[11px] sm:text-xs text-[#55635B] line-clamp-1 mb-3">
                    {item.subtitle}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-2 border-t border-[#EAE3D6]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-body text-sm sm:text-base font-bold text-[#0D281E]">
                    {formatCurrency(item.price)}
                  </span>

                  <button
                    onClick={(e) => handleAdd(item, e)}
                    className={`text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs ${
                      isAdded
                        ? "bg-[#356348] text-white"
                        : "bg-[#0D281E] hover:bg-[#081B13] text-white hover:scale-103 active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <span>Add to Bag</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
