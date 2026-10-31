"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag, Check } from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    freeShippingThreshold,
    freeShippingProgress,
    isFreeShipping,
  } = useCart();

  const [giftNote, setGiftNote] = useState("");

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <Container size="narrow">
          <div className="w-16 h-16 rounded-full bg-ivory-100 border border-border flex items-center justify-center mx-auto mb-4 text-forest-700">
            <ShoppingBag className="w-8 h-8 opacity-60" />
          </div>
          <span className="eyebrow mb-2">Empty Bag</span>
          <h1 className="font-display text-4xl text-forest-900 mb-4">
            Your Botanical Bag is Empty
          </h1>
          <p className="text-sm text-charcoal-600 max-w-sm mx-auto leading-relaxed mb-8">
            Take a moment to explore our clean-burning candles, restorative hair nectars, and limited seasonal sets.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Explore the Collection
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="max-w-2xl mb-10">
          <span className="eyebrow mb-2">Review & Savor</span>
          <h1 className="font-display text-3xl sm:text-4xl text-forest-900">
            Your Botanical Bag ({items.length} items)
          </h1>
        </div>

        {/* Free Shipping Alert */}
        <div className="bg-sage-100/70 p-5 rounded-[3px] border border-[#d6e0d0] mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-forest-900">
              {isFreeShipping
                ? "✨ Complimentary Carbon-Neutral Shipping Unlocked!"
                : `Add ${formatCurrency(remainingForFreeShipping)} more to receive complimentary delivery across India.`}
            </p>
            <p className="text-xs text-forest-900/70 mt-0.5">
              Carefully dispatched from our Bangalore studio in 100% plastic-free packaging.
            </p>
          </div>
          <div className="w-full sm:w-48 bg-[#d0dcce] h-2 rounded-full overflow-hidden">
            <div
              className="bg-forest-900 h-full rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Cart Item Rows */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-border rounded-[3px] bg-white divide-y divide-border overflow-hidden">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.2, ease: "easeOut" } }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                  >
                    <div className="w-24 h-28 bg-ivory-100 rounded-[3px] overflow-hidden flex-shrink-0 border border-border">
                      <img
                        src={item.product.featuredImage}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <span className="text-[10px] uppercase tracking-wider text-sage-500 font-semibold block mb-0.5">
                        {item.product.categoryLabel}
                      </span>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-display text-lg font-medium text-forest-900 hover:text-forest-700 transition-colors block leading-tight"
                      >
                        {item.product.title}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-charcoal-600 mt-1">
                          Size: <span className="font-medium text-charcoal-900">{item.variant.name}</span>
                        </p>
                      )}
                      <p className="text-xs text-neutral-400 mt-1 font-mono">
                        Unit: {formatCurrency(item.unitPrice)}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                      <div className="flex items-center border border-border rounded-[2px] bg-ivory-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-charcoal-600 hover:text-forest-900 active:scale-90 transition-transform duration-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-charcoal-900 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-charcoal-600 hover:text-forest-900 active:scale-90 transition-transform duration-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-body font-semibold text-base text-forest-900">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-error active:scale-90 transition-[transform,color] duration-100 p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Gift Note Accordion */}
            <div className="p-6 bg-white border border-border rounded-[3px]">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-900 mb-2">
                Handwritten Gift Message (Complimentary)
              </h4>
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                rows={3}
                placeholder="Include a personal message to be written with fountain pen on seed paper..."
                className="w-full text-xs p-3 bg-ivory-50 border border-border rounded-[3px] focus:outline-none focus:border-forest-900 text-charcoal-900"
              />
            </div>
          </div>

          {/* Right Order Summary Box */}
          <div className="lg:col-span-5 bg-white border border-border rounded-[3px] p-8 shadow-xs space-y-6">
            <h3 className="font-display text-2xl font-medium text-forest-900 pb-4 border-b border-border">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm text-charcoal-600">
              <div className="flex justify-between">
                <span>Botanical Subtotal</span>
                <span className="font-medium text-charcoal-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-forest-900">
                  {isFreeShipping ? "FREE" : "₹150"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (GST)</span>
                <span className="text-xs text-sage-500 font-medium">Included</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-baseline">
              <span className="font-display text-xl text-forest-900">Total Amount</span>
              <span className="font-body text-2xl font-bold text-forest-900">
                {formatCurrency(subtotal + (isFreeShipping ? 0 : 150))}
              </span>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full py-4 text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="pt-4 border-t border-border space-y-2 text-xs text-charcoal-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-700 flex-shrink-0" />
                <span>256-bit encrypted checkout with UPI, Cards & NetBanking</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-forest-700 flex-shrink-0" />
                <span>Carbon-neutral plastic-free delivery</span>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
