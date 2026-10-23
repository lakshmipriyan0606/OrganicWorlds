# Engineering Rules & Guidelines — Earth & Essence

These rules are permanent guardrails for the code foundation.

1. **Strict TypeScript:**
   - No `any` types. Use explicit interfaces and discriminated unions.
   - All component props must be strictly typed.

2. **Design System Adherence:**
   - Always reuse tokens from `globals.css` and `tokens.json`.
   - Never inject arbitrary hex colors or ad-hoc margins that violate the 4px spacing scale.
   - Preserve the approved typography pairing: Bodoni Moda / Cormorant Garamond for display and Manrope / DM Sans for body/UI.

3. **Component Engineering:**
   - Keep components focused and composable. Avoid monolithic files exceeding 300 lines.
   - Do not duplicate header, navigation, or footer markup across routes.
   - Extract shared patterns into `src/components/ui/` or `src/components/shared/`.

4. **Small Loops & Testing:**
   - Work through one feature phase at a time as tracked in `docs/TASKS.md`.
   - Run `npm run lint` and `npm run build` after completing features to ensure zero regressions.

5. **Security & Secrets:**
   - Real keys belong in `.env.local` only; commit only `.env.example`.
   - Never expose API keys or secrets in client components.
