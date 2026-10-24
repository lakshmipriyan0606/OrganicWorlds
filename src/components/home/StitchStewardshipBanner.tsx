"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, RotateCcw, Sprout, ShieldCheck, Sparkles } from "lucide-react";

const commitments = [
  {
    icon: Truck,
    tamilTitle: "நேரடி விநியோகம்",
    title: "Conscious Despatch",
    tamilBadge: "பிளாஸ்டிக் அற்றது",
    badge: "100% Plastic-Free",
    description: "Complimentary domestic zero-carbon transit for orders over ₹1,500 across India. Packed thoughtfully in recycled kraft paper & plant fiber.",
    accentBg: "bg-[#82947B]/15",
    accentColor: "text-[#263D32]"
  },
  {
    icon: RotateCcw,
    tamilTitle: "மண்பாண்ட சுழற்சி",
    title: "Perpetual Clay Vessels",
    tamilBadge: "மறுபயன்பாடு",
    badge: "Refill & Reuse",
    description: "Handcrafted terracotta vessels and glass apothecary jars. Return empty containers to any partner stockist for an instant ritual refill credit.",
    accentBg: "bg-[#263D32]/12",
    accentColor: "text-[#263D32]"
  },
  {
    icon: Sprout,
    tamilTitle: "மரச்செக்கு உற்பத்தி",
    title: "Regenerative Harvest",
    tamilBadge: "குளிர்ந்த முறை",
    badge: "Cold Wood-Pressed",
    description: "Every botanical extract pressed in traditional Vaagai wood mills without heat friction, preserving fragile phytosterols and live herbal nutrients.",
    accentBg: "bg-[#82947B]/15",
    accentColor: "text-[#263D32]"
  }
];

export function StitchStewardshipBanner() {
  return (
    <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 my-12 lg:my-16">
      
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
          இயற்கையோடு இணைந்த வாழ்க்கை • BOTANICAL ETHICS
        </span>
        <h3 className="font-display text-2xl sm:text-3xl text-[#1A1C18] font-normal">
          Conscious Care, <span className="italic font-display text-[#263D32]">Pure Stewardship</span>
        </h3>
      </div>

      {/* 3 Distinct Elevated Cards with Smooth Hover Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {commitments.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white rounded-3xl p-7 flex flex-col items-start border border-[#E3DDD1] shadow-2xs hover:shadow-xl hover:shadow-[#263D32]/8 hover:border-[#263D32]/40 hover:-translate-y-1.5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
            >
              {/* Top Row: Icon + Badge */}
              <div className="w-full flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl ${item.accentBg} flex items-center justify-center ${item.accentColor} group-hover:scale-110 group-hover:bg-[#263D32] group-hover:text-white transition-all duration-300 shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#263D32] bg-[#EAF0E6] px-2.5 py-1 rounded-full">
                  {item.badge}
                </span>
              </div>

              {/* Tamil Subtitle */}
              <span className="text-[11px] font-semibold text-[#82947B] block -mb-0.5">
                {item.tamilTitle}
              </span>

              {/* Title */}
              <h4 className="font-display text-lg text-[#1A1C18] font-medium mb-2 group-hover:text-[#263D32] transition-colors">
                {item.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-[#525A55] leading-relaxed font-normal">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
