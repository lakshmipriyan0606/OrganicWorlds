---
name: pavishna-motion-design
description: >-
  Emil Kowalski high-craft motion design and animation standards adapted for
  Pavishna Organic Worlds botanical e-commerce. Use whenever designing, reviewing,
  or implementing UI components, animations, transitions, or micro-interactions.
---

# Pavishna Botanical Motion & Design Engineering (Emil Kowalski Philosophy)

This skill encodes high-craft UI animation and design engineering principles derived from Emil Kowalski (former Vercel & Linear) specifically tailored for Pavishna Organic Worlds.

---

## 1. The Core Motion Gate (Should it animate?)

Before writing an animation, it must pass these strict tests:
- **Never animate keyboard-initiated actions** (shortcuts, fast input typing).
- **High-frequency checks**: Elements interacted with repeatedly get minimal or instant transition.
- **Justified motion**: Every animation must serve feedback, spatial consistency, or state indication. Decorative "slop" is strictly forbidden.

---

## 2. Easing & Curve Standards

| Purpose | Rule | Recommended Curve |
|---------|------|-------------------|
| **Entrances (Mount)** | **NEVER `ease-in`**. Always `ease-out`. | `cubic-bezier(0.16, 1, 0.3, 1)` or `[0.16, 1, 0.3, 1]` |
| **Exits (Unmount)** | Inverse of entrance or quick linear fade. | `ease: "easeOut"` or `[0.16, 1, 0.3, 1]` |
| **On-screen Move** | `ease-in-out` or spring. | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Interactive Gestures** | Physics springs. | `type: "spring", damping: 28, stiffness: 300` |

---

## 3. Duration Budget

- **Button tap / active feedback**: 100–160ms (`active:scale-95` or `whileTap={{ scale: 0.94 }}`)
- **Tooltip / popover**: 125–200ms
- **Dropdown / select menu**: 150–220ms (with `transformOrigin` set to trigger)
- **Modal / drawer**: 200–300ms (interruptible spring)
- **Hard Ceiling**: All UI interactive transitions must finish in **< 300ms**. (Only ambient background flourishes like sun dapples may run longer).

---

## 4. GPU Optimization & Performance

- **Transform & Opacity ONLY**: Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` directly.
- **No `transition-all`**: Always specify properties explicitly: `transition-[transform,opacity,box-shadow]` or `transition-[width]`.
- **No scale-from-zero**: Never animate from `scale(0)` to `scale(1)`. Objects in nature don't appear out of nothing. Always use `scale(0.95–0.97)` paired with `opacity: 0 -> 1`.
- **Interruptibility**: Always use `AnimatePresence` with `mode="wait"` or `mode="popLayout"` for smooth re-triggers.

---

## 5. Accessibility

Always honor `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-marquee,
  .animate-marquee-fast,
  .animate-marquee-reverse {
    animation: none !important;
  }
}
```
For Framer Motion:
Use `useReducedMotion()` from `framer-motion` to disable spatial transforms while keeping gentle opacity fades.

---

## 6. Pavishna Design Tokens

- **Brand Colors**:
  - Forest Dark: `#0D281E` / `#0E231C`
  - Emerald Accent: `#1A4533` / `#263D32`
  - Sage: `#86B398` / `#536345`
  - Ivory Cream: `#F6F3EC` / `#FAF8F5`
  - Sand / Border: `#E6E1D7` / `#E2DDD2`
- **Typography**:
  - Display / Headlines: `font-display` ("Bodoni Moda" / "Cormorant Garamond")
  - Body / UI: `font-body` ("Manrope")
- **Buttons**: Rounded-full pill aesthetics with crisp typography (`tracking-wider`, `uppercase`, `text-xs`).

---

## 7. Next.js 16 Architectural Rules

- **NEVER** add `export const dynamic = 'force-dynamic'` on pages with `cacheComponents: true`.
- **NEVER** add `export const dynamicParams` when `cacheComponents: true`.
- Dynamic routes with `generateStaticParams()` must return at least one fallback slug.
- Proxy file is `src/proxy.ts`, not `middleware.ts`.

