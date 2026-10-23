"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedHeroSection } from "@/components/home/AnimatedHeroSection";
import { NewsletterSection } from "@/components/shared/NewsletterSection";
import { mockProducts } from "@/config/products";
import { useCart } from "@/components/cart/CartContext";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  Droplets,
  Sparkle,
  ShieldCheck,
  Check,
  Plus,
  Leaf,
  Layers,
  Heart,
  Award
} from "lucide-react";

const botanicalSpotlights = [
  {
    id: "vetiver",
    name: "Vetti Veru (Wild Vetiver Roots)",
    subtitle: "Sacred South Indian Grounding & Cooling Botanical",
    image: "/images/Img1.jpeg",
    tag: "Cooling & Calming",
    description:
      "Hand-dug from sandy riverbanks in South India and sun-dried naturally. Vetiver roots release an intoxicating earthy-woody fragrance that calms the nervous system, purifies skin pores, and cools excess body heat.",
    keyBenefit: "Deep cooling, grounding woody aroma, natural deodorizer",
    featuredSoap: "Vetti Veru Bath Soap",
    soapSlug: "vetti-veru-bath-soap",
  },
  {
    id: "hibiscus",
    name: "Hibiscus Rosa (Fresh Flower Juice)",
    subtitle: "Petal Anthocyanins & Gentle Natural AHAs",
    image: "/images/img3.jpeg",
    tag: "Complexion Radiance",
    description:
      "Freshly plucked crimson Hibiscus blossoms pressed at cold temperatures to yield nutrient-dense floral nectar. Naturally packed with alpha-hydroxy acids and gentle enzymatic smoothers for supple, luminous skin.",
    keyBenefit: "Gentle natural exfoliation, skin elasticity, petal glow",
    featuredSoap: "Hibiscus Rosa Bath Soap",
    soapSlug: "hibiscus-rosa-bath-soap",
  },
  {
    id: "neem",
    name: "Wild Neem (Cold-Extracted Leaf & Seed)",
    subtitle: "The Ancient Ayurvedic Purifier & Shield",
    image: "/images/img4.jpeg",
    tag: "Blemish Clarifying",
    description:
      "Revered for thousands of years as the supreme botanical detoxifier. Fresh neem leaf pulp and pure cold-pressed seed oil work synergistically to clear congestion, soothe breakouts, and fortify the skin barrier.",
    keyBenefit: "Antibacterial protection, pore detoxification, excess sebum balance",
    featuredSoap: "Neem Bath Soap",
    soapSlug: "neem-bath-soap",
  },
  {
    id: "rose",
    name: "Damask Rose (Pure Petal Hydrosol)",
    subtitle: "Royal Floral Essence for Velvety Hydration",
    image: "/images/img7.jpeg",
    tag: "Deep Cellular Moisture",
    description:
      "Hydro-distilled Indian Damask rose petals that infuse every lather with natural moisture. Restores suppleness to dry and sensitive skin while lingering with the delicate aroma of an authentic royal rose garden.",
    keyBenefit: "Intense moisture retention, soothing redness, exquisite floral scent",
    featuredSoap: "Rose Bath Soap",
    soapSlug: "rose-bath-soap",
  },
];

export default function HomePage() {
  const { addItem } = useCart();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [activeBotanical, setActiveBotanical] = useState<string>("vetiver");

  // Pavishna 7 Signature Bath Soaps
  const artisanalSoaps = mockProducts.filter((p) => p.category === "soaps");

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 1800);
  };

  const selectedBotanical =
    botanicalSpotlights.find((b) => b.id === activeBotanical) ||
    botanicalSpotlights[0];

  return (
    <div className="flex flex-col bg-[#FAFBF9] text-[#1B1C19]">

      {/* =========================================================================
          HERO SECTION: Pixel-Accurate Production Animated Hero
          ========================================================================= */}
      <AnimatedHeroSection />


      {/* =========================================================================
          SIGNATURE 7 ARTISANAL SOAPS BENTO SHOWCASE (CORE CLIENT HERO!)
          ========================================================================= */}
      <section id="soaps-bento" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8ECE6]">
        <Container>
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold tracking-widest uppercase mb-3 border border-emerald-200">
              <Leaf className="w-3.5 h-3.5" />
              <span>Authentic Saponification</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#0D3B2E] mb-4 font-bold tracking-tight">
              The 7 Sacred Herbal Bath Soaps
            </h2>
            <p className="text-base text-[#4A5568] leading-relaxed max-w-2xl mx-auto font-normal">
              Each artisan bar is blended with concentrated botanical juices and cured for 4 full weeks to retain natural moisturizing plant glycerin. Zero tallow, zero synthetic fragrance.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {artisanalSoaps.map((soap, index) => (
              <motion.div
                key={soap.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative bg-[#FAFCF9] rounded-2xl border border-[#E3E8E1] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-emerald-700/50 hover:shadow-xl"
              >
                {/* Image Area */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2F5F1]">
                  <img
                    src={soap.featuredImage}
                    alt={soap.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0D3B2E] text-[10px] font-extrabold uppercase tracking-wider shadow-2xs border border-emerald-900/10">
                      {soap.badge || "Pure Botanical"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider">
                      125g
                    </span>
                  </div>
                </div>

                {/* Details Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800">
                        {soap.soapSpecs?.soapType || "Handcrafted Bar"}
                      </span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        ★ {soap.rating}
                      </span>
                    </div>

                    <Link href={`/products/${soap.slug}`}>
                      <h3 className="font-display text-xl font-bold text-[#0D3B2E] group-hover:text-emerald-700 transition-colors leading-snug">
                        {soap.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#4A5568] mt-2 line-clamp-2 leading-relaxed font-normal">
                      {soap.subtitle}
                    </p>

                    {soap.soapSpecs?.keyBotanicals && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {soap.soapSpecs.keyBotanicals.map((herb, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/5 text-emerald-900 font-semibold"
                          >
                            {herb}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="mt-6 pt-4 border-t border-[#E8EDE6] flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#0D3B2E]">
                        {formatCurrency(soap.price)}
                      </span>
                      {soap.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through ml-2">
                          {formatCurrency(soap.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(soap, e)}
                      className={`h-9 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                        addedSlug === soap.slug
                          ? "bg-emerald-700 text-white shadow-sm scale-105"
                          : "bg-[#0D3B2E] text-white hover:bg-emerald-900 shadow-2xs hover:scale-103"
                      }`}
                    >
                      {addedSlug === soap.slug ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </Container>
      </section>


      {/* =========================================================================
          HERBAL HAIR & SCALP SPOTLIGHT (CORE HERO #2 - PIXEL MATCH TO REFERENCE)
          ========================================================================= */}
      <section className="relative py-20 lg:py-28 bg-[#F6F3EC] border-b border-[#E8E2D5] overflow-hidden select-none">
        
        {/* Subtle Decorative Botanical Line-Art Branches (Bottom Left and Right) */}
        <div className="absolute -bottom-6 -left-8 w-64 h-64 pointer-events-none opacity-25 z-0">
          <svg className="w-full h-full text-[#485642]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 180 C40 140, 80 110, 140 70" />
            <path d="M45 150 C35 135, 30 115, 42 105 C55 112, 58 132, 45 150 Z" />
            <path d="M72 125 C88 115, 102 118, 106 130 C90 138, 78 132, 72 125 Z" />
            <path d="M95 100 C82 88, 80 72, 92 65 C102 74, 100 90, 95 100 Z" />
            <path d="M118 78 C135 68, 148 70, 150 82 C135 88, 124 84, 118 78 Z" />
          </svg>
        </div>
        <div className="absolute -bottom-6 -right-8 w-72 h-72 pointer-events-none opacity-25 z-0">
          <svg className="w-full h-full text-[#485642]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M180 180 C160 140, 120 110, 60 70" />
            <path d="M155 150 C165 135, 170 115, 158 105 C145 112, 142 132, 155 150 Z" />
            <path d="M128 125 C112 115, 98 118, 94 130 C110 138, 122 132, 128 125 Z" />
            <path d="M105 100 C118 88, 120 72, 108 65 C98 74, 100 90, 105 100 Z" />
            <path d="M82 78 C65 68, 52 70, 50 82 C65 88, 76 84, 82 78 Z" />
          </svg>
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl border border-[#DCE2D6] aspect-[4/3] bg-[#E8E4DA] group">
                <img
                  src="/images/hair-oil-hero.jpg"
                  alt="Pavishna Signature Scalp Nectar Rosemary & Bhringraj"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Top Left Pill */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#FAF7F0]/95 backdrop-blur-md text-[#283226] text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                    Ayurvedic Formulation
                  </span>
                </div>

                {/* Bottom Card Overlay */}
                <div className="absolute bottom-5 inset-x-5 text-white z-10">
                  <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.2em] text-[#E0C097] font-bold block mb-1">
                    Signature Scalp Nectar
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-white leading-tight">
                    Rosemary &amp; Bhringraj Scalp Nectar
                  </h3>
                  <p className="text-xs text-white/85 mt-1 max-w-sm font-normal">
                    Slow-milled cold extraction with 18 rare Indian scalp-stimulating herbs.
                  </p>
                </div>
              </div>

              {/* Floating Extraction Pill Badge */}
              <div className="absolute -bottom-5 -right-3 sm:-right-4 sm:bottom-4 bg-white/98 backdrop-blur-md py-3 px-4.5 rounded-2xl shadow-xl border border-[#DCE3DB] flex items-center gap-3.5 z-20">
                <div className="w-9 h-9 rounded-full bg-[#E5F3EB] flex items-center justify-center text-[#1E5638] shrink-0">
                  <Droplets className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9.5px] uppercase tracking-[0.16em] text-[#556350] font-bold block">
                    Extraction
                  </span>
                  <span className="text-xs font-bold text-[#142E20] block mt-0.5">
                    Zero-Heat Cold Pressing
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Editorial Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Eyebrow Pill */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6EFE4] text-[#1D4A34] text-[10.5px] font-bold tracking-widest uppercase border border-[#CBDBC8]">
                <Sparkles className="w-3.5 h-3.5 text-[#1D4A34]" />
                <span>Hair &amp; Follicle Vitality</span>
              </span>

              {/* Main Headline with Leaf Flourish */}
              <h2 className="font-display text-[32px] sm:text-[40px] lg:text-[46px] text-[#19231A] font-medium tracking-tight leading-[1.12]">
                Slow-pressed{" "}
                <span className="italic font-normal text-[#1E4A38] inline-flex items-center">
                  scalp elixirs
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#1E4A38] inline-block -mt-1 ml-2 shrink-0"
                    viewBox="0 0 36 36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 31 C12 24, 18 18, 31 6" />
                    <path d="M14 22 C11 18, 11 14, 15 12 C18 15, 17 19, 14 22 Z" fill="currentColor" fillOpacity="0.25" />
                    <path d="M22 14 C25 10, 29 11, 29 14 C27 18, 23 17, 22 14 Z" fill="currentColor" fillOpacity="0.25" />
                    <path d="M23 21 C20 25, 22 29, 25 28 C27 25, 26 22, 23 21 Z" fill="currentColor" fillOpacity="0.25" />
                    <path d="M29 8 C33 7, 35 10, 33 12 C31 11, 29 9, 29 8 Z" fill="currentColor" fillOpacity="0.3" />
                  </svg>
                </span>
                <br />
                for profound root strength.
              </h2>

              <p className="text-[14px] sm:text-[15px] text-[#424A40] leading-relaxed font-normal max-w-xl">
                Conventional hair oils rely on cheap mineral oils, liquid paraffin, and chemical fragrances that clog hair follicles. Pavishna Scalp Elixirs are made with pure cold-pressed Sesame and Virgin Coconut oils infused for 21 days with hand-plucked Rosemary, Bhringraj, Brahmi, and Amla.
              </p>

              {/* Feature Cards matching reference styling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4.5 rounded-2xl bg-[#EFECE5] border border-[#DDD7C8] shadow-2xs">
                  <span className="text-xl sm:text-[22px] font-bold text-[#142E20] block tracking-tight">18 Rare Herbs</span>
                  <span className="text-xs text-[#525B50] mt-1 block font-medium">Authentic Ayurvedic Kashayam infusion</span>
                </div>
                <div className="p-4.5 rounded-2xl bg-[#EFECE5] border border-[#DDD7C8] shadow-2xs">
                  <span className="text-xl sm:text-[22px] font-bold text-[#142E20] block tracking-tight">0% Mineral Oil</span>
                  <span className="text-xs text-[#525B50] mt-1 block font-medium">Lightweight, non-sticky pure bio-lipids</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <Link href="/products/rosemary-bhringraj-scalp-nectar">
                  <Button
                    variant="primary"
                    className="rounded-full bg-[#133829] hover:bg-[#0E281D] text-white px-7 py-3.5 text-[11px] uppercase tracking-[0.16em] font-bold shadow-sm transition-all hover:scale-102 cursor-pointer"
                  >
                    Shop Hair Oil Ritual (₹680)
                  </Button>
                </Link>
                <Link
                  href="/shop?category=hair-care"
                  className="text-[11.5px] uppercase tracking-[0.16em] font-bold text-[#133829] hover:text-[#0E281D] transition-colors"
                >
                  View All Hair Care →
                </Link>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>


      {/* =========================================================================
          BOTANICAL INGREDIENT SPOTLIGHT (Replacing 3D with Interactive Craft Lab)
          ========================================================================= */}
      <section className="relative w-full bg-[#08231B] text-[#FBF9F3] py-20 lg:py-28 overflow-hidden border-b border-emerald-950">
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-900/80 text-[#E0C097] text-[11px] font-bold tracking-widest uppercase mb-3 border border-emerald-700/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>South Indian Herbal Alchemy</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#FFFFFF] mb-4 font-bold tracking-tight">
              Pure Botanical Ingredients &amp; Craft
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-light">
              Explore the living herbs and cold-press extraction methods behind our handcrafted bath soaps and scalp elixirs.
            </p>
          </div>

          {/* Botanical Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {botanicalSpotlights.map((bot) => (
              <button
                key={bot.id}
                onClick={() => setActiveBotanical(bot.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeBotanical === bot.id
                    ? "bg-[#E0C097] text-[#08231B] shadow-md scale-103"
                    : "bg-emerald-900/60 text-white/80 hover:bg-emerald-800 hover:text-white border border-emerald-800"
                }`}
              >
                {bot.name.split(" ")[0]} {bot.name.split(" ")[1]}
              </button>
            ))}
          </div>

          {/* Active Botanical Display Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBotanical.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="max-w-4xl mx-auto bg-emerald-950/70 backdrop-blur-md rounded-2xl p-6 sm:p-10 border border-emerald-800/60 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-5 relative aspect-square rounded-xl overflow-hidden border border-emerald-800 shadow-md">
                <img
                  src={selectedBotanical.image}
                  alt={selectedBotanical.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {selectedBotanical.tag}
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <span className="text-[11px] uppercase tracking-widest text-[#E0C097] font-bold block">
                  Botanical Monograph
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {selectedBotanical.name}
                </h3>
                <p className="text-sm text-white/85 leading-relaxed font-light">
                  {selectedBotanical.description}
                </p>

                <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-800/80">
                  <span className="text-[11px] uppercase font-bold text-[#E0C097] block mb-1">
                    Core Benefit
                  </span>
                  <p className="text-xs text-white/90 font-medium">
                    {selectedBotanical.keyBenefit}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/products/${selectedBotanical.soapSlug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#E0C097] hover:text-white transition-colors"
                  >
                    <span>Experience in {selectedBotanical.featuredSoap}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Sourcing credentials below */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-emerald-900 text-center">
            <div className="flex flex-col items-center">
              <Droplets className="w-5 h-5 text-[#E0C097] mb-2" />
              <h4 className="font-display font-bold text-base text-[#FFFFFF]">Cold-Pressed Extraction</h4>
              <p className="text-xs text-white/70 mt-1">Slow-milled botanicals preserving live enzymes &amp; fatty acids.</p>
            </div>
            <div className="flex flex-col items-center">
              <Sparkle className="w-5 h-5 text-[#E0C097] mb-2" />
              <h4 className="font-display font-bold text-base text-[#FFFFFF]">4-Week Natural Cure</h4>
              <p className="text-xs text-white/70 mt-1">Natural skin-conditioning plant glycerin retained in every bar.</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-[#E0C097] mb-2" />
              <h4 className="font-display font-bold text-base text-[#FFFFFF]">100% Plastic-Free</h4>
              <p className="text-xs text-white/70 mt-1">Recyclable amber glass, unbleached cotton labels, and natural jute.</p>
            </div>
          </div>
        </Container>
      </section>


      {/* =========================================================================
          DAILY CARE RITUALS (Soap, Hair Oil, & Candle Option)
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8ECE6]">
        <Container>
          <div className="max-w-2xl mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-emerald-800 font-bold mb-2">
              Daily Practice
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#0D3B2E] font-bold tracking-tight">
              Three Steps for Mindful Daily Care
            </h2>
            <p className="text-sm sm:text-base text-[#4A5568] mt-2 font-normal">
              How to weave cold-process herbal soaps and cold-pressed scalp oils into your morning and evening rhythms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Soap */}
            <div className="bg-[#FAFBF9] p-8 rounded-2xl border border-[#E3E8E1] shadow-2xs space-y-4 hover:border-emerald-700/40 transition-colors">
              <span className="text-xs uppercase tracking-widest text-emerald-800 font-extrabold block">
                01 / Morning Purification
              </span>
              <h3 className="font-display text-2xl font-bold text-[#0D3B2E]">Herbal Soap Cleansing</h3>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                Glide your Pavishna herbal bar between wet palms. Let the natural Vetiver, Hibiscus, or Neem lather work into the skin for 60 seconds before rinsing. Leaves skin supple with zero dryness.
              </p>
              <Link href="#soaps-bento" className="text-xs uppercase tracking-wider font-bold text-[#0D3B2E] hover:underline inline-block pt-2">
                Explore Bath Soaps →
              </Link>
            </div>

            {/* Step 2: Hair Oil */}
            <div className="bg-[#FAFBF9] p-8 rounded-2xl border border-[#E3E8E1] shadow-2xs space-y-4 hover:border-emerald-700/40 transition-colors">
              <span className="text-xs uppercase tracking-widest text-emerald-800 font-extrabold block">
                02 / Scalp Revitalization
              </span>
              <h3 className="font-display text-2xl font-bold text-[#0D3B2E]">Rosemary Scalp Therapy</h3>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                Dispense 2 to 3 pipettes of cold-pressed Rosemary &amp; Bhringraj Nectar onto your scalp. Use gentle circular thumb pressure to boost microcirculation and awaken dormant follicles.
              </p>
              <Link href="/products/rosemary-bhringraj-scalp-nectar" className="text-xs uppercase tracking-wider font-bold text-[#0D3B2E] hover:underline inline-block pt-2">
                Explore Hair Oil Ritual →
              </Link>
            </div>

            {/* Step 3: Candle (Option) */}
            <div className="bg-[#FAFBF9] p-8 rounded-2xl border border-[#E3E8E1] shadow-2xs space-y-4 hover:border-emerald-700/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-emerald-800 font-extrabold block">
                  03 / Evening Solace
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Optional Ritual
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#0D3B2E]">Aromatherapy Candle</h3>
              <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed font-normal">
                An optional companion for evening tranquility. Light the organic soy candle during your warm bath to disperse wild jasmine and vetiver smoke across your sanctuary.
              </p>
              <Link href="/products/wild-jasmine-vetiver-soy-candle" className="text-xs uppercase tracking-wider font-bold text-[#0D3B2E] hover:underline inline-block pt-2">
                Explore Candle Ritual →
              </Link>
            </div>
          </div>
        </Container>
      </section>


      {/* =========================================================================
          PAVISHNA HERITAGE & EXTRACTION WISDOM
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#F5F8F4] border-b border-[#E3E8E1]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[#DCE3DB] group">
              <img
                src="https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1200&q=80"
                alt="Botanical Ingredients Grinding"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/5 text-emerald-900 text-[11px] font-bold tracking-widest uppercase border border-emerald-900/15">
                Authentic Craftsmanship
              </span>
              
              <blockquote className="font-display text-2xl sm:text-3xl text-[#0D3B2E] font-bold leading-snug">
                “True wellness is slow, intentional, and rooted in the pure healing wisdom of living plants.”
              </blockquote>

              <p className="text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
                At Pavishna Organic Worlds, we reject shortcuts. We source wild-grown vetiver from local farmers, sun-dry petals on unbleached mats, and use hand-poured wooden molds for our herbal soaps. Every batch is naturally cured so your skin absorbs only life-giving botanicals.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#DCE3DB]">
                <div>
                  <h4 className="font-display text-2xl font-bold text-[#0D3B2E]">4 Weeks</h4>
                  <p className="text-xs text-[#4A5568] mt-1 uppercase tracking-wider font-bold">Natural Air Curing</p>
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold text-[#0D3B2E]">0% Chemicals</h4>
                  <p className="text-xs text-[#4A5568] mt-1 uppercase tracking-wider font-bold">Zero SLS, Parabens or Palm Oil</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/our-story">
                  <Button variant="outline" className="border-[#0D3B2E] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider">
                    Read Our Complete Story
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </section>


      {/* =========================================================================
          NEWSLETTER
          ========================================================================= */}
      <NewsletterSection />

    </div>
  );
}
