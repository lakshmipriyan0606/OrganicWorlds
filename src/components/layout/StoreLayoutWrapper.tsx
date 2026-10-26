"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./AnnouncementBar";
import { SiteHeader } from "./SiteHeader";
import { CartDrawer } from "./CartDrawer";
import { SiteFooter } from "./SiteFooter";

function StoreLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<main className="flex-1 min-h-screen" />}>
      <StoreLayoutInner>{children}</StoreLayoutInner>
    </Suspense>
  );
}
