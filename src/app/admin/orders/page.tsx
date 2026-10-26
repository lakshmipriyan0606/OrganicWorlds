"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  carrier?: string | null;
  trackingNumber?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  user?: { name: string | null; email: string } | null;
  items: Array<{ id: string; productName: string; quantity: number }>;
  createdAt: string;
}

const STATUS_FILTERS = [
  { label: "All Orders", value: "ALL" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Packed", value: "PACKED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (targetPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", targetPage.toString());
      params.set("limit", "12");
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("limit", "12");
        if (statusFilter !== "ALL") params.set("status", statusFilter);

        const res = await fetch(`/api/admin/orders?${params.toString()}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setOrders(data.orders || []);
          setTotal(data.total || 0);
          setPage(data.page || 1);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch admin orders:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" />
            Shipped
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
            <Package className="w-3 h-3" />
            Delivered
          </span>
        );
      case "PROCESSING":
      case "PACKED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
            <RefreshCw className="w-3 h-3 animate-spin" />
            {status}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            {status.replace("_", " ")}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block">
            Fulfillment & Dispatches
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Apothecary Orders
          </h1>
          <p className="text-xs text-[#525A55] mt-1">
            Track real-time formulation dispatches, manage carrier logistics, and advance fulfillment stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchOrders(page)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E3DDD1] text-xs font-bold text-[#0D281E] hover:bg-[#FAF8F5] shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E3DDD1] shadow-2xs space-y-4">
        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-bold transition-all text-xs ${
                statusFilter === f.value
                  ? "bg-[#0D281E] text-white shadow-2xs"
                  : "bg-[#FAF8F5] text-[#525A55] hover:bg-[#F0ECE1] border border-[#E3DDD1]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#82947B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order number (POW-...), customer name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3DDD1] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#0D281E]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533]"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E3DDD1] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#F0ECE1] flex items-center justify-between text-xs text-[#525A55]">
          <span>
            Showing {orders.length} of {total} orders
          </span>
          <span>Page {page} of {totalPages}</span>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#82947B] animate-spin mx-auto" />
            <p className="text-xs text-[#525A55]">Retrieving sacred apothecary dispatches...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-[#82947B] mx-auto opacity-50" />
            <p className="font-display text-sm font-bold text-[#0D281E]">No orders matched criteria</p>
            <p className="text-xs text-[#525A55]">Try selecting a different status filter or clearing search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#F0ECE1] text-[10px] font-bold uppercase tracking-wider text-[#82947B]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {orders.map((o) => {
                  const customerName = o.user?.name || o.guestName || "Botanical Patron";
                  const customerEmail = o.user?.email || o.guestEmail || "—";
                  const itemCount = o.items.reduce((sum, i) => sum + i.quantity, 0);

                  return (
                    <tr key={o.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0D281E]">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#0D281E] block">{customerName}</span>
                        <span className="text-[10px] text-[#82947B] block truncate max-w-[140px]">
                          {customerEmail}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#525A55]">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(o.status)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-amber-50 text-amber-800"
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#525A55]">{itemCount} units</td>
                      <td className="py-3 px-4 font-bold text-[#0D281E]">
                        {formatCurrency(o.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F0ECE1] border border-[#E3DDD1] text-xs font-bold text-[#0D281E] shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
            <button
              onClick={() => fetchOrders(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E3DDD1] text-xs font-bold text-[#0D281E] disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <span className="text-[#525A55]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => fetchOrders(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E3DDD1] text-xs font-bold text-[#0D281E] disabled:opacity-40"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
