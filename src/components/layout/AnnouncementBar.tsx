"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Leaf, Heart, Truck } from "lucide-react";
import { AnnouncementCMSData, DEFAULT_ANNOUNCEMENT_DATA } from "@/types/cms";

export function AnnouncementBar() {
  const [data, setData] = useState<AnnouncementCMSData>(DEFAULT_ANNOUNCEMENT_DATA);

  useEffect(() => {
    let ignore = false;
    async function loadCMS() {
      try {
        const res = await fetch("/api/cms/homepage");
        const resData = await res.json();
        if (!ignore && resData.success && resData.announcement) {
          setData(resData.announcement);
        }
      } catch (e) {
        console.error("Failed to load announcement CMS:", e);
      }
    }
    loadCMS();
    return () => {
      ignore = true;
    };
  }, []);

  if (!data.enabled) return null;

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
            Free Shipping on orders above ₹{data.freeShippingThreshold || 1500}
          </span>
          <span className="text-[#86B398]/50 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap hidden sm:flex text-emerald-200">
            {data.text}
          </span>
        </div>

        {/* Right: Track Order & Help */}
        <div className="hidden lg:flex items-center gap-5 text-[11px] text-[#C4D9CD]">
          <Link href="/track" className="hover:text-white transition-colors">
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
