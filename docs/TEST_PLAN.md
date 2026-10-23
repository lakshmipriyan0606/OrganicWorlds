# Test Plan — Earth & Essence

This document defines what "working" means across viewports, interactions, and type safety.

## 1. Viewport & Responsive Criteria
- **Mobile (375px & 390px):**
  - Navigation collapses cleanly into slide-out Mobile Menu.
  - Triptych arches in Hero stack elegantly into a single or dual editorial layout without horizontal scroll.
  - Product grids display 1 or 2 columns with touch-friendly 44px+ tap targets.
  - Cart drawer fits mobile viewport comfortably.
- **Tablet (768px):**
  - Product grids scale to 2-3 columns.
  - Header displays compact navigation or hamburger depending on breakpoint.
- **Desktop (1280px & 1440px):**
  - Max content container width constrained to 1360px–1440px with 64px gutters.
  - Full desktop navigation with hover states and dropdowns.
  - Triptych hero display is fully expanded as designed in Stitch reference.

## 2. Interaction Criteria
- **Cart System:**
  - Clicking "Add to Cart" on any product opens the slide-out Cart Drawer.
  - Badge on Header Cart Icon updates count dynamically.
  - Quantity controls (+, -, delete) in cart drawer update subtotals accurately.
  - Free shipping progress indicator animates and calculates correctly against threshold (₹1,500).
- **Navigation & Routing:**
  - Logo links to Home (`/`).
  - "Shop All" links to `/shop`.
  - Categories link to `/categories/candles` and `/categories/hair-care`.
  - "Our Story" links to `/our-story`.
  - Product cards link to `/products/[slug]`.
- **Product Filters:**
  - Filter by category, price range, and sort order (Price Low-High, Rating, Featured).

## 3. Code Quality Criteria
- `npm run lint` passes with 0 warnings or errors.
- `npm run build` succeeds generating static and dynamic routes.
- Zero TypeScript `any` types.
