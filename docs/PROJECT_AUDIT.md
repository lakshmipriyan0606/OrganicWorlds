# Pavishna Organic Worlds — Project Audit Report

**Audit Date:** 2026-10-30  
**Stack:** Next.js 16.4.2 (Turbopack, cacheComponents, partialPrefetching), React 19.3.0, TypeScript 5, Prisma 6.19.3, SQLite (`prisma/dev.db`), Tailwind CSS 4, Framer Motion 14, Razorpay (simulated/test mode)  
**Audited by:** Antigravity Principal Engineer Session

---

## Summary

| Category | Status |
|---|---|
| TypeScript | ✅ 0 errors |
| ESLint | ✅ 0 errors |
| Unit Test Suites (9/9) | ✅ PASSED |
| Playwright E2E (13/13) | ✅ PASSED |
| Production Build | ✅ exit code 0 |

---

## Mock Data Removed

| Item | File | Before | After |
|---|---|---|---|
| `bestSellerItems[]` | `PavishnaBestSellers.tsx` | Hardcoded 4-item array | Real DB query via `/api/products?bestSellers=true` |
| `mockProducts` search | `SiteHeader.tsx` | Filtered local array | Navigates to `/shop?search=<query>` |
| `mockProducts` shop fallback | `app/shop/page.tsx` | Used when DB empty | Honest error/empty state |
| `mockProducts` static params | `products/[slug]/page.tsx` | Generated from mock array | Generated from live DB slugs |
| `mockProducts` detail page | `products/[slug]/page.tsx` | Resolved from mock array | `getDbProductBySlug()` only |
| `mockProducts` related products | `products/[slug]/page.tsx` | Filtered from mock array | `getRelatedProducts()` from DB |
| Hardcoded featured product | `PavishnaFeaturedProduct.tsx` | Static product reference | DB-driven via CMS key |
| Hardcoded ritual categories | `PavishnaShopByRitual.tsx` | Static array | Dynamic `/api/categories` |
| `"19 formulations"` text | `admin/dashboard/page.tsx` | Hardcoded count | `{metrics?.totalProducts}` |

---

## Route Audit

### Storefront

| Route | Status | Notes |
|---|---|---|
| `/` (homepage) | ✅ PASS | All sections DB-driven; best sellers, featured product, shop-by-ritual all dynamic |
| `/shop` | ✅ PASS | Real server-side pagination, search, category filter, sort, price filter |
| `/shop?search=<q>` | ✅ PASS | Real DB text search via `/api/products` |
| `/categories` | ✅ PASS | DB-driven category listing |
| `/categories/[slug]` | ✅ PASS | DB-driven; shows real products for the category |
| `/products/[slug]` | ✅ PASS | Purely DB-driven; `notFound()` if missing/unpublished |
| `/cart` | ✅ PASS | Client-side cart with session persistence |
| `/checkout` | ✅ PASS | Requires auth; delivery address; order creation |
| `/order-confirmation/[id]` | ✅ PASS | Real order record |
| `/track` | ✅ PASS | Order tracking by email+order number |
| `/track/[token]` | ✅ PASS | Tokenized order tracking |
| `/account` | ✅ PASS | Protected; shows real orders and addresses |
| `/login`, `/register` | ✅ PASS | Real auth; session cookie |
| `/forgot-password`, `/reset-password` | ✅ PASS | Full password recovery flow |
| `/our-story`, `/contact` | ✅ PASS | Static content pages |

### Admin

| Route | Status | Notes |
|---|---|---|
| `/admin/login` | ✅ PASS | Separate admin auth |
| `/admin/dashboard` | ✅ PASS | Real metrics from DB (products, orders, revenue, customers) |
| `/admin/products` | ✅ PASS | DB-backed list, create, edit, archive, revalidates storefront cache |
| `/admin/products/new` | ✅ PASS | Form persists to DB |
| `/admin/products/[id]` | ✅ PASS | Edit and delete with revalidation |
| `/admin/categories` | ✅ PASS | DB-backed CRUD |
| `/admin/orders` | ✅ PASS | Real orders from DB; filter by status; update order status |
| `/admin/orders/[id]` | ✅ PASS | Full order detail; status update |
| `/admin/customers` | ✅ PASS | Real registered customer list |
| `/admin/inventory` | ✅ PASS | Stock adjust; revalidates `/products/[slug]` and `/shop` |
| `/admin/homepage` | ✅ PASS | CMS-driven hero and announcement editor |
| `/admin/media` | ✅ PASS | Upload, list, delete media assets |
| `/admin/settings` | ✅ PASS | Site settings management |

### API Routes

All auth-required API routes (`/api/admin/*`, `/api/account/*`, `/api/checkout/*`) return **401/403** for unauthenticated or unauthorized requests. All are marked `ƒ (Dynamic)` in the production build — they are never statically prerendered.

> **Note on `cookies()` build-time warnings:** During `next build`, Next.js 16 with `cacheComponents: true` probes every route handler. Routes that call `cookies()` emit a `HANGING_PROMISE_REJECTION` warning in build output. This is **expected and benign** — it is not an error. The route table confirms all such routes are classified `ƒ (Dynamic)` and served on-demand at runtime. `export const dynamic = 'force-dynamic'` is **not compatible** with `cacheComponents: true` in Next.js 16 and must not be used.

---

## Security Findings

| Finding | Status |
|---|---|
| Admin routes protected by `requireAdmin()` | ✅ Verified by E2E test |
| Customer routes protected by `requireAuth()` | ✅ Verified by E2E test |
| Cross-account order access denied | ✅ Verified by Playwright test "Step 5" |
| Non-admin blocked from product mutations | ✅ Verified by Playwright "Security" test |
| Session-less checkout API rejected 401 | ✅ Verified by Playwright "Security Gate" test |
| Razorpay HMAC signature verification | ✅ Implemented in `/api/checkout/razorpay/verify` |
| Rate limiting on checkout | ✅ `checkRateLimit()` in create-order route |
| Password hashing (bcrypt) | ✅ Implemented |
| Secure HTTP-only session cookie | ✅ Implemented |

---

## Known Non-Issues / Expected Behavior

- **Phase 04 CMS test file-deletion warning:** The CMS test attempts to delete a test upload file that was already cleaned up in a prior run. The test still passes — the service logs a warning and continues gracefully.
- **`cookies()` build-time prerender warnings:** Explained above. Not an error.

---

## Remaining Pre-Production Checklist (Not in Scope for This Audit)

- [ ] Migrate from SQLite to PostgreSQL for production (update `DATABASE_URL`)
- [ ] Configure real Razorpay live keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`)
- [ ] Replace local file upload storage with cloud storage (S3/GCS/Cloudinary)
- [ ] Set a strong `SESSION_SECRET` and `NEXTAUTH_SECRET` in production env
- [ ] Configure email provider for password recovery emails
- [ ] Set up CDN for static assets
- [ ] Enable HTTPS and HSTS
