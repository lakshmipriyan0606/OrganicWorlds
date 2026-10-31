"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#0D281E] text-white pt-14 pb-10 border-t border-[#1C3E2F] relative overflow-hidden">
      
      {/* Decorative botanical branch watermark in corner */}
      <div className="absolute -bottom-10 -left-10 w-64 h-64 pointer-events-none opacity-20 select-none">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#B4D6C1]">
          <path d="M10 190 C60 140, 120 80, 190 10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M40 160 C30 140, 45 130, 60 145 C60 160, 50 170, 40 160 Z" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Top Newsletter Bar (Exact from Mockup Section 13) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-white/10">
          
          {/* Brand & Slogan */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="inline-block mb-1.5">
              <span className="font-display text-2xl font-medium tracking-tight text-white">
                Pavishna Organic Worlds
              </span>
            </Link>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#86B398] font-medium">
              Nature • Wellness • You
            </span>
          </div>

          {/* Email Subscription Form */}
          <div className="lg:col-span-5 flex flex-col">
            <h4 className="text-sm font-semibold text-white mb-0.5">
              Join Our Natural Journey
            </h4>
            <p className="text-xs text-[#B4C7BD] mb-3 font-normal">
              Get exclusive botanical offers, new arrivals and skincare tips.
            </p>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:border-[#86B398] focus:bg-white/15 transition-[border-color,background-color] duration-160 ease-out"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-white text-[#0D281E] hover:bg-[#F2EEE4] active:scale-[0.97] text-xs font-bold uppercase tracking-wider transition-[transform,background-color] duration-160 ease-out shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Social Icons */}
          <div className="lg:col-span-3 flex items-center justify-start lg:justify-end gap-3 text-white/80">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 transition-[transform,background-color,color] duration-160 ease-out cursor-pointer shadow-2xs"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 transition-[transform,background-color,color] duration-160 ease-out cursor-pointer shadow-2xs"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 transition-[transform,background-color,color] duration-160 ease-out cursor-pointer shadow-2xs"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0D281E" />
              </svg>
            </a>
          </div>

        </div>

        {/* Bottom Nav Links & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9BB1A5]">
          <nav className="flex flex-wrap items-center gap-6 text-[12px]">
            <Link href="/shop" className="hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/our-story" className="hover:text-white transition-colors">
              Our Story
            </Link>
            <Link href="/#ingredients" className="hover:text-white transition-colors">
              Ingredients
            </Link>
            <Link href="/#blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          <p className="text-[11px] text-[#7E9689]">
            © 2026 Pavishna Organic Worlds. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
