"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, RefreshCw } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

interface InventoryLogItem {
  id: string;
  reason: string;
  delta: number;
  previousStock: number;
  newStock: number;
  createdAt: string;
}

interface ProductDetailData {
  id: string;
  title: string;
  slug: string;
  sku: string;
  [key: string]: unknown;
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          setInventoryLogs(data.inventoryLogs || []);
        }
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#525A55]">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#82947B]" />
        <span>Loading formulation data...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-12 text-center text-xs text-rose-700">
        <span>Formulation not found or has been deleted.</span>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1440px] mx-auto w-full space-y-8">
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
            Formulation Editor
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Edit {product.title}
          </h1>
          <p className="text-xs font-mono text-[#6E7B73] mt-1">SKU: {product.sku}</p>
        </div>

        <Link
          href={`/products/${product.slug}`}
          target="_blank"
          className="px-4 py-2 rounded-full border border-[#DCE3DB] text-[#0D281E] hover:bg-white text-xs font-semibold self-start sm:self-auto"
        >
          Preview on Storefront ↗
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Product Form */}
        <div className="lg:col-span-8">
          <ProductForm initialData={product} isEdit={true} />
        </div>

        {/* Right Column: Inventory Audit History for this Product */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#ECE7DC] pb-3">
            <Clock className="w-4 h-4 text-[#82947B]" />
            <h3 className="font-display text-sm font-bold text-[#0D281E]">
              Stock Movement History
            </h3>
          </div>

          {inventoryLogs.length === 0 ? (
            <p className="text-xs text-[#6E7B73] py-4 text-center">
              No stock movements recorded yet.
            </p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto divide-y divide-[#ECE7DC] text-xs">
              {inventoryLogs.map((log) => (
                <div key={log.id} className="pt-2.5 first:pt-0">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-[#0D281E]">{log.reason}</span>
                    <span
                      className={`font-mono font-bold ${
                        log.delta > 0 ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {log.delta > 0 ? `+${log.delta}` : log.delta}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#6E7B73] mt-0.5">
                    <span>
                      Stock: {log.previousStock} → {log.newStock}
                    </span>
                    <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
