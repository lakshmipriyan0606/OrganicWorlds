"use client";

import React, { useEffect, useState } from "react";
import { Users, Search, RefreshCw, Mail, Phone, ShoppingBag, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/customers");
        const data = await res.json();
        if (!ignore && data.success) {
          setCustomers(data.customers || []);
        }
      } catch (e) {
        console.error("Customers fetch error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="p-5 sm:p-8 lg:p-10 max-w-[1440px] mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#82947B] block mb-1">
            Customer Directory
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0D281E]">
            Registered Customers & Order History
          </h1>
          <p className="text-xs text-[#525A55] mt-1">
            View customer contact details, purchase volume, and total order spend
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setRefreshKey((k) => k + 1);
          }}
          className="p-2.5 rounded-full bg-white border border-[#DCE3DB] text-[#0D281E] hover:bg-[#FAFBF9] self-start sm:self-auto cursor-pointer"
          title="Refresh customers"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3DDD1] shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#82947B] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAFBF9] border border-[#DCE3DB] rounded-xl text-xs text-[#12281D] focus:outline-none focus:border-[#0D281E]"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-3xl border border-[#E3DDD1] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF9] border-b border-[#E3DDD1] text-[#82947B] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Completed Orders</th>
                <th className="py-3.5 px-6 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE7DC]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-[#525A55]">
                    Loading customer records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-[#525A55]">
                    No customer accounts found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAFBF9]/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-900/10 text-[#0D281E] font-bold text-xs flex items-center justify-center shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-[#0D281E] block">{c.name}</span>
                          <span className="text-[11px] text-[#6E7B73] font-mono">{c.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#525A55]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Mail className="w-3 h-3 text-[#82947B]" />
                          <span>{c.email}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#6E7B73]">
                            <Phone className="w-3 h-3 text-[#82947B]" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#6E7B73]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                        {c.orderCount} orders
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-[#0D281E] text-sm">
                      {formatCurrency(c.totalSpent)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
