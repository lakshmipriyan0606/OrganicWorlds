import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1440px] mx-auto w-full space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-[#82947B] hover:text-[#0D281E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product List</span>
        </Link>
      </div>

      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
          Catalog Creation
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
          Add New Botanical Formulation
        </h1>
        <p className="text-xs text-[#525A55] mt-1">
          Enter botanical attributes, ingredients, pricing, and upload imagery for the live dispensary.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
