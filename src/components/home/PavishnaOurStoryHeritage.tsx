"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PavishnaOurStoryHeritage() {
  return (
    <section className="w-full bg-[#FAF8F5] py-18 lg:py-24 border-b border-[#EAE3D6] relative overflow-hidden">
      
      {/* Botanical branch watermark accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 pointer-events-none opacity-30 select-none">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#405448]">
          <path d="M20 180 C80 140, 130 90, 180 20" stroke="currentColor" strokeWidth="1" />
          <path d="M50 150 C40 130, 50 120, 65 130 C65 145, 58 155, 50 150 Z" fill="currentColor" fillOpacity="0.25" />
          <path d="M80 125 C75 105, 90 100, 100 110 C98 125, 90 132, 80 125 Z" fill="currentColor" fillOpacity="0.25" />
          <path d="M115 100 C110 85, 125 80, 135 92 C130 105, 120 110, 115 100 Z" fill="currentColor" fillOpacity="0.25" />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Photograph of Artisan Hands Craft */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#E2DDD2] group bg-[#F5F2EA]">
              <img
                src="/images/artisan-hands-craft.jpg"
                alt="Authentic Indian artisan hands sorting fresh flower petals and herbs in traditional brass uruli bowls"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column: Story Copy */}
          <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D281E] block mb-2">
              OUR STORY
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] text-[#0D281E] font-normal leading-[1.12] mb-5">
              Rooted in Tradition.<br />
              <span className="italic text-[#1A4533]">Made for Today.</span>
            </h2>
            <p className="text-base text-[#4E5B52] leading-relaxed mb-6 font-normal">
              We source the finest botanicals and follow traditional methods to bring you pure, effective and sustainable skincare.
            </p>
            <p className="text-xs sm:text-sm text-[#66756B] leading-relaxed mb-8 font-normal">
              Every soap is slowly cold-cured for six weeks under gentle coastal sea breezes, and our hair oils are naturally wood-pressed in ancestral Vaagai timber mills across Tamil Nadu.
            </p>
            <Link
              href="/our-story"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D281E] hover:text-[#1A4533] pb-1 border-b border-[#0D281E] hover:border-[#1A4533] transition-colors"
            >
              <span>Our Journey</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
