"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  Filter,
  X,
  SlidersHorizontal,
  Plus,
  Check,
  Heart,
  Truck,
  RotateCcw,
  Sprout,
  CheckCircle2,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const keynoteChips = [
  "Cedar & Hinoki",
  "Wild Fig",
  "Rosemary",
  "Sandalwood",
  "Amla & Camellia",
  "Vetiver Roots",
];

const tamilNames: Record<string, string> = {
  "vetti-veru-bath-soap": "வெட்டிவேர் சோப்பு",
  "hibiscus-rosa-bath-soap": "செம்பருத்தி சோப்பு",
  "neem-bath-soap": "வேப்பிலை சோப்பு",
  "rose-bath-soap": "பன்னீர் ரோஜா சோப்பு",
  "coconut-bath-soap": "தூய தேங்காய் சோப்பு",
  "aloe-vera-bath-soap": "கற்றாழை சோப்பு",
  "orange-bath-soap": "ஆரஞ்சு மூலிகை சோப்பு",
  "pavishna-botanical-hair-scalp-oil": "மூலிகை கூந்தல் தைலம்",
  "wild-jasmine-smoked-vetiver-candle": "மல்லிகை & வெட்டிவேர் தீபம்",
  "santal-hinoki-botanical-candle": "சந்தன தீபம்",
  "dusk-olive-grove-candle": "ஆலிவ் சோலை தீபம்",
  "pavishna-royal-heritage-bath-hamper": "பாரம்பரிய குளியல் பெட்டகம்",
  "botanical-scalp-elixir": "மூலிகை ஸ்கால்ப் எலிக்சர்",
  "camellia-honey-repair-masque": "தேன் & கேமல்லியா மாஸ்க்",
  "white-tea-aloe-tonic-mist": "வெண்தேநீர் டோனிக் மிஸ்ட்",
  "nocturnal-scalp-renewal-drops": "இரவு நேர கூந்தல் துளிகள்",
  "hand-carved-walnut-comb": "கைவினை மர சீப்பு",
  "shea-rosemary-split-end-salve": "ரோஸ்மேரி கூந்தல் தைலம்",
  "solstice-bath-ceremony-crate": "பாரம்பரிய குளியல் பெட்டகம்",
};

function ShopContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "all";

  const { addItem, openCart } = useCart();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local filter state — search/category are initialised from URL and can be overridden by sidebar
  const [search, setSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [maxPrice, setMaxPrice] = useState<number>(7000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [selectedKeynotes, setSelectedKeynotes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [toastItem, setToastItem] = useState<string | null>(null);

  // Effective values: URL params take precedence when user navigates from the header search
  const effectiveSearch = urlSearch || search;
  const effectiveCategory = urlCategory !== "all" ? urlCategory : selectedCategory;

  // Load products from database via API
  useEffect(() => {
    let ignore = false;
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12",
          sortBy,
          inStockOnly: inStockOnly ? "true" : "false",
        });
        if (effectiveCategory !== "all") {
          params.set("categorySlug", effectiveCategory);
        }
        if (effectiveSearch.trim()) {
          params.set("search", effectiveSearch.trim());
        }
        if (maxPrice < 7000) {
          params.set("maxPrice", maxPrice.toString());
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Server returned HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!ignore) {
          if (data.success && Array.isArray(data.products)) {
            setDbProducts(data.products);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
          } else {
            throw new Error(data.error || "Failed to load catalog");
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load products from database:", err);
          setError("Unable to connect to the apothecary vault. Please check your connection and retry.");
          setDbProducts([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      ignore = true;
    };
  }, [page, effectiveCategory, effectiveSearch, sortBy, inStockOnly, maxPrice]);

  const toggleKeynote = (keynote: string) => {
    setSelectedKeynotes((prev) =>
      prev.includes(keynote) ? prev.filter((k) => k !== keynote) : [...prev, keynote]
    );
  };

  const toggleWishlist = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAddedSlug(product.slug);
    setToastItem(product.title);
    setTimeout(() => {
      setAddedSlug(null);
      setToastItem(null);
    }, 2800);
  };

  // Optional client-side botanical keynote refinement
  const filteredProducts = useMemo(() => {
    if (selectedKeynotes.length === 0) return dbProducts;
    return dbProducts.filter((p) => {
      const text = `${p.title} ${p.subtitle} ${p.description} ${p.ingredientsSummary || ""}`.toLowerCase();
      return selectedKeynotes.some((k) => text.includes(k.toLowerCase().split(" ")[0]));
    });
  }, [dbProducts, selectedKeynotes]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSearch("");
    setMaxPrice(7000);
    setInStockOnly(false);
    setSelectedKeynotes([]);
    setSortBy("featured");
    setPage(1);
  };

  return (
    <div className="bg-[#FAFBF9] text-[#1A1C18] min-h-screen selection:bg-[#CEE9D9] selection:text-[#10271D]">
      {/* Top Breadcrumbs & Page Intro */}
      <section className="max-w-[1360px] mx-auto w-full px-5 sm:px-8 lg:px-12 pt-6 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#55423D]/80 mb-6">
          <Link href="/" className="hover:text-[#263D32] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#AAA99F]" />
          <span className="text-[#263D32] font-bold">Shop All</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 gap-x-8 items-end pb-6 border-b border-[#E6E1D7]">
          <div className="lg:col-span-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#263D32] block mb-2">
              The Seasonal Apothecary
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1C18] font-normal tracking-tight leading-[1.1] mb-3">
              All Botanical Offerings
            </h1>
            <p className="text-xs sm:text-sm text-[#424844] max-w-2xl leading-relaxed font-normal">
              Slow-crafted essentials for everyday rituals — sun-grown botanicals, cold-pressed scalp elixirs, and hand-poured soy candles poured in tactile, wheel-thrown clay vessels.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end items-center">
            <div className="bg-[#EEEEE8] px-4 py-2 rounded-full flex items-center gap-2 border border-[#E6E1D7] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#426B50] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#263D32]">
                Verified Persistent Database Catalog
              </span>
            </div>
          </div>
        </div>

        {/* Category Shortcut Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none">
          {[
            { id: "all", label: "All Harvests" },
            { id: "hair-care", label: "Scalp & Hair" },
            { id: "soaps", label: "Handcrafted Soaps" },
            { id: "candles", label: "Candles" },
            { id: "gifting", label: "Gift Hampers" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
              className={`px-4.5 py-2 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                effectiveCategory === cat.id
                  ? "bg-[#263D32] text-white shadow-xs"
                  : "bg-[#EEEEE8] hover:bg-[#E5E5DE] text-[#424844]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Filter Status & Sort Bar */}
      <section className="max-w-[1360px] mx-auto w-full px-5 sm:px-8 lg:px-12 mb-8">
        <div className="bg-[#F4F4ED] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-y-4 gap-x-6 border border-[#E6E1D7]">
          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#424844] font-medium mr-1">
              Filtered by:
            </span>

            {effectiveSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3E3DD] text-[#1A1C18] text-xs font-semibold">
                Search: &ldquo;{effectiveSearch}&rdquo;
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="hover:text-[#A4423B] transition-colors"
                  aria-label="Remove search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {effectiveCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3E3DD] text-[#1A1C18] text-xs font-semibold">
                {effectiveCategory}
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPage(1);
                  }}
                  className="hover:text-[#A4423B] transition-colors"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3E3DD] text-[#1A1C18] text-xs font-semibold">
                In Stock
                <button
                  onClick={() => {
                    setInStockOnly(false);
                    setPage(1);
                  }}
                  className="hover:text-[#A4423B] transition-colors"
                  aria-label="Remove in-stock filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedKeynotes.map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D2E5C9] text-[#10271D] text-xs font-semibold">
                {k}
                <button
                  onClick={() => toggleKeynote(k)}
                  className="hover:text-[#A4423B] transition-colors"
                  aria-label={`Remove ${k} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-[#263D32] uppercase tracking-wider underline underline-offset-4 ml-2 hover:text-[#10271D] transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Count & Sort Control */}
          <div className="flex items-center gap-6 ml-auto">
            <span className="text-xs text-[#424844]">
              Showing <strong className="font-semibold text-[#1A1C18]">{total}</strong> botanical offerings
            </span>

            <div className="relative flex items-center">
              <label htmlFor="sort-select" className="sr-only">Sort by</label>
              <div className="flex items-center gap-2 bg-[#EEEEE8] px-3.5 py-1.5 rounded-full border border-[#E6E1D7] cursor-pointer hover:bg-[#E5E5DE] transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#424844]" />
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs font-semibold uppercase tracking-wider text-[#1A1C18] cursor-pointer outline-none appearance-none pr-3"
                >
                  <option value="featured">Featured Harvests</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Acclaim</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body: Filter Sidebar + Product Grid */}
      <section className="max-w-[1360px] mx-auto w-full px-5 sm:px-8 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-12 items-start">
          {/* Sticky Filter Sidebar */}
          <aside className="lg:col-span-3 sticky top-28 space-y-6">
            <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E6E1D7] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D7]">
                <h3 className="font-display text-xl text-[#1A1C18] font-normal">
                  Refine Alchemy
                </h3>
                <Filter className="w-4 h-4 text-[#82947B]" />
              </div>

              {/* Price Filter Slider */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#1A1C18]">Price Range</span>
                  <span className="font-bold text-[#263D32]">₹500 – {formatCurrency(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="7000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full accent-[#263D32] bg-[#EEEEE8] h-1.5 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#727974]">
                  <span>₹500</span>
                  <span>₹7,000+</span>
                </div>
              </div>

              {/* Category Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-[#E6E1D7]">
                <span className="font-bold uppercase tracking-wider text-xs text-[#1A1C18] block">
                  Categories
                </span>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "All Harvests" },
                    { id: "hair-care", label: "Hair & Scalp Tonics" },
                    { id: "soaps", label: "Artisanal Bath Soaps" },
                    { id: "candles", label: "Soy & Clay Candles" },
                    { id: "gifting", label: "Curated Crate Sets" },
                  ].map((cat) => (
                    <label key={cat.id} className="flex items-center justify-between text-xs cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category-radio"
                          checked={effectiveCategory === cat.id}
                          onChange={() => {
                            setSelectedCategory(cat.id);
                            setPage(1);
                          }}
                          className="w-3.5 h-3.5 accent-[#263D32] cursor-pointer"
                        />
                        <span className="text-[#424844] group-hover:text-[#1A1C18] transition-colors">
                          {cat.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Botanical Keynotes */}
              <div className="space-y-2.5 pt-2 border-t border-[#E6E1D7]">
                <span className="font-bold uppercase tracking-wider text-xs text-[#1A1C18] block">
                  Botanical Keynotes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {keynoteChips.map((chip) => {
                    const isSelected = selectedKeynotes.includes(chip);
                    return (
                      <button
                        key={chip}
                        onClick={() => toggleKeynote(chip)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#263D32] text-white shadow-xs"
                            : "bg-[#F4F4ED] text-[#424844] hover:bg-[#EEEEE8]"
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stewardship Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-[#E6E1D7]">
                <span className="font-bold uppercase tracking-wider text-xs text-[#1A1C18] block">
                  Stewardship
                </span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => {
                        setInStockOnly(e.target.checked);
                        setPage(1);
                      }}
                      className="w-3.5 h-3.5 accent-[#263D32] cursor-pointer"
                    />
                    <span className="text-[#424844]">In Stock in South India Studio</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-3.5 h-3.5 accent-[#263D32] cursor-pointer"
                    />
                    <span className="text-[#424844]">100% Plastic-Free Packed</span>
                  </label>
                </div>
              </div>

              {/* Mini Environmental Note Card */}
              <div className="bg-[#82947B] p-5 rounded-2xl text-white relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8EDE4] block mb-1">
                  Cold-Pressed Ethics
                </span>
                <p className="text-xs text-white/90 leading-relaxed font-normal">
                  Every formula contains 0% synthetic fragrances, parabens, or palm wax derivatives.
                </p>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-4 border border-[#E6E1D7] animate-pulse space-y-3">
                    <div className="w-full aspect-[4/3] rounded-2xl bg-[#EEEEE8]" />
                    <div className="h-3 bg-[#EEEEE8] rounded w-1/3" />
                    <div className="h-4 bg-[#EEEEE8] rounded w-3/4" />
                    <div className="h-3 bg-[#EEEEE8] rounded w-1/2" />
                    <div className="h-8 bg-[#EEEEE8] rounded-full w-full mt-4" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="bg-white rounded-3xl p-12 border border-rose-200 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
                <h3 className="font-display text-xl text-[#1A1C18] font-bold">Catalog Unavailable</h3>
                <p className="text-xs text-[#525A55] max-w-md mx-auto">{error}</p>
                <button
                  onClick={() => setPage(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D281E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#1A4533] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Connection</span>
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="bg-white rounded-3xl p-16 border border-[#E6E1D7] text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E6E1D7] flex items-center justify-center mx-auto text-[#263D32]">
                  <Sprout className="w-7 h-7" />
                </div>
                <h3 className="font-display text-2xl text-[#1A1C18] font-normal">No Formulations Found</h3>
                <p className="text-xs sm:text-sm text-[#525A55] max-w-md mx-auto">
                  No offerings match the chosen criteria. Try adjusting your filters or resetting your search.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0D281E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#1A4533] cursor-pointer"
                >
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p, idx) => {
                    const isAdded = addedSlug === p.slug;
                    const isFav = !!wishlist[p.slug];

                    return (
                      <motion.div
                        key={p.slug}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: idx * 0.03 }}
                        className="group flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-[#E6E1D7] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#263D32]/12 hover:border-[#263D32]/50 cursor-pointer"
                      >
                        <div>
                          <div className="relative w-full aspect-[4/3] rounded-t-2xl sm:rounded-t-[2.25rem] rounded-b-xl overflow-hidden bg-[#F4F4ED] mb-3">
                            <Link href={`/products/${p.slug}`} className="block w-full h-full">
                              <img
                                src={p.featuredImage}
                                alt={p.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                                loading="lazy"
                              />
                            </Link>

                            {p.badge && (
                              <div className="absolute top-3 left-3 z-10">
                                <span className="inline-block bg-[#263D32] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
                                  {p.badge}
                                </span>
                              </div>
                            )}

                            <button
                              onClick={(e) => toggleWishlist(p.slug, e)}
                              aria-label="Add to wishlist"
                              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1A1C18] hover:bg-white transition-all duration-200 hover:scale-110 active:scale-90 shadow-sm cursor-pointer"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-[#A4423B] text-[#A4423B]" : "text-[#1A1C18]"}`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#263D32]">
                              {p.categoryLabel || p.categorySlug}
                            </span>
                            {tamilNames[p.slug] && (
                              <span className="text-[10.5px] font-medium text-[#82947B]">
                                {tamilNames[p.slug]}
                              </span>
                            )}
                          </div>

                          <Link href={`/products/${p.slug}`}>
                            <h3 className="font-display text-base text-[#1A1C18] font-medium leading-tight group-hover:text-[#263D32] transition-colors line-clamp-1 mb-1">
                              {p.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-[#424844] mb-3 line-clamp-1 leading-relaxed">
                            {p.subtitle}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-[#E6E1D7]/60 mt-auto">
                          <div className="flex items-baseline gap-2">
                            <span className="font-body text-sm sm:text-base font-bold text-[#1A1C18]">
                              {formatCurrency(p.price)}
                            </span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-xs text-[#727974] line-through">
                                {formatCurrency(p.originalPrice)}
                              </span>
                            )}
                          </div>

                          <button
                            disabled={!p.inStock || p.stockQuantity === 0}
                            onClick={(e) => handleQuickAdd(p, e)}
                            className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed ${
                              !p.inStock || p.stockQuantity === 0
                                ? "bg-neutral-300 text-neutral-600"
                                : isAdded
                                ? "bg-[#426B50] text-white scale-102"
                                : "bg-[#263D32] hover:bg-[#1A2C23] text-white hover:scale-104 active:scale-95"
                            }`}
                          >
                            {!p.inStock || p.stockQuantity === 0 ? (
                              <span>Sold Out</span>
                            ) : isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Real Server-Side Pagination Bar */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-14 pt-8 flex items-center justify-center gap-2 border-t border-[#E6E1D7]">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 h-9 rounded-full bg-[#EEEEE8] hover:bg-[#E5E5DE] text-[#1A1C18] flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-colors gap-1.5 mr-2 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        page === pNum
                          ? "bg-[#263D32] text-white shadow-xs"
                          : "bg-[#EEEEE8] hover:bg-[#E5E5DE] text-[#1A1C18]"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 h-9 rounded-full bg-[#EEEEE8] hover:bg-[#E5E5DE] text-[#1A1C18] flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-colors gap-1.5 ml-2 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand Manifesto & Stewardship Banner */}
      <section className="max-w-[1360px] mx-auto w-full px-5 sm:px-8 lg:px-12 my-12">
        <div className="bg-[#EEEEE8] rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left border border-[#E6E1D7]">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#82947B]/20 flex items-center justify-center text-[#263D32] mb-1">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-display text-lg text-[#1A1C18] font-medium">Conscious Despatch</h4>
            <p className="text-xs text-[#424844] max-w-xs leading-relaxed">
              Complimentary domestic zero-carbon transit for orders over ₹1,500 across India.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#263D32]/15 flex items-center justify-center text-[#263D32] mb-1">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-display text-lg text-[#1A1C18] font-medium">Perpetual Clay Vessels</h4>
            <p className="text-xs text-[#424844] max-w-xs leading-relaxed">
              Return candle pottery and cosmetic jars clean to any boutique stockist for harvest refill credit.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#82947B]/20 flex items-center justify-center text-[#263D32] mb-1">
              <Sprout className="w-5 h-5" />
            </div>
            <h4 className="font-display text-lg text-[#1A1C18] font-medium">Regenerative Estates</h4>
            <p className="text-xs text-[#424844] max-w-xs leading-relaxed">
              100% botanical harvest grown under natural sunlight with zero petroleum derivatives or artificial stabilizers.
            </p>
          </div>
        </div>
      </section>

      {/* Floating Animated Cart Toast */}
      <AnimatePresence>
        {toastItem && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="fixed bottom-7 right-7 z-50 flex items-center gap-3.5 bg-[#263D32] text-white px-5 py-3.5 rounded-full shadow-2xl border border-white/15"
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

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center">
          <div className="animate-pulse text-xs uppercase tracking-widest text-[#263D32] font-bold">
            Gathering Botanical Harvests...
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
