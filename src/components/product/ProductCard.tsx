"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product";
import { useCart } from "@/components/cart/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Plus, Check, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  aspectRatio?: "portrait" | "square";
}

export function ProductCard({ product, aspectRatio = "portrait" }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-[#E6E1D7] transition-[transform,box-shadow,border-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#263D32]/12 hover:border-[#263D32]/50 cursor-pointer">
      <div>
        {/* Compact Arched Top Image Container */}
        <div className={`relative w-full overflow-hidden bg-[#F4F4ED] rounded-t-2xl sm:rounded-t-[2.25rem] rounded-b-xl mb-3 border border-[#E6E1D7]/60 ${
          aspectRatio === "portrait" ? "aspect-[4/3]" : "aspect-square"
        }`}>
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <img
              src={product.featuredImage}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
              loading="lazy"
            />
          </Link>

          {/* Badge - Positioned safely within bounds to avoid text clipping */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-block bg-[#263D32] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
                {product.badge}
              </span>
            </div>
          )}

          {/* Wishlist Button with Backdrop Blur & Spring Scale Pop */}
          <motion.button
            onClick={toggleWishlist}
            whileTap={{ scale: 0.85 }}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1A1C18] hover:bg-white shadow-sm cursor-pointer"
          >
            <motion.span
              animate={isWishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-[#A4423B] text-[#A4423B]" : "text-[#1A1C18]"}`} />
            </motion.span>
          </motion.button>
        </div>

        {/* Category Label */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#263D32] block mb-1">
          {product.categoryLabel}
        </span>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-base text-[#1A1C18] font-medium leading-tight group-hover:text-[#263D32] transition-colors line-clamp-1 mb-1">
            {product.title}
          </h3>
        </Link>

        {/* Subtitle */}
        <p className="text-xs text-[#424844] mb-3 line-clamp-1 leading-relaxed">
          {product.subtitle}
        </p>
      </div>

      {/* Price & Add to Bag */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E6E1D7]/60 mt-auto">
        <span className="font-body text-sm sm:text-base font-bold text-[#1A1C18]">
          {formatCurrency(product.price)}
        </span>

        <motion.button
          onClick={handleQuickAdd}
          whileTap={{ scale: 0.94 }}
          className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-colors duration-200 cursor-pointer shadow-xs ${
            isAdded
              ? "bg-[#426B50] text-white"
              : "bg-[#263D32] hover:bg-[#1A2C23] text-white hover:shadow-md"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

    </div>
  );
}
