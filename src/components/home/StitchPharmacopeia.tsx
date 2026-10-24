"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flower2, Activity, Droplets, Sparkles, MapPin, Leaf, ShieldCheck } from "lucide-react";

const pillars = [
  {
    id: "rosemary",
    step: "01",
    tamilTag: "நுண் ரத்த ஓட்டம்",
    tag: "Micro-Circulation",
    tamilTitle: "நீலாம்பரி & ரோஸ்மேரி",
    title: "Neelambari & Rosemary",
    originTamil: "நீலகிரி சோலை",
    origin: "Nilgiri Sholas",
    description:
      "High-elevation Western Ghats botanicals scientifically documented to awaken dormant follicles, boost scalp micro-circulation, and prevent premature thinning.",
    icon: Activity,
    accentBg: "bg-[#82947B]/15",
    accentColor: "text-[#263D32]",
    badgeBg: "bg-[#263D32]/8 text-[#263D32]"
  },
  {
    id: "amla",
    step: "02",
    tamilTag: "வேர் வலிமை",
    tag: "Follicle Fortification",
    tamilTitle: "காட்டு நெல்லிக்காய்",
    title: "Wild Nellikai / Amla",
    originTamil: "ஜவ்வாது காடுகள்",
    origin: "Javadi Hills",
    description:
      "Wild-foraged Indian gooseberries slow-macerated for 40 days in golden sesame. Concentrated natural Vitamin C that seals split cuticles and restores mirror gloss.",
    icon: Sparkles,
    accentBg: "bg-[#263D32]/12",
    accentColor: "text-[#263D32]",
    badgeBg: "bg-[#263D32]/8 text-[#263D32]"
  },
  {
    id: "castor",
    step: "03",
    tamilTag: "அடர்த்தி பாதுகாப்பு",
    tag: "Cellular Lipid Density",
    tamilTitle: "மரச்செக்கு கரிசலாங்கண்ணி",
    title: "Wood-Pressed Bhringraj",
    originTamil: "காவிரி டெல்டா",
    origin: "Kaveri River Basin",
    description:
      "Cold wood-pressed ricinoleic seed oil infused with wild False Daisy root. Creates an impenetrable botanical lipid barrier that deeply anchors roots against stress shedding.",
    icon: Droplets,
    accentBg: "bg-[#82947B]/15",
    accentColor: "text-[#263D32]",
    badgeBg: "bg-[#263D32]/8 text-[#263D32]"
  },
  {
    id: "vetiver",
    step: "04",
    tamilTag: "உடற் குளிர்ச்சி",
    tag: "Grounding Scalp Relief",
    tamilTitle: "நாட்டு வெட்டிவேர்",
    title: "Pure Vetti Veru Roots",
    originTamil: "கடலூர் கடற்கரை",
    origin: "Cuddalore Sands",
    description:
      "Hand-harvested aromatic vetiver roots with golden aavaram petals. Neutralizes pitta body heat, soothes scalp inflammation, and imparts an earthy calming aroma.",
    icon: Flower2,
    accentBg: "bg-[#263D32]/10",
    accentColor: "text-[#263D32]",
    badgeBg: "bg-[#263D32]/8 text-[#263D32]"
  }
];

export function StitchPharmacopeia() {
  return (
    <section className="w-full bg-[#F4F4ED] py-20 lg:py-24 border-y border-[#E6E1D7] relative overflow-hidden">
      
      {/* Ambient background botanical leaf tint */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#82947B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#263D32]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5ECE0] border border-[#CCD7C5] mb-3 shadow-2xs"
          >
            <Leaf className="w-3.5 h-3.5 text-[#263D32]" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#263D32]">
              சித்த &amp; ஆயுர்வேத ரகசியம் • THE BOTANICAL PHARMACOPEIA
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-[42px] text-[#1A1C18] font-normal leading-tight mb-3"
          >
            Four Pillars of Scalp &amp; Hair{" "}
            <span className="italic font-display text-[#82947B]">Vitality</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-[#424844] leading-relaxed"
          >
            நேரடி இயற்கை தோட்டங்களிலிருந்து கைமுறையாக அறுவடை செய்யப்பட்டு, மரச்செக்கு பிழிதல் மற்றும் 40-நாள் சூரிய ஒளி ஊறல் மூலம் பெறப்படும் தூய ஆற்றல்.
          </motion.p>
        </div>

        {/* 4 Icon Pillars Grid - Smooth Interactive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white rounded-3xl p-6 sm:p-7 flex flex-col items-start border border-[#E3DDD1] shadow-2xs hover:shadow-2xl hover:shadow-[#263D32]/12 hover:border-[#263D32]/50 hover:-translate-y-2 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
              >
                {/* Top Corner Number Watermark */}
                <span className="absolute top-5 right-6 font-display text-2xl font-semibold text-[#82947B]/30 group-hover:text-[#263D32]/35 transition-colors">
                  {pillar.step}
                </span>

                {/* Animated Icon Circle */}
                <div className={`w-13 h-13 rounded-2xl ${pillar.accentBg} flex items-center justify-center ${pillar.accentColor} mb-5 group-hover:scale-110 group-hover:bg-[#263D32] group-hover:text-white transition-all duration-300 shadow-xs`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Tag & Tamil Benefit */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#263D32] bg-[#EAF0E6] px-2.5 py-0.5 rounded-full">
                    {pillar.tag}
                  </span>
                  <span className="text-[10px] font-medium text-[#82947B]">
                    • {pillar.tamilTag}
                  </span>
                </div>

                {/* Tamil Title */}
                <span className="text-xs font-semibold text-[#82947B] block -mb-1">
                  {pillar.tamilTitle}
                </span>

                {/* English Title */}
                <h3 className="font-display text-xl text-[#1A1C18] font-medium mb-2.5 group-hover:text-[#263D32] transition-colors">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#525A55] leading-relaxed mb-6 font-normal">
                  {pillar.description}
                </p>

                {/* Bottom Origin Meta */}
                <div className="mt-auto pt-3.5 border-t border-[#ECE7DC] w-full flex items-center justify-between text-xs text-[#727974]">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#82947B]">
                    {pillar.originTamil}
                  </span>
                  <span className="font-semibold text-[#1A1C18] flex items-center gap-1 text-[11px] group-hover:text-[#263D32] transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-[#263D32]" />
                    {pillar.origin}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
