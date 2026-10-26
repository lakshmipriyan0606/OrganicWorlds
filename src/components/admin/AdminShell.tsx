"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Sparkles,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Homepage CMS", href: "/admin/homepage", icon: Sparkles },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login page, render clean container without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#F6F4EF]">{children}</div>;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#12281D] flex flex-col lg:flex-row antialiased">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-[#0D281E] text-white flex-col shrink-0 border-r border-[#1C3E2F]">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-white">
              Pavishna Admin
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#86B398]">
              Commerce Control
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? "bg-[#1E4D38] text-white shadow-xs font-semibold"
                    : "text-[#B4C7BD] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-[#86B398]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#B4C7BD] hover:bg-white/5 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#86B398]" />
              <span>View Storefront</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-[#0D281E] text-white flex items-center justify-between px-4 border-b border-[#1C3E2F]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-white/80 hover:text-white cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display text-sm font-bold text-white">Pavishna Admin</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-xs text-[#86B398] hover:text-white flex items-center gap-1"
        >
          <span>Store</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileSidebarOpen && (
        <div className="lg:hidden bg-[#0D281E] border-b border-[#1C3E2F] px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                  active ? "bg-[#1E4D38] text-white" : "text-[#B4C7BD]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-300 pt-3 border-t border-white/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
