import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

export const instant = false;

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payments: true,
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  let shippingAddress: {
    fullName?: string;
    street?: string;
    apartment?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    phone?: string;
  } = {};

  try {
    shippingAddress = JSON.parse(order.shippingAddress);
  } catch {
    // fallback
  }

  const isConfirmed = order.status === "CONFIRMED";
  const customerDisplayName = order.user?.name || order.guestName || "Botanical Patron";

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-white rounded-3xl p-8 border border-[#E3DDD1] shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block">
            Apothecary Dispatch Order Placed
          </span>

          <h1 className="font-display text-3xl font-bold text-[#0D281E]">
            Thank You, {customerDisplayName}
          </h1>

          <p className="text-xs text-[#525A55] max-w-md mx-auto">
            Your sacred order has been securely reserved in our Tamil Nadu workshop. Order{" "}
            <span className="font-mono font-bold text-[#0D281E]">{order.orderNumber}</span>.
          </p>

          <div className="pt-2 flex justify-center">
            {order.status === "CONFIRMED" ? (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status: Confirmed & Paid</span>
              </span>
            ) : (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Status: {order.status.replace("_", " ")}</span>
              </span>
            )}
          </div>
        </div>

        {/* Order Details & Items Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-6">
          <h3 className="font-display text-sm font-bold text-[#0D281E] pb-3 border-b border-[#F0ECE1]">
            Reserved Items ({order.items.length})
          </h3>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
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

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-[#F0ECE1] space-y-2 text-xs">
            <div className="flex justify-between text-[#525A55]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#0D281E]">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-[#525A55]">
              <span>Botanical Shipping</span>
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

        {/* Dispatch Address & Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE1] text-[#82947B]">
              <MapPin className="w-4 h-4 text-[#0D281E]" />
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0D281E]">
                Delivery Destination
              </h4>
            </div>
            <p className="text-xs text-[#525A55] leading-relaxed pt-1">
              <strong className="text-[#0D281E]">{shippingAddress.fullName}</strong>
              <br />
              {shippingAddress.street}
              {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
              <br />
              {shippingAddress.city}, {shippingAddress.state} — {shippingAddress.postalCode}
              <br />
              Phone: {shippingAddress.phone}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE1] text-[#82947B]">
              <ShieldCheck className="w-4 h-4 text-[#0D281E]" />
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0D281E]">
                Fulfillment Protocol
              </h4>
            </div>
            <p className="text-xs text-[#525A55] leading-relaxed pt-1">
              Orders are freshly sealed in unbleached banana fiber wraps and dispatched within 24
              hours from Madurai, Tamil Nadu.
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#0D281E] hover:underline flex items-center gap-1.5"
          >
            <span>Continue Exploring Apothecary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/account"
            className="px-6 py-2.5 rounded-full bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider shadow-xs"
          >
            View in My Sanctuary
          </Link>
        </div>
      </div>
    </div>
  );
}
