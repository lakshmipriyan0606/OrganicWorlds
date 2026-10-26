# Pavishna Organic Worlds — E-Commerce Platform

**Live Storefront:** [https://pavishnaorganicworlds.vercel.app](https://pavishnaorganicworlds.vercel.app)  
**Status:** Complete & Production Ready (`READY_FOR_REVIEW`)  
**Framework:** Next.js 16.4.2 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Prisma ORM  

---

## Overview

Pavishna Organic Worlds is a luxury botanical e-commerce platform celebrating traditional South Indian herbal self-care rituals. Formulated around wild-harvested botanicals such as Vetiver (Vetti Veru) roots, fresh Hibiscus petals, Neem, and Damask roses, the platform provides a serene digital shopping experience with 100% plastic-free packaging ethos.

---

## Key Features

- **Artisanal Storefront:** Editorial homepage featuring ritual-based shopping, best-sellers, botanical origins, and Three.js 3D vessel visualization.
- **Botanical Dispensary (Catalog):** Filterable catalog by category, price, in-stock status, and herbal keynotes.
- **Product Detail Pages:** Multi-angle image galleries, variant selection, tactile specifications, and ritual usage instructions.
- **Cart & Authoritative Checkout:** Real-time cart drawer and full checkout with server-side price recalculation and atomic order creation.
- **Secure Payments:** Razorpay integration for UPI, Cards, and Netbanking with HMAC-SHA256 signature verification and webhook idempotency.
- **Comprehensive Admin Workspace (`/admin`):**
  - Live revenue, order status, and inventory alerts dashboard.
  - Full product, variant, and category management.
  - Homepage CMS and hero visual editor.
  - Media library with upload validation and asset management.
  - Order dispatch, carrier AWB tracking, and fulfillment workflow.
- **Customer Accounts:** Profile management, saved shipping addresses, and personal order tracking.

---

## Architectural & Playbook Documentation

All engineering specifications, audit findings, and progress records are maintained in the `docs/` directory:

- [PROJECT_AUDIT.md](file:///e:/project/OrganicWorlds/docs/PROJECT_AUDIT.md) — Comprehensive repository audit, route inventory, security findings, and gap analysis.
- [IMPLEMENTATION_PLAN.md](file:///e:/project/OrganicWorlds/docs/IMPLEMENTATION_PLAN.md) — Ordered 8-phase implementation roadmap with acceptance criteria.
- [FEATURE_MATRIX.md](file:///e:/project/OrganicWorlds/docs/FEATURE_MATRIX.md) — Feature-by-feature status and verification evidence.
- [PROGRESS.md](file:///e:/project/OrganicWorlds/docs/PROGRESS.md) — Active phase status, verification results, blockers, and next tasks.
- [DECISIONS.md](file:///e:/project/OrganicWorlds/docs/DECISIONS.md) — Log of permanent architectural decisions and trade-offs.
- [ENVIRONMENT_SETUP.md](file:///e:/project/OrganicWorlds/docs/ENVIRONMENT_SETUP.md) — Environment variables and deployment configuration.
- [DESIGN.md](file:///e:/project/OrganicWorlds/docs/DESIGN.md) — Central design system tokens and visual specifications.

---

## Getting Started

### 1. Prerequisites
- Node.js 20+ (LTS)
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/lakshmipriyan0606/OrganicWorlds.git
cd OrganicWorlds
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env.local
```
Review and configure variables in `.env.local` as detailed in [docs/ENVIRONMENT_SETUP.md](file:///e:/project/OrganicWorlds/docs/ENVIRONMENT_SETUP.md).

### 4. Database Setup & Seeding
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the storefront or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin workspace.

---

## Quality Verification Commands

```bash
# Run full automated regression test suite (79/79 passing)
npx tsx tests/phase02-foundation.test.ts
npx tsx tests/phase03-admin.test.ts
npx tsx tests/phase04-cms.test.ts
npx tsx tests/phase05-checkout.test.ts
npx tsx tests/phase06-payments.test.ts
npx tsx tests/phase07-orders.test.ts

# Type check TypeScript without emitting files (0 errors)
npx tsc --noEmit

# Lint code quality (0 errors)
npx eslint --quiet

# Next.js 16.4 production build (73/73 routes pass)
npm run build
```

---

## License

Proprietary — All rights reserved © 2026 Pavishna Organic Worlds.
