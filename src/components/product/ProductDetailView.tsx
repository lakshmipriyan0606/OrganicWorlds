"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, ProductVariant } from "@/types/product";
import { useCart } from "@/components/cart/CartContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { Star, ShieldCheck, Truck, Plus, Minus, CheckCircle2 } from "lucide-react";

export function ProductDetailView({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.featuredImage);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"ritual" | "ingredients" | "specs">("ritual");
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      
      {/* Left Gallery Column */}
      <div className="lg:col-span-7 space-y-4">
        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white border border-[#E3E8E1] shadow-md group">
          <img
            src={selectedImage}
            alt={product.title}
            className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-103"
          />
          {product.badge && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0D3B2E] border border-emerald-900/10 shadow-xs text-xs font-bold uppercase tracking-wider">
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer ${
                  selectedImage === img
                    ? "border-[#0D3B2E] ring-2 ring-[#0D3B2E]/30 shadow-xs"
                    : "border-[#E3E8E1] hover:border-[#0D3B2E]/60 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Product Buy Box */}
      <div className="lg:col-span-5 space-y-7">
        
        {/* Title & Category */}
        <div className="space-y-2">
          <Link
            href={`/categories/${product.category}`}
            className="eyebrow hover:text-forest-700 transition-colors"
          >
            {product.categoryLabel}
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl text-forest-900 leading-tight">
            {product.title}
          </h1>
          <p className="text-sm text-[#3E4640] leading-relaxed font-normal">
            {product.subtitle}
          </p>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center text-warning">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-warning text-warning"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-charcoal-900">{product.rating}</span>
            <span className="text-xs text-[#3E4640]">({product.reviewCount} verified reviews)</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 pb-6 border-b border-[#E2DDD2]">
          <span className="font-body text-2xl sm:text-3xl font-bold text-forest-900">
            {formatCurrency(currentPrice)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span className="text-[11px] text-forest-700 font-semibold">Taxes included • Free delivery above ₹1,500</span>
        </div>

        {/* Variant Selector */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-2.5">
            <span className="text-xs uppercase tracking-wider font-bold text-charcoal-900 block">
              Format &amp; Size
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-3 text-left border rounded-[3px] text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    selectedVariant?.id === v.id
                      ? "border-forest-900 bg-ivory-100 font-bold text-forest-900 ring-1 ring-forest-900 shadow-xs"
                      : "border-[#E2DDD2] hover:border-sand-300 text-[#3E4640] bg-white"
                  }`}
                >
                  <span className="font-medium">{v.name}</span>
                  <span className="text-forest-900 font-bold mt-1">{formatCurrency(v.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#E2DDD2] rounded-[3px] bg-white h-12">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 h-full text-charcoal-600 hover:text-forest-900 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-sm font-bold text-forest-900 min-w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3.5 h-full text-charcoal-600 hover:text-forest-900 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              className={`flex-1 h-12 text-sm tracking-wider uppercase font-bold transition-all rounded-full bg-[#0D3B2E] hover:bg-emerald-900 text-white shadow-md hover:shadow-lg ${
                addedAnimation ? "bg-emerald-600 hover:bg-emerald-600 text-white" : ""
              }`}
            >
              {addedAnimation ? (
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Added to Botanical Bag
                </span>
              ) : (
                `Add to Bag • ${formatCurrency(currentPrice * quantity)}`
              )}
            </Button>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] text-[#4A5568]">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span>Ships in 24–48 hours across India</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span>100% Pure Botanical, Zero Toxins</span>
            </div>
          </div>
        </div>

        {/* Informational Tabs (Ritual, Specs, Ingredients) */}
        <div className="pt-6 border-t border-[#E3E8E1]">
          <div className="flex border-b border-[#E3E8E1]">
            <button
              onClick={() => setActiveTab("ritual")}
              className={`pb-3 text-xs uppercase tracking-wider font-bold mr-6 transition-all cursor-pointer ${
                activeTab === "ritual"
                  ? "border-b-2 border-[#0D3B2E] text-[#0D3B2E]"
                  : "text-[#4A5568] hover:text-[#0D3B2E]"
              }`}
            >
              Daily Ritual
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3 text-xs uppercase tracking-wider font-bold mr-6 transition-all cursor-pointer ${
                activeTab === "specs"
                  ? "border-b-2 border-[#0D3B2E] text-[#0D3B2E]"
                  : "text-[#4A5568] hover:text-[#0D3B2E]"
              }`}
            >
              Botanical Anatomy
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`pb-3 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === "ingredients"
                  ? "border-b-2 border-[#0D3B2E] text-[#0D3B2E]"
                  : "text-[#4A5568] hover:text-[#0D3B2E]"
              }`}
            >
              Ingredients
            </button>
          </div>

          <div className="pt-4 text-sm text-[#3E4640] leading-relaxed font-normal">
            {activeTab === "ritual" && (
              <ul className="space-y-2.5">
                {product.ritualSteps?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-display font-bold text-forest-900 text-base leading-none">•</span>
                    <span>{step}</span>
                  </li>
                )) || <p>{product.description}</p>}
              </ul>
            )}

            {activeTab === "specs" && (
              <div className="space-y-3">
                {product.hairOilSpecs && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="font-bold text-charcoal-900">Hair &amp; Scalp Type:</span> {product.hairOilSpecs.hairType.join(", ")}</div>
                    <div><span className="font-bold text-charcoal-900">Volume:</span> {product.hairOilSpecs.volumeMl}ml Glass Dropper</div>
                    <div className="col-span-2">
                      <span className="font-bold text-charcoal-900 block mb-1">Key Benefits:</span>
                      <p>{product.hairOilSpecs.keyBenefits.join(" • ")}</p>
                    </div>
                  </div>
                )}

                {product.soapSpecs && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="font-bold text-charcoal-900">Craft Process:</span> {product.soapSpecs.soapType}</div>
                    <div><span className="font-bold text-charcoal-900">Air-Curing Duration:</span> {product.soapSpecs.curingWeeks} Weeks Cured</div>
                    <div><span className="font-bold text-charcoal-900">Bar Weight:</span> {product.soapSpecs.weightGrams}g</div>
                    <div><span className="font-bold text-charcoal-900">Skin Affinity:</span> {product.soapSpecs.skinType.join(", ")}</div>
                    <div className="col-span-2 pt-2 border-t border-[#E2DDD2]">
                      <span className="font-bold text-charcoal-900 block mb-1">Key Botanicals:</span>
                      <p>{product.soapSpecs.keyBotanicals.join(" • ")}</p>
                    </div>
                  </div>
                )}

                {product.candleSpecs && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="font-bold text-charcoal-900">Wax Type:</span> {product.candleSpecs.waxType}</div>
                    <div><span className="font-bold text-charcoal-900">Burn Time:</span> {product.candleSpecs.burnTimeHours} Hours</div>
                    <div><span className="font-bold text-charcoal-900">Scent Family:</span> {product.candleSpecs.scentFamily}</div>
                    <div><span className="font-bold text-charcoal-900">Vessel Weight:</span> {product.candleSpecs.weightGrams}g</div>
                    <div className="col-span-2 pt-2 border-t border-[#E2DDD2]">
                      <span className="font-bold text-charcoal-900 block mb-1">Fragrance Architecture:</span>
                      <p>Top: {product.candleSpecs.topNotes.join(", ")}</p>
                      <p>Heart: {product.candleSpecs.heartNotes.join(", ")}</p>
                      <p>Base: {product.candleSpecs.baseNotes.join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ingredients" && (
              <p className="text-xs leading-relaxed font-normal">
                {product.ingredientsSummary || "100% pure organic botanicals. Wild-harvested without synthetic petroleum derivatives, parabens, silicones, or chemical fragrance additives."}
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
