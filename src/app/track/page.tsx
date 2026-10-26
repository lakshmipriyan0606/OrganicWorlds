"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck, Search, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

export default function TrackOrderSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/track/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order not found.");
        setLoading(false);
        return;
      }

      router.push(`/track/${data.trackingToken}`);
    } catch (err) {
      console.error("Lookup network error:", err);
      setError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#0D281E]/8 border border-[#0D281E]/15 flex items-center justify-center mx-auto text-[#0D281E]">
            <Truck className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block">
            Apothecary Dispatch Portal
          </span>
          <h1 className="font-display text-3xl font-bold text-[#0D281E]">
            Track Your Botanical Order
          </h1>
          <p className="text-xs text-[#525A55] max-w-sm mx-auto leading-relaxed">
            Enter your order number or tracking token to inspect your formulation curing, packaging, and carrier dispatch status.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-md space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-2">
                Order Identifier
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#82947B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. POW-2026-1001 or Tracking Token"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E3DDD1] bg-[#FAF8F5] text-xs font-mono focus:outline-none focus:border-[#0D281E]"
                  required
                />
              </div>
              <p className="text-[10px] text-[#82947B] mt-1.5">
                Found on your order confirmation screen and receipt email.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full py-3 rounded-full bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533] disabled:opacity-50 transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Track Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#F0ECE1] text-center space-y-2">
            <p className="text-xs text-[#525A55]">
              Have a customer account?
            </p>
            <div className="flex justify-center gap-4 text-xs font-bold">
              <Link
                href="/login"
                className="text-[#0D281E] hover:underline"
              >
                Sign In to View All Orders
              </Link>
              <span className="text-[#82947B]">|</span>
              <Link
                href="/account"
                className="text-[#0D281E] hover:underline"
              >
                Go to Sanctuary
              </Link>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#82947B]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0D281E]" />
          <span>Real-time dispatch tracking across all carrier partners</span>
        </div>
      </div>
    </div>
  );
}
