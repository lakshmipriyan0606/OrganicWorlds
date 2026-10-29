# Pavishna Organic Worlds — Feature Matrix

**Last Updated:** October 29, 2026 (Mandatory Customer Authentication & Checkout Security Audit Completed)  
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
| **Checkout** | Mandatory Authenticated Checkout | `VERIFIED_COMPLETE` | `src/app/checkout/page.tsx`, `/api/checkout/create-order` | Two-step checkout with mandatory authentication. Customer ID derived exclusively from verified session. Anonymous guest checkout completely disabled. Rate limited (10 req/min). |
| **Customer Accounts** | Real DB Login & Registration | `VERIFIED_COMPLETE` | `/login`, `/register`, `/api/auth/*` | Salted bcrypt (12 rounds), min 8-character password constraint, rate limiting (15 login/min, 10 reg/min), account enumeration prevented with identical 401s, demo credentials restricted strictly to dev/test. |
| **Customer Accounts** | Password Recovery & Reset | `VERIFIED_COMPLETE` | `/forgot-password`, `/reset-password`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `email-service.ts` | 64-char cryptographically secure tokens, SHA-256 hashed DB storage, 1-hour expiry, single-use enforcement, anti-enumeration identical 200 responses, rate limiting (5 req/15 min), configurable email service, and session revocation via `tokenVersion`. |
| **Customer Accounts** | Profile & Address Book | `VERIFIED_COMPLETE` | `/account`, `/api/account/addresses/*` | Live address management with create modal, default toggling, and authenticated delete strictly scoped to `userId: session.userId`. |
| **Customer Accounts** | Order History & Tracking | `VERIFIED_COMPLETE` | `/account`, `/api/account/orders`, `/order-confirmation/[id]` | Real-time customer order history strictly isolated by owner. Order confirmation page features strict cross-account IDOR protection rendering 404 for non-owners. |

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
| **Database** | Relational Database & ORM | `VERIFIED_COMPLETE` | `prisma/schema.prisma`, `src/lib/prisma.ts`, `dev.db` | Synchronized SQLite DB with 13 models (including PasswordResetToken and User.tokenVersion). Tested via Prisma Client. |
| **Database** | Database Migrations & Seeds | `VERIFIED_COMPLETE` | `prisma/seed.ts` | 19 products, categories, admin user, customer user, and CMS seeded. |
| **Security** | Role-Based Authentication & Session Security | `VERIFIED_COMPLETE` | `src/lib/auth.ts`, `src/proxy.ts`, `/api/auth/*` | HS256 signed JWT session tokens, HttpOnly SameSite=Lax cookies, admin proxy guards, session fixation prevention, and instant tokenVersion session invalidation. |
| **Security** | Rate Limiting Engine | `VERIFIED_COMPLETE` | `src/lib/rate-limit.ts` | In-memory sliding-window & distributed Upstash Redis rate limiter protecting login (15/min), register (10/min), forgot-password (5/15min), reset-password (10/15min), and order creation (10/min). |
| **Security** | Authoritative Server Pricing & Stock Checking | `VERIFIED_COMPLETE` | `src/lib/services/pricing-service.ts` | Client prices ignored; all line item costs and stock availability recalculated authoritatively against database. |
| **Payments** | Razorpay Order Creation | `VERIFIED_COMPLETE` | `/api/checkout/razorpay/create-order`, `payment-service.ts` | Server-side gateway order generation in paise, strictly checking order ownership against session (`403 Forbidden` if cross-account attempt). |
| **Payments** | HMAC Signature Verification | `VERIFIED_COMPLETE` | `/api/checkout/razorpay/verify`, `payment-service.ts` | Constant-time `crypto.timingSafeEqual` HMAC-SHA256 signature verification. Rejects fraudulent signatures, advances order to CONFIRMED, and idempotently decrements stock. |
| **Payments** | Webhook Processing | `VERIFIED_COMPLETE` | `/api/webhooks/razorpay`, `payment-service.ts` | Raw-body HMAC verification, idempotent handling of `payment.captured` and `payment.failed`. |
| **Fulfillment** | Public Customer Tracking Route | `VERIFIED_COMPLETE` | `src/app/track/[token]/page.tsx`, `/api/track/[token]` | Token-based botanical journey lookup (`/track/[token]`) with 4-step progressive timeline and carrier links. |
| **Testing** | Automated Regression & Security Suite | `VERIFIED_COMPLETE` | `tests/phase02` through `phase07`, `tests/audit-checkout-auth.test.ts`, `tests/password-reset.test.ts`, `tests/e2e-customer-journey.test.ts` | **157 automated tests passing across 9 test suites** covering auth, IDOR, session revocation, password reset cryptography, anti-enumeration, cart pricing, CMS, orders, Razorpay HMAC, webhooks, and full E2E customer journey. |
| **Testing** | Playwright Browser E2E Automation | `VERIFIED_COMPLETE` | `e2e/admin-dynamic-product.spec.ts`, `e2e/customer-checkout.spec.ts`, `playwright.config.ts` | **13/13 Playwright browser tests passing** across real Chromium: guest authentication gating, registration, order creation, payment verification, order history, IDOR protection, and complete 12-step dynamic product lifecycle (₹500 → ₹450 → offer ₹399 → stock 0 blocked → restore 10). |
| **Testing** | Unified Verification Command (`npm run test:full`) | `VERIFIED_COMPLETE` | `package.json` (`npm run test:full`) | Single repeatable master verification command executing all 9 unit/integration test suites, 13 Playwright browser E2E tests, TypeScript compilation, ESLint, and Next.js 16.4 production build. |
| **Build & Lint** | Clean Linter & Build | `VERIFIED_COMPLETE` | `npx tsc --noEmit` (0 errors), `npm run lint -- --quiet` (0 errors), Next.js 16.4 Turbopack build | Zero compiler warnings, zero lint errors, 79/79 routes generated cleanly. |
