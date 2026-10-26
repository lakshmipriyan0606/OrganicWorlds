import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByTrackingToken } from "@/lib/services/order-service";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const instant = false;

interface TrackingPageProps {
  params: Promise<{ token: string }>;
}

export default async function PublicTrackingPage({ params }: TrackingPageProps) {
  const { token } = await params;
  const trackingData = await getOrderByTrackingToken(token);

  if (!trackingData) {
    notFound();
  }

  const {
    orderNumber,
    status,
    carrier,
    trackingNumber,
    trackingUrl,
    shippedAt,
    deliveredAt,
    createdAt,
    destination,
    items,
  } = trackingData;

  // Determine stage progression (1 to 4)
  let currentStage = 1; // 1: Confirmed, 2: Packed, 3: Shipped, 4: Delivered
  if (status === "PROCESSING" || status === "PACKED") currentStage = 2;
  if (status === "SHIPPED" || status === "OUT_FOR_DELIVERY") currentStage = 3;
  if (status === "DELIVERED") currentStage = 4;
  if (status === "CANCELLED" || status === "REFUNDED") currentStage = 0;

  const steps = [
    {
      num: 1,
      title: "Sanctuary Order Confirmed",
      desc: "Formula freshly cured and reserved in workshop.",
      date: new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      active: currentStage >= 1,
      completed: currentStage > 1,
    },
    {
      num: 2,
      title: "Artisanal Packing Ritual",
      desc: "Hand-wrapped in unbleached banana fiber.",
      date: currentStage >= 2 ? "Completed" : "In Progress",
      active: currentStage >= 2,
      completed: currentStage > 2,
    },
    {
      num: 3,
      title: "Dispatched from Madurai",
      desc: carrier ? `In transit via ${carrier}` : "Carrier handoff in progress.",
      date: shippedAt
        ? new Date(shippedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : "Pending handoff",
      active: currentStage >= 3,
      completed: currentStage > 3,
    },
    {
      num: 4,
      title: "Arrived at Sanctuary",
      desc: "Delivered safely to your destination.",
      date: deliveredAt
        ? new Date(deliveredAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : "Expected soon",
      active: currentStage >= 4,
      completed: currentStage === 4,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Crest & Order Banner */}
        <div className="bg-white rounded-3xl p-8 border border-[#E3DDD1] shadow-md text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FAFBF9] border border-[#E3DDD1] flex items-center justify-center mx-auto text-[#0D281E]">
            <Truck className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block">
              Sacred Botanical Journey
            </span>
            <h1 className="font-display text-3xl font-bold text-[#0D281E]">
              Order {orderNumber}
            </h1>
          </div>

          <div className="flex justify-center">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status: {status.replace("_", " ")}</span>
            </span>
          </div>

          {carrier && trackingNumber && (
            <div className="pt-2">
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD1] text-xs">
                <span className="text-[#525A55]">
                  Carrier: <strong className="text-[#0D281E]">{carrier}</strong> • AWB:{" "}
                  <span className="font-mono font-bold text-[#0D281E]">{trackingNumber}</span>
                </span>
                {trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-[#0D281E] hover:underline"
                  >
                    <span>Track on {carrier}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Botanical Journey Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-6">
          <h3 className="font-display text-sm font-bold text-[#0D281E] pb-3 border-b border-[#F0ECE1] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#82947B]" />
            <span>Botanical Dispatch Progression</span>
          </h3>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E3DDD1]">
            {steps.map((step) => (
              <div key={step.num} className="relative flex items-start gap-4 text-xs">
                {/* Step Circle Indicator */}
                <div
                  className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    step.completed
                      ? "bg-[#0D281E] text-white ring-4 ring-emerald-100"
                      : step.active
                      ? "bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse"
                      : "bg-white border-2 border-[#E3DDD1] text-[#82947B]"
                  }`}
                >
                  {step.completed ? "✓" : step.num}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-bold ${
                        step.active ? "text-[#0D281E]" : "text-[#82947B]"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <span className="text-[10px] text-[#82947B] font-mono">{step.date}</span>
                  </div>
                  <p className="text-[#525A55] text-[11px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Sanctum & Items List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE1]">
              <MapPin className="w-4 h-4 text-[#0D281E]" />
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0D281E]">
                Destination Sanctum
              </h4>
            </div>
            <p className="text-xs text-[#525A55] leading-relaxed pt-1">
              {destination.city ? (
                <>
                  {destination.city}, {destination.state} — {destination.postalCode}
                  <br />
                  <span className="text-[10px] text-[#82947B]">
                    (Address details protected for security)
                  </span>
                </>
              ) : (
                "Verified Botanical Sanctuary Destination"
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE1]">
              <ShieldCheck className="w-4 h-4 text-[#0D281E]" />
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0D281E]">
                Care Ritual
              </h4>
            </div>
            <p className="text-xs text-[#525A55] leading-relaxed pt-1">
              Store handcrafted soaps in dry ambient conditions. Keep cold-pressed oils away from direct sunlight.
            </p>
          </div>
        </div>

        {/* Package Contents */}
        <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-4">
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0D281E] pb-2 border-b border-[#F0ECE1]">
            Sanctuary Package Contents ({items.length})
          </h4>
          <div className="divide-y divide-[#F0ECE1] text-xs">
            {items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAFBF9] border border-[#E3DDD1] overflow-hidden shrink-0 flex items-center justify-center">
                    {item.featuredImage ? (
                      <img
                        src={item.featuredImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-4 h-4 text-[#82947B]" />
                    )}
                  </div>
                  <span className="font-bold text-[#0D281E]">{item.productName}</span>
                </div>
                <span className="text-xs text-[#82947B] font-mono">Qty: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D281E] hover:underline"
          >
            <span>Explore More Sacred Formulations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
