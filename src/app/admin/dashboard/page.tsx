"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Plus,
  ArrowRight,
  Boxes,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MetricsData {
  totalProducts: number;
  publishedProducts: number;
  outOfStockCount: number;
  lowStockCount: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

interface LowStockItem {
  id: string;
  title: string;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  price: number;
  featuredImage: string;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [lowStockList, setLowStockList] = useState<LowStockItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/metrics");
        const data = await res.json();
        if (!ignore && data.success) {
          setMetrics(data.metrics);
          setLowStockList(data.lowStockProducts || []);
          setRecentOrders(data.recentOrders || []);
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
            Store Overview
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Apothecary Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              setRefreshKey((k) => k + 1);
            }}
            className="p-2.5 rounded-full bg-white border border-[#DCE3DB] text-[#0D281E] hover:bg-[#FAFBF9] transition-all cursor-pointer shadow-2xs"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/products/new"
            className="px-5 py-2.5 rounded-full bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-transform hover:scale-102"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl bg-white border border-[#E3DDD1] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#82947B] mb-3">
            <span className="text-xs uppercase font-bold tracking-wider">Verified Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-[#0D281E]">
              {loading ? "..." : formatCurrency(metrics?.totalRevenue || 0)}
            </div>
            <p className="text-[11px] text-[#525A55] mt-1">From captured, verified orders</p>
          </div>
        </div>

        {/* Orders Placed */}
        <div className="p-6 rounded-2xl bg-white border border-[#E3DDD1] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#82947B] mb-3">
            <span className="text-xs uppercase font-bold tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-[#0D281E]">
              {loading ? "..." : metrics?.totalOrders || 0}
            </div>
            <p className="text-[11px] text-[#525A55] mt-1">
              {metrics?.processingOrders || 0} in packing • {metrics?.shippedOrders || 0} in transit
            </p>
          </div>
        </div>

        {/* Live Catalog */}
        <div className="p-6 rounded-2xl bg-white border border-[#E3DDD1] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#82947B] mb-3">
            <span className="text-xs uppercase font-bold tracking-wider">Active Products</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-[#0D281E]">
              {loading ? "..." : metrics?.publishedProducts || 0}
            </div>
            <p className="text-[11px] text-[#525A55] mt-1">
              Of {metrics?.totalProducts || 0} catalog formulations
            </p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 rounded-2xl bg-white border border-[#E3DDD1] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#82947B] mb-3">
            <span className="text-xs uppercase font-bold tracking-wider">Stock Alerts</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              (metrics?.outOfStockCount || 0) > 0 ? "bg-rose-100 text-rose-700" : "bg-amber-50 text-amber-800"
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-[#0D281E]">
              {loading ? "..." : metrics?.outOfStockCount || 0}
            </div>
            <p className="text-[11px] text-[#525A55] mt-1">
              Out of stock • {metrics?.lowStockCount || 0} running low
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Low Stock Watchlist & Operational Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Low Stock Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#E3DDD1] shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0D281E]">
                Inventory Attention Watchlist
              </h2>
              <p className="text-xs text-[#525A55]">
                Formulations near or below minimum batch curing threshold
              </p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-[#0D281E] hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {lowStockList.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6E7B73] bg-[#FAFBF9] rounded-2xl border border-dashed border-[#DCE3DB]">
              <Boxes className="w-8 h-8 text-emerald-600/40 mx-auto mb-2" />
              <span>All botanical formulations are adequately stocked.</span>
            </div>
          ) : (
            <div className="divide-y divide-[#ECE7DC] overflow-x-auto">
              {lowStockList.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover bg-ivory-100 border border-[#DCE3DB] shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#0D281E] truncate">{item.title}</h4>
                      <p className="text-[11px] font-mono text-[#6E7B73]">SKU: {item.sku}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.stockQuantity === 0
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {item.stockQuantity} units left
                    </span>
                    <Link
                      href={`/admin/products/${item.id}`}
                      className="text-xs font-semibold text-[#1E4D38] hover:underline"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Operations Hub */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0D281E] text-white rounded-3xl p-6 sm:p-7 shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#86B398] block mb-1">
              Apothecary Modules
            </span>
            <h3 className="font-display text-xl font-bold mb-4">Quick Navigation</h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link
                href="/admin/products"
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 transition-all flex flex-col justify-between"
              >
                <Package className="w-5 h-5 text-emerald-400 mb-2" />
                <span className="font-bold">Catalog CRUD</span>
                <span className="text-[10px] text-[#B4C7BD]">Manage formulations</span>
              </Link>
              <Link
                href="/admin/categories"
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 transition-all flex flex-col justify-between"
              >
                <Boxes className="w-5 h-5 text-emerald-400 mb-2" />
                <span className="font-bold">Categories</span>
                <span className="text-[10px] text-[#B4C7BD]">Soaps, Oils, Gifts</span>
              </Link>
              <Link
                href="/admin/homepage"
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 transition-all flex flex-col justify-between"
              >
                <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
                <span className="font-bold">Hero CMS</span>
                <span className="text-[10px] text-[#B4C7BD]">Edit visuals & copy</span>
              </Link>
              <Link
                href="/admin/orders"
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 transition-all flex flex-col justify-between"
              >
                <ShoppingBag className="w-5 h-5 text-emerald-400 mb-2" />
                <span className="font-bold">Orders</span>
                <span className="text-[10px] text-[#B4C7BD]">Fulfillment & AWB</span>
              </Link>
            </div>
          </div>

          {/* Seed State Notification Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs">
            <h4 className="text-xs uppercase font-bold text-[#82947B] tracking-wider mb-2">
              System Environment
            </h4>
            <div className="space-y-2 text-xs text-[#525A55]">
              <div className="flex justify-between py-1 border-b border-[#ECE7DC]">
                <span>Database</span>
                <span className="font-mono font-bold text-[#0D281E]">SQLite (dev.db)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#ECE7DC]">
                <span>Seeded Products</span>
                <span className="font-mono font-bold text-[#0D281E]">19 formulations</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#ECE7DC]">
                <span>Auth System</span>
                <span className="font-mono font-bold text-[#0D281E]">JWT HTTP-Only Cookie</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Free Shipping Limit</span>
                <span className="font-mono font-bold text-emerald-800">₹1,500</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
