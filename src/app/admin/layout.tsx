import React, { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center text-[#0D281E]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#0D281E] border-t-transparent animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Loading Apothecary Console...
            </span>
          </div>
        </div>
      }
    >
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
