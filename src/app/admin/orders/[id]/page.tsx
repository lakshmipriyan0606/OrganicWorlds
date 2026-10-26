"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  ShoppingBag,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Send,
} from "lucide-react";

interface OrderDetail {
  id: string;
  orderNumber: string;
  trackingToken: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  shippingAddress: string;
  notes?: string | null;
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  user?: { name: string | null; email: string; phone?: string | null } | null;
  items: Array<{
    id: string;
    productName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    featuredImage?: string | null;
  }>;
  payments: Array<{
    id: string;
    gateway: string;
    gatewayOrderId?: string | null;
    gatewayPaymentId?: string | null;
    status: string;
    amount: number;
    createdAt: string;
  }>;
}

const CARRIER_OPTIONS = [
  "Delhivery",
  "BlueDart",
  "India Post",
  "DTDC",
  "Shadowfax",
  "Custom / Courier Partner",
];

const STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING_PAYMENT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [selectedStatus, setSelectedStatus] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  const loadOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setSelectedStatus(data.order.status);
        setCarrier(data.order.carrier || "");
        setTrackingNumber(data.order.trackingNumber || "");
        setTrackingUrl(data.order.trackingUrl || "");
      } else {
        setErrorMsg("Failed to load order details.");
      }
    } catch (err) {
      console.error("Order load error:", err);
      setErrorMsg("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setOrder(data.order);
          setSelectedStatus(data.order.status);
          setCarrier(data.order.carrier || "");
          setTrackingNumber(data.order.trackingNumber || "");
          setTrackingUrl(data.order.trackingUrl || "");
        } else if (!ignore) {
          setErrorMsg("Failed to load order details.");
        }
      } catch (err) {
        console.error("Order load error:", err);
        if (!ignore) setErrorMsg("Network error occurred.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          carrier: carrier.trim() || undefined,
          trackingNumber: trackingNumber.trim() || undefined,
          trackingUrl: trackingUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Update failed.");
      } else {
        setSuccessMsg(`Order updated successfully to ${selectedStatus}.`);
        setOrder(data.order);
      }
    } catch (err) {
      console.error("Order update error:", err);
      setErrorMsg("Failed to update order.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#82947B] animate-spin mx-auto" />
        <p className="text-xs text-[#525A55]">Retrieving order specifications...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="font-display text-xl font-bold text-[#0D281E]">Order Not Found</h2>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D281E] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  let shippingAddressParsed: Record<string, string> = {};
  try {
    shippingAddressParsed = JSON.parse(order.shippingAddress);
  } catch {
    // fallback
  }

  const customerName = order.user?.name || order.guestName || "Botanical Patron";
  const customerEmail = order.user?.email || order.guestEmail || "—";
  const customerPhone = order.user?.phone || order.guestPhone || shippingAddressParsed.phone || "—";

  const availableNextStatuses = STATUS_TRANSITIONS[order.status] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#82947B] hover:text-[#0D281E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders List</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
              {order.orderNumber}
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              {order.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-[#525A55]">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/track/${order.trackingToken}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E3DDD1] text-xs font-bold text-[#0D281E] hover:bg-[#FAF8F5] shadow-2xs"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Public Tracking View</span>
            <ExternalLink className="w-3 h-3 text-[#82947B]" />
          </Link>
        </div>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items & Customer Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line Items Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-4">
            <h3 className="font-display text-sm font-bold text-[#0D281E] pb-3 border-b border-[#F0ECE1] flex items-center justify-between">
              <span>Formulation Line Items ({order.items.length})</span>
              <span className="text-xs text-[#82947B] font-mono">Immutable Snapshots</span>
            </h3>

            <div className="divide-y divide-[#F0ECE1]">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FAFBF9] border border-[#E3DDD1] overflow-hidden shrink-0 flex items-center justify-center">
                      {item.featuredImage ? (
                        <img
                          src={item.featuredImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-[#82947B]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D281E]">{item.productName}</h4>
                      <span className="text-[10px] text-[#82947B]">
                        SKU: {item.sku} • Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#0D281E]">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="pt-4 border-t border-[#F0ECE1] space-y-2 text-xs">
              <div className="flex justify-between text-[#525A55]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#0D281E]">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#525A55]">
                <span>Shipping Fee</span>
                <span className="font-semibold text-[#0D281E]">
                  {order.shippingAmount === 0 ? "FREE" : formatCurrency(order.shippingAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#F0ECE1] text-sm">
                <span className="font-display font-bold text-[#0D281E]">Grand Total</span>
                <span className="font-display text-lg font-bold text-[#0D281E]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Destination & Customer Info Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE1]">
                <MapPin className="w-4 h-4 text-[#0D281E]" />
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0D281E]">
                  Delivery Sanctum
                </h4>
              </div>
              <p className="text-xs text-[#525A55] leading-relaxed">
                <strong className="text-[#0D281E]">{shippingAddressParsed.fullName || customerName}</strong>
                <br />
                {shippingAddressParsed.addressLine1 || shippingAddressParsed.street}
                {shippingAddressParsed.addressLine2 && `, ${shippingAddressParsed.addressLine2}`}
                <br />
                {shippingAddressParsed.city}, {shippingAddressParsed.state} — {shippingAddressParsed.postalCode}
                <br />
                Phone: {shippingAddressParsed.phone || customerPhone}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE1]">
                <CreditCard className="w-4 h-4 text-[#0D281E]" />
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0D281E]">
                  Payment Protocol
                </h4>
              </div>
              <div className="text-xs text-[#525A55] space-y-1">
                <div>
                  <span className="text-[#82947B]">Status: </span>
                  <strong className="text-[#0D281E]">{order.paymentStatus}</strong>
                </div>
                {order.payments[0] && (
                  <>
                    <div>
                      <span className="text-[#82947B]">Gateway: </span>
                      <span className="font-mono">{order.payments[0].gateway}</span>
                    </div>
                    {order.payments[0].gatewayPaymentId && (
                      <div>
                        <span className="text-[#82947B]">Txn ID: </span>
                        <span className="font-mono text-[11px] block truncate">
                          {order.payments[0].gatewayPaymentId}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fulfillment State Machine Form (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0ECE1]">
              <Truck className="w-4 h-4 text-[#0D281E]" />
              <h3 className="font-display text-sm font-bold text-[#0D281E]">
                Fulfillment Controls
              </h3>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              {/* Status Select */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  Advance Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3DDD1] bg-[#FAF8F5] text-xs font-semibold focus:outline-none focus:border-[#0D281E]"
                >
                  <option value={order.status}>Current: {order.status}</option>
                  {availableNextStatuses.map((s) => (
                    <option key={s} value={s}>
                      Advance to: {s}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#82947B] mt-1">
                  Enforces strict fulfillment state machine rules.
                </p>
              </div>

              {/* Carrier Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  Courier Partner
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3DDD1] bg-[#FAF8F5] text-xs font-semibold focus:outline-none focus:border-[#0D281E]"
                >
                  <option value="">Select Carrier Partner...</option>
                  {CARRIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tracking Number / AWB */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  AWB / Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. DEL-88991200 or BLU-99210"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3DDD1] bg-[#FAF8F5] text-xs font-mono focus:outline-none focus:border-[#0D281E]"
                />
              </div>

              {/* Tracking URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                  Live Tracking URL
                </label>
                <input
                  type="url"
                  placeholder="Auto-generated if left blank"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3DDD1] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#0D281E]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3 rounded-full bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533] disabled:opacity-50 shadow-2xs flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Save & Advance Fulfillment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
