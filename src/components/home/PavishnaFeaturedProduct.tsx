"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Leaf, Sparkles, Droplets, ArrowRight } from "lucide-react";

interface FeaturedProductData {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  price: number;
  badge?: string | null;
  featuredImage: string;
  ingredientsSummary?: string | null;
}

export function PavishnaFeaturedProduct() {
  const [product, setProduct] = useState<FeaturedProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  useEffect(() => {
    let ignore = false;
    async function loadFeatured() {
      try {
        const res = await fetch("/api/cms/homepage");
        if (res.ok) {
          const data = await res.json();
          if (!ignore && data.success && data.featuredProduct) {
            setProduct(data.featuredProduct);
          }
        }
      } catch (err) {
        console.error("Failed to load featured product:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadFeatured();
    return () => {
      ignore = true;
    };
  }, []);

  // Graceful handling if no product is featured or DB returns no product
  if (!loading && !product) {
    return null;
  }

  if (loading) {
    return (
      <section className="w-full bg-[#0D281E] text-white py-16 animate-pulse">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 h-64 flex items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-[#86B398]">Loading botanical spotlight...</span>
        </div>
      </section>
    );
  }

  if (!product) return null;

  return (
    <section ref={sectionRef} className="w-full bg-[#0D281E] text-white py-18 lg:py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#26533D]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#1E3F2E]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Product Story & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-4"
          >
            <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#86B398] block mb-2">
              {product.badge ? `${product.badge.toUpperCase()} SPOTLIGHT` : "FEATURED FORMULATION"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] text-white font-normal leading-[1.1] mb-4">
              {product.title}
            </h2>
            <p className="text-sm text-[#D3E0D8] leading-relaxed mb-8 max-w-sm font-normal line-clamp-3">
              {product.description}
            </p>
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/40 text-white hover:bg-white hover:text-[#0D281E] text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-102 cursor-pointer shadow-md"
            >
              <span>Explore Formulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Center Column: Hero Product Shot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex justify-center"
          >
            <div className="relative w-full max-w-[380px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-[#091D15]">
              <img
                src={product.featuredImage}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
              />
            </div>
          </motion.div>

          {/* Right Column: 3 Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col gap-5 lg:pl-6"
          >
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/8 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B4D6C1] shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">Pure Botanical Base</h4>
                <p className="text-xs text-[#C5D6CC] mt-0.5 font-normal">
                  {product.ingredientsSummary ? product.ingredientsSummary.slice(0, 45) + "..." : "Wild-harvested cold-pressed oils"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/8 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B4D6C1] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">Sacred Formulation</h4>
                <p className="text-xs text-[#C5D6CC] mt-0.5 font-normal">Handcrafted in small 6-week cured batches</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/8 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B4D6C1] shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">100% Non-Toxic</h4>
                <p className="text-xs text-[#C5D6CC] mt-0.5 font-normal">0% synthetic fragrance, palm oil, or sulfates</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
