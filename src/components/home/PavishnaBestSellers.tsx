"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types/product";

interface PavishnaBestSellersProps {
  onQuickAdd: (product: Product) => void;
}

export function PavishnaBestSellers({ onQuickAdd }: PavishnaBestSellersProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  useEffect(() => {
    let ignore = false;
    async function loadBestSellers() {
      try {
        const res = await fetch("/api/products?bestSellers=true&limit=4");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load best sellers:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadBestSellers();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section ref={sectionRef} className="w-full bg-[#FAF8F5] py-16 lg:py-22 border-b border-[#EAE3D6]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12"
        >
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
        </motion.div>

        {/* 4 Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-[#E5DFD4]">
              <div className="aspect-square w-full rounded-xl bg-[#ECE7DC] mb-3" />
              <div className="h-4 bg-[#ECE7DC] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#ECE7DC] rounded w-1/2 mb-4" />
              <div className="h-8 bg-[#ECE7DC] rounded-full w-full" />
            </div>
          ))}

          {!loading && products.length === 0 && (
            <div className="col-span-2 md:col-span-4 flex flex-col items-center justify-center py-16 text-center">
              <span className="text-[#4E5B52] text-sm">No best sellers available right now. Check back soon.</span>
              <Link href="/shop" className="mt-4 text-xs font-bold uppercase tracking-wider text-[#0D281E] underline underline-offset-4">
                Browse All Products
              </Link>
            </div>
          )}

          {!loading && products.map((product, idx) => {
            const isAdded = addedId === product.id;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col justify-between bg-white rounded-2xl p-3 sm:p-4 border border-[#E5DFD4] shadow-xs hover:shadow-xl hover:shadow-[#0D281E]/8 hover:border-[#0D281E]/30 hover:-translate-y-1.5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <div>
                  {/* Photo with Smooth Scale */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F5F2EA] mb-3">
                    <Link href={`/products/${product.slug}`} className="block w-full h-full">
                      <img
                        src={product.featuredImage}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  {/* Title */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-display text-base sm:text-lg font-medium text-[#0D281E] group-hover:text-[#1A4533] transition-colors leading-snug line-clamp-1 mb-0.5">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Subtitle */}
                  <p className="text-[11px] sm:text-xs text-[#55635B] line-clamp-1 mb-3">
                    {product.subtitle}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-2 border-t border-[#EAE3D6]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-body text-sm sm:text-base font-bold text-[#0D281E]">
                    {formatCurrency(product.price)}
                  </span>

                  <button
                    onClick={(e) => handleAdd(product, e)}
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
                        <Plus className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
