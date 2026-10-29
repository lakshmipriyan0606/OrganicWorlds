"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@pavishnaorganicworlds.com");
  const [password, setPassword] = useState("AdminPavishna2026!Secure");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Check your credentials.");
        setIsLoading(false);
        return;
      }

      if (data.user?.role !== "ADMIN" && data.user?.role !== "STAFF") {
        setErrorMessage("Access denied: Administrator privileges required.");
        setIsLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center p-5 selection:bg-[#CEE9D9] selection:text-[#0D281E]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E3DDD1] shadow-xl">
        {/* Emblem & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0D281E] text-white flex items-center justify-center mx-auto mb-4 shadow-md border border-white/20">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#263D32] block mb-1">
            Store Administration
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#0D281E] tracking-tight">
            Pavishna Organic Worlds
          </h1>
          <p className="text-xs text-[#525A55] mt-1.5">
            Sign in to manage catalog, orders, and botanical content
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#263D32] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pavishnaorganicworlds.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:ring-1 focus:ring-[#0D281E] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#263D32] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:ring-1 focus:ring-[#0D281E] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-full bg-[#0D281E] hover:bg-[#1A4533] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? "Verifying..." : "Enter Workspace"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Badge (Development & Testing only) */}
        {process.env.NODE_ENV !== "production" && (
          <div className="mt-8 pt-6 border-t border-[#ECE7DC] text-center">
            <p className="text-[11px] text-[#6E7B73]">
              Default Seed Admin: <span className="font-mono text-[#0D281E] font-medium">admin@pavishnaorganicworlds.com</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
