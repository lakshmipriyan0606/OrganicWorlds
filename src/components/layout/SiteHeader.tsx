"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useCart } from "@/components/cart/CartContext";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ArrowRight,
  User,
  LogOut,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ignore = false;
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (!ignore && data.authenticated && data.user) {
            setCurrentUser(data.user);
          } else if (!ignore) {
            setCurrentUser(null);
          }
        } else if (!ignore) {
          setCurrentUser(null);
        }
      } catch {
        if (!ignore) setCurrentUser(null);
      }
    }
    checkAuth();
    return () => {
      ignore = true;
    };
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F6F3EC]/95 backdrop-blur-md border-b border-[#ECE6DB] transition-all duration-200">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Left: Mobile Menu Button + Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#1F241F] hover:text-[#0D3B2E] focus:outline-none cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group py-1.5 focus:outline-none"
              aria-label="Pavishna Organic Worlds Homepage"
            >
              <img
                src="/images/logo-header-transparent.png"
                alt="Pavishna Organic Worlds"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </Link>
          </div>

          {/* Center Navigation Links (Exact from Mockup: Home, Shop, Our Story, Ingredients, Blog) */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={cn(
                "text-[12.5px] font-medium tracking-wide transition-colors duration-200 hover:text-[#0D281E] py-1",
                pathname === "/" ? "text-[#0D281E] font-semibold" : "text-[#4A554D]"
              )}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={cn(
                "text-[12.5px] font-medium tracking-wide transition-colors duration-200 hover:text-[#0D281E] py-1",
                pathname.startsWith("/shop") || pathname.startsWith("/categories") ? "text-[#0D281E] font-semibold" : "text-[#4A554D]"
              )}
            >
              Shop
            </Link>
            <Link
              href="/our-story"
              className={cn(
                "text-[12.5px] font-medium tracking-wide transition-colors duration-200 hover:text-[#0D281E] py-1",
                pathname === "/our-story" ? "text-[#0D281E] font-semibold" : "text-[#4A554D]"
              )}
            >
              Our Story
            </Link>
            <Link
              href="/#ingredients"
              className="text-[12.5px] font-medium tracking-wide text-[#4A554D] hover:text-[#0D281E] transition-colors duration-200 py-1"
            >
              Ingredients
            </Link>
            <Link
              href="/#blog"
              className="text-[12.5px] font-medium tracking-wide text-[#4A554D] hover:text-[#0D281E] transition-colors duration-200 py-1"
            >
              Blog
            </Link>
          </nav>

          {/* Right: Search, Account/User, Cart Bag */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-[#1F241F] hover:text-[#0D281E] transition-colors p-1.5 cursor-pointer"
              aria-label="Search catalog"
            >
              <Search className="w-4.5 h-4.5 stroke-[1.8]" />
            </button>

            {/* Account / User Menu Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={cn(
                  "text-[#1F241F] hover:text-[#0D281E] transition-colors p-1.5 hidden sm:inline-flex items-center justify-center cursor-pointer rounded-full relative",
                  userMenuOpen && "text-[#0D281E] bg-[#EAE4D7]"
                )}
                aria-label="Account and orders menu"
                aria-expanded={userMenuOpen}
              >
                <User className="w-4.5 h-4.5 stroke-[1.8]" />
                {currentUser && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-[#F6F3EC]" />
                )}
              </button>

              {/* Profile Dropdown Card */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: "top right" }}
                    className="absolute right-0 top-full mt-3 w-72 bg-white rounded-3xl border border-[#E3DDD1] shadow-xl p-5 z-50 space-y-4"
                  >
                  {currentUser ? (
                    // Logged in user view
                    <div className="space-y-3">
                      <div className="pb-3 border-b border-[#F0ECE1]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#82947B] block">
                          Sanctuary Patron
                        </span>
                        <h4 className="font-display text-sm font-bold text-[#0D281E] truncate">
                          {currentUser.name || "Botanical Patron"}
                        </h4>
                        <p className="text-[11px] text-[#525A55] truncate">{currentUser.email}</p>
                        {currentUser.role === "ADMIN" && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                            <ShieldCheck className="w-3 h-3" />
                            Apothecary Staff
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl text-[#0D281E] hover:bg-[#FAF8F5] font-semibold transition-colors"
                        >
                          <span>My Sanctuary & Orders</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#82947B]" />
                        </Link>
                        <Link
                          href="/track"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl text-[#525A55] hover:bg-[#FAF8F5] hover:text-[#0D281E] font-medium transition-colors"
                        >
                          <span>Track Dispatch</span>
                          <Truck className="w-3.5 h-3.5 text-[#82947B]" />
                        </Link>
                        {currentUser.role === "ADMIN" && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl text-amber-900 bg-amber-50/70 hover:bg-amber-100/70 font-bold transition-colors"
                          >
                            <span>Admin Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#F0ECE1]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Not logged in view
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-display text-sm font-bold text-[#0D281E]">
                          Sanctuary Profile
                        </h4>
                        <p className="text-[11px] text-[#525A55] mt-0.5 leading-relaxed">
                          Sign in to access your sacred orders, saved addresses, and botanical self-care history.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full py-2.5 rounded-full bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <span>Sign In to Sanctuary</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full py-2.5 rounded-full border border-[#E3DDD1] bg-[#FAF8F5] text-[#0D281E] text-xs font-bold uppercase tracking-wider hover:bg-[#F0ECE1] transition-colors flex items-center justify-center text-center"
                        >
                          Create Account
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-[#F0ECE1] space-y-1.5 text-xs text-[#525A55]">
                        <Link
                          href="/track"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:text-[#0D281E] hover:bg-[#FAF8F5] transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#82947B]" />
                          <span>Track an Order</span>
                        </Link>
                        <Link
                          href="/admin/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:text-[#0D281E] hover:bg-[#FAF8F5] transition-colors text-[11px] text-[#82947B]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Apothecary Staff Login</span>
                        </Link>
                      </div>
                    </div>
                  )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openCart}
              className="relative p-1.5 text-[#1F241F] hover:text-[#0D281E] transition-colors flex items-center cursor-pointer"
              aria-label={`Open shopping cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-4.5 h-4.5 stroke-[1.8]" />
              {mounted && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 400 }}
                  className="absolute -top-1 -right-1 bg-[#0D281E] text-white text-[9.5px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Live Search Drawer / Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-[#E2DDD2] bg-white shadow-lg"
            >
              <div className="max-w-[800px] mx-auto px-5 py-5">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <Search className="w-5 h-5 text-[#0D281E] absolute left-3.5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search hair oils, cold-process soaps, ingredients... (Press Enter to search)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-24 py-3 bg-[#FAF8F5] border border-[#E2DDD2] rounded-xl text-sm text-[#1B1C19] focus:outline-none focus:border-[#0D281E]"
                  />
                  <div className="absolute right-3 flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-[#0D281E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#1A4533] cursor-pointer"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="text-[#6E7B73] hover:text-[#0D281E] p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FBF9F3] p-6 shadow-xl flex flex-col justify-between"
            >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E2DDD2]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  <img
                    src="/images/logo-header-transparent.png"
                    alt="Pavishna Organic Worlds"
                    className="h-10 w-auto object-contain"
                  />
                </Link>
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

              {/* Mobile Account / Sanctuary Section */}
              <div className="mt-8 pt-6 border-t border-[#E2DDD2] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#82947B] block">
                  Sanctuary Account
                </span>
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="text-xs">
                      <strong className="text-[#0D281E] block font-bold truncate">
                        {currentUser.name || "Botanical Patron"}
                      </strong>
                      <span className="text-[11px] text-[#525A55] block truncate">
                        {currentUser.email}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E3DDD1] font-bold text-[#0D281E]"
                      >
                        <span>My Sanctuary & Orders</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#82947B]" />
                      </Link>

                      <Link
                        href="/track"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E3DDD1] font-medium text-[#525A55]"
                      >
                        <span>Track Order</span>
                        <Truck className="w-3.5 h-3.5 text-[#82947B]" />
                      </Link>

                      {currentUser.role === "ADMIN" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200 font-bold text-amber-900"
                        >
                          <span>Admin Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-full bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Sign In to Sanctuary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-full border border-[#E3DDD1] bg-white text-[#0D281E] text-xs font-bold uppercase tracking-wider flex items-center justify-center text-center"
                    >
                      Create Account
                    </Link>

                    <Link
                      href="/track"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-[#525A55] hover:text-[#0D281E]"
                    >
                      <span>Track Order</span>
                      <Truck className="w-3.5 h-3.5 text-[#82947B]" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

              <div className="pt-6 border-t border-[#E2DDD2]">
                <p className="text-xs text-[#3E4640] leading-relaxed font-normal">
                  Cold-pressed scalp elixirs and 6-week cured cold-process soaps handcrafted for mindful daily rituals.
                </p>
                <p className="text-[11px] text-forest-700 mt-2 font-bold">
                  Free shipping across India on orders over ₹1,500
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
