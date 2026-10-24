"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function PavishnaShopByRitual() {
  return (
    <section className="w-full bg-[#FAF8F5] py-16 lg:py-22 border-b border-[#EAE3D6]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline & Philosophy */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D281E] block mb-2">
              SHOP BY RITUAL
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] text-[#0D281E] font-normal leading-[1.12] mb-4">
              Small Rituals.<br />
              <span className="italic text-[#1A4533]">Big Changes.</span>
            </h2>
            <p className="text-sm text-[#4E5B52] leading-relaxed mb-6 font-normal">
              Care for your skin, hair and well-being with nature&apos;s best South Indian botanicals.
            </p>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D281E] hover:text-[#1A4533] pb-1 border-b border-[#0D281E] hover:border-[#1A4533] transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Column: Asymmetric Image Bento Mosaic */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Card 1: Large Vertical Card (Glow Naturally) */}
            <div className="sm:col-span-6 group relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] shadow-lg border border-[#E3DDD2] cursor-pointer">
              <Link href="/categories/soaps" className="block w-full h-full">
                <img
                  src="/images/ritual-glow-woman.jpg"
                  alt="South Indian woman with glowing skin holding herbal soap"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-7 text-white">
                  <h3 className="font-display text-2xl sm:text-3xl font-medium mb-1 group-hover:text-[#F0DFCA] transition-colors">
                    Glow Naturally
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 uppercase tracking-wider group-hover:underline">
                    <span>Skincare Soaps</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Stack: 2 Horizontal Cards */}
            <div className="sm:col-span-6 flex flex-col gap-5 sm:gap-6">
              
              {/* Card 2: Top Right (Nourish Your Hair) */}
              <div className="group relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9.5] shadow-lg border border-[#E3DDD2] cursor-pointer">
                <Link href="/categories/hair-care" className="block w-full h-full">
                  <img
                    src="/images/hair-oil-hero.jpg"
                    alt="Botanical hair oils in amber bottles with fresh flowers"
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
                    <h3 className="font-display text-xl sm:text-2xl font-medium mb-0.5 group-hover:text-[#F0DFCA] transition-colors">
                      Nourish Your Hair
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 uppercase tracking-wider group-hover:underline">
                      <span>Hair Oils</span>
                      <span>→</span>
                    </span>
                  </div>
                </Link>
              </div>

              {/* Card 3: Bottom Right (Daily Freshness) */}
              <div className="group relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9.5] shadow-lg border border-[#E3DDD2] cursor-pointer">
                <Link href="/categories/soaps" className="block w-full h-full">
                  <img
                    src="/images/img3.jpeg"
                    alt="Colorful artisanal soaps with red hibiscus flowers in ceramic bowl"
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
                    <h3 className="font-display text-xl sm:text-2xl font-medium mb-0.5 group-hover:text-[#F0DFCA] transition-colors">
                      Daily Freshness
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 uppercase tracking-wider group-hover:underline">
                      <span>Bath &amp; Body</span>
                      <span>→</span>
                    </span>
                  </div>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
