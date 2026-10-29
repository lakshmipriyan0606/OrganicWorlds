"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Leaf,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Password reset token is missing. Please request a new reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password. The link may have expired or already been used.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FFF5F5] border border-[#FED7D7] flex items-center justify-center mx-auto text-[#C53030]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-xl font-bold text-[#0D281E]">
            Missing Recovery Token
          </h3>
          <p className="text-xs text-[#525A55] leading-relaxed">
            This password reset link is invalid or incomplete. Please request a new recovery link from our sanctuary.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="w-full py-3 px-4 rounded-xl bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>Request New Link</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#EBF7EE] border border-[#CEE9D9] flex items-center justify-center mx-auto text-[#1B633E]">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-xl font-bold text-[#0D281E]">
            Password Reset Complete
          </h3>
          <p className="text-xs text-[#525A55] leading-relaxed">
            Your patron sanctuary password has been successfully updated. All prior active sessions have been safely revoked.
          </p>
          <div className="p-3 bg-[#F6F4EF] rounded-2xl border border-[#E3DDD1] text-[11px] text-[#718076] mt-4 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#1B633E]" />
            <span>Account secured with modern cryptographic hashing</span>
          </div>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full py-3 px-4 rounded-xl bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In with New Password</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FED7D7] flex items-start gap-2.5 text-[#C53030]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed">{error}</span>
        </div>
      )}

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
          New Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full pl-10 pr-10 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:ring-1 focus:ring-[#0D281E] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-[#82947B] hover:text-[#0D281E] p-0.5 cursor-pointer"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="mt-1 text-[10px] text-[#718076]">Must be at least 8 characters long</p>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1.5">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-[#82947B] absolute left-3.5 top-3" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
            className="w-full pl-10 pr-10 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:ring-1 focus:ring-[#0D281E] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2.5 text-[#82947B] hover:text-[#0D281E] p-0.5 cursor-pointer"
            title={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <span>{loading ? "Establishing New Password..." : "Update Password"}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="pt-4 border-t border-[#F0ECE1] text-center">
        <Link
          href="/login"
          className="text-xs text-[#525A55] hover:text-[#0D281E] font-medium"
        >
          Cancel and return to sign in
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#CEE9D9] selection:text-[#0D281E]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="w-14 h-14 rounded-full bg-[#0D281E]/8 border border-[#0D281E]/15 flex items-center justify-center mx-auto mb-4 text-[#0D281E] shadow-2xs">
          <Leaf className="w-7 h-7" />
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-[#0D281E]">
          Establish New Password
        </h2>
        <p className="mt-2 text-xs text-[#525A55]">
          Create a secure, memorable password for your patron account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E3DDD1] shadow-md space-y-6">
          <Suspense
            fallback={
              <div className="py-8 text-center text-xs text-[#718076]">
                Validating recovery link...
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
