"use client";

import React from "react";

const marqueeItems = [
  "Free carbon-neutral shipping across India on orders over ₹1,500",
  "100% Pure South Indian Botanical Alchemy",
  "Complimentary 4-week cured herbal soap sample with orders above ₹1,200",
  "Cold-pressed scalp elixirs & hand-cut artisanal bath soaps",
  "Zero synthetic chemicals • Zero parabens • Zero palm oil",
  "Ethically wild-harvested herbs & sun-dried Vetiver roots",
];

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Store Announcements"
      className="relative bg-[#48533D] text-[#E8EFE3] text-[10.5px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase py-2.5 overflow-hidden border-b border-[#3B4432] select-none z-50"
    >
      <style>{`
        @keyframes marqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .announcement-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 28s linear infinite;
          will-change: transform;
        }
        .announcement-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="announcement-marquee-track">
        {/* Render 2 identical sets for 100% seamless, infinite -50% loop */}
        {[...marqueeItems, ...marqueeItems].map((msg, idx) => (
          <div key={idx} className="flex items-center gap-3.5 px-6 shrink-0">
            <svg
              className="w-3.5 h-3.5 text-[#D0DEC4] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span className="tracking-[0.15em] font-medium">{msg}</span>
            <span className="text-[#C2D2B5]/70 text-xs ml-3 font-normal">✦</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

