# Pavishna Organic Worlds — Feature Matrix

**Last Updated:** October 26, 2026 (Phase 02 Completed)  
**Standard Status Values:** `VERIFIED_COMPLETE` | `PARTIALLY_IMPLEMENTED` | `BROKEN` | `MISSING` | `BLOCKED` | `NOT_TESTED`  

---

## 1. Storefront & Customer Experience

| Feature Area | Feature Item | Status | Evidence / Implementation Source | Notes & Target Phase |
|---|---|---|---|---|
| **Branding & Layout** | Botanical Header & Navigation | `VERIFIED_COMPLETE` | `src/components/layout/SiteHeader.tsx` | Hydration safe via `useSyncExternalStore`. Clean linting. Mobile drawer and search functional. |
| **Branding & Layout** | Announcement Bar with Ticker | `VERIFIED_COMPLETE` | `src/components/layout/AnnouncementBar.tsx` | Connected to dynamic CMS with threshold and active toggle. |
| **Branding & Layout** | Botanical Footer & Newsletter | `PARTIALLY_IMPLEMENTED` | `src/components/layout/SiteFooter.tsx` | UI complete; newsletter form only sets local component state. (Phase 05) |
| **Homepage** | Editorial Hero & Trust Strip | `VERIFIED_COMPLETE` | `src/components/home/PavishnaHero.tsx` | Connected to dynamic CMS hero props and fallback defaults. |
| **Homepage** | Shopping-by-Ritual Mosaic | `VERIFIED_COMPLETE` | `src/components/home/PavishnaShopByRitual.tsx` | Visual masonry grid linking to categories. |
| **Homepage** | Best-Sellers Carousel & Quick-Add | `VERIFIED_COMPLETE` | `src/components/home/PavishnaBestSellers.tsx` | Strictly typed `Product` callback. Quick add triggers animated toast notification. |
| **Homepage** | Brand Heritage & Sourcing | `VERIFIED_COMPLETE` | `src/components/home/PavishnaOurStoryHeritage.tsx` | Authentic botanical storytelling. |
| **Homepage** | Ingredients & Benefits Breakdown | `VERIFIED_COMPLETE` | `src/components/home/PavishnaIngredientOrigins.tsx` | Accurate botanical origins and benefits. |
| **Homepage** | 3-Step Tamil Sanctuary Regimen | `VERIFIED_COMPLETE` | `src/components/home/StitchSanctuaryRegimen.tsx` | Traditional Tamil self-care ritual flow. |
| **Homepage** | 3D Interactive Vessel Studio | `VERIFIED_COMPLETE` | `src/components/3d/ThreeProductViewer.tsx` | Interactive Three.js WebGL canvas with 360° rotation and mood lighting. |
| **Catalog** | Shop All Catalog | `VERIFIED_COMPLETE` | `src/app/shop/page.tsx`, `/api/products` | Dynamic catalog queries database with live multi-filtering (category, search, max price, stock) and sort options. |
| **Catalog** | Category Directory | `VERIFIED_COMPLETE` | `src/app/categories/page.tsx` | Queries live categories from database with accurate product counts. |
| **Catalog** | Dynamic Category Pages | `VERIFIED_COMPLETE` | `src/app/categories/[slug]/page.tsx` | Queries live database category and associated product formulations. |
| **Product Detail** | Rich Product Detail View | `VERIFIED_COMPLETE` | `src/app/products/[slug]/page.tsx`, `ProductDetailView.tsx` | Database product resolution with fallbacks, variant selectors, batch info, and ritual tabs. |
| **Customer Cart** | Slide-Over Cart Drawer | `VERIFIED_COMPLETE` | `src/components/layout/CartDrawer.tsx` | Real-time items, quantity change, free shipping threshold indicator, direct checkout link. |
| **Customer Cart** | Cart Page Review | `VERIFIED_COMPLETE` | `src/app/cart/page.tsx` | Full review of bag items, gift notes, price breakdown, and direct link to real checkout. |
| **Checkout** | Real Server Checkout | `VERIFIED_COMPLETE` | `src/app/checkout/page.tsx`, `/api/checkout/create-order` | Server-authoritative checkout with Zod validation, pricing recalculation, and atomic DB order persistence. |
| **Customer Accounts** | Login & Registration | `VERIFIED_COMPLETE` | `/login`, `/register`, `/api/auth/*` | Full frontend portals with botanical styling, bcrypt validation, and secure session cookies. |
| **Customer Accounts** | Profile & Address Book | `VERIFIED_COMPLETE` | `/account`, `/api/account/addresses/*` | Live address management with create modal, default toggling, and authenticated delete. |
| **Customer Accounts** | Order History & Tracking | `VERIFIED_COMPLETE` | `/account`, `/api/account/orders`, `/order-confirmation/[id]` | Real-time customer order history with status badges, line items, and confirmation views. |

---

## 2. Administration & Content Management

| Feature Area | Feature Item | Status | Evidence / Implementation Source | Notes & Target Phase |
|---|---|---|---|---|
| **Admin Layout** | Responsive Admin Shell | `VERIFIED_COMPLETE` | `src/components/admin/AdminShell.tsx`, `src/app/admin/layout.tsx` | Dark botanical sidebar, active navigation, mobile drawer, logout. |
| **Admin Overview** | Dashboard Metrics | `VERIFIED_COMPLETE` | `src/app/admin/dashboard/page.tsx`, `/api/admin/metrics` | Live database metrics for revenue, order states, catalog size, and low stock items. |
| **Catalog Admin** | Product CRUD & Image Select | `VERIFIED_COMPLETE` | `src/app/admin/products/*`, `ProductForm.tsx`, `/api/admin/products/*` | Paginated formulation table, search/filter, full botanical creation & edit forms. |
| **Catalog Admin** | Category Management | `VERIFIED_COMPLETE` | `src/app/admin/categories/page.tsx`, `/api/admin/categories` | Category list with formulation counts, create/update modal. |
| **Catalog Admin** | Inventory & Stock Adjustments | `VERIFIED_COMPLETE` | `src/app/admin/inventory/page.tsx`, `/api/admin/inventory/adjust` | Real-time batch stock tracking, threshold warnings, atomic stock adjustment with immutable log. |
| **Homepage CMS** | Hero Visual & Copy Editor | `VERIFIED_COMPLETE` | `src/app/admin/homepage/page.tsx`, `/api/admin/homepage`, `PavishnaHero.tsx` | Live WYSIWYG preview, full headline/subtitle/CTA/focal/opacity editing. |
| **Homepage CMS** | Announcement Bar Editor | `VERIFIED_COMPLETE` | `src/app/admin/homepage/page.tsx`, `AnnouncementBar.tsx` | Dynamic banner ticker text, threshold, and active toggle. |
| **Media Library** | Media Upload & Asset Browser | `VERIFIED_COMPLETE` | `src/app/admin/media/page.tsx`, `/api/admin/media/*`, `cms-service.ts` | 5MB size limit, MIME validation, copy-to-clipboard URL, referential safe delete. |
| **Order Admin** | Order Management Workspace | `VERIFIED_COMPLETE` | `src/app/admin/orders/page.tsx`, `/api/admin/orders` | View orders, filter by status, search by order number/customer, inspect item snapshots. |
| **Order Admin** | Status Machine Transitions | `VERIFIED_COMPLETE` | `src/app/admin/orders/[id]/page.tsx`, `order-service.ts` | Process, pack, ship, deliver, cancel, and refund orders with strict transition enforcement. |
| **Order Admin** | Shipping & Tracking Entry | `VERIFIED_COMPLETE` | `src/app/admin/orders/[id]/page.tsx`, `order-service.ts` | Assign carrier (Delhivery, BlueDart, DTDC, India Post, Shadowfax), AWB, and auto-generated tracking links. |

---

## 3. Backend, Security & Payments

| Feature Area | Feature Item | Status | Evidence / Implementation Source | Notes & Target Phase |
|---|---|---|---|---|
| **Database** | Relational Database & ORM | `VERIFIED_COMPLETE` | `prisma/schema.prisma`, `src/lib/prisma.ts`, `dev.db` | Synchronized SQLite DB with 12 models. Tested via Prisma Client. |
| **Database** | Database Migrations & Seeds | `VERIFIED_COMPLETE` | `prisma/seed.ts` | 19 products, categories, admin user, customer user, and CMS seeded. |
| **Security** | Role-Based Authentication | `VERIFIED_COMPLETE` | `src/lib/auth.ts`, `src/proxy.ts`, `/api/auth/*` | HTTP-only session cookies, bcryptjs, admin proxy guards. |
| **Security** | Authoritative Server Pricing | `VERIFIED_COMPLETE` | `src/lib/services/pricing-service.ts` | Strict stock checking and authoritative price recalculation from database. |
| **Payments** | Razorpay Order Creation | `VERIFIED_COMPLETE` | `/api/checkout/razorpay/create-order`, `payment-service.ts` | Server-side gateway order generation in paise, linked to Payment record. |
| **Payments** | HMAC Signature Verification | `VERIFIED_COMPLETE` | `/api/checkout/razorpay/verify`, `payment-service.ts` | Timing-safe HMAC-SHA256 signature verification advancing order to CONFIRMED and deducting stock. |
| **Payments** | Webhook Processing | `VERIFIED_COMPLETE` | `/api/webhooks/razorpay`, `payment-service.ts` | Raw-body HMAC verification, idempotent handling of `payment.captured` and `payment.failed`. |
| **Fulfillment** | Public Customer Tracking Route | `VERIFIED_COMPLETE` | `src/app/track/[token]/page.tsx`, `/api/track/[token]` | Token-based botanical journey lookup (`/track/[token]`) with 4-step progressive timeline and carrier links. |
| **Testing** | Automated Regression Suite | `VERIFIED_COMPLETE` | `tests/phase02` through `phase07` | 79 automated tests covering auth, cart recalculation, catalog, CMS, media, orders, Razorpay HMAC, and tracking. |
| **Build & Lint** | Clean Linter & Build | `VERIFIED_COMPLETE` | `npx tsc --noEmit` (0 errors), `npx eslint --quiet` (0 errors), `npm run build` (73 routes pass) | Next.js 16.4 Turbopack build passing cleanly with Partial Prerendering. |
