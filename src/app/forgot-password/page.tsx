"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Leaf,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An error occurred while requesting password recovery.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error("Forgot password request failure:", err);
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
          Account Recovery
        </h2>
        <p className="mt-2 text-xs text-[#525A55]">
          Restore access to your Pavishna Organic Worlds patron sanctuary
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E3DDD1] shadow-md space-y-6">
          {submitted ? (
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#EBF7EE] border border-[#CEE9D9] flex items-center justify-center mx-auto text-[#1B633E]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-[#0D281E]">
                  Recovery Link Dispatched
                </h3>
                <p className="text-xs text-[#525A55] leading-relaxed">
                  If an account is associated with{" "}
                  <strong className="text-[#0D281E] font-medium">{email}</strong>, a
                  single-use, time-limited reset link has been dispatched to your inbox.
                </p>
                <div className="p-3 bg-[#F6F4EF] rounded-2xl border border-[#E3DDD1] text-[11px] text-[#718076] mt-4">
                  <div className="flex items-center justify-center gap-1 font-semibold text-[#0D281E] mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Mindful Security</span>
                  </div>
                  The link is valid for <strong>60 minutes</strong> and will expire automatically once consumed.
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <Link
                  href="/login"
                  className="w-full py-3 px-4 rounded-xl bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="text-xs text-[#718076] hover:text-[#0D281E] hover:underline"
                >
                  Didn&apos;t receive it? Try a different email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FED7D7] flex items-start gap-2.5 text-[#C53030]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{error}</span>
                </div>
              )}

              <p className="text-xs text-[#525A55] leading-relaxed">
                Enter your registered email address below. We will send a secure link to reset your password.
              </p>

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
                    placeholder="patron@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E] focus:ring-1 focus:ring-[#0D281E] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? "Sending Sacred Link..." : "Send Reset Link"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 border-t border-[#F0ECE1] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#525A55] hover:text-[#0D281E] font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
