# System Architecture — Earth & Essence

## 1. Technical Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS v4 + Vanilla CSS Design System Tokens
- **Icons:** Lucide React + Material Symbols Outlined
- **State Management:** React Context (CartContext with localStorage persistence)
- **Fonts:** Next/Font with Google Fonts (`Bodoni_Moda` / `Cormorant_Garamond` + `Manrope` / `DM_Sans`)

## 2. Request & Data Flow
```
User Interaction
      │
      ▼
Client Components (Interactive: CartDrawer, FilterBar, VariantSelector)
      │
      ▼
CartContext / Filter State (Client-side memory + LocalStorage)
      │
      ▼
Server Components (Pages: layout.tsx, page.tsx, [slug]/page.tsx)
      │
      ▼
Mock Product & Content Catalog (src/config/products.ts, site.ts)
```

## 3. Directory Layout
```
OrganicWorlds/
├── docs/                      # Architectural & planning brain
│   ├── PRD.md                 # Product specifications
│   ├── ARCHITECTURE.md        # Technical design & stack
│   ├── DESIGN.md              # Master visual reference & token spec
│   ├── RULES.md               # AI & engineering constraints
│   ├── TASKS.md               # Phase-by-phase implementation checklist
│   ├── DECISIONS.md           # Log of permanent architectural decisions
│   ├── MEMORY.md              # Current execution state tracker
│   └── TEST_PLAN.md           # Acceptance testing criteria
├── src/
│   ├── app/                   # Next.js App Router routes & layouts
│   │   ├── layout.tsx         # Root layout with fonts, header, cart, footer
│   │   ├── globals.css        # Central design system CSS variables
│   │   ├── page.tsx           # Approved Homepage (Verdure & Root style)
│   │   ├── shop/              # Catalog page
│   │   ├── categories/        # Category directory & dynamic category pages
│   │   ├── products/[slug]/   # Dynamic Product Detail Page
│   │   ├── our-story/         # Brand philosophy
│   │   └── cart/              # Full cart & checkout page
│   ├── components/
│   │   ├── ui/                # Base primitives (Button, Badge, Input, Modal)
│   │   ├── layout/            # SiteHeader, Navigation, CartDrawer, SiteFooter
│   │   ├── product/           # ProductCard, Gallery, Filters, VariantSelector
│   │   ├── cart/              # CartItemRow, CartSummary, CartProvider
│   │   └── shared/            # HeroSection, ValueProps, Newsletter, StorySection
│   ├── config/
│   │   ├── site.ts            # Site configuration, navigation, metadata
│   │   └── products.ts        # Type-safe product catalog & categories
│   ├── lib/
│   │   └── utils.ts           # Shared utilities (cn, formatCurrency)
│   └── types/
│       ├── product.ts         # Domain types (Product, Category, Variant, Cart)
│       └── design-system.ts   # Design token types
```

## 4. Architectural Rules
1. **Server First:** Page roots and static sections remain Server Components. Use `"use client"` only where state or browser APIs (cart drawer, filter toggles, dialogs) are necessary.
2. **Zero Hardcoded Colors:** All visual components must use the centralized design system tokens (`bg-forest-900`, `text-sage-500`, `bg-ivory-50`, `border-border`).
3. **Responsive Grid & Spacing:** Adhere strictly to the 4px spacing scale and fluid container system (1440px desktop, 768px tablet, 390px mobile).
4. **Data-Driven UI:** No duplicated product cards or navigation menus; all lists render from `src/config/products.ts` or `src/config/site.ts`.
