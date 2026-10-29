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
  MapPin,
  CreditCard,
  Check,
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

  // Sandbox Test Payment state (Local & Test environment)
  const [sandboxModalOpen, setSandboxModalOpen] = useState(false);
  const [sandboxData, setSandboxData] = useState<{
    orderId: string;
    orderNumber: string;
    amount: number;
    currency: string;
    gatewayOrderId: string;
    simulatedPaymentId?: string;
    simulatedSignature?: string;
  } | null>(null);
  const [verifyingSandbox, setVerifyingSandbox] = useState(false);

  const handleCompleteSandboxPayment = async () => {
    if (!sandboxData) return;
    setVerifyingSandbox(true);
    setOrderError(null);

    try {
      const verifyRes = await fetch("/api/checkout/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: sandboxData.orderId,
          razorpayOrderId: sandboxData.gatewayOrderId,
          razorpayPaymentId: sandboxData.simulatedPaymentId,
          razorpaySignature: sandboxData.simulatedSignature,
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        clearCart();
        setSandboxModalOpen(false);
        router.push(`/order-confirmation/${sandboxData.orderId}`);
      } else {
        setOrderError(verifyData.error || "Simulated payment verification failed.");
        setVerifyingSandbox(false);
      }
    } catch (err) {
      console.error("Sandbox verification error:", err);
      setOrderError("Network error during simulated payment verification.");
      setVerifyingSandbox(false);
    }
  };

  const handleFailSandboxPayment = () => {
    setSandboxModalOpen(false);
    setOrderError("Payment simulation failed: The transaction was cancelled or declined. Your items remain in your cart.");
  };

  const handleCloseSandboxModal = () => {
    setSandboxModalOpen(false);
  };

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

      const isPlaceholderKey =
        !rzpData.keyId ||
        rzpData.keyId.includes("placeholder") ||
        rzpData.keyId === "rzp_test_dummy" ||
        Boolean(rzpData.isSimulated);

      if (isPlaceholderKey) {
        setSandboxData({
          orderId,
          orderNumber: rzpData.orderNumber,
          amount: rzpData.amount,
          currency: rzpData.currency,
          gatewayOrderId: rzpData.gatewayOrderId,
          simulatedPaymentId:
            rzpData.simulatedSignature?.razorpayPaymentId ||
            `pay_rzp_mock_${Date.now()}`,
          simulatedSignature: rzpData.simulatedSignature?.razorpaySignature,
        });
        setSandboxModalOpen(true);
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
        {/* LUXURY BOTANICAL ANIMATED STEPPER HEADER */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0ECE1]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#82947B] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227] animate-pulse" />
                Authoritative Secure Checkout
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E] tracking-tight">
                {isLoggedIn ? "Delivery Details & Order Review" : "Sign In Required for Checkout"}
              </h1>
              <p className="text-xs text-[#525A55] mt-1 flex flex-wrap items-center gap-2">
                <span>100% Plastic-free dispatch from our Tamil Nadu botanical apothecary</span>
                <span className="hidden sm:inline text-[#DCE3DB]">•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  Eco-Certified Sanctuary Dispatch
                </span>
              </p>
            </div>

            {/* Overall Progress Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#82947B]">
                Checkout Flow:
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#FAFBF9] border border-[#DCE3DB] text-xs font-bold font-mono text-[#0D281E] shadow-2xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {isLoggedIn ? "Step 2 of 3 (66%)" : "Step 1 of 3 (33%)"}
              </span>
            </div>
          </div>

          {/* Stepper Timeline & Smooth Animated Track */}
          <div className="relative pt-1 sm:pt-3">
            {/* Background Connector Bar (desktop) */}
            <div className="absolute top-7 left-12 right-12 h-1 bg-[#EBE7DE] rounded-full -translate-y-1/2 z-0 hidden sm:block" />

            {/* Animated Active Connector Bar with emerald gradient */}
            <div
              className="absolute top-7 left-12 h-1 bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#0D281E] rounded-full -translate-y-1/2 z-0 hidden sm:block transition-all duration-700 ease-out shadow-xs"
              style={{ width: isLoggedIn ? "50%" : "0%" }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 relative z-10">
              {/* STEP 1: PATRON SIGN IN */}
              <div
                className={`flex items-center sm:flex-col sm:items-center gap-3.5 sm:gap-2 p-3 sm:p-2.5 rounded-2xl transition-all duration-300 ${
                  isLoggedIn
                    ? "bg-emerald-50/70 sm:bg-transparent"
                    : "bg-[#0D281E]/5 sm:bg-transparent"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-500 shrink-0 ${
                    isLoggedIn
                      ? "bg-emerald-700 text-white ring-4 ring-emerald-600/15 scale-105"
                      : "bg-[#0D281E] text-white ring-4 ring-[#0D281E]/20"
                  }`}
                >
                  {isLoggedIn ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="sm:text-center">
                  <div className="flex items-center sm:justify-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D281E]">
                      1. Sign In
                    </span>
                    {isLoggedIn && (
                      <span className="text-[9px] font-bold text-emerald-700 uppercase bg-emerald-100/90 px-1.5 py-0.5 rounded-md">
                        Done
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#718076] block">
                    {isLoggedIn ? "Verified Patron Access" : "Patron Verification"}
                  </span>
                </div>
              </div>

              {/* STEP 2: DELIVERY DETAILS */}
              <div
                className={`flex items-center sm:flex-col sm:items-center gap-3.5 sm:gap-2 p-3 sm:p-2.5 rounded-2xl transition-all duration-300 ${
                  isLoggedIn
                    ? "bg-emerald-50/80 sm:bg-transparent"
                    : "opacity-60 sm:opacity-75"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-500 shrink-0 ${
                    isLoggedIn
                      ? "bg-[#0D281E] text-white ring-4 ring-[#0D281E]/20 scale-105"
                      : "bg-[#F0ECE1] text-[#82947B] border border-[#DCE3DB]"
                  }`}
                >
                  <Truck
                    className={`w-5 h-5 ${
                      isLoggedIn ? "text-emerald-300" : "text-[#82947B]"
                    }`}
                  />
                </div>
                <div className="sm:text-center">
                  <div className="flex items-center sm:justify-center gap-1.5">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isLoggedIn ? "text-[#0D281E]" : "text-[#82947B]"
                      }`}
                    >
                      2. Delivery
                    </span>
                    {isLoggedIn && (
                      <span className="text-[9px] font-bold text-[#0D281E] uppercase bg-emerald-200/60 px-1.5 py-0.5 rounded-md animate-pulse">
                        Active Step
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#718076] block">
                    Dispatch Destination
                  </span>
                </div>
              </div>

              {/* STEP 3: SACRED PAYMENT */}
              <div className="flex items-center sm:flex-col sm:items-center gap-3.5 sm:gap-2 p-3 sm:p-2.5 rounded-2xl opacity-60 sm:opacity-75 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#F0ECE1] text-[#82947B] border border-[#DCE3DB] flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                  <CreditCard className="w-5 h-5 text-[#82947B]" />
                </div>
                <div className="sm:text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#82947B] block">
                    3. Payment
                  </span>
                  <span className="text-[10px] text-[#718076] block">
                    Razorpay & Dispatch
                  </span>
                </div>
              </div>
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
                    {/* Quick Demo Helper (Development & Testing only) */}
                    {process.env.NODE_ENV !== "production" && (
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
                    )}

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
                <div className="p-5 rounded-3xl bg-white border border-[#E3DDD1] shadow-xs flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-[#0D281E] flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                      {customerName ? customerName.charAt(0).toUpperCase() : "P"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          Authenticated Patron Member
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#0D281E] mt-0.5">
                        {customerName || "Member"} •{" "}
                        <span className="font-normal text-[#525A55]">{customerEmail}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3.5 py-1.5 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Switch</span>
                  </button>
                </div>

                {/* Contact Confirmation */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#F0ECE1]">
                    <UserCheck className="w-4 h-4 text-[#82947B]" />
                    <h3 className="font-display text-sm font-bold text-[#0D281E]">
                      Patron Contact
                    </h3>
                  </div>

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
                        className="w-full px-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:bg-white focus:ring-2 focus:ring-[#0D281E]/10 transition-all"
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
                        className="w-full px-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:bg-white focus:ring-2 focus:ring-[#0D281E]/10 transition-all"
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
                      className="w-full px-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:bg-white focus:ring-2 focus:ring-[#0D281E]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#82947B]" />
                      <h3 className="font-display text-sm font-bold text-[#0D281E]">
                        Shipping & Delivery Address
                      </h3>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200 hidden sm:inline">
                      🌿 100% Eco-Packaging
                    </span>
                  </div>

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
                      className="w-full px-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:bg-white focus:ring-2 focus:ring-[#0D281E]/10 transition-all"
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
                      className="w-full px-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:bg-white focus:ring-2 focus:ring-[#0D281E]/10 transition-all"
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
                        className="w-full px-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:bg-white focus:ring-2 focus:ring-[#0D281E]/10 transition-all"
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
                        className="w-full px-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:bg-white focus:ring-2 focus:ring-[#0D281E]/10 transition-all"
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
                        className="w-full px-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:bg-white focus:ring-2 focus:ring-[#0D281E]/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Gift Note */}
                <div className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    <h3 className="font-display text-sm font-bold text-[#0D281E]">
                      Handwritten Botanical Gift Message (Optional)
                    </h3>
                  </div>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Inscribe a sacred botanical blessing or personalized note to the recipient..."
                    className="w-full p-3 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:bg-white focus:ring-2 focus:ring-[#0D281E]/10 transition-all resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="group relative overflow-hidden w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#0D281E] via-[#163B2C] to-[#0D281E] hover:from-[#163B2C] hover:to-[#0D281E] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(13,40,30,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(13,40,30,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {submittingOrder
                      ? "Verifying Inventory & Authorizing Payment..."
                      : `Confirm Order & Proceed to Pay ${formatCurrency(estimatedTotal)}`}
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </form>
            )}
          </div>

          {/* Right Column (5 cols): Order Items Summary */}
          <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <h3 className="font-display text-sm font-bold text-[#0D281E]">
                Order Items ({items.length})
              </h3>
              <span className="text-[10px] text-[#82947B] font-mono font-bold">
                Direct Dispatch
              </span>
            </div>

            {/* Item list */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="group flex items-center justify-between gap-3 text-xs p-1.5 rounded-xl hover:bg-[#FAFBF9] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FAFBF9] border border-[#E3DDD1] overflow-hidden shrink-0 flex items-center justify-center">
                      {item.product.featuredImage ? (
                        <img
                          src={item.product.featuredImage}
                          alt={item.product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <span className="font-semibold text-[#0D281E] shrink-0 font-mono">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[#F0ECE1] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#525A55]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#0D281E] font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#525A55]">
                <span>Standard Botanical Dispatch</span>
                <span className="font-semibold text-[#0D281E]">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 uppercase font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Free Shipping
                    </span>
                  ) : (
                    <span className="font-mono">{formatCurrency(shippingFee)}</span>
                  )}
                </span>
              </div>

              {shippingFee > 0 && (
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD1] text-[10px] text-[#82947B] flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
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

            {/* Pricing Guarantee & Trust Badges */}
            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#DCE3DB] space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-[#0D281E] text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authoritative Server Pricing Guarantee</span>
              </div>
              <p className="text-[10px] text-[#718076] leading-relaxed">
                Grand totals and inventory availability are verified authoritatively on the server.
              </p>
              <div className="pt-2 border-t border-[#E8E4DA] grid grid-cols-2 gap-2 text-[10px] text-[#525A55]">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  256-Bit SSL Secured
                </span>
                <span className="flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-700" />
                  100% Plastic-Free
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sandbox Payment Simulator Modal (Active when using test/placeholder Razorpay keys) */}
      {sandboxModalOpen && sandboxData && (
        <div
          data-testid="sandbox-payment-modal"
          className="fixed inset-0 z-50 bg-[#0D281E]/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#DCE3DB] shadow-2xl relative space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Header Tag */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold tracking-wider uppercase border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Sanctuary Payment Sandbox
              </span>
            </div>

            {/* Emblem / Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#0D281E] text-[#CEE9D9] flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0D281E]">
                Test Gateway Simulation
              </h3>
              <p className="text-xs text-[#525A55] leading-relaxed">
                Development environment detected with placeholder Razorpay keys. No actual bank account or credit card will be charged.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#E3DDD1] text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#525A55]">
                <span>Order Reference</span>
                <span className="font-mono font-bold text-[#0D281E]">{sandboxData.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-[#525A55]">
                <span>Customer</span>
                <span className="font-semibold text-[#0D281E]">{customerName || "Patron Member"}</span>
              </div>
              <div className="flex justify-between items-center text-[#525A55]">
                <span>Payment Amount</span>
                <span className="font-display font-bold text-base text-[#0D281E]">
                  {formatCurrency(sandboxData.amount / 100)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#F0ECE1] flex items-center gap-1.5 text-[10px] text-[#82947B]">
                <Lock className="w-3 h-3 text-emerald-700 shrink-0" />
                <span>HMAC-SHA256 signature verified server-side</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                data-testid="confirm-sandbox-payment"
                onClick={handleCompleteSandboxPayment}
                disabled={verifyingSandbox}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0D281E] text-white hover:bg-[#1A4533] font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {verifyingSandbox ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Sacred Transaction...</span>
                  </>
                ) : (
                  <>
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>Complete Sacred Test Payment (Instant UPI / Cards)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleFailSandboxPayment}
                disabled={verifyingSandbox}
                className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                Simulate Payment Failure (Test Error Recovery)
              </button>

              <button
                type="button"
                onClick={handleCloseSandboxModal}
                disabled={verifyingSandbox}
                className="text-xs text-[#82947B] hover:text-[#0D281E] font-medium transition-colors cursor-pointer pt-1"
              >
                Return to Checkout
              </button>
            </div>

            {/* Dev hint */}
            <p className="text-[10px] text-[#82947B] border-t border-[#E3DDD1] pt-3">
              💡 To enable the live Razorpay modal, set valid <code className="font-mono text-[#0D281E]">RAZORPAY_KEY_ID</code> and <code className="font-mono text-[#0D281E]">RAZORPAY_KEY_SECRET</code> in <code className="font-mono text-[#0D281E]">.env</code>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
