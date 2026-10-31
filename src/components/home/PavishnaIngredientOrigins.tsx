"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ingredients = [
  {
    name: "Neem",
    tamil: "வேப்பிலை",
    benefit: "Purifies",
    desc: "Antibacterial protection and natural acne defense",
    image: "/images/img4.jpeg",
  },
  {
    name: "Turmeric",
    tamil: "மஞ்சள்",
    benefit: "Heals",
    desc: "Golden antioxidant glow and skin tone balance",
    image: "/images/turmeric-soap-bar.jpg",
  },
  {
    name: "Hibiscus",
    tamil: "செம்பருத்தி",
    benefit: "Brightens",
    desc: "Natural AHAs for supple, luminous cellular renewal",
    image: "/images/img3.jpeg",
  },
  {
    name: "Coconut",
    tamil: "தேங்காய்",
    benefit: "Moisturizes",
    desc: "Cold-pressed virgin lipids for deep epidermal hydration",
    image: "/images/img2.jpeg",
  },
];

export function PavishnaIngredientOrigins() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} id="ingredients" className="w-full bg-[#FAF8F5] py-18 lg:py-24 border-b border-[#EAE3D6]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading & Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-4"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0D281E] block mb-2">
              THE POWER OF NATURE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] text-[#0D281E] font-normal leading-[1.12] mb-4">
              Pure Ingredients.<br />
              <span className="italic text-[#1A4533]">Real Benefits.</span>
            </h2>
            <p className="text-sm text-[#4E5B52] leading-relaxed mb-6 font-normal">
              We choose every ingredient with care, from nature&apos;s purest Indian farm sources.
            </p>
            <Link
              href="/#ingredients"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D281E] hover:text-[#1A4533] pb-1 border-b border-[#0D281E] hover:border-[#1A4533] transition-colors"
            >
              <span>Our Ingredients</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right Column: 4 Botanical Ingredient Tiles */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {ingredients.map((ing, idx) => (
              <motion.div
                key={ing.name}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-[#E5DFD4] shadow-xs hover:shadow-lg hover:shadow-[#0D281E]/8 hover:border-[#0D281E]/30 hover:-translate-y-1.5 active:scale-[0.98] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
              >
                {/* Botanical Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#F5F2EA] mb-3.5 p-1">
                  <img
                    src={ing.image}
                    alt={ing.name}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <h4 className="font-display text-lg font-medium text-[#0D281E] mb-0.5 group-hover:text-[#1A4533] transition-colors">
                  {ing.name}
                </h4>

                {/* Tamil Name */}
                <span className="text-[10px] text-[#82947B] font-semibold mb-1 block">
                  {ing.tamil}
                </span>

                {/* Benefit Pill */}
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#0D281E] bg-[#EAF0E6] px-2.5 py-0.5 rounded-full mt-auto">
                  {ing.benefit}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
