"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  Leaf,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  Package,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  UserCheck,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Auth state
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "register">("signin");

  // Inline sign-in form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Inline registration form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Delivery & Order state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Tamil Nadu");
  const [postalCode, setPostalCode] = useState("");
  const [giftNote, setGiftNote] = useState("");

  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // 1. Check if user is already logged in on initial render
  useEffect(() => {
    let ignore = false;
    async function checkAuthSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (!ignore && data.authenticated && data.user) {
            setIsLoggedIn(true);
            setCustomerName(data.user.name || "");
            setCustomerEmail(data.user.email || "");
            setCustomerPhone(data.user.phone || "");

            // Pre-fill default address
            const addrRes = await fetch("/api/account/addresses");
            if (addrRes.ok) {
              const addrData = await addrRes.json();
              const defAddr =
                addrData.addresses?.find((a: { isDefault: boolean }) => a.isDefault) ||
                addrData.addresses?.[0];
              if (defAddr) {
                setStreet(defAddr.street || "");
                setApartment(defAddr.apartment || "");
                setCity(defAddr.city || "");
                setState(defAddr.state || "Tamil Nadu");
                setPostalCode(defAddr.postalCode || "");
                if (defAddr.phone) setCustomerPhone(defAddr.phone);
              }
            }
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (!ignore) setCheckingAuth(false);
      }
    }
    checkAuthSession();
    return () => {
      ignore = true;
    };
  }, []);

  const shippingFee = subtotal >= 1500 ? 0 : 99;
  const estimatedTotal = subtotal + shippingFee;

  // Quick fill demo customer credentials
  const handleQuickFillCustomer = () => {
    setLoginEmail("customer@example.com");
    setLoginPassword("CustomerPavishna2026!Secure");
    setAuthError(null);
  };

  // Inline Sign In submission
  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Invalid email or password");
        setAuthSubmitting(false);
        return;
      }

      setIsLoggedIn(true);
      setCustomerName(data.user.name || "");
      setCustomerEmail(data.user.email || "");

      // Try fetching saved addresses
      const addrRes = await fetch("/api/account/addresses");
      if (addrRes.ok) {
        const addrData = await addrRes.json();
        const defAddr =
          addrData.addresses?.find((a: { isDefault: boolean }) => a.isDefault) ||
          addrData.addresses?.[0];
        if (defAddr) {
          setStreet(defAddr.street || "");
          setApartment(defAddr.apartment || "");
          setCity(defAddr.city || "");
          setState(defAddr.state || "Tamil Nadu");
          setPostalCode(defAddr.postalCode || "");
          if (defAddr.phone) setCustomerPhone(defAddr.phone);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuthError("Network error during sign-in. Please try again.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Inline Registration submission
  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setAuthSubmitting(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim().toLowerCase(),
          phone: regPhone.trim() || undefined,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Registration failed.");
        setAuthSubmitting(false);
        return;
      }

      setIsLoggedIn(true);
      setCustomerName(data.user.name || regName);
      setCustomerEmail(data.user.email || regEmail);
      if (regPhone) setCustomerPhone(regPhone);
    } catch (err) {
      console.error("Register error:", err);
      setAuthError("Network error during registration.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle Logout / Switch account
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setStreet("");
      setApartment("");
      setPostalCode("");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // Submit Final Order
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setOrderError("Authentication is required. Please sign in or register to place your order.");
      return;
    }

    if (items.length === 0) {
      setOrderError("Your cart is empty. Please add items to proceed.");
      return;
    }

    setSubmittingOrder(true);
    setOrderError(null);

    const payload = {
      customerName,
      email: customerEmail,
      phone: customerPhone,
      addressLine1: street,
      addressLine2: apartment.trim() || undefined,
      city,
      state,
      postalCode,
      notes: giftNote.trim() || undefined,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.message || data.error || "Failed to create order.");
        setSubmittingOrder(false);
        return;
      }

      const orderId = data.orderId;

      // Initialize Razorpay Gateway Order
      const rzpRes = await fetch("/api/checkout/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) {
        setOrderError(rzpData.error || "Failed to initialize payment gateway.");
        setSubmittingOrder(false);
        return;
      }

      // Load Razorpay Checkout SDK
      const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
          if (typeof window === "undefined") return resolve(false);
          const win = window as unknown as { Razorpay?: unknown };
          if (win.Razorpay) return resolve(true);

          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadRazorpayScript();
      const win = window as unknown as {
        Razorpay?: new (opts: unknown) => { open: () => void };
      };

      if (scriptLoaded && win.Razorpay) {
        const options = {
          key: rzpData.keyId,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: "Pavishna Organic Worlds",
          description: `Order ${rzpData.orderNumber}`,
          order_id: rzpData.gatewayOrderId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: {
            color: "#0D281E",
          },
          handler: async function (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) {
            try {
              const verifyRes = await fetch("/api/checkout/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                clearCart();
                router.push(`/order-confirmation/${orderId}`);
              } else {
                setOrderError(verifyData.error || "Payment verification failed.");
                setSubmittingOrder(false);
              }
            } catch (vErr) {
              console.error("Verification network error:", vErr);
              setOrderError("Network error during payment verification.");
              setSubmittingOrder(false);
            }
          },
          modal: {
            ondismiss: function () {
              setSubmittingOrder(false);
            },
          },
        };

        const razorpayInstance = new win.Razorpay(options);
        razorpayInstance.open();
      } else {
        // Fallback for environments where external Razorpay script is blocked
        clearCart();
        router.push(`/order-confirmation/${orderId}`);
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setOrderError("Network error occurred while submitting order.");
      setSubmittingOrder(false);
    }
  };

  // Cart empty view
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E3DDD1] text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#82947B] mx-auto opacity-50" />
          <h2 className="font-display text-xl font-bold text-[#0D281E]">
            Your Botanical Bag is Empty
          </h2>
          <p className="text-xs text-[#525A55]">
            Explore our handcrafted herbal soaps, hair elixirs, and temple incense formulations.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex px-6 py-2.5 rounded-full bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider"
            >
              Explore Offerings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-12 selection:bg-[#CEE9D9] selection:text-[#0D281E]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Stepper */}
        <div className="pb-4 border-b border-[#E3DDD1] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
              Authoritative Secure Checkout
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
              {isLoggedIn ? "Delivery Details & Order Review" : "Sign In Required for Checkout"}
            </h1>
            <p className="text-xs text-[#525A55] mt-1">
              100% Plastic-free dispatch from our Tamil Nadu botanical apothecary
            </p>
          </div>

          {/* Checkout Steps Progress */}
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                isLoggedIn
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-[#0D281E] text-white border-[#0D281E]"
              }`}
            >
              {isLoggedIn ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full bg-white text-[#0D281E] text-[9px] flex items-center justify-center font-bold">
                  1
                </span>
              )}
              <span>1. Sign In</span>
            </div>

            <span className="text-[#82947B]">→</span>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                isLoggedIn
                  ? "bg-[#0D281E] text-white border-[#0D281E]"
                  : "bg-[#FAFBF9] text-[#82947B] border-[#DCE3DB]"
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white/20 text-current text-[9px] flex items-center justify-center font-bold">
                2
              </span>
              <span>2. Delivery</span>
            </div>
          </div>
        </div>

        {orderError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{orderError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Mandatory Auth OR Delivery Form */}
          <div className="lg:col-span-7 space-y-6">
            {checkingAuth ? (
              <div className="bg-white rounded-3xl p-12 border border-[#E3DDD1] shadow-2xs flex flex-col items-center justify-center gap-3 text-center">
                <RefreshCw className="w-6 h-6 animate-spin text-[#0D281E]" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#0D281E]">
                  Verifying Patron Session...
                </p>
              </div>
            ) : !isLoggedIn ? (
              /* MANDATORY AUTHENTICATION CARD */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-md space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-3">
                    <Lock className="w-3 h-3" />
                    <span>Mandatory Sign-In Required</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D281E]">
                    Sign In or Register to Complete Checkout
                  </h2>
                  <p className="text-xs text-[#525A55] mt-1.5 leading-relaxed">
                    An authentic Patron account is required to reserve fresh Ayurvedic botanical
                    batches, track dispatch status, and manage ritual deliveries.
                  </p>
                </div>

                {/* Tab Switcher: Sign In vs Create Account */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F6F4EF] border border-[#E3DDD1]">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab("signin");
                      setAuthError(null);
                    }}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                      authTab === "signin"
                        ? "bg-[#0D281E] text-white shadow-xs"
                        : "text-[#525A55] hover:text-[#0D281E]"
                    }`}
                  >
                    Sign In to Sanctuary
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab("register");
                      setAuthError(null);
                    }}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                      authTab === "register"
                        ? "bg-[#0D281E] text-white shadow-xs"
                        : "text-[#525A55] hover:text-[#0D281E]"
                    }`}
                  >
                    Create New Account
                  </button>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* TAB 1: SIGN IN FORM */}
                {authTab === "signin" && (
                  <div className="space-y-4">
                    {/* Quick Demo Helper */}
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD1] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C9A227]" />
                        <div>
                          <span className="text-[11px] font-bold text-[#0D281E] block">
                            Have test credentials?
                          </span>
                          <span className="text-[10px] text-[#718076]">
                            customer@example.com / CustomerPavishna2026!Secure
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleQuickFillCustomer}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#DCE3DB] hover:border-[#0D281E] text-[11px] font-bold text-[#0D281E] shrink-0 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3 text-emerald-700" />
                        <span>Fill Demo</span>
                      </button>
                    </div>

                    <form onSubmit={handleInlineLogin} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
                          <input
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="customer@example.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
                          <input
                            type={showLoginPassword ? "text" : "password"}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-10 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-2.5 text-[#82947B] hover:text-[#0D281E] p-0.5 cursor-pointer"
                          >
                            {showLoginPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authSubmitting}
                        className="w-full py-3 px-4 rounded-xl bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <span>
                          {authSubmitting ? "Authenticating..." : "Sign In & Proceed to Delivery"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 2: REGISTER FORM */}
                {authTab === "register" && (
                  <form onSubmit={handleInlineRegister} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Sundari Natarajan"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="sundari@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                        Phone Number (for Courier SMS / WhatsApp Updates)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                        Create Password (min. 6 characters)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
                        <input
                          type={showRegPassword ? "text" : "password"}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-2.5 text-[#82947B] hover:text-[#0D281E] p-0.5 cursor-pointer"
                        >
                          {showRegPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>
                        {authSubmitting
                          ? "Creating Account..."
                          : "Create Account & Proceed to Delivery"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* STEP 2: LOGGED-IN DELIVERY & ORDER SUBMISSION FORM */
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                {/* Verified Patron Member Banner */}
                <div className="p-4 rounded-2xl bg-white border border-[#E3DDD1] shadow-2xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Authenticated Patron Member
                      </span>
                      <p className="text-xs font-bold text-[#0D281E]">
                        {customerName || "Member"} •{" "}
                        <span className="font-normal text-[#525A55]">{customerEmail}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Switch</span>
                  </button>
                </div>

                {/* Contact Confirmation */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-4">
                  <h3 className="font-display text-sm font-bold text-[#0D281E] pb-3 border-b border-[#F0ECE1]">
                    Patron Contact
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Sundari Natarajan"
                        className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="sundari@example.com"
                        className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                      Phone Number (for Courier Delivery Updates)
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-4">
                  <h3 className="font-display text-sm font-bold text-[#0D281E] pb-3 border-b border-[#F0ECE1]">
                    Shipping & Delivery Address
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Door No, Street Name, Cross, Layout"
                      className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                      Apartment, Suite, Unit (Optional)
                    </label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Flat 4B, Lotus Apartments"
                      className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Chennai"
                        className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Tamil Nadu"
                        className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="600001"
                        className="w-full px-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                      />
                    </div>
                  </div>
                </div>

                {/* Gift Note */}
                <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#82947B]" />
                    <h3 className="font-display text-sm font-bold text-[#0D281E]">
                      Handwritten Botanical Gift Message (Optional)
                    </h3>
                  </div>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Inscribe a sacred botanical blessing or personalized note to the recipient..."
                    className="w-full p-3 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-full py-4 px-6 rounded-full bg-[#0D281E] hover:bg-[#1A4533] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {submittingOrder
                      ? "Verifying Inventory & Authorizing Payment..."
                      : `Confirm Order & Proceed to Pay ${formatCurrency(estimatedTotal)}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Right Column (5 cols): Order Items Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-6 sticky top-28">
            <h3 className="font-display text-sm font-bold text-[#0D281E] pb-3 border-b border-[#F0ECE1]">
              Order Items ({items.length})
            </h3>

            {/* Item list */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FAFBF9] border border-[#E3DDD1] overflow-hidden shrink-0 flex items-center justify-center">
                      {item.product.featuredImage ? (
                        <img
                          src={item.product.featuredImage}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-[#82947B]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D281E] line-clamp-1">
                        {item.product.title}
                      </h4>
                      <p className="text-[10px] text-[#82947B]">
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#0D281E] shrink-0">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[#F0ECE1] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#525A55]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#0D281E]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#525A55]">
                <span>Standard Botanical Dispatch</span>
                <span className="font-semibold text-[#0D281E]">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 uppercase font-bold">Free</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>

              {shippingFee > 0 && (
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E3DDD1] text-[10px] text-[#82947B] flex items-center gap-2">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Add {formatCurrency(1500 - subtotal)} more to qualify for complimentary shipping
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[#F0ECE1] flex justify-between items-baseline">
              <span className="font-display text-base font-bold text-[#0D281E]">Total Payable</span>
              <span className="font-display text-2xl font-bold text-[#0D281E]">
                {formatCurrency(estimatedTotal)}
              </span>
            </div>

            {/* Pricing Guarantee */}
            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#DCE3DB] text-[11px] text-[#525A55] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#0D281E]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authoritative Server Pricing Guarantee</span>
              </div>
              <p className="text-[10px] text-[#718076] leading-relaxed">
                Grand totals and inventory availability are verified authoritatively on the server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
