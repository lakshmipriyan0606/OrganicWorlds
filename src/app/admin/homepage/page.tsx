"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Layers,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { HeroCMSData, AnnouncementCMSData } from "@/types/cms";

export default function AdminHomepageCMSPage() {
  const [hero, setHero] = useState<HeroCMSData>({
    eyebrow: "PURE • BOTANICAL • HANDCRAFTED",
    title: "Nature’s Care",
    italicTitle: "for Your Skin",
    subtitle: "Organic soaps, oils and skincare crafted with traditional wisdom and the power of nature.",
    ctaPrimaryText: "Shop Organic Soaps",
    ctaPrimaryLink: "/categories/soaps",
    ctaSecondaryText: "Explore Our Oils",
    ctaSecondaryLink: "/categories/hair-care",
    imageDesktop: "/images/hero-hair-oil.jpg",
    imageAlt: "Pavishna Herbal Hair Oil pouring into carved stone mortar surrounded by fresh botanicals",
    badgeText: "100% NATURAL INGREDIENTS",
    overlayOpacity: 0,
  });

  const [announcement, setAnnouncement] = useState<AnnouncementCMSData>({
    enabled: true,
    text: "Welcome to Pavishna Organic Worlds • Complimentary botanical soap sample with orders above ₹1,499 • Free shipping across India",
    freeShippingThreshold: 1500,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function loadCMS() {
      try {
        const res = await fetch("/api/admin/homepage");
        const data = await res.json();
        if (!ignore && data.success && data.cms) {
          if (data.cms.hero) setHero(data.cms.hero);
          if (data.cms.announcement) setAnnouncement(data.cms.announcement);
        }
      } catch (err) {
        console.error("Failed to load CMS content:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadCMS();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero, announcement }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update homepage content.");
      } else {
        setSaveSuccess("Homepage content successfully published to storefront!");
        setTimeout(() => setSaveSuccess(null), 4000);
      }
    } catch (err) {
      console.error("Save error:", err);
      setErrorMessage("Network error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[#0D281E]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Loading Homepage CMS Content...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1560px] mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
            Dynamic Storefront CMS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Homepage Hero & Announcement Editor
          </h1>
          <p className="text-xs text-[#525A55] mt-1">
            Update hero visuals, headlines, CTAs, and announcement banners without deploying code
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              setRefreshKey((k) => k + 1);
            }}
            className="p-2.5 rounded-full bg-white border border-[#DCE3DB] text-[#0D281E] hover:bg-[#FAFBF9] cursor-pointer"
            title="Reload content"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-transform hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Announcement Bar Settings */}
          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#82947B]" />
                <h3 className="font-display text-sm font-bold text-[#0D281E]">
                  Announcement Banner Ticker
                </h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#10281D]">
                <input
                  type="checkbox"
                  checked={announcement.enabled}
                  onChange={(e) =>
                    setAnnouncement((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-[#0D281E] focus:ring-[#0D281E]"
                />
                <span>Active</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                Banner Message Text
              </label>
              <textarea
                rows={2}
                value={announcement.text}
                onChange={(e) =>
                  setAnnouncement((prev) => ({ ...prev, text: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                placeholder="Enter store announcement text..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={announcement.freeShippingThreshold || 1500}
                onChange={(e) =>
                  setAnnouncement((prev) => ({
                    ...prev,
                    freeShippingThreshold: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
              />
            </div>
          </div>

          {/* Hero Section Copy & Badges */}
          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0ECE1]">
              <Layers className="w-4 h-4 text-[#82947B]" />
              <h3 className="font-display text-sm font-bold text-[#0D281E]">
                Hero Copy & Typography
              </h3>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                Eyebrow Subhead
              </label>
              <input
                type="text"
                value={hero.eyebrow || ""}
                onChange={(e) => setHero((prev) => ({ ...prev, eyebrow: e.target.value }))}
                className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  value={hero.title || ""}
                  onChange={(e) => setHero((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  Italic Accent Title
                </label>
                <input
                  type="text"
                  value={hero.italicTitle || ""}
                  onChange={(e) => setHero((prev) => ({ ...prev, italicTitle: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                Editorial Subtitle
              </label>
              <textarea
                rows={3}
                value={hero.subtitle || ""}
                onChange={(e) => setHero((prev) => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                Circular Rotating Badge Text
              </label>
              <input
                type="text"
                value={hero.badgeText || ""}
                onChange={(e) => setHero((prev) => ({ ...prev, badgeText: e.target.value }))}
                className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
              />
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-4">
            <h3 className="font-display text-sm font-bold text-[#0D281E] pb-3 border-b border-[#F0ECE1]">
              Call-to-Action Destinations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  value={hero.ctaPrimaryText || ""}
                  onChange={(e) =>
                    setHero((prev) => ({ ...prev, ctaPrimaryText: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  Primary CTA Link
                </label>
                <input
                  type="text"
                  value={hero.ctaPrimaryLink || ""}
                  onChange={(e) =>
                    setHero((prev) => ({ ...prev, ctaPrimaryLink: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  Secondary CTA Label
                </label>
                <input
                  type="text"
                  value={hero.ctaSecondaryText || ""}
                  onChange={(e) =>
                    setHero((prev) => ({ ...prev, ctaSecondaryText: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  Secondary CTA Link
                </label>
                <input
                  type="text"
                  value={hero.ctaSecondaryLink || ""}
                  onChange={(e) =>
                    setHero((prev) => ({ ...prev, ctaSecondaryLink: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                />
              </div>
            </div>
          </div>

          {/* Hero Imagery Settings */}
          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0ECE1]">
              <ImageIcon className="w-4 h-4 text-[#82947B]" />
              <h3 className="font-display text-sm font-bold text-[#0D281E]">
                Hero Visual Asset
              </h3>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                Image URL (or select from Media Library)
              </label>
              <input
                type="text"
                value={hero.imageDesktop || ""}
                onChange={(e) => setHero((prev) => ({ ...prev, imageDesktop: e.target.value }))}
                className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                placeholder="/images/hero-hair-oil.jpg or /uploads/..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                Image Alt Text
              </label>
              <input
                type="text"
                value={hero.imageAlt || ""}
                onChange={(e) => setHero((prev) => ({ ...prev, imageAlt: e.target.value }))}
                className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                <span>Dark Overlay Opacity</span>
                <span>{hero.overlayOpacity || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                step="5"
                value={hero.overlayOpacity || 0}
                onChange={(e) =>
                  setHero((prev) => ({
                    ...prev,
                    overlayOpacity: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-[#0D281E]"
              />
            </div>
          </div>
        </div>

        {/* Right Live Preview Canvas (7 cols) */}
        <div className="xl:col-span-7 sticky top-8 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#82947B] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Real-Time Storefront Preview</span>
            </span>
            <span className="text-[11px] text-[#525A55] bg-white px-3 py-1 rounded-full border border-[#DCE3DB]">
              WYSIWYG Simulation
            </span>
          </div>

          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E3DDD1] shadow-md overflow-hidden">
            {/* Announcement Bar Preview */}
            {announcement.enabled && (
              <div className="bg-[#0D281E] text-white py-2 px-4 text-center text-[10px] font-medium border-b border-[#1A382B]">
                <span>{announcement.text}</span>
              </div>
            )}

            {/* Simulated Hero Scene */}
            <div className="p-6 sm:p-10 relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left Text */}
                <div className="md:col-span-7 space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3A4A40]">
                    {hero.eyebrow}
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl text-[#0D281E] leading-tight">
                    {hero.title} <br />
                    <span className="italic text-[#1A4533]">{hero.italicTitle}</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#455048] leading-relaxed line-clamp-3">
                    {hero.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="px-5 py-2.5 rounded-full bg-[#0D281E] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <span>{hero.ctaPrimaryText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="px-5 py-2.5 rounded-full border border-[#0D281E]/40 text-[#0D281E] text-[11px] font-semibold uppercase tracking-wider">
                      {hero.ctaSecondaryText}
                    </span>
                  </div>
                </div>

                {/* Right Image */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden shadow-lg border border-[#E2DDD2] bg-[#F5F1E8]">
                    <img
                      src={hero.imageDesktop || "/images/hero-hair-oil.jpg"}
                      alt={hero.imageAlt || "Hero visual"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/hero-hair-oil.jpg";
                      }}
                    />
                    {/* Dark Overlay */}
                    {hero.overlayOpacity ? (
                      <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: (hero.overlayOpacity || 0) / 100 }}
                      />
                    ) : null}

                    {/* Rotating Stamp Simulation */}
                    <div className="absolute top-3 right-3 w-16 h-16 rounded-full bg-white/90 backdrop-blur-xs p-1 shadow border border-[#0D281E]/15 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-[#0D281E]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Strip Simulation */}
              <div className="mt-8 pt-4 border-t border-[#EAE3D6] grid grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#0D281E]/8 flex items-center justify-center text-[#0D281E]">
                    <Leaf className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-[#0D281E]">100% Natural</h5>
                    <p className="text-[9px] text-[#55635B]">Botanical Origins</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#0D281E]/8 flex items-center justify-center text-[#0D281E]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-[#0D281E]">Zero Toxins</h5>
                    <p className="text-[9px] text-[#55635B]">No Parabens or SLS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
