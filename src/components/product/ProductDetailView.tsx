"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductVariant } from "@/types/product";
import { useCart } from "@/components/cart/CartContext";
import { formatCurrency } from "@/lib/utils";
import {
  Star,
  Plus,
  Minus,
  Check,
  Heart,
  ZoomIn,
  RotateCcw,
  Sparkles,
  Droplets,
  Clock,
  CheckCircle2,
  ChevronDown,
  ShieldAlert,
  Leaf,
  ShoppingBag
} from "lucide-react";

export function ProductDetailView({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();

  // Gallery macro images
  const defaultImages = [
    product.featuredImage,
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLvflG30Qfh1TuHv5yRZoL1a4X2_Ik_1p1QNyd3jolTo5VTYarqCxPc1A5kxfWdwko-HQgOC1BlBLycVWSPkCwWy4jfjp6Lly5NaAxwRyzlK7d-kiUNBxSKGnQToVZWBTwv8-LjDoU_UKysBikPv8di67VNiGMf0Bzyj1XuzYtad0JfrzMOuz3Qb0EP252us0fgVMCeRk5L79lMJS835ZxZKhdC8FMYdCrITvrV7hdI_BCcYgiFjG3",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB0axqaM0xQezc7pCyKfEX_GNr7wv9bP0a229RMk39E1_w_nckvQTTRn5QYLjgp5Yqv7gHbziWMwijHdB_3k-qg-pIVUaFHy3cMO97uByy51N-O-qrAyX1lZTPWxRqmxFYOhEN_MG0enyzebhVtWsd2E_2myo3kouuk1hLDZEgYxPbSCxFqit1gIZecr5-lezoptmasN8WFbeu3Bc82Zgh6hRqnesgh-u1cplTsxEFRGm23KnVyghD6",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDkiekRKS5O8gIssc9SXRJCmf19aTFnooogMxaP1EsEDX7iQlfn_IVwxnozVtDH9iasM-GVpJacZjxFQC383kcAQa0Uwthhg_BeLLHqpJdexfSQt-MQDMEnblYkwBAPDMbitHoeXxsjury8EjWecwuCsEUhoU1tA7mjIGKK2ta3vsTJctOGrjszRQZ3fmOVjURKzg7unBnqT1hrSuM87Rmi1293t9GuZEbvT-GvBe6DB6RmsSwaqLbd"
  ];

  const galleryImages = product.images && product.images.length >= 3 ? product.images : defaultImages;
  const thumbnailLabels = ["Texture", "Vessel", "Ritual", "Packaging"];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [toastAdded, setToastAdded] = useState(false);

  // SKU options
  const defaultVariants: ProductVariant[] = product.variants && product.variants.length > 0
    ? product.variants
    : [
        { id: "v1", name: "Artisan Ceramic Jar 200g", price: product.price, inStock: true, sku: "PV-JAR-01" },
        { id: "v2", name: "Compostable Refill Pouch 200g", price: Math.round(product.price * 0.82), inStock: true, sku: "PV-PCH-01" },
        { id: "v3", name: "Duo Ritual Set (Jar + Refill)", price: Math.round(product.price * 1.68), inStock: true, sku: "PV-DUO-01" }
      ];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariants[0]);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setToastAdded(true);
    setTimeout(() => setToastAdded(false), 3000);
  };

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  return (
    <div className="w-full">
      
      {/* TWO-COLUMN MAIN PRODUCT HERO */}
      <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14 pb-16 lg:pb-24">
        
        {/* LEFT COLUMN: ARCHED GALLERY STAGE (58%) */}
        <div className="w-full lg:w-[58%] flex flex-col gap-5">
          
          {/* Main Stage Container with Arched Top */}
          <div className="relative w-full aspect-[4/5] rounded-t-[4rem] sm:rounded-t-[5rem] rounded-b-2xl overflow-hidden bg-[#F4F4ED] border border-[#E6E1D7] shadow-sm group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIdx}
                src={galleryImages[activeImageIdx] || product.featuredImage}
                alt={`${product.title} - view ${activeImageIdx + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
            </AnimatePresence>

            {/* Overlaid Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#1A1C18] text-[10px] font-bold tracking-widest uppercase shadow-xs">
                {product.categoryLabel.toUpperCase()}
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#82947B] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                ORGANIC LIPID MATRIX
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#263D32] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                REFILLABLE DESIGN
              </span>
            </div>

            {/* Micro Zoom Pill Prompt */}
            <div className="absolute bottom-6 right-6 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md text-[#1A1C18] text-[11px] font-bold tracking-wider pointer-events-none shadow-xs">
              <ZoomIn className="w-3.5 h-3.5 text-[#263D32]" />
              <span>MACRO VIEW</span>
            </div>
          </div>

          {/* Interactive Thumbnails */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
            {galleryImages.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden bg-[#EEEEE8] p-0.5 transition-all outline-none cursor-pointer border ${
                  activeImageIdx === idx
                    ? "border-[#263D32] ring-2 ring-[#263D32]/30 shadow-xs"
                    : "border-[#E6E1D7] opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover rounded-[14px]"
                />
                <span className="absolute inset-x-0 bottom-0 py-1 bg-white/85 backdrop-blur-xs text-[10px] font-bold text-center uppercase tracking-wider text-[#1A1C18]">
                  {thumbnailLabels[idx] || `View ${idx + 1}`}
                </span>
              </button>
            ))}
          </div>

          {/* Sustainability Accreditation Strip */}
          <div className="mt-2 p-5 rounded-2xl bg-[#F4F4ED] border border-[#E6E1D7] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#82947B]/20 flex items-center justify-center text-[#263D32]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1A1C18] uppercase tracking-wider">
                  Closed-Loop Refill Cycle
                </p>
                <p className="text-xs text-[#424844] mt-0.5">
                  Vessels designed for multi-year reuse with compostable refill sachets.
                </p>
              </div>
            </div>
            <a
              href="#refill-protocol"
              className="text-xs font-bold text-[#263D32] underline underline-offset-4 uppercase tracking-wider hover:text-[#10271D]"
            >
              How to Refill
            </a>
          </div>

        </div>

        {/* RIGHT COLUMN: PRODUCT INFO & BUY BOX (42%) */}
        <div className="w-full lg:w-[42%] flex flex-col pt-1 lg:sticky lg:top-28">
          
          {/* Category & Harvest Registry */}
          <div className="flex items-center justify-between pb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#263D32]">
              APOTHECARY DISPENSARY • HARVEST BATCH N° 12
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#263D32] bg-[#D2E5C9] px-2.5 py-0.5 rounded-full">
              Autumn Pressed
            </span>
          </div>

          {/* Product Title */}
          <h1 className="font-display text-2xl sm:text-3xl lg:text-[2.35rem] text-[#1A1C18] font-normal leading-[1.14] tracking-tight pb-3">
            {product.title}
          </h1>

          {/* Product Subtitle */}
          <p className="text-xs sm:text-sm text-[#424844] leading-relaxed pb-4">
            {product.subtitle}
          </p>

          {/* Price & Review Row */}
          <div className="flex items-baseline justify-between py-4 border-y border-[#E6E1D7]">
            <div className="flex items-baseline gap-2">
              <span className="font-body text-2xl font-bold text-[#1A1C18]">
                {formatCurrency(selectedVariant.price)}
              </span>
              <span className="text-xs text-[#727974]">
                (Inclusive of all statutory taxes)
              </span>
            </div>

            <div className="flex items-center gap-1.5 cursor-pointer">
              <div className="flex items-center text-[#263D32]">
                <Star className="w-4 h-4 fill-[#263D32]" />
              </div>
              <span className="text-xs font-bold text-[#1A1C18]">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-[#727974]">({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Formulation Benefits Micro-Pills */}
          <div className="pt-4 pb-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EEEEE8] text-[#1A1C18] text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#263D32]" />
              Barrier Repair
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EEEEE8] text-[#1A1C18] text-[11px] font-semibold">
              <Droplets className="w-3.5 h-3.5 text-[#263D32]" />
              Cuticle Smoothing
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EEEEE8] text-[#1A1C18] text-[11px] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#263D32]" />
              Weightless Moisture
            </span>
          </div>

          {/* Size & Refill Option Selector */}
          <div className="flex flex-col gap-2.5 pb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#1A1C18]">
                Selection Matrix
              </span>
              <span className="text-[#727974]">Weight: 200g net</span>
            </div>

            <div className="flex flex-col gap-2">
              {defaultVariants.map((variant) => {
                const isSelected = selectedVariant.id === variant.id;
                return (
                  <label
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`cursor-pointer relative flex items-center justify-between p-3.5 rounded-2xl transition-all border ${
                      isSelected
                        ? "bg-[#FAFAF3] border-[#263D32] ring-1 ring-[#263D32] shadow-xs"
                        : "bg-[#F4F4ED] hover:bg-[#EEEEE8] border-[#E6E1D7]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-[#263D32] bg-[#263D32]" : "border-[#AAA99F]"
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1A1C18]">{variant.name}</p>
                        <p className="text-[11px] text-[#424844]">
                          {variant.name.includes("Pouch")
                            ? "Zero-plastic plant pouch to refill your jar (Save 18%)"
                            : variant.name.includes("Duo")
                            ? "Includes 1 jar, 1 pouch & sandalwood comb"
                            : "Handcrafted stoneware jar + wooden applicator"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1A1C18] whitespace-nowrap">
                      {formatCurrency(variant.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sourcing & Stock Note */}
          <div className="p-3.5 rounded-xl bg-[#82947B]/15 border border-[#82947B]/20 flex items-start gap-2.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#426B50] mt-1 shrink-0 animate-pulse" />
            <p className="text-xs text-[#1A1C18] leading-relaxed">
              <strong className="font-bold text-[#263D32]">In Stock</strong> — Raw mountain honey ethically gathered in small yields from Himachal Pradesh apiculture cooperatives.
            </p>
          </div>

          {/* Quantity & Add to Bag Actions */}
          <div className="flex items-stretch gap-3 pb-6">
            
            {/* Quantity Stepper */}
            <div className="flex items-center bg-[#EEEEE8] rounded-full px-3 py-1.5 shrink-0 border border-[#E6E1D7]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1C18] hover:bg-white transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-[#1A1C18]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1C18] hover:bg-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary Add to Bag Pill Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-[#263D32] hover:bg-[#1A2C23] text-white text-xs font-bold uppercase tracking-wider px-6 py-4 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO BAG — {formatCurrency(selectedVariant.price * quantity)}</span>
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label="Save to Wishlist"
              className="w-13 h-13 rounded-full bg-[#EEEEE8] hover:bg-[#E5E5DE] border border-[#E6E1D7] flex items-center justify-center text-[#1A1C18] transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#A4423B] text-[#A4423B]" : "text-[#1A1C18]"}`} />
            </button>

          </div>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E6E1D7] text-center">
            <div className="flex flex-col items-center gap-1 p-2">
              <Leaf className="w-4 h-4 text-[#82947B]" />
              <span className="text-[10.5px] font-semibold text-[#1A1C18] leading-tight">
                Zero Petrochemicals or Parabens
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <Sparkles className="w-4 h-4 text-[#263D32]" />
              <span className="text-[10.5px] font-semibold text-[#1A1C18] leading-tight">
                Food-Grade Raw Bio-Actives
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <RotateCcw className="w-4 h-4 text-[#272318]" />
              <span className="text-[10.5px] font-semibold text-[#1A1C18] leading-tight">
                Refillable Heavy Ceramic Jar
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 1: BOTANICAL ARCHITECTURE & MOLECULAR SYNERGY */}
      <section className="w-full bg-[#F4F4ED] rounded-3xl p-8 sm:p-12 lg:p-14 border border-[#E6E1D7] mb-16">
        <div className="max-w-2xl mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#263D32] block mb-2">
            Purity &amp; Provenance
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1A1C18] font-normal leading-tight">
            Botanical Architecture &amp; Molecular Synergy
          </h2>
          <p className="text-xs sm:text-sm text-[#424844] mt-2.5 leading-relaxed">
            Every active compound is extracted cold under nitrogen blanket to preserve volatile bio-flavonoids and delicate botanical cellular structures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#FFFFFF] rounded-2xl p-7 flex flex-col justify-between border border-[#E6E1D7] shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#263D32] bg-[#CEE9D9] px-2.5 py-1 rounded-full">
                  ACTIVE BIO-OIL
                </span>
                <span className="text-[11px] text-[#727974]">82% Oleic Acid</span>
              </div>
              <h3 className="font-display text-lg text-[#1A1C18] font-medium mb-1">
                Cold-Pressed Camellia Oleifera
              </h3>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[#82947B] mb-3">
                Darjeeling Estate Harvest
              </p>
              <p className="text-xs text-[#424844] leading-relaxed">
                Penetrates deep into the cortex with biomimetic plant squalene and micro-fatty acids, restoring flexibility to parched strands without heavy occlusive buildup.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-[#E6E1D7] flex items-center justify-between text-[11px] text-[#727974]">
              <span>Extractions: First Cold Press</span>
              <span className="font-semibold text-[#1A1C18]">Unrefined</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FFFFFF] rounded-2xl p-7 flex flex-col justify-between border border-[#E6E1D7] shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#272318] bg-[#EBE1D1] px-2.5 py-1 rounded-full">
                  NATURAL HUMECTANT
                </span>
                <span className="text-[11px] text-[#727974]">Enzymatic Raw</span>
              </div>
              <h3 className="font-display text-lg text-[#1A1C18] font-medium mb-1">
                Raw Wild Himalayan Honey
              </h3>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[#82947B] mb-3">
                Himachal Pradesh Cooperative
              </p>
              <p className="text-xs text-[#424844] leading-relaxed">
                Harvested from wild cliff colonies at 2,400 meters altitude. Imparts living bio-enzymes, gluconic acid, and continuous ambient hydration to the lipid mantle.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-[#E6E1D7] flex items-center justify-between text-[11px] text-[#727974]">
              <span>Ethical Foraged</span>
              <span className="font-semibold text-[#1A1C18]">Non-Heated</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FFFFFF] rounded-2xl p-7 flex flex-col justify-between border border-[#E6E1D7] shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#263D32] bg-[#D2E5C9] px-2.5 py-1 rounded-full">
                  STRENGTH MATRIX
                </span>
                <span className="text-[11px] text-[#727974]">&lt; 1,000 Daltons</span>
              </div>
              <h3 className="font-display text-lg text-[#1A1C18] font-medium mb-1">
                Hydrolyzed Oat Peptide
              </h3>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[#82947B] mb-3">
                Sustainably Farmed Punjab
              </p>
              <p className="text-xs text-[#424844] leading-relaxed">
                Micro-peptides that slip between frayed keratin scales. Structurally bridges broken peptide bonds to dramatically decrease porosity and eliminate rough friction.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-[#E6E1D7] flex items-center justify-between text-[11px] text-[#727974]">
              <span>Enzymatic Hydrolysis</span>
              <span className="font-semibold text-[#1A1C18]">100% Bio-based</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: APPLICATION & SUGGESTED REGIMEN (Deep Forest Pine Inset) */}
      <section className="w-full rounded-3xl bg-[#1B382B] text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden mb-16">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#82947B]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
          
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <div className="relative aspect-[4/5] rounded-t-[4rem] rounded-b-2xl overflow-hidden bg-black/20 shadow-2xl border border-white/10 group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHKKVjQ8gOCmbzoO2L8FpXvmZGcwMgXRQHIAlmA1NJBkQ1nLPXy7BUJOC7v-aIgj5cB3AQSPf3lKQ0ESxc74gQTKtlU6CLDgZvYuplmam3AgsQgr1Xua925W7qRm7gbECai9-9oiXlEMVzh-vpDGfK8WYSsfa9kH5c75Uw7iVuvCgcMNzi9j4h6IZLWWpELtaHVFnnytmfd_wKEWU60MQpU27M5pUgUYonGEl_7XnOLE0UmX5KfrBQ"
                alt="Sensory bathroom application scene"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-6">
                <p className="font-display text-lg text-white italic font-normal">
                  “Transform cleansing from a hurried chore into a restorative sensory retreat.”
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 text-[#E8EDE4]/80 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase">
              <span>RITUAL DURATION: 15–20 MINUTES</span>
              <span>FREQUENCY: ONCE WEEKLY</span>
            </div>
          </div>

          <div className="w-full lg:w-7/12 flex flex-col gap-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B2CDBD] block mb-2">
                The Weekly Sanctuary Practice
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-white font-normal leading-tight">
                Application &amp; Suggested Regimen
              </h2>
              <p className="text-xs sm:text-sm text-[#E8EDE4]/80 mt-2 leading-relaxed">
                For best absorption, employ body heat and intentional breathwork during application to encourage botanical micro-lipids deep into the fiber strands.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="w-8 h-8 rounded-full bg-[#B2CDBD] text-[#10271D] flex items-center justify-center font-bold text-xs shrink-0">
                  01
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Post-Cleansing Preparation</h4>
                  <p className="text-xs text-[#E8EDE4]/75 mt-1 leading-relaxed">
                    Gently press excess moisture from washed strands using a raw linen cloth. Hair should remain moist and supple, never dripping wet.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="w-8 h-8 rounded-full bg-[#B2CDBD] text-[#10271D] flex items-center justify-center font-bold text-xs shrink-0">
                  02
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Thermal Palm Activation</h4>
                  <p className="text-xs text-[#E8EDE4]/75 mt-1 leading-relaxed">
                    Warm a chestnut-sized dollop between warm palms for 5 seconds until the golden wax matrix melts into a luminous, spreadable nectar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="w-8 h-8 rounded-full bg-[#B2CDBD] text-[#10271D] flex items-center justify-center font-bold text-xs shrink-0">
                  03
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Slow Distribution &amp; Dwell</h4>
                  <p className="text-xs text-[#E8EDE4]/75 mt-1 leading-relaxed">
                    Comb smoothly with wide-toothed sandalwood tines from mid-lengths to tips. Wrap in a warm steamed towel and allow the herbs to infuse for 15 minutes before lukewarm rinse.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#E8EDE4]/90 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B2CDBD]" />
                <span>Safe for color-treated tresses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B2CDBD]" />
                <span>pH 4.8 Acid Mantle Balanced</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: EXTENSIBLE ACCORDIONS */}
      <section className="w-full pb-16 lg:pb-24" id="refill-protocol">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="w-full lg:w-4/12 flex flex-col gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#263D32]">
              Transparent Specifications
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1A1C18] font-normal leading-tight">
              Purity Guarantees &amp; Formulation Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[#424844] leading-relaxed">
              Complete disclosures on harvest ethics, biochemical composition, clinical compatibility, and zero-landfill packaging protocols.
            </p>

            <div className="mt-2 p-5 rounded-2xl bg-[#EEEEE8] border border-[#E6E1D7] flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A1C18] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#263D32]" />
                Independent Laboratory Audited
              </span>
              <p className="text-xs text-[#424844] leading-relaxed">
                Every production lot is cross-tested for heavy metals, pesticides, and microbial stability by certified third-party bio-chemists.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-8/12 flex flex-col gap-4">
            
            {/* Accordion 1 */}
            <div className="rounded-2xl bg-[#F4F4ED] border border-[#E6E1D7] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion(0)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="font-display text-lg text-[#1A1C18] font-medium">
                  Full Ingredients &amp; Certifiable Lineage
                </span>
                <ChevronDown className={`w-5 h-5 text-[#263D32] transition-transform duration-300 ${
                  openAccordion === 0 ? "rotate-180" : ""
                }`} />
              </button>
              <AnimatePresence>
                {openAccordion === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-1 flex flex-col gap-3">
                      <p className="text-xs font-mono text-[#424844] leading-relaxed bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E1D7]">
                        {product.ingredientsSummary || "Camellia Oleifera (Tea Seed) Seed Oil*, Distilled Water/Aqua, Cetearyl Olivate (and) Sorbitan Olivate (Olive-derived), Raw Wildflower Honey (Himachal Pradesh)**, Butyrospermum Parkii (Cold-Pressed Nilotica Shea) Butter*, Hydrolyzed Oat Protein, Leuconostoc/Radish Root Ferment Filtrate, Pelargonium Graveolens (Rose Geranium) Flower Oil, Tocopherol (Non-GMO Vitamin E), Santalum Album (Sandalwood) Extract."}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#727974] pt-1">
                        <span>*Certified Ecocert Organic</span>
                        <span>•</span>
                        <span>**Smallholder Wild-Harvested</span>
                        <span>•</span>
                        <span>100% Biodegradable</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2 */}
            <div className="rounded-2xl bg-[#F4F4ED] border border-[#E6E1D7] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion(1)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="font-display text-lg text-[#1A1C18] font-medium">
                  Formulation Safety &amp; Pregnancy Suitability
                </span>
                <ChevronDown className={`w-5 h-5 text-[#263D32] transition-transform duration-300 ${
                  openAccordion === 1 ? "rotate-180" : ""
                }`} />
              </button>
              <AnimatePresence>
                {openAccordion === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-1">
                      <p className="text-xs sm:text-sm text-[#424844] leading-relaxed">
                        Formulated completely devoid of synthetic endocrine disruptors, phthalates, synthetic musk fixatives, and retinoids. Essential oil concentrations are kept beneath 0.25% therapeutic threshold, making this masque deeply gentle and suitable for expecting and nursing mothers.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3 */}
            <div className="rounded-2xl bg-[#F4F4ED] border border-[#E6E1D7] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion(2)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="font-display text-lg text-[#1A1C18] font-medium">
                  Refill &amp; Closed-Loop Packaging Protocol
                </span>
                <ChevronDown className={`w-5 h-5 text-[#263D32] transition-transform duration-300 ${
                  openAccordion === 2 ? "rotate-180" : ""
                }`} />
              </button>
              <AnimatePresence>
                {openAccordion === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-1">
                      <p className="text-xs sm:text-sm text-[#424844] leading-relaxed">
                        To refill, rinse your ceramic jar with warm water and allow to dry thoroughly. Snip the corner notch of your compostable plant-film refill pouch, decant the cream into the stoneware vessel, and compost the empty pouch in home compost within 90 days.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 4 */}
            <div className="rounded-2xl bg-[#F4F4ED] border border-[#E6E1D7] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion(3)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="font-display text-lg text-[#1A1C18] font-medium">
                  Dispensary Storage &amp; Shelf Stability
                </span>
                <ChevronDown className={`w-5 h-5 text-[#263D32] transition-transform duration-300 ${
                  openAccordion === 3 ? "rotate-180" : ""
                }`} />
              </button>
              <AnimatePresence>
                {openAccordion === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-1">
                      <p className="text-xs sm:text-sm text-[#424844] leading-relaxed">
                        Store in a cool sanctuary away from direct noon solar rays. Preserved with natural radish root bio-ferment; stable for 18 months unopened or 9 months once unsealed.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* Floating Animated Cart Toast */}
      <AnimatePresence>
        {toastAdded && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="fixed bottom-7 right-7 z-50 flex items-center gap-3.5 bg-[#263D32] text-white px-5 py-3.5 rounded-full shadow-2xl border border-white/15"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-normal text-[#E8EDE4]">
                <strong className="font-semibold text-white">{product.title}</strong> added to your apothecary bag.
              </span>
              <button
                onClick={openCart}
                className="text-xs font-bold uppercase tracking-wider text-[#CEE9D9] hover:underline flex items-center gap-1 cursor-pointer ml-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
