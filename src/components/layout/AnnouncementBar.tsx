"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Heart, Sparkles, Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Store Announcement"
      className="w-full bg-[#0D281E] text-white py-2 px-4 sm:px-8 text-[11px] font-medium border-b border-[#1A382B] select-none z-50 overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto flex items-center justify-between">
        
        {/* Left / Center: Benefit Statements with Dots */}
        <div className="flex items-center gap-3 sm:gap-6 mx-auto sm:mx-0 overflow-x-auto no-scrollbar text-[#E2EAE5]">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Truck className="w-3.5 h-3.5 text-[#86B398]" />
            Free Shipping on orders above ₹999
          </span>
          <span className="text-[#86B398]/50 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap hidden sm:flex">
            <Leaf className="w-3.5 h-3.5 text-[#86B398]" />
            100% Natural Botanicals
          </span>
          <span className="text-[#86B398]/50 hidden md:inline">•</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap hidden md:flex">
            <Heart className="w-3.5 h-3.5 text-[#86B398]" />
            Handmade with Love in Tamil Nadu
          </span>
        </div>

        {/* Right: Track Order & Help */}
        <div className="hidden lg:flex items-center gap-5 text-[11px] text-[#C4D9CD]">
          <Link href="/contact" className="hover:text-white transition-colors">
            Track Order
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            Customer Care
          </Link>
        </div>

      </div>
    </aside>
  );
}
