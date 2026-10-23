"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useCart } from "@/components/cart/CartContext";
import { mockProducts } from "@/config/products";
import { ShoppingBag, Search, Menu, X, Box, ArrowRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const searchResults = searchQuery.trim()
    ? mockProducts.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F6F3EC]/95 backdrop-blur-md border-b border-[#ECE6DB] transition-all duration-200">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#1F241F] hover:text-[#0D3B2E] focus:outline-none cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Left Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/categories/soaps"
              className={cn(
                "text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 hover:text-[#0D3B2E] py-1",
                pathname === "/categories/soaps" ? "text-[#0D3B2E] font-bold" : "text-[#1F241F]"
              )}
            >
              Artisanal Soaps
            </Link>
            <Link
              href="/categories/hair-care"
              className={cn(
                "text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 hover:text-[#0D3B2E] py-1",
                pathname === "/categories/hair-care" ? "text-[#0D3B2E] font-bold" : "text-[#1F241F]"
              )}
            >
              Hair &amp; Scalp
            </Link>
            <Link
              href="/shop"
              className={cn(
                "text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 hover:text-[#0D3B2E] py-1",
                pathname === "/shop" ? "text-[#0D3B2E] font-bold" : "text-[#1F241F]"
              )}
            >
              Shop All
            </Link>
          </nav>

          {/* Center Brand Identity with Botanical Mark */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2.5 group text-left">
              <svg
                className="w-7 h-7 text-[#1A231C] opacity-90 flex-shrink-0 group-hover:scale-105 transition-transform"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Botanical vine sprig motif */}
                <path d="M12 30 C16 26, 20 20, 26 12 C28 9, 31 7, 34 6" />
                <path d="M18 24 C16 20, 16 16, 18 13 C21 15, 22 18, 20 22" fill="currentColor" fillOpacity="0.1" />
                <path d="M23 18 C25 15, 27 13, 30 14 C29 17, 27 19, 24 19" fill="currentColor" fillOpacity="0.1" />
                <path d="M13 29 C9 28, 7 25, 8 22 C11 23, 13 25, 14 28" fill="currentColor" fillOpacity="0.1" />
                <path d="M28 10 C31 9, 34 9, 35 11 C34 13, 31 13, 29 12" fill="currentColor" fillOpacity="0.1" />
              </svg>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-medium tracking-tight text-[#1A231C] leading-none group-hover:text-[#0D3B2E] transition-colors">
                  Pavishna
                </span>
                <span className="text-[9.5px] uppercase tracking-[0.24em] text-[#3D453D] font-medium mt-1">
                  Organic Worlds
                </span>
              </div>
            </Link>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-7">
              <Link
                href="/categories/candles"
                className={cn(
                  "text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 hover:text-[#0D3B2E] py-1",
                  pathname === "/categories/candles" ? "text-[#0D3B2E] font-bold" : "text-[#1F241F]"
                )}
              >
                Candles
              </Link>
              <Link
                href="/our-story"
                className={cn(
                  "text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 hover:text-[#0D3B2E] py-1",
                  pathname === "/our-story" ? "text-[#0D3B2E] font-bold" : "text-[#1F241F]"
                )}
              >
                Our Story
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#1F241F] hover:text-[#0D3B2E] transition-colors p-1 cursor-pointer"
                aria-label="Search catalog"
              >
                <Search className="w-4.5 h-4.5 stroke-[1.6]" />
              </button>

              {/* Shopping Bag Trigger */}
              <button
                onClick={openCart}
                className="relative p-1 text-[#1F241F] hover:text-[#0D3B2E] transition-colors flex items-center cursor-pointer"
                aria-label={`Open shopping cart with ${totalItems} items`}
              >
                <ShoppingBag className="w-4.5 h-4.5 stroke-[1.6]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#133829] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Drawer / Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#E2DDD2] bg-white shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-[800px] mx-auto px-5 py-5">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-forest-700 absolute left-3.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search hair oils, cold-process soaps, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-ivory-50 border border-[#E2DDD2] rounded-[3px] text-sm text-[#1B1C19] focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-3 text-charcoal-600 hover:text-forest-900 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Search Results */}
              {searchQuery && (
                <div className="mt-4 pt-3 border-t border-[#E2DDD2]">
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-2 rounded hover:bg-ivory-100 transition-colors"
                        >
                          <img
                            src={p.featuredImage}
                            alt={p.title}
                            className="w-12 h-12 object-cover rounded-[2px] bg-ivory-100"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-forest-900 truncate">{p.title}</h4>
                            <p className="text-[11px] text-[#3E4640] truncate">{p.categoryLabel}</p>
                            <span className="text-xs font-bold text-forest-700">{formatCurrency(p.price)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#3E4640] text-center py-4 font-normal">
                      No botanical offerings found matching &ldquo;{searchQuery}&rdquo;. Try searching &ldquo;hair oil&rdquo; or &ldquo;soap&rdquo;.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FBF9F3] p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E2DDD2]">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-emerald-900/15 shadow-sm bg-white shrink-0">
                    <img
                      src="/images/logo.jpeg"
                      alt="Pavishna Organic Worlds"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-display text-xl text-[#0D3B2E] block font-bold leading-tight">
                      Pavishna
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#0D3B2E]/90 font-bold">
                      Organic Worlds
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-charcoal-600 hover:text-forest-900 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-5">
                {siteConfig.navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-base font-bold transition-colors py-1 flex items-center justify-between",
                      pathname === link.href ? "text-forest-900 font-bold" : "text-[#3E4640]"
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#E2DDD2]">
              <p className="text-xs text-[#3E4640] leading-relaxed font-normal">
                Cold-pressed scalp elixirs and 6-week cured cold-process soaps handcrafted for mindful daily rituals.
              </p>
              <p className="text-[11px] text-forest-700 mt-2 font-bold">
                Free shipping across India on orders over ₹1,500
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
