"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Sparkles, Droplets, ArrowRight } from "lucide-react";

export function PavishnaFeaturedProduct() {
  return (
    <section className="w-full bg-[#0D281E] text-white py-18 lg:py-24 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#26533D]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#1E3F2E]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Product Story & CTA */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-4">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#86B398] block mb-2">
              FEATURED PRODUCT
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[46px] text-white font-normal leading-[1.1] mb-4">
              Neem Purifying<br />
              <span className="italic font-display text-[#B4D6C1]">Soap</span>
            </h2>
            <p className="text-sm text-[#D3E0D8] leading-relaxed mb-8 max-w-sm font-normal">
              Balances skin, fights impurities, and keeps you fresh naturally with cold-pressed neem seed oil and mountain spring water.
            </p>
            <Link
              href="/products/neem-bath-soap"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/40 text-white hover:bg-white hover:text-[#0D281E] text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-102 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Center Column: Hero Product Shot */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-[380px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-[#091D15]">
              <img
                src="/images/featured-neem-soap.jpg"
                alt="Pavishna engraved Neem purifying soap on rustic tree slice with fresh leaves"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
              />
            </div>
          </div>

          {/* Right Column: 3 Feature Badges */}
          <div className="lg:col-span-4 flex flex-col gap-5 lg:pl-6">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/8 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B4D6C1] shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">Neem Extract</h4>
                <p className="text-xs text-[#C5D6CC] mt-0.5 font-normal">Purifies &amp; protects skin microbiome</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/8 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B4D6C1] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">Aloe Vera</h4>
                <p className="text-xs text-[#C5D6CC] mt-0.5 font-normal">Soothes &amp; deeply heals skin cells</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/8 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#B4D6C1] shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">Essential Oils</h4>
                <p className="text-xs text-[#C5D6CC] mt-0.5 font-normal">100% pure botanical fragrance</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
