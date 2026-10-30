"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Truck,
  Database,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";
import { StoreSettings, DEFAULT_SETTINGS } from "@/lib/services/settings-service";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) {
        throw new Error(`Failed to load settings (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to load store settings:", err);
      setError("Failed to load settings from server. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualReload = () => {
    setLoading(true);
    fetchSettings();
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!ignore && data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load store settings:", err);
          setError("Failed to load settings from server. Check console for details.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (field: keyof StoreSettings, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to persist store settings");
      }

      setSettings(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error("Settings save error:", err);
      setError(err instanceof Error ? err.message : "Error saving settings");
    } finally {
      setSaving(false);
    }
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

        <button
          onClick={handleManualReload}
          disabled={loading || saving}
          className="p-2.5 rounded-full bg-white border border-[#DCE3DB] text-[#0D281E] hover:bg-[#FAFBF9] self-start sm:self-auto cursor-pointer shadow-2xs disabled:opacity-50"
          title="Reload settings from database"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Store settings successfully updated and persisted to database.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} data-loaded={!loading} className="space-y-6 max-w-4xl">
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
              <label htmlFor="store-name" className="block uppercase font-bold text-[#263D32] mb-1">Store Name</label>
              <input
                id="store-name"
                type="text"
                value={settings.storeName}
                onChange={(e) => handleChange("storeName", e.target.value)}
                disabled={loading}
                className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-semibold text-[#0D281E] focus:outline-none focus:border-[#0D281E]"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-[#263D32] mb-1">Currency Code</label>
              <input
                type="text"
                value={settings.currencyCode}
                onChange={(e) => handleChange("currencyCode", e.target.value)}
                disabled={loading}
                className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-semibold text-[#0D281E] focus:outline-none focus:border-[#0D281E]"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-[#263D32] mb-1">
                Support / Concierge Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  disabled={loading}
                  className="w-full pl-8 pr-3 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#0D281E] focus:outline-none focus:border-[#0D281E]"
                />
                <Mail className="w-3.5 h-3.5 text-[#82947B] absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block uppercase font-bold text-[#263D32] mb-1">
                Support Phone / WhatsApp
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => handleChange("supportPhone", e.target.value)}
                  disabled={loading}
                  className="w-full pl-8 pr-3 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#0D281E] focus:outline-none focus:border-[#0D281E]"
                />
                <Phone className="w-3.5 h-3.5 text-[#82947B] absolute left-2.5 top-3" />
              </div>
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
              <label htmlFor="free-shipping-threshold" className="block uppercase font-bold text-[#263D32] mb-1">
                Free Shipping Threshold (INR ₹)
              </label>
              <input
                id="free-shipping-threshold"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange("freeShippingThreshold", Number(e.target.value))}
                disabled={loading}
                min={0}
                className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-bold text-[#0D281E] focus:outline-none focus:border-[#0D281E]"
              />
              <p className="text-[11px] text-[#6E7B73] mt-1">
                Orders equal or exceeding this subtotal qualify for complimentary dispatch
              </p>
            </div>

            <div>
              <label htmlFor="standard-shipping-fee" className="block uppercase font-bold text-[#263D32] mb-1">
                Standard Shipping Fee (INR ₹)
              </label>
              <input
                id="standard-shipping-fee"
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => handleChange("standardShippingFee", Number(e.target.value))}
                disabled={loading}
                min={0}
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
                <label className="text-[11px] uppercase font-bold text-[#6E7B73] block mb-1">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  value={settings.razorpayKeyId}
                  onChange={(e) => handleChange("razorpayKeyId", e.target.value)}
                  disabled={loading}
                  className="font-mono text-xs text-[#0D281E] bg-[#FAFBF9] p-2 rounded-lg border border-[#DCE3DB] w-full"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase font-bold text-[#6E7B73] block mb-1">
                  Server Webhook Endpoint
                </label>
                <input
                  type="text"
                  value={settings.webhookEndpoint}
                  onChange={(e) => handleChange("webhookEndpoint", e.target.value)}
                  disabled={loading}
                  className="font-mono text-xs text-[#0D281E] bg-[#FAFBF9] p-2 rounded-lg border border-[#DCE3DB] w-full"
                />
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
          disabled={loading || saving}
          className="px-8 py-3 rounded-full bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533] cursor-pointer shadow-md hover:shadow-lg transition-transform hover:scale-102 disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save Store Settings"}
        </button>
      </form>
    </div>
  );
}
