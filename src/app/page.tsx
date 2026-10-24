"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PavishnaHero } from "@/components/home/PavishnaHero";
import { PavishnaShopByRitual } from "@/components/home/PavishnaShopByRitual";
import { PavishnaBestSellers } from "@/components/home/PavishnaBestSellers";
import { PavishnaFeaturedProduct } from "@/components/home/PavishnaFeaturedProduct";
import { PavishnaOurStoryHeritage } from "@/components/home/PavishnaOurStoryHeritage";
import { PavishnaIngredientOrigins } from "@/components/home/PavishnaIngredientOrigins";
import { PavishnaStoriesAndPackaging } from "@/components/home/PavishnaStoriesAndPackaging";
import { StitchSanctuaryRegimen } from "@/components/home/StitchSanctuaryRegimen";
import { PavishnaSustainabilityBanner } from "@/components/home/PavishnaSustainabilityBanner";
import { PavishnaBlogSection } from "@/components/home/PavishnaBlogSection";
import { useCart } from "@/components/cart/CartContext";
import { Product } from "@/types/product";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const { addItem, openCart } = useCart();
  const [toastItem, setToastItem] = useState<string | null>(null);

  const handleQuickAdd = (product: Product) => {
    addItem(product);
    setToastItem(product.title);
    setTimeout(() => {
      setToastItem(null);
    }, 3200);
  };

  return (
    <div className="flex flex-col bg-[#FAF8F5] text-[#10281D] min-h-screen selection:bg-[#CEE9D9] selection:text-[#10271D]">
      
      {/* 1. Asymmetric Hero & Slim Trust Strip (Mockup Section 1 & 2) */}
      <PavishnaHero />

      {/* 2. Asymmetric Shopping-by-Ritual Mosaic (Mockup Section 4) */}
      <PavishnaShopByRitual />

      {/* 3. Best-Selling Products Carousel / Row (Mockup Section 6) */}
      <PavishnaBestSellers onQuickAdd={handleQuickAdd} />

      {/* 4. Full-Width Dark Green Featured Product Spotlight (Mockup Section 5) */}
      <PavishnaFeaturedProduct />

      {/* 5. Brand Heritage - Rooted in Tradition (Mockup Section 8) */}
      <PavishnaOurStoryHeritage />

      {/* 6. Ingredient Origins - Pure Ingredients, Real Benefits (Mockup Section 7) */}
      <PavishnaIngredientOrigins />

      {/* 7. Customer Reviews & Conscious Packaging (Mockup Section 10 & 11) */}
      <PavishnaStoriesAndPackaging />

      {/* 8. Three-Step Traditional Tamil Sanctuary Ritual (Mockup Section 9) */}
      <StitchSanctuaryRegimen />

      {/* 9. Sustainability Beyond Products Terracotta Banner (Mockup Section 11) */}
      <PavishnaSustainabilityBanner />

      {/* 10. Editorial Journal / Blog (Mockup Section 12) */}
      <PavishnaBlogSection />

      {/* Floating Animated Cart Toast Notification */}
      <AnimatePresence>
        {toastItem && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="fixed bottom-7 right-7 z-50 flex items-center gap-3.5 bg-[#0D281E] text-white px-5 py-3.5 rounded-full shadow-2xl border border-white/15"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-normal text-[#E8EDE4]">
                <strong className="font-semibold text-white">{toastItem}</strong> added to your apothecary bag.
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
