"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Award, Heart, Star, Sparkles, ArrowRight } from "lucide-react";
import { HeroCMSData, DEFAULT_HERO_DATA } from "@/types/cms";

interface PavishnaHeroProps {
  content?: HeroCMSData;
}

export function PavishnaHero({ content }: PavishnaHeroProps) {
  const data = { ...DEFAULT_HERO_DATA, ...content };

  return (
    <section className="relative w-full bg-[#FAF8F5] text-[#10281D] overflow-hidden pt-10 sm:pt-14 lg:pt-18 pb-0 border-b border-[#EAE3D6]">
      
      {/* Decorative Botanical Foliage Watermark in background */}
      <div className="absolute top-0 right-0 w-80 h-80 sm:w-96 sm:h-96 pointer-events-none opacity-40 select-none z-0">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#405448]">
          <path d="M180 20 C140 60, 100 110, 80 180" stroke="currentColor" strokeWidth="1" />
          <path d="M150 50 C130 40, 120 50, 130 65 C145 65, 155 58, 150 50 Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M125 80 C105 75, 100 90, 110 100 C125 98, 132 90, 125 80 Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M100 115 C85 110, 80 125, 92 135 C105 130, 110 120, 100 115 Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Editorial Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-4"
          >
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 mb-5 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#3A4A40]">
              <span>{data.eyebrow}</span>
            </div>

            {/* Editorial Serif Headline */}
            <h1 className="font-display text-[44px] sm:text-[58px] lg:text-[66px] text-[#0D281E] leading-[1.06] tracking-tight font-normal mb-5">
              {data.title}<br />
              <span className="font-display italic font-normal text-[#1A4533]">{data.italicTitle}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#455048] max-w-lg mb-8 leading-relaxed font-normal">
              {data.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-10 sm:mb-12">
              <Link
                href={data.ctaPrimaryLink || "/categories/soaps"}
                className="px-7 py-3.5 rounded-full bg-[#0D281E] text-white hover:bg-[#081B13] text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-102 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>{data.ctaPrimaryText}</span>
                <span>→</span>
              </Link>
              <Link
                href={data.ctaSecondaryLink || "/categories/hair-care"}
                className="px-7 py-3.5 rounded-full border border-[#0D281E]/40 text-[#0D281E] hover:bg-[#0D281E]/5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-102 cursor-pointer"
              >
                {data.ctaSecondaryText}
              </Link>
            </div>
          </motion.div>

          {/* Right Cinematic Pouring Oil Product Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex justify-center lg:justify-end relative"
          >
            <div className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-[#E2DDD2] group bg-[#F5F1E8]">
              <img
                src={data.imageDesktop || "/images/hero-hair-oil.jpg"}
                alt={data.imageAlt || "Pavishna herbal formulation visual"}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-104"
              />

              {data.overlayOpacity ? (
                <div
                  className="absolute inset-0 bg-black pointer-events-none"
                  style={{ opacity: (data.overlayOpacity || 0) / 100 }}
                />
              ) : null}

              {/* Circular Rotating Stamp Badge */}
              <div className="absolute top-6 right-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/90 backdrop-blur-md p-1 shadow-lg border border-[#0D281E]/15 flex items-center justify-center pointer-events-none select-none">
                <div className="relative w-full h-full flex items-center justify-center animate-spin" style={{ animationDuration: "25s" }}>
                  <svg className="w-full h-full text-[#0D281E]" viewBox="0 0 100 100">
                    <path
                      id="heroBadgePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text fontSize="7.8" letterSpacing="0.2em" fill="currentColor" fontWeight="600" className="uppercase">
                      <textPath href="#heroBadgePath" startOffset="0%">
                        • {data.badgeText || "100% NATURAL INGREDIENTS"} •
                      </textPath>
                    </text>
                  </svg>
                  <Leaf className="w-5 h-5 text-[#0D281E] absolute" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Section 2: Slim Trust & Brand Benefit Strip (Integrated seamlessly at bottom of Hero) */}
        <div className="mt-14 sm:mt-18 pt-6 pb-6 border-t border-[#EAE3D6] grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center text-center sm:text-left">
          
          {/* Trust 1 */}
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0D281E]/8 flex items-center justify-center text-[#0D281E] shrink-0">
              <Leaf className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D281E]">100% Natural</h4>
              <p className="text-[11px] text-[#55635B]">Ingredients</p>
            </div>
          </div>

          {/* Trust 2 */}
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0D281E]/8 flex items-center justify-center text-[#0D281E] shrink-0">
              <Award className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D281E]">Handcrafted</h4>
              <p className="text-[11px] text-[#55635B]">in India</p>
            </div>
          </div>

          {/* Trust 3 */}
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0D281E]/8 flex items-center justify-center text-[#0D281E] shrink-0">
              <Heart className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D281E]">Trusted by</h4>
              <p className="text-[11px] text-[#55635B]">10,000+ Customers</p>
            </div>
          </div>

          {/* Trust 4 */}
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0D281E]/8 flex items-center justify-center text-[#0D281E] shrink-0">
              <Star className="w-4.5 h-4.5 fill-[#0D281E]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D281E]">4.8 / 5</h4>
              <p className="text-[11px] text-[#55635B]">Average Rating</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
