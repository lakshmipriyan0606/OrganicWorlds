# Pavishna Organic Worlds — Comprehensive Repository Audit & Gap Analysis

**Date:** October 26, 2026  
**Auditor:** Principal Software & E-Commerce Systems Architect  
**Playbook Phase:** Prompt 01 — Repository Audit, Feature Gap Analysis, and Roadmap  
**Target Platform:** Pavishna Organic Worlds (https://pavishnaorganicworlds.vercel.app)  

---

## 1. Executive Summary

A comprehensive architectural and functional audit of the `OrganicWorlds` repository was conducted. 

The application currently represents a visually stunning, editorial botanical storefront built with **Next.js 16.4.2 (App Router)**, **React 19.3.0**, **TypeScript 5.x**, and **Tailwind CSS v4**. It features rich handcrafted visual assets for South Indian herbal bath soaps (Vetti Veru, Hibiscus Rosa, Neem, etc.) and botanical hair oils, complete with smooth animations (Framer Motion) and 3D WebGL scenes (Three.js).

However, from an **e-commerce engineering and production standpoint**, the current system is essentially a **static prototype / frontend mockup**:
1. **Zero Database / ORM Layer:** No database (SQLite, PostgreSQL, MySQL) is integrated. No ORM (Prisma, Drizzle) exists. Products, categories, and reviews are static arrays defined in `src/config/products.ts`.
2. **Zero Backend API Layer:** No Next.js API routes or server actions exist under `src/app/api`.
3. **Simulated Checkout:** In `src/app/cart/page.tsx`, checkout execution is simulated with a client-side `setTimeout` (1500ms) that clears `localStorage` and renders a mock confirmation screen.
4. **Zero Authentication & Authorization:** No customer login/registration or administrator authentication exists. The header user icon merely links to `/contact`.
5. **Completely Missing Admin Workspace:** There is no `/admin` route or backend capability to manage inventory, update product prices, view orders, upload media, or edit homepage copy.
6. **Hardcoded CMS Content:** All homepage banners, hero headlines, ritual steps, and announcements are hardcoded in React components. A business owner cannot change content without code edits and deployments.
7. **Linter & Code Quality Baseline:** `npx tsc --noEmit` passes with 0 type errors. `npm run build` succeeds generating 34 prerendered pages. However, `npm run lint` surfaced 2 ESLint errors (`react-hooks/set-state-in-effect` in `SiteHeader.tsx` and `@typescript-eslint/no-explicit-any` in `PavishnaBestSellers.tsx`) plus 65 warnings.

To achieve production readiness as demanded by the 8-Phase Master Playbook, the project requires establishing a robust database and ORM foundation, server-side authentication, authoritative pricing and cart recalculation, an administrative control panel, a live homepage CMS and media manager, Razorpay payment processing with signed webhooks, full order lifecycle state management, and end-to-end automated tests.

---

## 2. Actual Architecture & Route Inventory

### 2.1 Technology Stack
- **Framework:** Next.js 16.4.2 (App Router, Turbopack, Partial Prerendering enabled)
- **Runtime & UI Library:** Node.js (Windows x64), React 19.3.0, React DOM 19.3.0
- **Language:** TypeScript 5.x (Strict mode enabled)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/turbopack`), custom CSS variables in `src/app/globals.css`, `design-system.css`
- **Typography:** Google Fonts loaded via `next/font/google` (`Bodoni_Moda` display font, `Manrope` body font)
- **Animations & 3D:** Framer Motion 14.6.0, Three.js 0.186.1, Lucide React 1.61.0
- **Client State:** React Context (`CartContext.tsx`) persisted to browser `localStorage`
- **Database & ORM:** None currently installed
- **Authentication:** None currently installed

### 2.2 Route Inventory
| Route Path | Type | Current Status | Behavior / Findings |
|---|---|---|---|
| `/` | Client Page (`"use client"`) | `PARTIALLY_IMPLEMENTED` | Renders rich botanical homepage sections (Hero, Ritual Mosaic, Bestsellers, Spotlight, Heritage, Sourcing, Reviews, Packaging, Regimen, Journal). All data hardcoded. Contains client toast notification on quick-add. |
| `/shop` | Client Page (`"use client"`) | `PARTIALLY_IMPLEMENTED` | Comprehensive catalog view with category filters, price slider (up to ₹6,000), keynote filters, and sorting. Reads from `mockProducts` in `src/config/products.ts`. Quick-add connects to `CartContext`. |
| `/categories` | Server Page | `PARTIALLY_IMPLEMENTED` | Grid of 4 categories: Artisanal Bath Soaps, Botanical Hair & Scalp, Artisan Candles, Gifting & Hampers. Links to `/categories/[slug]`. |
| `/categories/[slug]` | Server Page (Dynamic) | `PARTIALLY_IMPLEMENTED` | Generates static params for all 4 categories. Renders filtered product grid. Reads from `src/config/products.ts`. |
| `/products/[slug]` | Server Page (Dynamic) | `PARTIALLY_IMPLEMENTED` | Generates static params for 19 mock products. Renders `ProductDetailView` with image gallery, variant selection, botanical specifications, ritual instructions, mock reviews, and related items. |
| `/our-story` | Server Page | `VERIFIED_COMPLETE` | Rich editorial brand story on South Indian herbal heritage, cold-process saponification, 4-step farm-to-ritual flow, and plastic-free packaging. |
| `/cart` | Client Page (`"use client"`) | `BROKEN` (Simulated) | Cart view with free shipping progress bar, quantity controls, and item removal. Checkout triggers fake `setTimeout` and fake order success. No server validation, no persistence, no payment gateway. |
| `/contact` | Client Page (`"use client"`) | `PARTIALLY_IMPLEMENTED` | Studio contact information and inquiry form. Form submission is mock (`setSubmitted(true)`); no email or database action is executed. Studio address mentions outdated "Earth & Essence" branding. |
| `/admin/*` | N/A | `MISSING` | No administrative routes, dashboard, or management capabilities exist. |
| `/login`, `/register`, `/account` | N/A | `MISSING` | No customer authentication, password management, profile, address book, or order history routes exist. |
| `/api/*` | N/A | `MISSING` | No backend API route handlers or server actions exist. |

---

## 3. Page-by-Page and Business Workflow Audit

### 3.1 Product Discovery & Catalog
- **Data Source:** Static TypeScript array `mockProducts` in `src/config/products.ts`.
- **Strengths:** Detailed botanical attributes (`ingredientsSummary`, `ritualSteps`, `soapSpecs`, `variants`).
- **Gaps:** Products cannot be created, updated, or marked out-of-stock without code edits. Category relationships are hardcoded strings. No real inventory counts or stock thresholds.

### 3.2 Cart & Authoritative Pricing
- **Implementation:** `src/components/cart/CartContext.tsx` stores cart items in browser `localStorage`.
- **Security Vulnerability:** Pricing calculations, subtotal, and free shipping checks occur entirely in the client's browser. If a user modifies `localStorage` or manipulates client payload, the application has no backend validation to detect price tampering.
- **Gaps:** Cart is not backed by server session; no reservation of inventory; no validation against current database stock.

### 3.3 Checkout & Order Creation
- **Implementation:** `src/app/cart/page.tsx` contains an HTML form. `handleCheckout` calls `setTimeout(() => setOrderPlaced(true), 1500)`.
- **Defects:** No order record is created in any database. No order ID or tracking code is generated. No payment is initiated. Customer receives false confirmation.

### 3.4 Payment Processing
- **Current State:** Completely absent.
- **Requirement:** Razorpay integration as the primary payment gateway for India (INR ₹ transactions, UPI, cards, netbanking), with server-side order creation, HMAC-SHA256 signature verification, raw-body webhook handling, idempotency, and reconciliation.

### 3.5 Order Fulfilment & Tracking
- **Current State:** Completely absent.
- **Requirement:** Order state machine (`PENDING_PAYMENT`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `REFUNDED`), tracking number and carrier assignment, and customer-facing order status timeline.

### 3.6 Homepage CMS & Media Management
- **Current State:** All hero text, images (`/images/hero-hair-oil.jpg`), and promotional banners are hardcoded inside JSX in `src/components/home/`.
- **Requirement:** Admin interface allowing business owners to upload images, update announcements, change hero headlines and CTAs, toggle section visibility, and revalidate the Next.js cache.

---

## 4. Admin Panel Specification

To fulfill the requirements of Prompts 03, 04, and 07, the administrative interface must be structured as follows:

```
/admin
├── /admin/login                 # Secure credentials entry & session cookie creation
├── /admin/dashboard             # Metrics: revenue, order count by status, low-stock alerts
├── /admin/products              # Product listing, search, category filter, stock status
│   ├── /admin/products/new      # Product creation with validation & image upload
│   └── /admin/products/[id]     # Product editing, price/variant management, inventory adjust
├── /admin/categories            # Category CRUD (name, slug, description, image)
├── /admin/inventory             # Stock monitoring, low-stock threshold, manual adjustment history
├── /admin/orders                # Order list with status filters, date range, search
│   └── /admin/orders/[id]       # Order detail, items snapshot, payment status, dispatch & tracking
├── /admin/customers             # Customer directory and order history
├── /admin/media                 # Media library: upload, preview, replace, usage references
├── /admin/homepage              # Hero visual editor, announcement bar, section visibility
└── /admin/settings              # Store settings, tax rates, shipping fee threshold
```

All `/admin` routes must be protected server-side via middleware and server-level role verification (`role === 'ADMIN'`).

---

## 5. Security and Data Integrity Findings

| ID | Issue Description | Severity | Impact | Source File Reference | Recommended Remedy |
|---|---|---|---|---|---|
| SEC-01 | Client-Side Authoritative Pricing | **CRITICAL** | Clients can tamper with prices or quantities in localStorage/request body to purchase products at arbitrary amounts. | `src/app/cart/page.tsx`<br>`src/components/cart/CartContext.tsx` | All prices and totals must be authoritatively calculated server-side from database records during order creation. |
| SEC-02 | Unauthenticated Admin Access Risk | **HIGH** | If admin endpoints are created without strict session checks, unauthenticated users could access sensitive store data. | Missing `/admin` / API routes | Enforce HTTP-only, secure, SameSite session cookies validated via Next.js middleware and server actions. |
| SEC-03 | Fake Order Placement | **HIGH** | Users are misled to believe an order was placed when no order data is persisted or validated. | `src/app/cart/page.tsx:29-37` | Replace simulated handler with server-side order creation transaction. |
| SEC-04 | Inconsistent Brand Identity in Contact Page | **LOW** | Studio address and email reference "Earth & Essence Botanicals" (`concierge@earthandessence.in`) instead of "Pavishna Organic Worlds". | `src/app/contact/page.tsx:48-56` | Update all branding, emails, and physical contact details to Pavishna Organic Worlds. |
| LINT-01 | ESLint Error: `react-hooks/set-state-in-effect` | **MEDIUM** | Synchronous setState in `useEffect` triggers cascading re-renders in root layout header. | `src/components/layout/SiteHeader.tsx:22` | Refactor hydration mounting check or use lazy state initialization. |
| LINT-02 | ESLint Error: `@typescript-eslint/no-explicit-any` | **MEDIUM** | Explicit `any` type used for props. | `src/components/home/PavishnaBestSellers.tsx:10` | Type callback strictly as `(product: Product) => void`. |

---

## 6. Data Model & API Gap Analysis

### 6.1 Database Schema Required (Prisma ORM)
The following relational models must be implemented:
1. **User:** `id`, `name`, `email`, `passwordHash`, `role` (`CUSTOMER` | `ADMIN`), `phone`, `createdAt`, `updatedAt`
2. **Address:** `id`, `userId`, `fullName`, `addressLine1`, `addressLine2`, `city`, `state`, `postalCode`, `phone`, `isDefault`
3. **Category:** `id`, `name`, `slug`, `description`, `image`, `order`, `isActive`
4. **Product:** `id`, `name`, `slug`, `subtitle`, `description`, `categorySlug`, `price`, `originalPrice`, `sku`, `stockQuantity`, `lowStockThreshold`, `inStock`, `isPublished`, `badge`, `featuredImage`, `images`, `ingredientsSummary`, `ritualSteps`, `soapSpecs` (JSON), `createdAt`, `updatedAt`
5. **ProductVariant:** `id`, `productId`, `name`, `sku`, `price`, `stockQuantity`, `inStock`
6. **Order:** `id`, `orderNumber`, `userId` (optional for guest), `guestEmail`, `guestPhone`, `status` (`PENDING_PAYMENT`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`), `totalAmount`, `subtotal`, `discountAmount`, `shippingAmount`, `taxAmount`, `shippingAddress` (JSON), `billingAddress` (JSON), `carrier`, `trackingNumber`, `trackingUrl`, `shippedAt`, `deliveredAt`, `createdAt`, `updatedAt`
7. **OrderItem:** `id`, `orderId`, `productId`, `variantId`, `productNameSnapshot`, `variantNameSnapshot`, `unitPriceSnapshot`, `quantity`, `totalPrice`
8. **Payment:** `id`, `orderId`, `gateway` (`RAZORPAY` | `STRIPE` | `COD`), `gatewayOrderId`, `gatewayPaymentId`, `gatewaySignature`, `status` (`PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`), `amount`, `currency`, `rawResponse` (JSON), `createdAt`
9. **HomepageContent:** `id`, `key`, `data` (JSON), `updatedAt`
10. **MediaAsset:** `id`, `filename`, `url`, `altText`, `fileSize`, `mimeType`, `createdAt`

### 6.2 Essential API Endpoints Required
- `POST /api/auth/register` — Customer account registration
- `POST /api/auth/login` — Authentication & session cookie issuance
- `POST /api/auth/logout` — Session termination
- `GET /api/auth/me` — Current user context
- `GET /api/products` — Catalog query with filters & pagination
- `GET /api/products/[slug]` — Product detail lookup
- `POST /api/checkout/create-order` — Authoritative price calculation, stock check, order & payment intent creation
- `POST /api/payments/razorpay/verify` — HMAC signature verification & order confirmation
- `POST /api/payments/razorpay/webhook` — Async payment event ingestion with signature verification
- `GET /api/customer/orders` — Customer order history
- `GET /api/orders/track/[token]` — Privacy-preserving order status lookup
- `GET/POST /api/admin/*` — Protected administrative endpoints for metrics, products, orders, media, and homepage CMS

---

## 7. Baseline Tests and Quality Checks

The following automated checks were executed during this audit:
1. **TypeScript Type Check:**
   - Command: `npx tsc --noEmit`
   - Result: **PASS** (0 errors).
2. **ESLint Code Quality Check:**
   - Command: `npx eslint --quiet`
   - Result: **FAIL (2 errors)**:
     - `src/components/home/PavishnaBestSellers.tsx:10:25` (`@typescript-eslint/no-explicit-any`)
     - `src/components/layout/SiteHeader.tsx:22:5` (`react-hooks/set-state-in-effect`)
3. **Next.js Production Build:**
   - Command: `npm run build`
   - Result: **PASS** (Turbopack compiled in 4.0s; TypeScript in 2.4s; 34 static and partial prerendered pages generated successfully).

---

## 8. Client Decisions & External Dependencies

| Dependency | Current Status | Required Action / Decision |
|---|---|---|
| **Database Solution** | Not configured | Use SQLite via Prisma for immediate zero-friction local development and automated testing; configure Prisma schema to allow seamless transition to PostgreSQL (e.g. Supabase or Neon) for production deployment. |
| **Authentication Strategy** | Not configured | Implement secure, self-contained JWT / session cookie authentication with bcryptjs password hashing and role-based guards. |
| **Razorpay Gateway** | Credentials needed for live transactions | Implement server-side order creation and signature verification using test-mode API keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`); document required production keys in `docs/ENVIRONMENT_SETUP.md`. |
| **Media Storage** | Local filesystem (`public/images/`) | Support local server upload for development; provide abstraction interface for cloud storage (Cloudinary or AWS S3) for production deployments. |

---

## 9. Phased Implementation Roadmap

- **Phase 01:** Repository Audit, Feature Gap Analysis, and Roadmap (**Current — Audit Completed**)
- **Phase 02:** Secure Foundation, Data Model, Authentication, and API Architecture (Prisma ORM, SQLite/PostgreSQL schema, database seed with existing 19 products, auth service, middleware, input validation, and baseline unit tests).
- **Phase 03:** Complete Admin Panel and Product/Inventory Management (Admin layout, dashboard metrics, product & category CRUD, stock tracking, and inventory adjustments).
- **Phase 04:** Homepage CMS, Hero Editor, and Media Library (Dynamic homepage configuration, hero editor, persistent media manager, and on-demand cache revalidation).
- **Phase 05:** Customer Accounts, Product Discovery, Cart, and Checkout (Database-backed catalog, customer login/register, profile & address management, authoritative cart recalculation, and persistent order creation).
- **Phase 06:** Secure Payment Integration (Razorpay order initiation, client checkout modal, HMAC-SHA256 signature verification, webhook processing, idempotency, and reconciliation).
- **Phase 07:** Order Administration, Fulfilment, Delivery Tracking, and Notifications (Admin order management, status machine transitions, carrier tracking numbers, customer tracking view, and notification hooks).
- **Phase 08:** Full QA, Security Review, Production Readiness, and Final Documentation (Automated regression suite, security audit, performance review, documentation update, and release recommendation).

---

## 10. Exact Next Implementation Task

Proceed directly to **Prompt 02 — Secure Foundation, Data Model, Authentication, and API Architecture**:
1. Fix the 2 existing ESLint errors in `PavishnaBestSellers.tsx` and `SiteHeader.tsx`.
2. Install Prisma ORM, `@prisma/client`, `bcryptjs`, and validation libraries.
3. Define the relational Prisma schema matching the data model specification.
4. Create and run the initial database migration.
5. Seed the database with the 19 authentic Pavishna Organic Worlds products and categories from `src/config/products.ts`.
6. Implement server-side authentication, password hashing, and role-based middleware guards.
