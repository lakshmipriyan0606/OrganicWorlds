"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Copy,
  Check,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileCheck,
} from "lucide-react";

interface MediaAssetItem {
  id: string;
  filename: string;
  url: string;
  altText?: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export default function AdminMediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ignore = false;
    async function loadAssets() {
      try {
        const params = new URLSearchParams({
          limit: "50",
          search,
        });
        const res = await fetch(`/api/admin/media?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setAssets(data.assets || []);
        }
      } catch (err) {
        console.error("Failed to load media assets:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadAssets();
    return () => {
      ignore = true;
    };
  }, [search, refreshKey]);

  const handleFileUpload = async (file: File) => {
    // Client-side validation
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setActionError(
        `Unsupported file type '${file.type}'. Allowed formats: JPEG, PNG, WebP, AVIF, SVG.`
      );
      setTimeout(() => setActionError(null), 5000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setActionError(
        `File exceeds 5MB size limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).`
      );
      setTimeout(() => setActionError(null), 5000);
      return;
    }

    setUploading(true);
    setActionSuccess(null);
    setActionError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", file.name);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Upload failed");
      } else {
        setActionSuccess(`Asset '${file.name}' uploaded successfully!`);
        setTimeout(() => setActionSuccess(null), 4000);
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setActionError("Failed to upload image due to network error.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (asset: MediaAssetItem) => {
    if (!confirm(`Are you sure you want to delete '${asset.filename}'?`)) return;

    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to delete asset.");
      } else {
        setActionSuccess(`Asset '${asset.filename}' deleted.`);
        setTimeout(() => setActionSuccess(null), 4000);
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setActionError("Failed to delete media asset.");
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1560px] mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
            Media Asset Governance
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Apothecary Media Library
          </h1>
          <p className="text-xs text-[#525A55] mt-1">
            Centralized botanical photography, packaging labels, and promotional visual assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              setRefreshKey((k) => k + 1);
            }}
            className="p-2.5 rounded-full bg-white border border-[#DCE3DB] text-[#0D281E] hover:bg-[#FAFBF9] cursor-pointer"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <label className="px-5 py-2.5 rounded-full bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-transform hover:scale-102 cursor-pointer">
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? "Uploading..." : "Upload Image"}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileUpload(file);
        }}
        className="border-2 border-dashed border-[#DCE3DB] hover:border-[#0D281E] bg-white rounded-3xl p-8 text-center transition-colors cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-full bg-[#FAFBF9] border border-[#DCE3DB] flex items-center justify-center mx-auto mb-3 text-[#0D281E] group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h4 className="font-display text-sm font-bold text-[#0D281E]">
          Drag and drop your botanical assets here, or browse
        </h4>
        <p className="text-[11px] text-[#82947B] mt-1">
          Supports JPEG, PNG, WebP, AVIF, SVG up to 5MB. Unique cryptographic filenames assigned.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3DDD1] shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#82947B] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search assets by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
          />
        </div>

        <div className="text-xs text-[#525A55] font-medium">
          <span>{assets.length} Assets Registered</span>
        </div>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#82947B] flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading asset repository...</span>
        </div>
      ) : assets.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#E3DDD1] space-y-3">
          <ImageIcon className="w-10 h-10 text-[#82947B] mx-auto opacity-50" />
          <h4 className="font-display text-base font-bold text-[#0D281E]">
            No Media Assets Found
          </h4>
          <p className="text-xs text-[#525A55] max-w-md mx-auto">
            Upload your first formulation photo, herb ingredient snapshot, or packaging label to
            populate the media library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-[#E3DDD1] overflow-hidden shadow-2xs flex flex-col justify-between group hover:border-[#0D281E] transition-all"
            >
              {/* Image Preview */}
              <div className="relative aspect-square bg-[#FAFBF9] overflow-hidden flex items-center justify-center border-b border-[#F0ECE1]">
                <img
                  src={asset.url}
                  alt={asset.altText || asset.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/hero-hair-oil.jpg";
                  }}
                />
              </div>

              {/* Metadata & Actions */}
              <div className="p-3 space-y-2">
                <div>
                  <h5
                    className="text-[11px] font-bold text-[#0D281E] truncate"
                    title={asset.filename}
                  >
                    {asset.filename}
                  </h5>
                  <div className="flex items-center justify-between text-[10px] text-[#82947B] mt-0.5">
                    <span>{formatBytes(asset.fileSize)}</span>
                    <span className="uppercase">{asset.mimeType.split("/")[1]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-[#F0ECE1]">
                  <button
                    onClick={() => handleCopyUrl(asset.id, asset.url)}
                    className="flex-1 py-1.5 px-2 bg-[#FAFBF9] hover:bg-[#F2EFE9] border border-[#DCE3DB] rounded-lg text-[10px] font-bold text-[#0D281E] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Copy Image URL"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#82947B]" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(asset)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer transition-colors"
                    title="Delete media asset"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
