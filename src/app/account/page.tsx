"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

interface AddressItem {
  id: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface OrderItemData {
  id: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  featuredImage?: string;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  createdAt: string;
  carrier?: string;
  trackingNumber?: string;
  items: OrderItemData[];
}

export default function CustomerAccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Address form modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    street: "",
    apartment: "",
    city: "",
    state: "Tamil Nadu",
    postalCode: "",
    phone: "",
    isDefault: true,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function loadAccountData() {
      try {
        const [meRes, ordersRes, addrRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/account/orders"),
          fetch("/api/account/addresses"),
        ]);

        if (meRes.status === 401) {
          router.push("/login?redirect=/account");
          return;
        }

        const meData = await meRes.json();
        const ordersData = await ordersRes.json();
        const addrData = await addrRes.json();

        if (!ignore && meData.success && meData.user) {
          setProfile(meData.user);
          setOrders(ordersData.orders || []);
          setAddresses(addrData.addresses || []);
        }
      } catch (err) {
        console.error("Account fetch error:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadAccountData();
    return () => {
      ignore = true;
    };
  }, [router, refreshKey]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to save address");
      } else {
        setActionSuccess("Shipping address saved successfully!");
        setShowAddressModal(false);
        setNewAddress({
          fullName: "",
          street: "",
          apartment: "",
          city: "",
          state: "Tamil Nadu",
          postalCode: "",
          phone: "",
          isDefault: false,
        });
        setRefreshKey((k) => k + 1);
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error("Save address error:", err);
      setActionError("Failed to save address.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setActionSuccess("Address removed.");
        setRefreshKey((k) => k + 1);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Delete address error:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Pending Payment</span>
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Confirmed</span>
          </span>
        );
      case "PROCESSING":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
      case "SHIPPED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>Shipped</span>
          </span>
        );
      case "DELIVERED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Delivered</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-[#0D281E]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Loading Your Sanctuary Profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Account Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#0D281E]/8 border border-[#0D281E]/15 flex items-center justify-center text-[#0D281E] shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-0.5">
                Member Sanctuary
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
                {profile?.name || "Customer"}
              </h1>
              <p className="text-xs text-[#525A55]">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E3DDD1] gap-6 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-[#0D281E] text-[#0D281E]"
                : "border-transparent text-[#82947B] hover:text-[#0D281E]"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "addresses"
                ? "border-[#0D281E] text-[#0D281E]"
                : "border-transparent text-[#82947B] hover:text-[#0D281E]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-[#0D281E] text-[#0D281E]"
                : "border-transparent text-[#82947B] hover:text-[#0D281E]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E3DDD1] space-y-3">
                <ShoppingBag className="w-10 h-10 text-[#82947B] mx-auto opacity-50" />
                <h3 className="font-display text-base font-bold text-[#0D281E]">
                  No orders placed yet
                </h3>
                <p className="text-xs text-[#525A55] max-w-sm mx-auto">
                  Discover our pure South Indian herbal soaps and scalp elixirs crafted with
                  traditional Ayurvedic wisdom.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex px-6 py-2.5 rounded-full bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider"
                  >
                    Explore Dispensary
                  </Link>
                </div>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#E3DDD1] overflow-hidden shadow-2xs p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0ECE1]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#0D281E]">
                          {order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <span className="text-[11px] text-[#82947B] mt-0.5 block">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#0D281E]">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <span className="text-[10px] text-[#82947B] block">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>

                  {/* Order Line Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FAFBF9] border border-[#E3DDD1] overflow-hidden shrink-0 flex items-center justify-center">
                            {item.featuredImage ? (
                              <img
                                src={item.featuredImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-[#82947B]" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-[#0D281E] block">
                              {item.productName}
                            </span>
                            <span className="text-[10px] text-[#82947B]">
                              Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold text-[#0D281E]">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#0D281E]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Truck className="w-4 h-4 text-[#82947B]" />
                        <span>Carrier: {order.carrier || "Delivery Partner"}</span>
                      </span>
                      <span className="font-mono text-[11px] bg-[#FAFBF9] px-2.5 py-1 rounded-md border border-[#E3DDD1]">
                        AWB: {order.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display text-base font-bold text-[#0D281E]">
                  Delivery Addresses
                </h3>
                <p className="text-xs text-[#525A55]">
                  Manage dispatch addresses for swift delivery across India
                </p>
              </div>

              <button
                onClick={() => setShowAddressModal(true)}
                className="px-5 py-2.5 rounded-full bg-[#0D281E] text-white hover:bg-[#1A4533] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white rounded-3xl p-6 border transition-all relative flex flex-col justify-between ${
                    addr.isDefault
                      ? "border-[#0D281E] shadow-xs"
                      : "border-[#E3DDD1] shadow-2xs"
                  }`}
                >
                  <div className="space-y-2">
                    {addr.isDefault && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                        Default Address
                      </span>
                    )}
                    <h4 className="font-bold text-sm text-[#0D281E]">{addr.fullName}</h4>
                    <p className="text-xs text-[#455048] leading-relaxed">
                      {addr.street}
                      {addr.apartment && `, ${addr.apartment}`}
                      <br />
                      {addr.city}, {addr.state} — {addr.postalCode}
                      <br />
                      Phone: {addr.phone}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0ECE1] flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E3DDD1] shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                    <h3 className="font-display text-base font-bold text-[#0D281E]">
                      Add New Delivery Address
                    </h3>
                    <button
                      onClick={() => setShowAddressModal(false)}
                      className="text-[#82947B] hover:text-[#0D281E] cursor-pointer text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddAddress} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1">
                        Recipient Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) =>
                          setNewAddress((p) => ({ ...p, fullName: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress((p) => ({ ...p, street: e.target.value }))
                        }
                        placeholder="House no, Street name, Area"
                        className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress((p) => ({ ...p, city: e.target.value }))
                          }
                          className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress((p) => ({ ...p, state: e.target.value }))
                          }
                          className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.postalCode}
                          onChange={(e) =>
                            setNewAddress((p) => ({ ...p, postalCode: e.target.value }))
                          }
                          placeholder="600001"
                          className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525A55] mb-1">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress((p) => ({ ...p, phone: e.target.value }))
                          }
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#10281D]">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) =>
                            setNewAddress((p) => ({ ...p, isDefault: e.target.checked }))
                          }
                          className="w-4 h-4 rounded text-[#0D281E] focus:ring-[#0D281E]"
                        />
                        <span>Set as Default Address</span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="px-4 py-2 border border-[#DCE3DB] rounded-xl text-xs text-[#525A55] hover:bg-[#FAFBF9]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0D281E] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1A4533]"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] max-w-xl space-y-4">
            <h3 className="font-display text-base font-bold text-[#0D281E] pb-3 border-b border-[#F0ECE1]">
              Personal Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#82947B] block">
                  Name
                </span>
                <span className="text-[#0D281E] font-medium">{profile?.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#82947B] block">
                  Email
                </span>
                <span className="text-[#0D281E] font-medium">{profile?.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#82947B] block">
                  Role
                </span>
                <span className="text-[#0D281E] font-medium capitalize">{profile?.role}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#82947B] block">
                  Account Created
                </span>
                <span className="text-[#0D281E] font-medium">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
