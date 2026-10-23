"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/components/cart/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Star, Plus, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  aspectRatio?: "portrait" | "square";
}

export function ProductCard({ product, aspectRatio = "portrait" }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-white border border-[#E5E9E4] rounded-[10px] overflow-hidden transition-all duration-300 hover:border-emerald-700/40 hover:shadow-lg">
      
      {/* Image Container with Badges & Quick Action */}
      <div className={`relative w-full overflow-hidden bg-[#F7F9F6] ${aspectRatio === "portrait" ? "aspect-[4/5]" : "aspect-square"}`}>
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.featuredImage}
            alt={product.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        {product.badge && (
          <div className="absolute top-3 left-3 pointer-events-none z-10">
            <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0D3B2E] border border-emerald-900/10 text-[10px] tracking-wider uppercase font-bold shadow-xs">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick Add Overlay Button */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-3 right-3 z-10 h-9 px-3 rounded-full border shadow-sm flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
            isAdded
              ? "bg-emerald-700 text-white border-emerald-700 scale-105"
              : "bg-white/95 text-[#0D3B2E] border-[#E2DDD2] hover:bg-[#0D3B2E] hover:text-white hover:scale-105"
          }`}
          aria-label={`Quick add ${product.title} to bag`}
          title="Quick add to bag"
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Added</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Add</span>
            </>
          )}
        </button>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-bold block mb-1">
            {product.categoryLabel}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#0D3B2E] group-hover:text-emerald-700 transition-colors leading-snug line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-[#4A5568] line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {product.subtitle}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EDF2EC] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-body font-bold text-base text-[#0D3B2E]">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-[#4A5568]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-[#1B1C19]">{product.rating}</span>
            <span className="text-neutral-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>

    </div>
  );
}
