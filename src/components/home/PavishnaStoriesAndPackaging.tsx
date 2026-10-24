"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export function PavishnaStoriesAndPackaging() {
  return (
    <section className="w-full bg-[#FAF8F5] py-18 lg:py-22 border-b border-[#EAE3D6]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Card: Real Stories Testimonial */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs flex flex-col sm:flex-row items-center gap-6 group hover:shadow-xl hover:shadow-[#0D281E]/8 hover:border-[#0D281E]/30 transition-all duration-400">
            {/* Customer Photo */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 shadow-md border border-[#E5DFD4]">
              <img
                src="/images/ritual-glow-woman.jpg"
                alt="Verified customer Anjali R. holding Pavishna soap with glowing skin"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
              />
            </div>

            {/* Testimonial Quote & Info */}
            <div className="flex flex-col items-start">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#0D281E] block mb-1.5">
                REAL STORIES
              </span>
              <p className="font-display text-lg sm:text-xl text-[#0D281E] italic font-normal leading-snug mb-3">
                “My skin feels cleaner, softer and healthier than ever before.”
              </p>
              
              <div className="flex items-center gap-1 text-[#D4A373] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D4A373]" />
                ))}
              </div>

              <span className="text-xs font-semibold text-[#4A554D] block mb-3">
                — Anjali R., Chennai
              </span>

              {/* Verified Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF0E6] text-[#0D281E] text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-[#0D281E]" />
                <span>Verified Herbal Routine</span>
              </div>
            </div>
          </div>

          {/* Right Card: Conscious Packaging */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs flex flex-col sm:flex-row items-center gap-6 group hover:shadow-xl hover:shadow-[#0D281E]/8 hover:border-[#0D281E]/30 transition-all duration-400">
            {/* Packaging Photo */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 shadow-md border border-[#E5DFD4]">
              <img
                src="/images/conscious-packaging.jpg"
                alt="Pavishna eco-friendly kraft box and unbleached cotton drawstring pouch bag"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
              />
            </div>

            {/* Packaging Copy */}
            <div className="flex flex-col items-start">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#0D281E] block mb-1.5">
                CONSCIOUS PACKAGING
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-[#0D281E] font-medium leading-snug mb-2">
                Good for You.<br />
                <span className="italic text-[#1A4533]">Better for Earth.</span>
              </h3>
              <p className="text-xs text-[#525E55] leading-relaxed mb-4 font-normal">
                Our packaging is 100% plastic-free, biodegradable and designed for a cleaner, greener planet.
              </p>
              <Link
                href="/our-story"
                className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D281E] hover:text-[#1A4533] pb-0.5 border-b border-[#0D281E] hover:border-[#1A4533] transition-colors"
              >
                <span>Our Promise</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
