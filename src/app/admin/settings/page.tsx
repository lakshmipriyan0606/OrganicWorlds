"use client";

import React, { useState } from "react";
import { Settings, ShieldCheck, CreditCard, Truck, Database, Globe, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1440px] mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
            Store Governance
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Apothecary & Store Settings
          </h1>
          <p className="text-xs text-[#525A55] mt-1">
            Configure commerce rules, shipping limits, gateway parameters, and platform metadata
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Store settings successfully updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* General Store Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#ECE7DC]">
            <Globe className="w-4 h-4 text-emerald-800" />
            <h3 className="font-display text-base font-bold text-[#0D281E]">
              Brand Identity & Regional Currency
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block uppercase font-bold text-[#263D32] mb-1">Store Name</label>
              <input
                type="text"
                disabled
                defaultValue="Pavishna Organic Worlds"
                className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-semibold text-[#0D281E] opacity-90 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-[#263D32] mb-1">Currency Code</label>
              <input
                type="text"
                disabled
                defaultValue="INR (₹ Indian Rupee)"
                className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-semibold text-[#0D281E] opacity-90 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#ECE7DC]">
            <Truck className="w-4 h-4 text-emerald-800" />
            <h3 className="font-display text-base font-bold text-[#0D281E]">
              Shipping & Fulfilment Rates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block uppercase font-bold text-[#263D32] mb-1">
                Free Shipping Threshold (INR ₹)
              </label>
              <input
                type="number"
                defaultValue={1500}
                className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-bold text-[#0D281E] focus:outline-none focus:border-[#0D281E]"
              />
              <p className="text-[11px] text-[#6E7B73] mt-1">
                Orders equal or exceeding this subtotal qualify for complimentary dispatch
              </p>
            </div>

            <div>
              <label className="block uppercase font-bold text-[#263D32] mb-1">
                Standard Shipping Fee (INR ₹)
              </label>
              <input
                type="number"
                defaultValue={99}
                className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-bold text-[#0D281E] focus:outline-none focus:border-[#0D281E]"
              />
              <p className="text-[11px] text-[#6E7B73] mt-1">
                Applied to orders below the free shipping threshold across India
              </p>
            </div>
          </div>
        </div>

        {/* Payment Gateway Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#ECE7DC]">
            <CreditCard className="w-4 h-4 text-emerald-800" />
            <h3 className="font-display text-base font-bold text-[#0D281E]">
              Payment Gateway Integration (Razorpay India)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-950 block text-xs">
                  Razorpay India Gateway Engine
                </span>
                <span className="text-[11px] text-emerald-800">
                  Ready for UPI, RuPay, Netbanking, and Cards
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px] uppercase tracking-wider">
                Active Test Mode
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-[11px] uppercase font-bold text-[#6E7B73] block mb-1">
                  Razorpay Key ID
                </span>
                <span className="font-mono text-xs text-[#0D281E] bg-[#FAFBF9] p-2 rounded-lg border border-[#DCE3DB] block truncate">
                  rzp_test_placeholder_key
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-[#6E7B73] block mb-1">
                  Server Webhook Endpoint
                </span>
                <span className="font-mono text-xs text-[#0D281E] bg-[#FAFBF9] p-2 rounded-lg border border-[#DCE3DB] block truncate">
                  /api/webhooks/razorpay
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Infrastructure */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#ECE7DC]">
            <Database className="w-4 h-4 text-emerald-800" />
            <h3 className="font-display text-base font-bold text-[#0D281E]">
              Data Layer & Database Infrastructure
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#525A55]">
            <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3DB]">
              <span className="text-[10px] uppercase font-bold text-[#82947B] block mb-0.5">ORM</span>
              <span className="font-mono text-[#0D281E] font-bold">Prisma ORM 6.19.3</span>
            </div>
            <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3DB]">
              <span className="text-[10px] uppercase font-bold text-[#82947B] block mb-0.5">Storage Driver</span>
              <span className="font-mono text-[#0D281E] font-bold">SQLite (dev.db) / Postgres Ready</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3 rounded-full bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533] cursor-pointer shadow-md hover:shadow-lg transition-transform hover:scale-102"
        >
          Save Store Settings
        </button>
      </form>
    </div>
  );
}
