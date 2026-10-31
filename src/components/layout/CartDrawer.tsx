"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    freeShippingThreshold,
    freeShippingProgress,
    isFreeShipping,
  } = useCart();

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs"
            onClick={closeCart}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-border pointer-events-auto"
            >
          
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-ivory-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest-900" />
              <h2 className="font-display text-xl font-medium text-forest-900">
                Your Botanical Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-charcoal-600 hover:text-forest-900 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-sage-100/60 px-6 py-3.5 border-b border-[#e1e9dc]">
            <div className="flex justify-between items-center text-xs font-medium text-forest-900 mb-1.5">
              <span>
                {isFreeShipping
                  ? "🎉 You have qualified for Complimentary Shipping!"
                  : `Add ${formatCurrency(remainingForFreeShipping)} more for Free Shipping`}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#d5e0cf] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-forest-900 h-full rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-ivory-100 border border-border flex items-center justify-center mx-auto mb-4 text-forest-700">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-display text-2xl font-medium text-forest-900 mb-2">
                  Your bag is currently empty
                </h3>
                <p className="text-sm text-charcoal-600 mb-8 max-w-xs mx-auto leading-relaxed">
                  Discover our 7 handcrafted herbal bath soaps, cold-pressed scalp elixirs, and pure botanical rituals.
                </p>
                <Button onClick={closeCart} variant="primary" className="w-full rounded-full bg-[#0D3B2E] hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest py-3">
                  Explore Artisanal Soaps
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-border/80 last:border-b-0">
                  <div className="relative w-20 h-24 bg-ivory-100 rounded-[3px] overflow-hidden flex-shrink-0 border border-border">
                    <img
                      src={item.product.featuredImage}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="font-display text-base font-medium text-forest-900 hover:text-forest-700 transition-colors leading-snug"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-error transition-colors p-1"
                          aria-label={`Remove ${item.product.title} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variant && (
                        <p className="text-xs text-charcoal-600 mt-0.5">
                          Size: {item.variant.name}
                        </p>
                      )}

                      <p className="text-xs text-sage-500 mt-0.5 font-medium">
                        {item.product.categoryLabel}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-border rounded-[2px] bg-ivory-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-charcoal-600 hover:text-forest-900 disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-charcoal-900 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-charcoal-600 hover:text-forest-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-body font-semibold text-sm text-forest-900">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-ivory-50 border-t border-border">
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-charcoal-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-600 text-xs">
                  <span>Shipping</span>
                  <span>{isFreeShipping ? "FREE" : "Calculated at checkout"}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6 pt-3 border-t border-border">
                <span className="font-display text-lg font-medium text-forest-900">Total</span>
                <span className="font-body text-xl font-bold text-forest-900">{formatCurrency(subtotal)}</span>
              </div>

              <Link href="/cart" onClick={closeCart} className="w-full block">
                <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <p className="text-[11px] text-center text-charcoal-600 mt-3">
                Taxes included. 100% plastic-free carbon-neutral delivery.
              </p>
            </div>
          )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
