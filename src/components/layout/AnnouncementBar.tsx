"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const announcements = [
  "Welcome to Pavishna Organic Worlds • Pure Botanical Alchemy",
  "Complimentary 4-week cured herbal soap sample with every order above ₹1,200",
  "100% Wild Botanicals • Vetti Veru, Hibiscus, Neem, Rose & Coconut • Zero Palm Oil",
  "Free carbon-neutral shipping across India on orders over ₹1,500"
];

export function AnnouncementBar() {
  return (
    <aside aria-label="Store Announcements" className="bg-[#48533D] text-[#DDE3D6] text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase py-2 px-4 text-center transition-all">
      <div className="max-w-[1360px] mx-auto flex items-center justify-center gap-2">
        <svg
          className="w-3.5 h-3.5 text-[#C8D1BE] flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
        <span className="font-medium">
          Free carbon-neutral shipping across India on orders over ₹1,500
        </span>
      </div>
    </aside>
  );
}
