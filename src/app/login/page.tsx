"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Leaf,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillCustomerCredentials = () => {
    setEmail("customer@example.com");
    setPassword("CustomerPavishna2026!Secure");
    setError(null);
  };

  const fillAdminCredentials = () => {
    setEmail("admin@pavishnaorganicworlds.com");
    setPassword("AdminPavishna2026!Secure");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // If user is admin, redirect to admin dashboard, else redirectUrl
      if (data.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err) {
      console.error("Login request error:", err);
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#CEE9D9] selection:text-[#0D281E]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="w-14 h-14 rounded-full bg-[#0D281E]/8 border border-[#0D281E]/15 flex items-center justify-center mx-auto mb-4 text-[#0D281E] shadow-2xs">
          <Leaf className="w-7 h-7" />
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-[#0D281E]">
          Sign in to Your Sanctuary
        </h2>
        <p className="mt-2 text-xs text-[#525A55]">
          Manage your botanical orders, saved addresses, and wellness subscriptions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E3DDD1] shadow-md space-y-6">
          {/* Quick-Fill Demo Helpers (Development & Testing only) */}
          {process.env.NODE_ENV !== "production" && (
            <div className="p-3.5 rounded-2xl bg-[#F6F4EF] border border-[#E3DDD1] space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0D281E]">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Quick Demo Access</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={fillCustomerCredentials}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-[#DCE3DB] hover:border-[#0D281E] text-[11px] font-semibold text-[#0D281E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <UserCheck className="w-3 h-3 text-emerald-700" />
                  <span>Fill Patron</span>
                </button>
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-[#DCE3DB] hover:border-[#0D281E] text-[11px] font-semibold text-[#0D281E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Fill Admin</span>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
              {process.env.NODE_ENV !== "production" && (
                <p className="text-[11px] text-rose-700 pl-6">
                  Click &quot;Fill Patron&quot; above to autofill the default test credentials.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:ring-1 focus:ring-[#0D281E] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#525A55]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#0D281E] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:ring-1 focus:ring-[#0D281E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#82947B] hover:text-[#0D281E] p-0.5 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Credentials Reference Badge */}
          <div className="pt-2 text-[10px] text-[#718076] text-center space-y-1">
            <div>
              Patron Demo:{" "}
              <code className="text-[#0D281E] font-mono font-medium">
                customer@example.com
              </code>{" "}
              /{" "}
              <code className="text-[#0D281E] font-mono font-medium">
                CustomerPavishna2026!Secure
              </code>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0ECE1] text-center">
            <p className="text-xs text-[#525A55]">
              Don&apos;t have an account yet?{" "}
              <Link
                href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
                className="font-bold text-[#0D281E] hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
