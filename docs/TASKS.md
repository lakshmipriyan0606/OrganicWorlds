# Implementation Tasks (TASKS.md)

## Phase 1: Setup & Design System Tokens Foundation
- [x] Audit workspace, initialize Git, and document project architecture
- [x] Configure `.gitignore` and `.env.example`
- [x] Configure `src/app/globals.css` with exact design tokens, typography, and botanical colors
- [x] Configure `src/app/layout.tsx` with Google Fonts (`Bodoni_Moda` & `Manrope`) and metadata
- [x] Create domain TypeScript interfaces (`src/types/product.ts`, `src/types/cart.ts`)
- [x] Create mock database and configuration (`src/config/site.ts`, `src/config/products.ts`)

## Phase 2: Foundational UI Components
- [x] `src/components/ui/Button.tsx` (primary, secondary, outline, ghost, destructive)
- [x] `src/components/ui/Badge.tsx` (default, sage, sand, forest, warning)
- [x] `src/components/ui/Container.tsx` and `Section.tsx` (fluid 1360px container, 4px spacing scale)

## Phase 3: Global Layout & Cart Architecture
- [x] `src/components/cart/CartContext.tsx` (cart state, localStorage persistence, add/remove/update, free shipping calculator)
- [x] `src/components/layout/AnnouncementBar.tsx` (promotional banner with free shipping notice)
- [x] `src/components/layout/SiteHeader.tsx` (responsive desktop & mobile navigation, logo, cart badge)
- [x] `src/components/layout/CartDrawer.tsx` (interactive slide-over drawer with free shipping progress bar)
- [x] `src/components/layout/SiteFooter.tsx` (dark forest-900 brand footer with curated links)
- [x] `src/components/shared/NewsletterSection.tsx` (interactive subscription form)

## Phase 4: Product Components & Catalog
- [x] `src/components/product/ProductCard.tsx` (4:5 image ratio, badges, quick add to bag, star ratings)
- [x] `src/components/product/ProductGrid.tsx` (responsive 2, 3, 4 column layouts)
- [x] `src/components/product/CategoryCard.tsx` (editorial card with overlay and hover transitions)
- [x] `src/components/product/ProductDetailView.tsx` (image gallery, variant selector, candle/hair oil specs, ritual tabs)

## Phase 5: Complete Page Implementations
- [x] `src/app/page.tsx`: Approved Homepage (faithful to Verdure & Root Stitch reference with triptych arches, value badges, collections, story quote, and newsletter)
- [x] `src/app/shop/page.tsx`: Shop All Catalog with category & price filtering
- [x] `src/app/categories/page.tsx`: All Categories Directory
- [x] `src/app/categories/[slug]/page.tsx`: Dynamic Category Pages (Candles, Hair Care, Skincare, Gifting)
- [x] `src/app/products/[slug]/page.tsx`: Dynamic Product Detail Page with breadcrumbs, specs, reviews, and related items
- [x] `src/app/our-story/page.tsx`: Brand Philosophy & Rituals
- [x] `src/app/cart/page.tsx`: Full Cart & Checkout review with order notes and confirmation
- [x] `src/app/contact/page.tsx`: Studio Concierge & Inquiries form

## Phase 6: Quality Checks & Documentation
- [x] Run `npm run lint` and verify 0 errors
- [x] Run `npm run build` and verify production build succeeds (21/21 static pages generated)
- [x] Git committed with clear messages
- [x] Documentation updated in `docs/`

## Phase 7: Three.js 3D Library Animations & Design Elevation
- [x] Install and configure Three.js (`three` & `@types/three`)
- [x] Create `ThreeProductViewer.tsx`:
  - Procedural amber apothecary glass candle with realistic physical transmission
  - Creamy coconut-soy wax and melt pool
  - Unbleached cotton wick with animated flickering flame point light
  - Cold-pressed rosemary scalp elixir bottle with gold pipette and matte bulb
  - High-resolution procedural 2D canvas textures for authentic botanical label printing
  - 360° mouse drag, touch controls, smooth inertial dampening, and wheel zoom
  - Dynamic lighting mood presets: Golden Hour Candlelight, Twilight Sanctuary, Clean Studio
  - Hotspot anatomy callouts and reset camera button
- [x] Create `BotanicalParticleField.tsx`: Ambient Three.js particle canvas with gentle floating golden pollen reacting to cursor movements
- [x] Integrate interactive 3D studio and dual toggle (3D Vessel vs Arch Lookbook) into Homepage Hero (`src/app/page.tsx`)
- [x] Add full-width Sensory Craft Atelier 3D interactive laboratory section to Homepage
- [x] Integrate 3D Interactive Vessel toggle into Product Detail Page gallery (`src/components/product/ProductDetailView.tsx`)
- [x] Elevate `ProductCard.tsx` with 3D badges, quick-add feedback animation, and hover depth
- [x] Elevate `SiteHeader.tsx` with live instant search drawer, 3D Atelier navigation, and smooth mobile drawer
- [x] Elevate `AnnouncementBar.tsx` with auto-rotating luxury ticker
- [x] Update `ShopPage.tsx` and `OurStoryPage.tsx` with ambient Three.js particle atmospheres
- [x] Verify production build passes cleanly (`npm run build` - 21/21 routes generated)

