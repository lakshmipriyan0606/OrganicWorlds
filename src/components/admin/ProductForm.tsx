"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface InitialProductData {
  id?: string;
  title?: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  categorySlug?: string;
  categoryLabel?: string;
  price?: number;
  originalPrice?: number;
  sku?: string;
  stockQuantity?: number;
  lowStockThreshold?: number;
  badge?: string;
  featuredImage?: string;
  ingredientsSummary?: string;
  ritualSteps?: string[];
  soapSpecs?: {
    soapType?: string;
    weightGrams?: number;
    curingWeeks?: number;
    scentProfile?: string;
  };
  isPublished?: boolean;
  inStock?: boolean;
}

interface ProductFormProps {
  initialData?: InitialProductData;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    subtitle: initialData?.subtitle || "",
    description: initialData?.description || "",
    categorySlug: initialData?.categorySlug || "soaps",
    categoryLabel: initialData?.categoryLabel || "Artisanal Bath Soaps",
    price: initialData?.price ? initialData.price.toString() : "420",
    originalPrice: initialData?.originalPrice ? initialData.originalPrice.toString() : "",
    sku: initialData?.sku || "",
    stockQuantity: initialData?.stockQuantity ? initialData.stockQuantity.toString() : "50",
    lowStockThreshold: initialData?.lowStockThreshold ? initialData.lowStockThreshold.toString() : "5",
    badge: initialData?.badge || "",
    featuredImage: initialData?.featuredImage || "/images/Img1.jpeg",
    ingredientsSummary: initialData?.ingredientsSummary || "",
    ritualStepsText: initialData?.ritualSteps ? initialData.ritualSteps.join("\n") : "",
    soapType: initialData?.soapSpecs?.soapType || "",
    weightGrams: initialData?.soapSpecs?.weightGrams ? initialData.soapSpecs.weightGrams.toString() : "125",
    curingWeeks: initialData?.soapSpecs?.curingWeeks ? initialData.soapSpecs.curingWeeks.toString() : "4",
    scentProfile: initialData?.soapSpecs?.scentProfile || "",
    isPublished: initialData?.isPublished ?? true,
    inStock: initialData?.inStock ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate slug from title if new
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isEdit ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      sku: isEdit ? prev.sku : prev.sku || `PV-${val.toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 6)}-125`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const ritualSteps = formData.ritualStepsText
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const soapSpecs = {
      soapType: formData.soapType || undefined,
      weightGrams: parseInt(formData.weightGrams, 10) || 125,
      curingWeeks: parseInt(formData.curingWeeks, 10) || 4,
      scentProfile: formData.scentProfile || undefined,
    };

    const payload = {
      title: formData.title,
      slug: formData.slug,
      subtitle: formData.subtitle || undefined,
      description: formData.description,
      categorySlug: formData.categorySlug,
      categoryLabel: formData.categorySlug === "soaps"
        ? "Artisanal Bath Soaps"
        : formData.categorySlug === "hair-care"
        ? "Botanical Hair & Scalp"
        : formData.categorySlug === "candles"
        ? "Artisan Candles"
        : "Royal Bath Gift Hampers",
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      sku: formData.sku,
      stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 5,
      badge: formData.badge || undefined,
      featuredImage: formData.featuredImage,
      images: [formData.featuredImage],
      ingredientsSummary: formData.ingredientsSummary || undefined,
      ritualSteps: ritualSteps.length > 0 ? ritualSteps : undefined,
      soapSpecs,
      inStock: formData.inStock,
      isPublished: formData.isPublished,
    };

    try {
      const url = isEdit && initialData?.id ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to save formulation.");
        setSaving(false);
        return;
      }

      setSuccessMessage(isEdit ? "Formulation updated successfully!" : "New formulation created!");
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1200);
    } catch {
      setErrorMessage("Network error occurred while saving.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Messages */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. Basic Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-5">
        <h3 className="font-display text-lg font-bold text-[#0D281E] border-b border-[#ECE7DC] pb-3">
          1. Formulation Essentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Vetti Veru Bath Soap"
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="vetti-veru-bath-soap"
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#0D281E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
            Subtitle / Brief Byline
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Authentic wild vetiver root cooling & grounding herbal bath bar"
            className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Botanical Category *
            </label>
            <select
              value={formData.categorySlug}
              onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
            >
              <option value="soaps">Artisanal Bath Soaps</option>
              <option value="hair-care">Botanical Hair & Scalp</option>
              <option value="candles">Artisan Candles</option>
              <option value="gifting">Royal Bath Gift Hampers</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Highlight Badge (Optional)
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. Bestseller, Organic, Small Batch"
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
            Full Description *
          </label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detail traditional herbs, saponification, benefits, and aroma..."
            className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
          />
        </div>
      </div>

      {/* 2. Pricing & Stock Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-5">
        <h3 className="font-display text-lg font-bold text-[#0D281E] border-b border-[#ECE7DC] pb-3">
          2. Pricing & Stock Governance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Selling Price (INR ₹) *
            </label>
            <input
              type="number"
              required
              step="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="420"
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-[#0D281E]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              MRP / Original Price (INR ₹)
            </label>
            <input
              type="number"
              step="1"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              placeholder="480"
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Product SKU *
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="PV-VET-125"
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#0D281E]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Units in Inventory *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Low Stock Warning Threshold
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#12281D]">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-800"
            />
            <span>Available In Stock</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#12281D]">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-800"
            />
            <span>Published on Live Storefront</span>
          </label>
        </div>
      </div>

      {/* 3. Imagery Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-5">
        <h3 className="font-display text-lg font-bold text-[#0D281E] border-b border-[#ECE7DC] pb-3">
          3. Media & Product Photography
        </h3>

        <div>
          <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
            Featured Image Path / URL *
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              required
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              placeholder="/images/Img1.jpeg or https://..."
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#0D281E]"
            />
            {formData.featuredImage && (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#DCE3DB] bg-ivory-100 shrink-0">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <p className="text-[11px] text-[#6E7B73] mt-1">
            Standard local images: /images/Img1.jpeg, /images/img3.jpeg, /images/img4.jpeg, /images/hero-hair-oil.jpg
          </p>
        </div>
      </div>

      {/* 4. Botanical Craft & Ritual Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs space-y-5">
        <h3 className="font-display text-lg font-bold text-[#0D281E] border-b border-[#ECE7DC] pb-3">
          4. Botanical Specifications & Ritual Guidelines
        </h3>

        <div>
          <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
            Ingredients Summary
          </label>
          <textarea
            rows={2}
            value={formData.ingredientsSummary}
            onChange={(e) => setFormData({ ...formData, ingredientsSummary: e.target.value })}
            placeholder="Cold-Pressed Virgin Coconut Oil, Wild Vetti Veru Roots, Castor Seed Oil..."
            className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
            Ritual Steps (One instruction per line)
          </label>
          <textarea
            rows={3}
            value={formData.ritualStepsText}
            onChange={(e) => setFormData({ ...formData, ritualStepsText: e.target.value })}
            placeholder="Work into a creamy botanical lather.&#10;Gently massage across skin breathing in the root aroma.&#10;Rinse with lukewarm water."
            className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Weight (Grams)
            </label>
            <input
              type="number"
              value={formData.weightGrams}
              onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Natural Curing Period (Weeks)
            </label>
            <input
              type="number"
              value={formData.curingWeeks}
              onChange={(e) => setFormData({ ...formData, curingWeeks: e.target.value })}
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#263D32] mb-1.5">
              Scent Profile
            </label>
            <input
              type="text"
              value={formData.scentProfile}
              onChange={(e) => setFormData({ ...formData, scentProfile: e.target.value })}
              placeholder="Deep earthy vetiver roots & forest dew"
              className="w-full p-2.5 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0D281E]"
            />
          </div>
        </div>
      </div>

      {/* Form Bottom Actions */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <Link
          href="/admin/products"
          className="px-6 py-2.5 rounded-full border border-[#DCE3DB] text-[#263D32] hover:bg-white text-xs font-semibold cursor-pointer"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-full bg-[#0D281E] hover:bg-[#1A4533] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-transform hover:scale-102 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Formulation..." : isEdit ? "Update Formulation" : "Create Formulation"}</span>
        </button>
      </div>
    </form>
  );
}
