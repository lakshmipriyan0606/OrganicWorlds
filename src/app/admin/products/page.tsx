"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Archive,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  categorySlug?: string;
  categoryLabel?: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  inStock: boolean;
  isPublished: boolean;
  featuredImage: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "15",
          search,
          category,
        });
        const res = await fetch(`/api/admin/products?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setProducts(data.products || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      } catch (e) {
        console.error("Products fetch error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [page, category, refreshKey]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const handleArchive = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to unpublish and archive '${title}'?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setActionSuccess(`Product '${title}' unpublished.`);
        setTimeout(() => setActionSuccess(null), 3000);
        setRefreshKey((k) => k + 1);
      }
    } catch (e) {
      console.error("Archive error:", e);
    }
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1440px] mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
            Apothecary Dispensary
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Product Catalog Management
          </h1>
          <p className="text-xs text-[#525A55] mt-1">
            Manage formulations, pricing, variants, and publication status ({total} formulations total)
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 rounded-full bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-transform hover:scale-102 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Product</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3DDD1] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#82947B] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={search}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-48 py-2 px-3 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
          >
            <option value="all">All Categories</option>
            <option value="soaps">Artisanal Bath Soaps</option>
            <option value="hair-care">Botanical Hair Care</option>
            <option value="candles">Artisan Candles</option>
            <option value="gifting">Royal Hampers</option>
          </select>

          <button
            onClick={() => {
              setLoading(true);
              setRefreshKey((k) => k + 1);
            }}
            className="p-2 rounded-xl bg-white border border-[#DCE3DB] text-[#0D281E] hover:bg-[#FAFBF9] cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Product Data Table */}
      <div className="bg-white rounded-3xl border border-[#E3DDD1] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF9] border-b border-[#E3DDD1] text-[#82947B] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE7DC]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#525A55]">
                    Loading formulations...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#525A55]">
                    No formulations match the query.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFBF9]/80 transition-colors">
                    {/* Title + Thumbnail */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.featuredImage}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover bg-ivory-100 border border-[#DCE3DB] shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="font-bold text-[#0D281E] hover:underline block truncate max-w-xs text-xs sm:text-sm"
                          >
                            {p.title}
                          </Link>
                          {p.subtitle && (
                            <span className="text-[11px] text-[#6E7B73] block truncate max-w-xs">
                              {p.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-[#525A55] font-medium">
                      {p.categoryLabel || p.categorySlug || "—"}
                    </td>

                    {/* SKU */}
                    <td className="py-4 px-4 font-mono text-[11px] text-[#6E7B73]">
                      {p.sku}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-[#0D281E]">
                      {formatCurrency(p.price)}
                    </td>

                    {/* Stock */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stockQuantity === 0
                          ? "bg-rose-100 text-rose-800"
                          : p.stockQuantity <= p.lowStockThreshold
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {p.stockQuantity} units
                      </span>
                    </td>

                    {/* Published State */}
                    <td className="py-4 px-4">
                      {p.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#6E7B73] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                          <span>Draft / Archived</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#82947B] hover:text-[#0D281E] rounded-lg hover:bg-black/5"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-1.5 text-[#82947B] hover:text-[#0D281E] rounded-lg hover:bg-black/5"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        {p.isPublished && (
                          <button
                            onClick={() => handleArchive(p.id, p.title)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Unpublish Product"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#ECE7DC] flex items-center justify-between text-xs text-[#525A55]">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE3DB] disabled:opacity-40 hover:bg-[#FAFBF9] cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE3DB] disabled:opacity-40 hover:bg-[#FAFBF9] cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
