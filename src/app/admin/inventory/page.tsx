"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InventoryProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  inStock: boolean;
  featuredImage: string;
  categoryLabel?: string;
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [adjustModalProduct, setAdjustModalProduct] = useState<InventoryProduct | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<"add" | "deduct">("add");
  const [adjustReason, setAdjustReason] = useState("RESTOCK");
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/products?limit=100");
        const data = await res.json();
        if (!ignore && data.success) {
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error("Inventory fetch error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct) return;

    setSubmitting(true);
    const finalDelta = adjustType === "add" ? Math.abs(adjustDelta) : -Math.abs(adjustDelta);

    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: adjustModalProduct.id,
          delta: finalDelta,
          reason: adjustReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess(
          `Stock for '${adjustModalProduct.title}' adjusted by ${finalDelta > 0 ? `+${finalDelta}` : finalDelta}. New stock: ${data.stockQuantity}`
        );
        setTimeout(() => setActionSuccess(null), 4000);
        setAdjustModalProduct(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (e) {
      console.error("Stock adjustment failed:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "low") {
      return p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0;
    }
    if (filter === "out") {
      return p.stockQuantity === 0;
    }
    return true;
  });

  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1440px] mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
            Stock Governance & Batch Invariants
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Inventory & Warehouse Control
          </h1>
          <p className="text-xs text-[#525A55] mt-1">
            Real-time batch stock tracking, threshold warnings, and atomic stock adjustments
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setRefreshKey((k) => k + 1);
          }}
          className="p-2.5 rounded-full bg-white border border-[#DCE3DB] text-[#0D281E] hover:bg-[#FAFBF9] self-start sm:self-auto cursor-pointer"
          title="Refresh inventory"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3DDD1] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#82947B] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search formulation or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
              filter === "all" ? "bg-[#0D281E] text-white" : "bg-[#FAFBF9] text-[#525A55] hover:bg-[#F0EFEA]"
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilter("low")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
              filter === "low" ? "bg-amber-800 text-white" : "bg-[#FAFBF9] text-amber-800 hover:bg-[#F0EFEA]"
            }`}
          >
            Low Stock ({products.filter((p) => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0).length})
          </button>
          <button
            onClick={() => setFilter("out")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
              filter === "out" ? "bg-rose-800 text-white" : "bg-[#FAFBF9] text-rose-800 hover:bg-[#F0EFEA]"
            }`}
          >
            Out of Stock ({products.filter((p) => p.stockQuantity === 0).length})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#E3DDD1] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF9] border-b border-[#E3DDD1] text-[#82947B] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Formulation</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Available Stock</th>
                <th className="py-3.5 px-4">Threshold</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE7DC]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#525A55]">
                    Loading warehouse stock...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#525A55]">
                    No formulations match the stock filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFBF9]/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.featuredImage}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover bg-ivory-100 border border-[#DCE3DB] shrink-0"
                        />
                        <div>
                          <span className="font-bold text-[#0D281E] block">{p.title}</span>
                          <span className="text-[11px] text-[#6E7B73]">{p.categoryLabel || "Artisanal"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-[#6E7B73]">{p.sku}</td>

                    <td className="py-4 px-4 font-semibold text-[#0D281E]">{formatCurrency(p.price)}</td>

                    <td className="py-4 px-4">
                      <span className="font-mono text-sm font-bold text-[#0D281E]">
                        {p.stockQuantity} units
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#6E7B73]">
                      ≤ {p.lowStockThreshold} units
                    </td>

                    <td className="py-4 px-4">
                      {p.stockQuantity === 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </span>
                      ) : p.stockQuantity <= p.lowStockThreshold ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Stock Alert</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>In Stock</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setAdjustModalProduct(p);
                          setAdjustDelta(20);
                          setAdjustType("add");
                          setAdjustReason("RESTOCK");
                        }}
                        className="px-3 py-1.5 rounded-full border border-[#DCE3DB] hover:bg-[#0D281E] hover:text-white text-xs font-semibold text-[#0D281E] transition-colors cursor-pointer"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#DCE3DB] shadow-2xl">
            <h3 className="font-display text-xl font-bold text-[#0D281E] mb-1">
              Adjust Inventory Stock
            </h3>
            <p className="text-xs text-[#525A55] mb-5">
              Updating stock for <strong className="text-[#0D281E]">{adjustModalProduct.title}</strong> (Current: {adjustModalProduct.stockQuantity} units)
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
                  Adjustment Operation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdjustType("add")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      adjustType === "add"
                        ? "bg-emerald-900 text-white border-emerald-900"
                        : "bg-[#FAFBF9] text-[#263D32] border-[#DCE3DB]"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Restock / Add (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType("deduct")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      adjustType === "deduct"
                        ? "bg-rose-900 text-white border-rose-900"
                        : "bg-[#FAFBF9] text-[#263D32] border-[#DCE3DB]"
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Deduct / Damage (-)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#263D32] mb-1">
                  Quantity Units
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-[#0D281E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#263D32] mb-1">
                  Reason for Adjustment
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
                >
                  <option value="RESTOCK">Batch Restock from Curing Studio</option>
                  <option value="MANUAL_CORRECTION">Manual Inventory Audit Count</option>
                  <option value="DAMAGED_VESSEL">Damaged / Broken Packaging</option>
                  <option value="RETURN_RESTOCK">Customer Return Restock</option>
                  <option value="PRESS_GIFTING">PR / Gifting Sample Allocation</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ECE7DC]">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="px-5 py-2 rounded-full border border-[#DCE3DB] text-xs font-semibold text-[#525A55] hover:bg-[#FAFBF9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-full bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533] cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Applying..." : "Confirm Stock Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
