"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

const articles = [
  {
    title: "Benefits of Neem for Healthy Skin",
    date: "Apr 12, 2025",
    tag: "Skin Rituals",
    image: "/images/img4.jpeg",
    slug: "benefits-of-neem",
  },
  {
    title: "DIY Turmeric Face Mask for Natural Glow",
    date: "Apr 03, 2025",
    tag: "Herbal DIY",
    image: "/images/turmeric-soap-bar.jpg",
    slug: "turmeric-face-mask-glow",
  },
  {
    title: "The Power of Herbal Oils for Hair Growth",
    date: "Mar 28, 2025",
    tag: "Hair Vitality",
    image: "/images/hero-hair-oil.jpg",
    slug: "herbal-oils-hair-growth",
  },
];

export function PavishnaBlogSection() {
  return (
    <section id="blog" className="w-full bg-[#FAF8F5] py-18 lg:py-22 border-b border-[#EAE3D6]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D281E] block mb-2">
              OUR BLOG
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#0D281E] font-normal leading-tight">
              Simple Tips. <span className="italic text-[#1A4533]">Natural Living.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4E5B52] mt-1.5 font-normal">
              Get the latest tips, skincare advice and botanical living ideas.
            </p>
          </div>

          <Link
            href="/#blog"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D281E] hover:text-[#1A4533] pb-1 border-b border-[#0D281E] hover:border-[#1A4533] transition-colors w-fit"
          >
            <span>Read All Blogs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.title}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E5DFD4] shadow-xs hover:shadow-xl hover:shadow-[#0D281E]/8 hover:border-[#0D281E]/30 hover:-translate-y-1.5 active:scale-[0.99] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Photo */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5F2EA]">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#0D281E] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs">
                    {art.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-lg text-[#0D281E] font-medium leading-snug group-hover:text-[#1A4533] transition-colors line-clamp-2 mb-2">
                    {art.title}
                  </h3>
                </div>
              </div>

              {/* Footer Date & Arrow */}
              <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs text-[#6A786F]">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-[#0D281E]/60" />
                  {art.date}
                </span>
                <span className="w-7 h-7 rounded-full bg-[#EAF0E6] text-[#0D281E] flex items-center justify-center font-bold text-xs group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
