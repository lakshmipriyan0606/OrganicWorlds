# Product Requirements Document (PRD) — Earth & Essence

## 1. Overview & Problem Statement
- **Product Name:** Earth & Essence
- **Vision:** A premium, botanical organic lifestyle e-commerce experience celebrating natural rituals.
- **Problem:** Customers seeking artisanal, non-toxic organic wellness products (candles, hair oils, skincare) face generic marketplace interfaces lacking aesthetic warmth, ingredient transparency, and calm luxury.
- **Outcome:** A cohesive, editorial digital storefront evoking tactile luxury, serene botanical discovery, and effortless shopping.

## 2. Target Users
- Mindful consumers seeking natural self-care rituals and authentic ingredient sourcing.
- Gifting shoppers looking for thoughtful, aesthetically packaged botanical collections.
- Initial market: India (currency: INR ₹, language: English).

## 3. Launch MVP Categories
1. **Artisan Hand-Poured Candles** (Scent notes, soy/beeswax, burn time, wicker & amber glass vessels).
2. **Herbal Scalp & Hair Elixirs** (Botanical ingredients, scalp health, dropper bottles).
3. **Curated Gift Bundles & Sets** (Aromatherapy, seasonal gift packaging).

## 4. MVP Core Features
- **Editorial Homepage:** The approved "Verdure & Root" design featuring triptych arches, value badges (Sun-grown, Small batch, Plastic-free), curated collections, and narrative storytelling.
- **Catalog & Filtering:** "Shop All" and Category Pages (Candles, Hair Care) with category, price, and attribute filters.
- **Rich Product Detail Pages (PDP):** Image galleries, variant selection, ingredient transparency, burn time / usage specifications, related products, and customer reviews.
- **Interactive Cart & Drawer:** Slide-over cart drawer with quantity adjustments, free shipping progress bar, and instant subtotal calculation.
- **Brand Story & Philosophy:** "Our Story" page communicating botanical sourcing, sustainable packaging, and ritual philosophy.
- **Responsive Viewports:** Fluid optimization across Mobile (375px/390px), Tablet (768px), Laptop (1280px), and Desktop (1440px).

## 5. What is NOT in Version 1 ("Not Now" List)
- Live payment gateway integration (Stripe/Razorpay backend execution) — mock checkout for frontend prototype.
- Real user authentication backend / Supabase Auth (mock user account state).
- Live inventory management warehouse APIs.
- Multi-currency / international shipping calculators.
- AI customer service chatbot.

## 6. Success Criteria
- [ ] Centralized design system with zero hardcoded arbitrary styling values.
- [ ] Homepage matches the approved Stitch reference down to the pixel.
- [ ] Every page (Shop, Categories, PDP, Story, Cart) adheres to the exact same typography, palette, button, and card rules.
- [ ] TypeScript strict mode passes with 0 errors.
- [ ] Production build passes cleanly with `npm run build`.
