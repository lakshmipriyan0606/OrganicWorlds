"use client";

import React, { useEffect, useState } from "react";
import { Layers, Plus, Edit, CheckCircle2, AlertCircle, RefreshCw, Box } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  _count?: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (!ignore && data.success) {
          setCategories(data.categories || []);
        }
      } catch (e) {
        console.error("Categories fetch error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormImage("/images/Img1.jpeg");
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || "");
    setFormImage(cat.image || "/images/Img1.jpeg");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          slug: formSlug,
          description: formDesc,
          image: formImage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`Category '${formName}' saved successfully.`);
        setTimeout(() => setMessage(null), 3000);
        setModalOpen(false);
        setRefreshKey((k) => k + 1);
      }
    } catch (e) {
      console.error("Category save error:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1440px] mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
            Store Taxonomy
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Category Management
          </h1>
          <p className="text-xs text-[#525A55] mt-1">
            Manage ritual collections, descriptions, imagery, and product assignments
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-transform hover:scale-102 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Category</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-[#525A55]">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#82947B]" />
            <span>Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-xs text-[#525A55] bg-white rounded-3xl border border-[#E3DDD1]">
            <span>No categories defined yet.</span>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-6 border border-[#E3DDD1] shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#DCE3DB] bg-ivory-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                        <Layers className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0D281E]">{cat.name}</h3>
                      <span className="text-[11px] font-mono text-[#82947B]">/{cat.slug}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200">
                    {cat._count?.products || 0} products
                  </span>
                </div>

                <p className="text-xs text-[#525A55] leading-relaxed mb-4">
                  {cat.description || "No description provided."}
                </p>
              </div>

              <div className="pt-4 border-t border-[#ECE7DC] flex justify-end">
                <button
                  onClick={() => openEditModal(cat)}
                  className="px-4 py-1.5 rounded-full border border-[#DCE3DB] text-xs font-semibold text-[#0D281E] hover:bg-[#FAFBF9] flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Category</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DCE3DB] shadow-2xl">
            <h3 className="font-display text-xl font-bold text-[#0D281E] mb-4">
              {editingCategory ? "Edit Category" : "New Botanical Category"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-[#263D32] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingCategory) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
                    }
                  }}
                  placeholder="e.g. Artisanal Bath Soaps"
                  className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#263D32] mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="soaps"
                  className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#0D281E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#263D32] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Summary of botanicals, herbs, and formulas in this collection..."
                  className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#263D32] mb-1">
                  Category Image URL
                </label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="/images/Img1.jpeg or https://..."
                  className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#0D281E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-full border border-[#DCE3DB] text-xs font-semibold text-[#525A55] hover:bg-[#FAFBF9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-[#0D281E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533] cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
