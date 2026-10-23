# Architectural Decisions Log (DECISIONS.md)

This log records permanent architectural choices to prevent reversing decisions later.

| Date | Decision | Rationale | Alternatives Considered |
|---|---|---|---|
| 2026-10-23 | Use Next.js 15+ App Router | Built-in SSR, server components, automatic code-splitting, and SEO optimization suited for e-commerce. | Vite SPA (less optimal for e-commerce SEO), Remix. |
| 2026-10-23 | Direct Tailwind CSS v4 Theme Integration | Native CSS variable theme integration allows zero runtime CSS overhead while providing design token autocomplete. | Styled Components (runtime overhead), Vanilla CSS alone (slower developer velocity). |
| 2026-10-23 | Approved Homepage as Visual Source of Truth | The "Verdure & Root" design (`screens/active/home.html` / screen `959cc20b23564412b57519c02a2eade2`) was verified and approved by the user. | Older generation screen variations at Y=0 / Y=12032. |
| 2026-10-23 | LocalStorage Cart State with React Context | Provides instant client-side cart updates, offline persistence, and seamless shopping without requiring a live backend session server for this phase. | Redux (unnecessary boilerplate for client cart), Zustand. |
| 2026-10-23 | Google Fonts Pairing: Bodoni Moda & Manrope | Implements the exact luxury organic editorial typography requested in the Master Prompt. | Generic browser fonts, Inter. |
| 2026-10-23 | Three.js WebGL Real-Time 3D Engine | Direct Three.js with canvas ref and procedural textures enables realistic 3D amber vessels, physically based transmission, animated candle flames, and floating botanical pollen without React 19 peer-dependency conflicts. | React-Three-Fiber (has peer dependency issues with React 19), Spline (external runtime dependency), static images. |
| 2026-10-23 | Procedural 2D Canvas Label Textures | High-resolution 2D canvas textures generated in-memory give the 3D vessels genuine, tactile typography, foil borders, and organic credentials without loading external heavy texture assets. | Low-res flat cylinder colors, external image downloads. |

