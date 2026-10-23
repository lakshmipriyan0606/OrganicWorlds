"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type HeroConcept = "editorial" | "herbarium" | "rituals";

const soapCards = [
  {
    id: "vetiver",
    title: "Vetti Veru Bath Soap",
    subtitle: "₹420 • Deep Cooling & Grounding",
    tag: "VETIVER ROOT",
    tagColor: "text-[#19221B]",
    image: "/images/Img1.jpeg",
    slug: "vetti-veru-bath-soap",
  },
  {
    id: "hibiscus",
    title: "Hibiscus Rosa Soap",
    subtitle: "₹450 • Translucent Ruby Glow",
    tag: "AHA GLOW",
    tagColor: "text-[#9E2034]",
    image: "/images/img3.jpeg",
    slug: "hibiscus-rosa-bath-soap",
  },
  {
    id: "rose",
    title: "Damask Rose Soap",
    subtitle: "₹480 • Radiant & Rejuvenating",
    tag: "DAMASK PETALS",
    tagColor: "text-[#9E2034]",
    image: "/images/img7.jpeg",
    slug: "rose-bath-soap",
  },
  {
    id: "neem",
    title: "Neem Soap",
    subtitle: "₹420 • Clear, Balanced & Fresh",
    tag: "PURIFYING NEEM",
    tagColor: "text-[#156038]",
    image: "/images/img4.jpeg",
    slug: "neem-bath-soap",
  },
];

export function AnimatedHeroSection() {
  const [activeConcept, setActiveConcept] = useState<HeroConcept>("editorial");
  const { scrollY } = useScroll();

  // Gentle, restrained parallax transforms
  const backgroundY = useTransform(scrollY, [0, 600], [0, 80]);
  const leftColY = useTransform(scrollY, [0, 600], [0, 40]);
  const rightColY = useTransform(scrollY, [0, 600], [0, 20]);
  const petal1Y = useTransform(scrollY, [0, 600], [0, -90]);
  const petal2Y = useTransform(scrollY, [0, 600], [0, -130]);
  const petal3Y = useTransform(scrollY, [0, 600], [0, -70]);

  return (
    <section className="relative w-full bg-[#F7F4EE] text-[#1B1C19] overflow-hidden pt-4 pb-16 lg:pt-8 lg:pb-22 border-b border-[#EAE3D6] select-none">
      
      {/* =========================================================================
          KEYFRAME STYLES: Dappled Sunlight, Organic Petal Drifts, Seal Spin
          ========================================================================= */}
      <style>{`
        @keyframes sunDapple {
          0%, 100% {
            transform: scale(1) translate(0px, 0px);
            opacity: 0.38;
          }
          50% {
            transform: scale(1.06) translate(12px, -8px);
            opacity: 0.52;
          }
        }
        @keyframes floatPetalSlow1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(16px, -24px, 0) rotate(14deg);
          }
        }
        @keyframes floatPetalSlow2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-18px, 20px, 0) rotate(-16deg);
          }
        }
        @keyframes floatPetalSlow3 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(22px, -18px, 0) rotate(20deg);
          }
        }
        @keyframes floatHerbariumDroplet {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(10px, -20px, 0) scale(1.04);
          }
        }
        @keyframes rotateSealBadge {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes swayHibiscus {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-6px, 10px, 0) rotate(-2deg);
          }
        }

        .animate-sun-dapple {
          animation: sunDapple 10s ease-in-out infinite;
        }
        .animate-petal-1 {
          animation: floatPetalSlow1 8s ease-in-out infinite;
        }
        .animate-petal-2 {
          animation: floatPetalSlow2 10.5s ease-in-out infinite;
        }
        .animate-petal-3 {
          animation: floatPetalSlow3 9.2s ease-in-out infinite;
        }
        .animate-droplet {
          animation: floatHerbariumDroplet 8.5s ease-in-out infinite;
        }
        .animate-seal-spin {
          animation: rotateSealBadge 26s linear infinite;
          transform-origin: center center;
        }
        .animate-sway-hibiscus {
          animation: swayHibiscus 11s ease-in-out infinite;
          transform-origin: left bottom;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-sun-dapple,
          .animate-petal-1,
          .animate-petal-2,
          .animate-petal-3,
          .animate-droplet,
          .animate-seal-spin,
          .animate-sway-hibiscus {
            animation: none !important;
          }
        }
      `}</style>

      {/* =========================================================================
          CONCEPT SWITCHER TABS (Matches the 3 reference concepts seamlessly!)
          ========================================================================= */}
      <div className="site-container relative z-30 mb-5 lg:mb-7 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#EAE4D7]/80 backdrop-blur-md border border-[#D8D0C2] shadow-2xs">
          <button
            onClick={() => setActiveConcept("editorial")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeConcept === "editorial"
                ? "bg-[#133829] text-white shadow-xs"
                : "text-[#4A5547] hover:text-[#133829]"
            }`}
          >
            Concept 01 • Botanical Editorial
          </button>
          <button
            onClick={() => setActiveConcept("herbarium")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeConcept === "herbarium"
                ? "bg-[#133829] text-white shadow-xs"
                : "text-[#4A5547] hover:text-[#133829]"
            }`}
          >
            Concept 02 • Floating Herbarium
          </button>
          <button
            onClick={() => setActiveConcept("rituals")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer hidden md:inline-block ${
              activeConcept === "rituals"
                ? "bg-[#133829] text-white shadow-xs"
                : "text-[#4A5547] hover:text-[#133829]"
            }`}
          >
            Concept 03 • Fresh Rituals
          </button>
        </div>

        <span className="hidden xl:inline-block text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#6B7567]">
          {activeConcept === "editorial" && "Clean • Elegant • Natural • Premium"}
          {activeConcept === "herbarium" && "Airy • Botanical • Dreamy • Soft"}
          {activeConcept === "rituals" && "Pure • Refreshing • Modern • Luxury"}
        </span>
      </div>

      {/* =========================================================================
          BACKGROUND VISUAL MOTION: Moving Sunlight Caustics & Gentle Foliage Shadows
          ========================================================================= */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      >
        {/* Soft Warm Sunlight Flare and Caustic Glow */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#FFF8E7]/80 via-[#F5EDD8]/40 to-transparent blur-3xl animate-sun-dapple" />
        <div className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-[#FFF9EE]/70 via-[#EFE7D2]/30 to-transparent blur-3xl animate-sun-dapple" style={{ animationDelay: "-5s" }} />

        {/* Ambient Warm Golden Aura Ribbon (Prominent in Concept 02: Floating Herbarium) */}
        {activeConcept === "herbarium" && (
          <div className="absolute inset-0 opacity-40 transition-opacity duration-700">
            <svg className="w-full h-full text-[#D4AF37]" viewBox="0 0 1200 600" fill="none">
              <path
                d="M-100 350 C200 450, 450 180, 800 300 C1050 400, 1200 200, 1300 250"
                stroke="url(#auraGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-60"
              />
              <path
                d="M-50 400 C250 480, 500 220, 850 340 C1100 420, 1250 240, 1350 280"
                stroke="url(#auraGrad)"
                strokeWidth="1"
                strokeDasharray="4 6"
                className="opacity-40"
              />
              <defs>
                <linearGradient id="auraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C9A050" stopOpacity="0" />
                  <stop offset="35%" stopColor="#E2C17C" stopOpacity="0.8" />
                  <stop offset="65%" stopColor="#EADBB2" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#C9A050" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </motion.div>

      {/* =========================================================================
          BOTANICAL LAYER: Hibiscus Blossom, Floating Rose Petals, Herbarium Droplet
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
        
        {/* Left Edge: Vibrant Red Hibiscus Blossom with Deep Green Foliage */}
        <div className="absolute -left-14 sm:-left-8 top-16 sm:top-24 w-44 sm:w-56 md:w-68 aspect-square pointer-events-none opacity-95 animate-sway-hibiscus">
          <img
            src="/images/hibiscus-corner.png"
            alt="South Indian Hibiscus Botanical"
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        </div>

        {/* Top-Right: Soft Botanical Olive/Neem Foliage Fronds */}
        <div className="absolute -top-10 -right-10 w-52 sm:w-64 md:w-80 pointer-events-none opacity-80">
          <svg className="w-full h-full text-[#485642]" viewBox="0 0 240 240" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M220 20 C180 50, 140 100, 110 160" />
            <path d="M200 45 C185 35, 175 40, 180 55 C195 55, 205 50, 200 45 Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M175 75 C155 70, 150 82, 160 92 C175 90, 182 82, 175 75 Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M150 105 C132 102, 130 115, 140 125 C152 120, 158 112, 150 105 Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M128 138 C115 135, 112 146, 122 154 C132 150, 136 142, 128 138 Z" fill="currentColor" fillOpacity="0.25" />
          </svg>
        </div>

        {/* Floating Petal 1 (Near left editorial text) */}
        <motion.div
          style={{ y: petal1Y }}
          className="absolute left-[12%] sm:left-[15%] top-[28%] w-10 sm:w-14 aspect-square animate-petal-1 opacity-90"
        >
          <img
            src="/images/petal-1.png"
            alt="Damask rose petal"
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        </motion.div>

        {/* Floating Petal 2 (Between left column & soaps grid) */}
        <motion.div
          style={{ y: petal2Y }}
          className="absolute left-[44%] sm:left-[48%] top-[18%] w-9 sm:w-12 aspect-square animate-petal-2 opacity-85"
        >
          <img
            src="/images/petal-2.png"
            alt="Damask rose petal"
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        </motion.div>

        {/* Floating Petal 3 (Drifting near bottom cards) */}
        <motion.div
          style={{ y: petal3Y }}
          className="absolute right-[6%] sm:right-[12%] bottom-[14%] w-8 sm:w-11 aspect-square animate-petal-3 opacity-80"
        >
          <img
            src="/images/petal-3.png"
            alt="Damask rose petal"
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        </motion.div>

        {/* Floating Herbarium Glass Sphere Droplet (Concept 02) */}
        {activeConcept === "herbarium" && (
          <div className="absolute left-[45%] top-[42%] w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/70 bg-gradient-to-br from-white/40 via-white/15 to-transparent backdrop-blur-md shadow-xl flex items-center justify-center animate-droplet">
            {/* Suspended botanical leaf inside droplet */}
            <div className="w-10 h-10 text-[#295439] opacity-85">
              <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full filter drop-shadow-sm">
                <path d="M8 32 C12 24, 20 18, 32 8 C30 18, 24 26, 16 30 C12 32, 10 32, 8 32 Z" />
                <path d="M12 28 L26 14" stroke="#FFF" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            {/* Specular highlight */}
            <div className="absolute top-2 left-3 w-4 h-2.5 rounded-full bg-white/70 rotate-[-30deg]" />
          </div>
        )}

        {/* Rotating Circular Botanical Heritage Seal Badge (Bottom Right Corner) */}
        <div className="absolute -bottom-8 -right-8 sm:-bottom-6 sm:-right-6 lg:-bottom-4 lg:-right-4 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none select-none z-10 overflow-hidden">
          <div className="w-full h-full animate-seal-spin">
            <svg
              className="w-full h-full text-[#364230] opacity-40"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="100" cy="100" r="92" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="86" strokeWidth="1.2" />
              <circle cx="100" cy="100" r="66" strokeWidth="1" />
              <circle cx="100" cy="100" r="62" strokeWidth="0.8" strokeDasharray="2 2" />

              <path
                id="animatedHeroSealPath"
                d="M 100, 100 m -76, 0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0"
                fill="none"
              />
              <text
                fontSize="8.5"
                letterSpacing="0.22em"
                fill="currentColor"
                fontWeight="600"
                className="uppercase"
              >
                <textPath href="#animatedHeroSealPath" startOffset="0%">
                  • AUTHENTIC BOTANICAL ALCHEMY • ESTD 2026 • 100% PURE HERBAL •
                </textPath>
              </text>

              <g transform="translate(100, 100)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 -22 L0 22 M-22 0 L22 0" strokeWidth="1" />
                <path d="M-12 -12 L12 12 M-12 12 L12 -12" strokeWidth="0.8" opacity="0.6" />
                <circle cx="0" cy="0" r="6" fill="#F7F4EE" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="2.5" fill="currentColor" />
              </g>
            </svg>
          </div>
        </div>

      </div>

      {/* =========================================================================
          HERO MAIN CONTENT CONTAINER (Left Editorial + Right 2x2 Soaps Grid)
          ========================================================================= */}
      <Container className="relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12 items-center">
          
          {/* -------------------------------------------------------------------
              LEFT COLUMN: Editorial Typography & Authentic Botanical Alchemy
              ------------------------------------------------------------------- */}
          <motion.div
            style={{ y: leftColY }}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col justify-center pr-0 lg:pr-2"
          >
            {/* Brand Identity Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5E9E1]/85 border border-[#D0D7C9] w-fit mb-6 shadow-2xs backdrop-blur-xs"
            >
              <div className="relative w-4.5 h-4.5 rounded-full overflow-hidden shrink-0 border border-emerald-900/15 bg-white">
                <img src="/images/logo-header-transparent.png" alt="Pavishna" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="text-[10px] sm:text-[10.5px] font-bold tracking-wider uppercase text-[#233022]">
                Pavishna Organic Worlds
              </span>
              <span className="w-1 h-1 rounded-full bg-[#233022]" />
              <span className="text-[10px] sm:text-[10.5px] text-[#233022]/90 font-medium tracking-wide">
                100% Pure Botanical Alchemy
              </span>
            </motion.div>

            {/* Oversized Editorial Serif Heading (Exact 4-line layout with line-art leaf sprig) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-[44px] sm:text-[56px] lg:text-[62px] text-[#19221B] leading-[1.08] mb-6 tracking-tight font-medium"
            >
              Handcrafted herbal<br />
              soaps<br />
              <span className="italic font-normal text-[#1E4A38] inline-flex items-center gap-2.5">
                &amp; cold-pressed
              </span><br />
              <span className="italic font-normal text-[#1E4A38] inline-flex items-center gap-2.5">
                scalp oils.
                {/* Botanical Line-Art Leaf Sprig next to scalp oils */}
                <svg
                  className="w-8 h-8 sm:w-9 sm:h-9 text-[#2C4837] inline-block -mt-1 shrink-0"
                  viewBox="0 0 36 36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 31 C12 24, 18 18, 31 6" />
                  <path d="M14 22 C11 18, 11 14, 15 12 C18 15, 17 19, 14 22 Z" fill="currentColor" fillOpacity="0.22" />
                  <path d="M22 14 C25 10, 29 11, 29 14 C27 18, 23 17, 22 14 Z" fill="currentColor" fillOpacity="0.22" />
                  <path d="M23 21 C20 25, 22 29, 25 28 C27 25, 26 22, 23 21 Z" fill="currentColor" fillOpacity="0.22" />
                  <path d="M29 8 C33 7, 35 10, 33 12 C31 11, 29 9, 29 8 Z" fill="currentColor" fillOpacity="0.28" />
                </svg>
              </span>
            </motion.h1>

            {/* Supporting Editorial Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-body text-base sm:text-lg text-[#3E453D] max-w-lg mb-8 leading-relaxed font-normal"
            >
              Slow-crafted in small South Indian batches using sun-dried Vetiver roots, fresh Hibiscus petals, antibacterial Neem, and pure Damask Roses. Zero synthetic sulfates, zero palm oil, 100% authentic skin nourishment.
            </motion.p>

            {/* Primary & Secondary Call To Actions */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-5 sm:gap-7 mb-4"
            >
              <Link href="#soaps-bento">
                <Button
                  variant="primary"
                  size="lg"
                  className="rounded-full shadow-sm hover:shadow-md px-7 py-3.5 text-[11px] uppercase tracking-wider font-bold bg-[#133829] text-white hover:bg-[#0E281D] transition-all hover:scale-102 cursor-pointer"
                >
                  Explore 7 Herbal Soaps
                </Button>
              </Link>
              <Link
                href="/shop?category=hair-care"
                className="font-bold text-[11.5px] tracking-wider uppercase text-[#133829] hover:text-emerald-800 transition-colors underline underline-offset-8 decoration-1 decoration-[#133829]/50 hover:decoration-[#133829]"
              >
                Cold-Pressed Hair Care →
              </Link>
            </motion.div>
          </motion.div>

          {/* -------------------------------------------------------------------
              RIGHT COLUMN: Exact 2x2 Rounded Soap Card Grid
              ------------------------------------------------------------------- */}
          <motion.div
            style={{ y: rightColY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col items-center lg:items-end"
          >
            <div className="w-full max-w-lg grid grid-cols-2 gap-3.5 sm:gap-4.5">
              {soapCards.map((soap, idx) => (
                <motion.div
                  key={soap.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + idx * 0.08 }}
                >
                  <Link href={`/products/${soap.slug}`} className="group block">
                    <div className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden shadow-md border border-[#DCE2D6] bg-white aspect-[4/5] transition-all duration-300 group-hover:shadow-2xl group-hover:border-[#133829]/40 group-hover:-translate-y-1">
                      
                      {/* Soap Photograph with Smooth Hover Scale */}
                      <img
                        src={soap.image}
                        alt={`Pavishna ${soap.title}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                      
                      {/* Luxury Editorial Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
                      
                      {/* Top Category / Benefit Pill */}
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className={`px-3 py-1 rounded-full bg-white/95 backdrop-blur-md ${soap.tagColor} text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider shadow-2xs`}>
                          {soap.tag}
                        </span>
                      </div>

                      {/* Bottom Product Info */}
                      <div className="absolute bottom-3.5 inset-x-3.5 text-white z-10">
                        <h4 className="font-display font-medium text-[14.5px] sm:text-base leading-tight group-hover:text-[#E0C097] transition-colors">
                          {soap.title}
                        </h4>
                        <p className="text-[11px] text-white/85 mt-0.5 font-normal">
                          {soap.subtitle}
                        </p>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
