import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#0E231C] text-[#FBF9F3] pt-20 pb-12 border-t border-forest-800">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 pb-16 border-b border-forest-800/80">
          
          {/* Brand Philosophy Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <div className="h-12 px-2.5 py-1 rounded-md bg-[#F6F3EC] border border-white/20 shadow-md shrink-0 flex items-center group-hover:scale-105 transition-transform">
                <img
                  src="/images/logo-header-transparent.png"
                  alt="Pavishna Organic Worlds"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-display text-2xl font-bold tracking-tight text-white block">
                  Pavishna Organic Worlds
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#E0C097] font-semibold block mt-0.5">
                  Handcrafted Soaps &amp; Cold-Pressed Hair Care
                </span>
              </div>
            </Link>
            <p className="text-sm text-ivory-100/90 leading-relaxed max-w-sm font-normal">
              We craft intentional daily botanical essentials using wild-harvested herbs, cold-pressed scalp elixirs, and 4-week cured artisan herbal soap bars. 100% natural, ethical, and plastic-free.
            </p>
            <div className="pt-2">
              <span className="eyebrow text-[#E0C097] mb-2">Our Origins</span>
              <p className="text-xs text-ivory-100/75 font-normal">
                Authentic South Indian Herbal Heritage • Small-Batch Artisanal Extraction
              </p>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-sand-300 mb-5">
              Curated Collections
            </h4>
            <ul className="space-y-3.5 text-[13px]">
              {siteConfig.footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-ivory-100/80 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-sand-300 mb-5">
              Botanical Care
            </h4>
            <ul className="space-y-3.5 text-[13px]">
              {siteConfig.footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-ivory-100/80 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Policies Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-sand-300 mb-5">
              Customer Concierge
            </h4>
            <ul className="space-y-3.5 text-[13px]">
              {siteConfig.footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-ivory-100/80 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ivory-100/70 gap-4">
          <p>
            © 2026 {siteConfig.name} Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Currency: INR (₹)</span>
            <span className="w-1 h-1 rounded-full bg-forest-700" />
            <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-forest-700" />
            <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
