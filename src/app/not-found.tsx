import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FAF8F5]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#0D281E]/5 text-[#0D281E] flex items-center justify-center mx-auto border border-[#E3DDD1]">
          <Compass className="w-8 h-8 text-[#0D281E]" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#82947B]">
            Error 404 — Botanical Mystery
          </span>
          <h1 className="font-display text-3xl font-bold text-[#0D281E]">
            Sanctuary Not Found
          </h1>
          <p className="text-xs text-[#525A55] leading-relaxed max-w-sm mx-auto">
            The botanical ritual or patron document you are seeking has either dissolved or is restricted to its rightful caretaker.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533] transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Apothecary</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
