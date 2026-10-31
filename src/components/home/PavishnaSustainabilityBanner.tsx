"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";

export function PavishnaSustainabilityBanner() {
  return (
    <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 my-14 lg:my-18">
      <div className="w-full rounded-3xl bg-[#9E432D] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-xl">
        
        {/* Subtle decorative leaf line-art */}
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-20 select-none">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-white">
            <path d="M10 190 C60 140, 120 80, 190 10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M40 160 C30 140, 45 130, 60 145 C60 160, 50 170, 40 160 Z" fill="currentColor" fillOpacity="0.4" />
            <path d="M80 125 C70 105, 85 95, 100 110 C100 125, 90 135, 80 125 Z" fill="currentColor" fillOpacity="0.4" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Headline & Mission */}
          <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold tracking-widest uppercase mb-3">
              <Sprout className="w-3 h-3 text-[#FFD6BA]" />
              <span>EARTH FIRST ETHICS</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-normal leading-tight mb-4">
              Sustainability<br />
              <span className="italic text-[#FFD6BA]">Beyond Products</span>
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-lg mb-7 font-normal">
              From responsible South Indian farm sourcing to zero-plastic biodegradable kraft packaging, we are committed to leaving the earth cleaner than we found it.
            </p>

            <Link
              href="/our-story"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white pb-1 border-b border-white hover:text-[#FFD6BA] hover:border-[#FFD6BA] transition-colors"
            >
              <span>Our Sustainability</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-160 ease-out group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Column: Photograph of Hands with Soil Seedling */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
              <img
                src="/images/sustainability-soil.jpg"
                alt="Hands tenderly cupping fertile dark soil with a thriving green seedling"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
