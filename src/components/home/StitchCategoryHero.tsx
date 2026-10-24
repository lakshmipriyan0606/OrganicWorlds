"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Droplets, Leaf, Sprout, Award, ChevronRight } from "lucide-react";

export function StitchCategoryHero() {
  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 500], [0, 35]);

  return (
    <section className="relative w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-4 pb-14">
      
      {/* Breadcrumbs Bar matching Stitch Screen 1 */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#55423D]/80 mb-6">
        <Link href="/" className="hover:text-[#263D32] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#AAA99F]" />
        <Link href="/shop" className="hover:text-[#263D32] transition-colors">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#AAA99F]" />
        <span className="text-[#263D32] font-bold">Hair &amp; Scalp Tonics</span>
      </nav>

      {/* Main Editorial Hero Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[#F4F4ED] rounded-3xl p-7 sm:p-10 lg:p-14 border border-[#E6E1D7] overflow-hidden shadow-xs"
      >
        {/* Ambient Subtle Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#263D32]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#82947B]/10 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Narrative & Formulations Info */}
          <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6">
            
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-7 h-[1.5px] bg-[#263D32]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#263D32]">
                Follicular Botanics
              </span>
            </div>

            {/* Display Headline with Serif Italic Emphasis */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-[#1A1C18] font-normal leading-[1.12] tracking-tight mb-5">
              Root &amp; Follicle Wellness: Hair &amp; Scalp{" "}
              <span className="italic font-normal text-[#263D32] font-display">Tonics</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-[#424844] leading-relaxed max-w-xl mb-7 font-normal">
              Ancient Ayurvedic and Mediterranean cold-pressed botanical infusions formulated to nourish hair follicles, soothe the scalp, and revive natural gloss without synthetic additives.
            </p>

            {/* Artisanal Value Tags */}
            <div className="flex flex-wrap items-center gap-2.5 mb-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAEAE2] text-[#1A1C18] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#263D32]" />
                <span>Cold-Pressed Bio-Actives</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAEAE2] text-[#1A1C18] text-xs font-semibold tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-[#82947B]" />
                <span>100% Botanical</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAEAE2] text-[#1A1C18] text-xs font-semibold tracking-wide">
                <Sprout className="w-3.5 h-3.5 text-[#272318]" />
                <span>Regenerative Harvest</span>
              </div>
            </div>

            {/* Editorial Metric Accents */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#E6E1D7] w-full max-w-lg mb-8">
              <div>
                <span className="font-display text-xl sm:text-2xl text-[#1A1C18] font-medium block">
                  6-Step
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#424844] font-medium block mt-0.5">
                  Slow Maceration
                </span>
              </div>
              <div>
                <span className="font-display text-xl sm:text-2xl text-[#1A1C18] font-medium block">
                  0%
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#424844] font-medium block mt-0.5">
                  Silicones or Sulfates
                </span>
              </div>
              <div>
                <span className="font-display text-xl sm:text-2xl text-[#1A1C18] font-medium block">
                  98.4%
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#424844] font-medium block mt-0.5">
                  Active Follicle Vitality
                </span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#263D32] hover:bg-[#1A2C23] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Formulations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/our-story"
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#FAFAF3] hover:bg-[#EEEEE8] text-[#1A1C18] border border-[#E6E1D7] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Pharmacopeia Lineage</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Signature Arched Frame Visual with Parallax */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div style={{ y: heroParallaxY }} className="relative w-full max-w-[380px] sm:max-w-[420px]">
              
              {/* Soft Ambient Botanical Glow */}
              <div className="absolute inset-0 rounded-t-full rounded-b-3xl bg-[#82947B]/20 blur-2xl transform scale-105 pointer-events-none" />

              {/* Symmetrical Outer Layered Arch Frame */}
              <div className="relative p-2.5 sm:p-3 rounded-t-full rounded-b-3xl bg-[#E8EDE4] border border-[#D5E0CF] shadow-xl">
                
                {/* Main Arched Container with high-res Still Life */}
                <div className="relative w-full aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden shadow-inner bg-[#EDE8DE] border border-[#E6E1D7] group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqTlKfoEnHGx0xl5URI7nd8fmfWh5rS0uDxYMbJDeV64X3nn7kVZJ_GV121x7P9QracGDDfl58wihiCKdpVp31LCl-Kj0KSN2Dnozj2FudYsb4EoLqcqjzzBGyRhi28fDKW1PahwE7VxdQcdLqQruQXSO_cfccfDkghOO0_fUxW94RzZ5I2WVw6l1JGthZPqDPnn_tzsihRyd6vF-nqhHxuVlQ124wZW7AIcY-DHT3xdiQVUqqQrEq"
                    alt="Artisanal dark amber glass dropper bottle pouring golden hair tonic oil over fresh green rosemary and sunlit bay leaves on rustic stone"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />

                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

                  {/* Floating Origin Stamp with Protected Glass Card */}
                  <div className="absolute bottom-5 inset-x-5 p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-between text-white z-10 shadow-lg">
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#CEE9D9] block">
                        Small Batch № 108
                      </span>
                      <span className="font-display text-base sm:text-lg font-normal text-white block mt-0.5">
                        Kodaikanal Wild Harvest
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25 text-white shrink-0 ml-3 shadow-xs">
                      <Leaf className="w-4.5 h-4.5 text-emerald-300" />
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
