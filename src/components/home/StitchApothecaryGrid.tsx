"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Star, Plus, Check, Heart } from "lucide-react";

interface StitchApothecaryGridProps {
  products: Product[];
  onQuickAdd: (product: Product) => void;
}

const filterOptions = [
  { id: "all", label: "All Formulations" },
  { id: "scalp-elixirs", label: "Scalp Elixirs", filterFn: (p: Product) => p.categoryLabel.toLowerCase().includes("scalp") || p.title.toLowerCase().includes("elixir") || p.title.toLowerCase().includes("drops") },
  { id: "conditioning-butters", label: "Conditioning Butters", filterFn: (p: Product) => p.categoryLabel.toLowerCase().includes("conditioning") || p.title.toLowerCase().includes("masque") || p.title.toLowerCase().includes("salve") },
  { id: "nourishing-mists", label: "Nourishing Mists", filterFn: (p: Product) => p.categoryLabel.toLowerCase().includes("mist") || p.title.toLowerCase().includes("mist") },
  { id: "wooden-tools", label: "Wooden Apothecary Tools", filterFn: (p: Product) => p.categoryLabel.toLowerCase().includes("tools") || p.title.toLowerCase().includes("comb") },
  { id: "artisanal-soaps", label: "Artisanal Bath Soaps", filterFn: (p: Product) => p.category === "soaps" }
];

export function StitchApothecaryGrid({ products, onQuickAdd }: StitchApothecaryGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedItemSlug, setAddedItemSlug] = useState<string | null>(null);

  const toggleWishlist = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleAddClick = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd(p);
    setAddedItemSlug(p.slug);
    setTimeout(() => {
      setAddedItemSlug(null);
    }, 1600);
  };

  // Filter products according to the active tab
  const displayedProducts = useMemo(() => {
    const selected = filterOptions.find(f => f.id === activeFilter);
    if (!selected || selected.id === "all") {
      // Prioritize the 6 stitch hair products + top soaps
      return products.slice(0, 9);
    }
    return products.filter(selected.filterFn || (() => true));
  }, [activeFilter, products]);

  return (
    <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pb-20">
      
      {/* Formulation Shortcuts / Filter Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b border-[#E6E1D7]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#263D32] block mb-1">
            Dispensary Formulations
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1A1C18] font-normal tracking-tight">
            Apothecary Dispensary
          </h2>
          <p className="text-xs sm:text-sm text-[#424844] mt-1">
            Filter by therapeutic modality or daily hair ritual
          </p>
        </div>

        {/* Scrollable Pill Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? "bg-[#263D32] text-white shadow-sm"
                    : "bg-[#EEEEE8] hover:bg-[#E5E5DE] text-[#424844]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Arched Product Grid with Motion Animations */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8"
      >
        <AnimatePresence mode="popLayout">
          {displayedProducts.map((p, idx) => {
            const isAdded = addedItemSlug === p.slug;
            const isFav = !!wishlist[p.slug];

            const tamilNames: Record<string, string> = {
              "vetti-veru-bath-soap": "வெட்டிவேர்",
              "hibiscus-rosa-bath-soap": "செம்பருத்தி",
              "neem-bath-soap": "வேப்பிலை",
              "rose-bath-soap": "பன்னீர் ரோஜா",
              "coconut-bath-soap": "தூய தேங்காய்",
              "aloe-vera-bath-soap": "கற்றாழை",
              "orange-bath-soap": "ஆரஞ்சு",
              "pavishna-botanical-hair-scalp-oil": "மூலிகை கூந்தல் தைலம்",
              "wild-jasmine-smoked-vetiver-candle": "மல்லிகை தீபம்",
              "santal-hinoki-botanical-candle": "சந்தன தீபம்",
              "dusk-olive-grove-candle": "ஆலிவ் தீபம்",
              "pavishna-royal-heritage-bath-hamper": "அரச குளியல் பெட்டகம்",
              "botanical-scalp-elixir": "ஸ்கால்ப் எலிக்சர்",
              "camellia-honey-repair-masque": "தேன் கூந்தல் மாஸ்க்",
              "white-tea-aloe-tonic-mist": "வெண்தேநீர் மிஸ்ட்",
              "nocturnal-scalp-renewal-drops": "இரவு கூந்தல் துளிகள்",
              "hand-carved-walnut-comb": "கைவினை மர சீப்பு",
              "shea-rosemary-split-end-salve": "ரோஸ்மேரி சால்வ்",
              "solstice-bath-ceremony-crate": "குளியல் பெட்டகம்",
            };

            return (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-[#E6E1D7] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#263D32]/12 hover:border-[#263D32]/50 cursor-pointer"
              >
                {/* Compact Arched Image Container - Reduced height & safe bounds */}
                <div>
                  <div className="relative w-full aspect-[4/3] rounded-t-2xl sm:rounded-t-[2.25rem] rounded-b-xl overflow-hidden bg-[#F4F4ED] border border-[#E6E1D7]/70 mb-3">
                    <Link href={`/products/${p.slug}`} className="block w-full h-full">
                      <img
                        src={p.featuredImage}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                        loading="lazy"
                      />
                    </Link>

                    {/* Badge - Safe bounds prevents text overlap / clipping */}
                    {p.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-block bg-[#263D32] text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
                          {p.badge}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button with Backdrop Blur & Spring Hover */}
                    <button
                      onClick={(e) => toggleWishlist(p.slug, e)}
                      aria-label="Save to Wishlist"
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#1A1C18] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 shadow-sm cursor-pointer"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isFav ? "fill-[#A4423B] text-[#A4423B]" : "text-[#1A1C18]"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & Tamil Heritage Header */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      {tamilNames[p.slug] && (
                        <span className="text-[10px] font-semibold text-[#82947B] block -mb-0.5">
                          {tamilNames[p.slug]}
                        </span>
                      )}
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="font-display text-base sm:text-[17px] text-[#1A1C18] font-medium group-hover:text-[#263D32] transition-colors duration-200 leading-snug line-clamp-1">
                          {p.title}
                        </h3>
                      </Link>
                    </div>
                    <span className="font-body text-sm sm:text-base font-semibold text-[#1A1C18] whitespace-nowrap pt-0.5">
                      {formatCurrency(p.price)}
                    </span>
                  </div>

                  {/* Subtitle / Botanical Specs */}
                  <p className="text-xs text-[#424844] line-clamp-1 mb-2.5 leading-relaxed font-normal">
                    {p.subtitle}
                  </p>
                </div>

                {/* Rating & Quick Add to Bag Bar */}
                <div className="pt-2.5 border-t border-[#E6E1D7]/60 flex items-center justify-between mt-auto">
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-1.5 text-[#263D32]">
                    <Star className="w-3.5 h-3.5 fill-[#263D32] text-[#263D32]" />
                    <span className="text-xs font-bold text-[#1A1C18]">{p.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-[#727974]">({p.reviewCount})</span>
                  </div>

                  {/* Quick Add Pill Button */}
                  <button
                    onClick={(e) => handleAddClick(p, e)}
                    className={`text-xs uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-200 shadow-xs cursor-pointer ${
                      isAdded
                        ? "bg-[#426B50] text-white scale-102"
                        : "bg-[#263D32] hover:bg-[#1A2C23] text-white hover:scale-104 active:scale-95 shadow-sm"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
