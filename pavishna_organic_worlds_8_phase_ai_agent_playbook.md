# Pavishna Organic Worlds — Complete E-commerce Engineering Playbook

**Project:** Pavishna Organic Worlds  
**Live website:** https://pavishnaorganicworlds.vercel.app  
**Existing framework:** Next.js (inspect the repository to verify exact version and architecture)  
**Purpose:** Upgrade the existing storefront into a secure, production-ready organic e-commerce platform with a real admin panel, editable homepage/media, customer accounts, checkout, payment processing, order fulfilment, tests, and maintained documentation.

---

# How the AI Agent Must Use This File

Execute **Prompt 01 through Prompt 08 in order**, one phase at a time. Do not attempt a single uncontrolled rewrite.

## Global non-negotiable rules

1. Inspect the actual repository before making assumptions. The live website alone is not enough to establish backend or source-code behavior.
2. Preserve the existing brand identity, useful content, working pages, and sound architecture. Refactor only when justified by evidence.
3. Do not use mock data, hardcoded production products, fake API responses, simulated payment success, or pretend order statuses to replace real functionality.
4. Never claim a feature is complete unless its acceptance criteria are met and the relevant checks have actually run.
5. Never expose secrets, payment credentials, privileged database access, or admin-only operations to browser code.
6. Do not perform real payments, destructive production database operations, or production deployment without explicit authorization.
7. If a required provider account, credential, business decision, or external integration is unavailable, implement the safe non-secret-dependent portions and document the blocker. Never fabricate credentials or integration success.
8. Use the project's current architecture where it is sound. Do not introduce a new database, ORM, authentication provider, UI library, or storage service without checking the existing stack and documenting the reason.
9. Use strict types and clear validation where the project supports TypeScript. Keep business rules in reusable server-side modules rather than duplicating them across components.
10. Keep customer-facing and admin interfaces responsive, accessible, consistent, and polished.
11. Update the relevant Markdown documents after every phase, not only at the end.
12. Work only on the current phase and its dependencies. Finish its acceptance criteria and report evidence before moving to the next phase.
13. Never silently skip a task. Record each skipped, blocked, untested, or deferred item and explain why.
14. Treat all existing repository instructions (`AGENTS.md`, `CLAUDE.md`, and similar) as relevant project guidance; reconcile conflicts explicitly.
15. Do not claim to have inspected or changed files that were not actually accessed or modified.

## Persistent project tracking files

Reuse existing equivalent files if present; do not create duplicate documents unnecessarily.

- `docs/PROJECT_AUDIT.md` — verified current state and gaps.
- `docs/IMPLEMENTATION_PLAN.md` — ordered phases, dependencies, acceptance criteria.
- `docs/FEATURE_MATRIX.md` — feature-by-feature status and evidence.
- `docs/PROGRESS.md` — current phase, completed work, blockers, tests, next task.
- `docs/DECISIONS.md` — architecture decisions, trade-offs, unresolved choices.
- `docs/ENVIRONMENT_SETUP.md` — environment variable names, setup, and deployment configuration without actual secrets.
- `README.md` — accurate project overview, local setup, test commands, deployment process, and links to the above documents.

Use these feature statuses consistently:
- `VERIFIED_COMPLETE`
- `PARTIALLY_IMPLEMENTED`
- `BROKEN`
- `MISSING`
- `BLOCKED`
- `NOT_TESTED`

A feature must not be marked `VERIFIED_COMPLETE` without appropriate evidence.

At the end of each phase, update `docs/PROGRESS.md` with the current phase, files changed, tests actually run and their results, known issues, blockers, documentation updated, and the next exact task.

---

# PROMPT 01 — Repository Audit, Feature Gap Analysis, and Roadmap

## Role

Act as a principal software architect, senior Next.js engineer, e-commerce architect, security engineer, QA lead, UX designer, and technical documentation lead. Perform a thorough, evidence-based audit of the existing Pavishna Organic Worlds project before implementing anything.

## Objective

Establish what exists, what works, what is broken, what is missing, and what must be built to make the existing website production-ready. This phase is **audit and planning only**.

## Tasks

### 1. Discover the repository and stack

Inspect the repository instructions, package manifest and lockfile, route tree, application layouts, components, API routes, server actions, middleware, database layer, migrations, authentication, storage, tests, and deployment configuration.

Determine the actual:
- Next.js and React versions; App Router or Pages Router.
- TypeScript and styling approach.
- UI component and animation libraries.
- Database, ORM/data-access layer, migrations, and schema.
- Authentication/session system and role model.
- Image storage and media delivery.
- Payment/shipping/email integrations, if any.
- Environment variables and Vercel deployment requirements.
- Existing test, lint, type-check, and build commands.

Do not infer backend functionality from the public site or filenames alone.

### 2. Audit every route and major interaction

Inspect all existing pages, layouts, navigation, footer links, forms, CTAs, search, product lists, product details, cart, checkout, account flows, blog, policies, contact page, and admin routes if present.

For each route and important interaction, record:
- Current behavior.
- Source files and relevant implementation evidence.
- Whether it is working, partial, broken, missing, blocked, or untested.
- Error/loading/empty states.
- Mobile and accessibility issues.
- Dependencies and acceptance criteria for fixing it.

Check for dead links, placeholder buttons, fake data, incomplete forms, duplicate logic, runtime risks, unsafe server/client boundaries, broken imports, and missing validation.

### 3. Audit e-commerce business workflows

Trace actual code and data for:
- Product/category/variant management.
- SKU, price, sale price, images, inventory, and availability.
- Cart persistence and server-side recalculation.
- Checkout, shipping, taxes, discounts, and order creation.
- Authentication and customer-owned data.
- Payment creation, verification, webhooks, and reconciliation.
- Order lifecycle, dispatch, tracking, cancellation, and refunds.
- Customer notifications and receipts.
- Homepage and content editing.
- SEO metadata, sitemap, robots rules, structured data, performance, and accessibility.

Do not assume these features exist just because their UI appears.

### 4. Security and reliability audit

Check admin authorization on every server-side mutation and protected read; customer order ownership; session and cookie configuration; input validation; rate limiting for sensitive operations; upload validation; secret exposure; payment webhook verification; replay/duplicate-event handling; inventory races and overselling; duplicate orders; data leakage; database constraints; dependency vulnerabilities; and backup/recovery assumptions.

Record concrete findings, severity, impact, file references, and a recommended fix. Do not expose secrets in audit output.

### 5. Define admin requirements

Create a grounded admin specification covering:
- Overview dashboard and date-range reports.
- Products, categories, variants, prices, stock, and SKU.
- Media library.
- Homepage and content management.
- Orders, payments, shipment tracking, cancellations, returns, and refunds.
- Customers.
- Discounts and promotions.
- Shipping and tax settings.
- Blog/SEO content where applicable.
- Notification settings.
- Administrator roles/permissions and audit logs.

Separate essential launch scope from optional future enhancements. Avoid building features without a plausible business need.

### 6. Create/update documentation

Create or update the persistent tracking files described at the top. Update `README.md` to reflect verified reality. Record assumptions and unresolved client decisions in `docs/DECISIONS.md`.

### Required deliverables

1. Executive summary.
2. Actual architecture and route inventory.
3. Page-by-page and workflow audit.
4. Admin panel specification.
5. Feature-gap matrix with severity, evidence, dependencies, and acceptance criteria.
6. Security and data-integrity findings.
7. Data model/API gap analysis.
8. Homepage/media management requirements.
9. Markdown documentation report.
10. Phased implementation roadmap.
11. Baseline tests/checks that can safely run.
12. Client decisions and external dependencies.
13. The exact next implementation task.

## Prompt 01 acceptance criteria

- Actual repository inspected to the extent access allows.
- Existing and missing functionality clearly distinguished.
- Major pages and business workflows accounted for.
- Priorities and acceptance criteria recorded.
- Documentation tracking files created or updated.
- No feature implementation started prematurely.
- `docs/PROGRESS.md` records the audit result and next task.

If repository access is unavailable, state the limitation and do not pretend the audit was completed.

---

# PROMPT 02 — Secure Foundation, Data Model, Authentication, and API Architecture

## Objective

Implement or repair the secure foundation required by the audit. Follow the existing architecture where appropriate; do not replace working infrastructure without evidence and a documented decision.

## Tasks

### 1. Data model and migrations

Inspect existing entities and schema first. Design or extend the smallest consistent model needed for:
- Users and roles.
- Products, categories, and variants.
- Product media and reusable media assets.
- Inventory and inventory adjustment history.
- Customer addresses.
- Carts or cart persistence, if applicable.
- Orders and immutable order-item snapshots.
- Payment attempts/transactions and provider references.
- Fulfilment/shipment information and status history.
- Coupons/promotions, if in launch scope.
- Homepage/content configuration.
- Refunds/returns, if in launch scope.
- Admin audit events where appropriate.

Include appropriate primary/foreign keys, unique constraints, indexes, money/currency handling, timestamps, and deletion/archive rules. Use the existing database and ORM conventions. Make migrations safe, reviewable, and reversible where feasible. Do not delete production data or run destructive production migrations.

Product names/prices in a completed order must be snapshotted so later product edits do not rewrite historical purchases. Clearly separate payment status from fulfilment/order status.

### 2. Authentication and authorization

Implement or strengthen:
- Secure login/logout and session handling.
- Registration/password reset only if supported by the chosen auth architecture and required by the audit.
- Server-side admin authorization for every privileged operation.
- Explicit role/permission checks for admin and staff roles if required.
- Customer ownership checks for profile, addresses, and orders.
- Secure cookie/session settings and safe redirects.
- Rate limiting or abuse protection for sensitive flows where practical.

Hiding an admin link in the UI is not authorization. Verify access on the server for every protected route, API handler, and server action. Do not create a publicly usable default administrator password. If initial admin provisioning is required, document a secure, environment-controlled bootstrap procedure.

### 3. Server and API foundation

Create reusable, typed validation and business-service modules for product, pricing, inventory, order, and authorization operations. Keep business logic out of presentation components. Use the project's established route handlers/server actions and consistent response/error patterns.

Validate all input at trust boundaries. Never trust browser-supplied product prices, discounts, totals, user IDs, role values, payment status, or inventory quantities.

### 4. Environment and storage configuration

Validate required environment variables safely at startup or through an explicit configuration check. Document variable names and purposes without actual secrets. Ensure production secrets are server-only.

Define persistent image storage using the project's existing suitable provider or an approved provider selected after documenting the decision. Do not rely on ephemeral local disk for production uploads. Use signed uploads or server-mediated uploads as appropriate, with type/size restrictions and authorization.

### 5. Reliability and observability

Implement safe error handling, structured server-side logs where appropriate, and clear operational errors without leaking stack traces, secrets, or personal data to users. Add appropriate database transaction boundaries for operations that must remain consistent.

### 6. Tests

Add tests for:
- Role and ownership authorization.
- Input validation.
- Database constraints and migrations where test infrastructure allows.
- Product and price validation.
- Inventory invariants.
- Protected server operations.
- Invalid or missing environment configuration where applicable.

## Prompt 02 acceptance criteria

- Schema and migrations match the implemented application.
- Authentication and admin authorization are enforced server-side.
- Customer data is isolated by ownership.
- Privileged values are not trusted from the client.
- Storage configuration is persistent and documented.
- Relevant tests, type checks, lint, and build run when available; failures are reported honestly.
- All documentation and `docs/PROGRESS.md` are updated before Prompt 03.

---

# PROMPT 03 — Complete Admin Panel and Product/Inventory Management

## Objective

Build a functional, polished admin workspace backed by real server-side data. Follow the audited design system and current architecture.

## Admin navigation

Create a clear, responsive admin layout with appropriate navigation for:
- Dashboard.
- Products.
- Categories.
- Inventory.
- Orders.
- Customers.
- Media library.
- Homepage/content.
- Promotions/coupons if in scope.
- Settings.
- Audit/activity log where appropriate.

Protect every admin route and operation on the server. Unauthorized users must not be able to access protected data by calling APIs directly.

## Dashboard

Show meaningful metrics sourced from the database, with clear date ranges and definitions:
- Order counts by status.
- Revenue and refunds, using documented calculation rules.
- Pending payments.
- Orders needing processing or dispatch.
- Delivered and cancelled orders.
- Low-stock and out-of-stock products.
- Best-selling products and recent activity where data supports it.

Provide useful empty states when the store has no records. Do not invent metrics or display hardcoded demo figures.

## Product management

Implement:
- Product listing with server-side pagination, search, filters, sorting, and status.
- Create/edit product forms with validated fields.
- Name, slug, SKU, description, category, product type, ingredients, directions/use, warnings where applicable, and SEO fields.
- Regular/sale price, currency, variants, and applicable tax configuration.
- Product image selection, upload, preview, gallery ordering, and alt text.
- Draft/published/archived state.
- Stock tracking, low-stock threshold, out-of-stock behavior, and inventory adjustment history.
- Safe archive/delete behavior and dependency warnings.
- Bulk operations only where they can be performed safely and audited.

Ensure unique SKU/slug behavior and server-side validation. Do not silently overwrite stock when editing unrelated product fields. Use transactions or safe concurrency controls for inventory changes.

## Category management

Implement category creation/editing, slugs, descriptions, image references, ordering, publication state, and product relationships as appropriate. Prevent accidental deletion of categories still used by products unless the reassignment behavior is explicit and safe.

## Customer and administrative operations

Provide customer lookup and relevant order history while minimizing exposure of personal information. Use role permissions for sensitive actions. Log important admin changes such as price/stock changes, product publication, order status changes, and refunds where appropriate.

## UX quality

Ensure responsive layouts, keyboard access, labelled forms, inline validation, loading states, empty states, confirmation for consequential actions, and useful success/error messages. Use the existing design system; avoid inconsistent one-off components.

## Tests

Test product create/read/update/archive, category operations, image references, pagination/filtering, authorization, invalid inputs, SKU conflicts, and inventory adjustment rules.

## Prompt 03 acceptance criteria

An authorized administrator can manage real products, categories, pricing, publication, and inventory without editing source code. Data persists across sessions and is correctly reflected on the customer storefront. No critical operation depends on mock data. Tests and documentation are updated.

---

# PROMPT 04 — Homepage CMS, Hero Editor, and Media Library

## Objective

Let a nontechnical business owner safely change homepage visuals and content from the admin panel without editing code or redeploying the application.

## Homepage/content editor

Audit the existing homepage before changing its design. Preserve useful brand content and established visual identity.

Support editable content for applicable existing sections:
- Announcement bar and promotional banners.
- Hero heading, supporting copy, CTA labels, and CTA destinations.
- Desktop hero image and optional mobile-specific image.
- Image focal point/position, crop behavior, alt text, and overlay settings where appropriate.
- Featured categories and product collections.
- Bestseller/new-arrival sections.
- Brand story, ingredients, benefits, testimonials, blog highlights, and footer content.
- Section visibility and ordering where appropriate.

Do not invent product claims, organic certifications, testimonials, ratings, or health claims. Require verified content or mark it for client approval.

Provide a clear preview-before-publish flow if compatible with the current architecture. Prevent invalid CTA URLs and unsafe arbitrary script injection. Sanitize rich text using an appropriate safe approach if rich text is supported.

## Media library

Implement:
- Upload, preview, search/filter, and select existing media.
- Replace an image while preserving or intentionally updating references.
- Alt text and optional internal labels.
- Upload progress, validation, useful errors, and clear confirmation.
- Allowed file formats and size limits.
- Server-side authorization and file validation.
- Persistent storage and stable URLs.
- Image optimization compatible with the existing Next.js setup.
- Warnings when media is referenced by products or homepage sections.
- Safe deletion rules and cleanup behavior.

Never persist temporary `blob:` URLs as content URLs. Avoid embedding base64 images into database records unless the existing architecture has a documented reason. Do not allow untrusted uploads to become executable content.

## Hero image quality

The hero must remain visually strong on desktop and mobile:
- Correct aspect ratios and responsive image behavior.
- Focal-point positioning so important content is not accidentally cropped.
- Readable text and sufficient contrast.
- Sensible fallback if no image is selected.
- Optimized image loading without causing avoidable layout shifts.
- Clear image preview and replacement workflow in admin.

Use the existing image library/provider when suitable; document any provider decision and required environment variables.

## Publishing and reliability

Ensure updates persist in the database/CMS layer and become visible on the storefront through the correct cache invalidation/revalidation strategy. Avoid stale content after a successful save. Validate all content server-side and show save/publish errors accurately.

## Tests

Test media authorization and validation, upload failure handling, reference-safe deletion, content save/reload, publish/unpublish behavior, mobile image behavior where applicable, and storefront reflection after content updates.

## Prompt 04 acceptance criteria

An authorized administrator can replace the hero image and update homepage content without editing source code. Changes persist and render on the live application after the documented publish/revalidation process. No fake media upload or mock CMS response is accepted. Update all Markdown documentation.

---

# PROMPT 05 — Customer Accounts, Product Discovery, Cart, and Checkout

## Objective

Complete the customer purchase journey using real products, persistent data, validated totals, and a consistent order model.

## Product discovery and details

Verify and implement as required:
- Category/collection browsing.
- Search, filters, sorting, and pagination where useful.
- Product detail pages with gallery, descriptions, ingredients, use instructions, warnings where appropriate, variants, price, availability, and quantity.
- SEO metadata and structured data that reflect real product information.
- Clear loading, empty, not-found, and error states.

Avoid unsupported medical or certification claims.

## Customer accounts

Implement or complete:
- Registration/login/logout according to the chosen authentication system.
- Password recovery if supported and required.
- Profile and contact information.
- Multiple saved addresses where needed.
- Order history and order detail.
- Customer-owned order access and secure tracking.
- Guest checkout if selected by the business.
- Cancellation/return request initiation if in scope.

Do not expose other customers' records or rely on client-side-only access checks.

## Cart

Implement:
- Add/update/remove product items.
- Quantity validation.
- Cart persistence using the existing suitable strategy.
- Correct handling of unavailable products, changed prices, deleted products, and changed variants.
- Server-side retrieval of current prices and stock.
- Clear display of subtotal, discounts, shipping estimate, tax treatment, and total.
- A useful empty-cart state.

The client must never determine the authoritative price. Recalculate the cart on the server before order creation.

## Checkout

Implement the audited checkout design:
- Contact and delivery address.
- Delivery method and eligible shipping options.
- Coupon validation where supported.
- Server-calculated subtotal, discounts, shipping, tax, and total.
- Terms/policy acknowledgement where required.
- Order review before payment.
- Safe order creation and duplicate-submission protection.
- Clear payment-pending, success, failure, and retry states.
- Order confirmation using the actual persisted order.

Tax and shipping rules must be configured from verified business requirements; do not invent rates or imply legal compliance without verification.

## Inventory and concurrency

Prevent overselling with suitable database transactions, atomic conditional updates, reservation/expiry logic, or another justified approach. Define when stock is reserved and when it is deducted/released, including abandoned or failed payments. Do not let repeated checkout submissions create uncontrolled duplicate orders.

## Notifications

Prepare order confirmation and status notifications using the existing or selected email provider. If credentials are unavailable, implement and test the provider abstraction safely and document the blocker. Do not claim emails were sent when they were not.

## Tests

Test cart operations, stale price/stock scenarios, invalid quantities, coupon rules, shipping calculations, customer ownership, duplicate submissions, checkout failure recovery, and order creation consistency.

## Prompt 05 acceptance criteria

A customer can browse real products, maintain a cart, enter delivery details, see server-calculated totals, and create a valid persisted order. Payment state remains truthful and is not marked successful merely because the order exists or the browser returns to a success page. Update documentation.

---

# PROMPT 06 — Secure Payment Integration: Razorpay First, Stripe Optional

## Objective

Implement a real, secure payment flow using the gateway confirmed by the client. For an India-focused store, evaluate Razorpay as the first option. Treat Stripe as an alternative or additional gateway only if the business account, country, currency, and required functionality are supported and confirmed.

Do not integrate both simply for the sake of having both. Record the selected gateway and rationale in `docs/DECISIONS.md`.

## Payment state model

Define and enforce explicit payment states appropriate to the chosen provider, for example:
- `PENDING`
- `PROCESSING`
- `SUCCEEDED`
- `FAILED`
- `CANCELLED`
- `REFUND_PENDING`
- `PARTIALLY_REFUNDED`
- `REFUNDED`

Use the existing conventions where appropriate, but preserve clear state semantics. Payment status and fulfilment status must remain separate.

## Payment creation and verification

Implement:
1. Server-side order validation and authoritative total calculation.
2. Server-side payment/order creation using secret credentials.
3. Safe handoff to the provider's hosted checkout or approved client SDK.
4. Server-side verification of provider response/signature using the provider's documented procedure.
5. Verified webhook handling for asynchronous updates.
6. Idempotency and duplicate-event protection.
7. Reconciliation for pending, failed, and inconsistent payments.
8. A trustworthy customer result page based on persisted server-side status.
9. Safe retry behavior without accidental duplicate charges or orders.

For Razorpay, use the official documented order creation and signature verification flow and verify webhook signatures using the raw request body as required by the provider. For Stripe, use the official documented checkout/payment and signed webhook flow if selected. Confirm current SDK requirements from official provider documentation during implementation.

Never:
- Expose secret keys in browser bundles.
- Trust a redirect or client-supplied status as proof of payment.
- Mark an order paid without trusted verification.
- Store raw card data.
- Log secrets or sensitive payment details.
- Simulate provider success in production code.
- Treat a webhook as inherently unique or process duplicate events twice.

## Webhook reliability

Verify signatures, persist event identifiers or equivalent idempotency records, handle retries, and make state transitions safe under concurrent events. Handle events arriving out of order. Do not downgrade a confirmed successful payment because a stale failure event arrives later.

Provide safe diagnostics that do not leak credentials or personal data. Use provider test mode and test credentials for development.

## Refunds and reconciliation

Implement refund workflows only within the supported provider capabilities and approved business policy. Protect refund actions with admin authorization, amount validation, idempotency, and audit history. Reflect refund state only after trusted provider confirmation. Clearly distinguish requested, pending, successful, and failed refunds.

## Configuration and testing

Document required environment variable names, webhook setup, test/live mode differences, and safe local testing. Never put actual secrets in Markdown or source control.

Test signature verification, invalid signatures, webhook replay, duplicate events, amount mismatch, failed payment, retry, asynchronous success, refund behavior, and order/payment consistency using provider test mode or controlled fixtures. No real-money payment is permitted during development verification.

## Prompt 06 acceptance criteria

Payment state can only be advanced through trusted server-side verification/provider events. Duplicate webhooks and retry requests do not create duplicate charges, duplicate order processing, or incorrect state transitions. If provider credentials are unavailable, document exactly what is implemented and what remains blocked—do not claim live integration is verified.

---

# PROMPT 07 — Order Administration, Fulfilment, Delivery Tracking, and Notifications

## Objective

Give administrators a reliable way to manage orders from placement through dispatch, delivery, cancellation, and refund while customers can see truthful order status.

## Order management interface

Implement:
- Order list with server-side search, filters, sorting, pagination, and date ranges.
- Search by order number and permitted customer fields.
- Detailed order view showing item snapshots, quantities, totals, payment status, delivery address, and history.
- Internal notes separated from customer-visible messages.
- Status timeline with actor, timestamp, and meaningful reason.
- Safe action confirmations and actionable errors.

Minimize exposure of customer personal information. Enforce admin/staff permissions server-side.

## State transitions

Define an explicit allowed order/fulfilment state machine that fits the business, for example:
- `PENDING_PAYMENT`
- `CONFIRMED`
- `PROCESSING`
- `PACKED`
- `SHIPPED`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`
- `RETURN_REQUESTED`
- `RETURNED`

Adapt these states to the existing model and chosen shipping workflow. Do not blindly introduce redundant statuses. Validate transitions server-side and retain history. Payment state is independent and must not be overwritten by a delivery status.

Define how COD, failed payment, cancellation after payment, failed delivery, return, and refund cases behave. A paid order cancellation may require a refund workflow; never mark a refund complete merely because cancellation was requested.

## Dispatch and tracking

Allow authorized staff to record:
- Carrier/shipping provider.
- Tracking/AWB number.
- Tracking URL from a validated/approved pattern.
- Dispatch date and relevant delivery information.
- Fulfilment status and status notes.

If a real carrier integration is selected and configured, use its documented API. Otherwise support accurate manual tracking updates and do not pretend to have live carrier events.

## Customer tracking

Provide authenticated order details and, if desired, a privacy-conscious public tracking route using an unguessable token rather than exposing sequential order IDs or sensitive customer data. Show only approved customer-visible fields.

## Notifications

Send appropriate order-confirmation, payment-confirmation, dispatch, tracking, delivery, cancellation, and refund updates through the selected email/SMS/WhatsApp provider where configured and legally appropriate.

Use retries and idempotency to avoid duplicate messages. Do not block core order consistency on a temporary notification-provider failure. Record notification outcome and provide safe retry where appropriate. Do not claim delivery of a notification unless the provider confirms the relevant outcome.

## Refunds and returns

Implement only the client-approved policy and provider-supported capabilities. Validate refund amounts, avoid exceeding captured amounts, protect operations with role checks, and retain an audit trail. Record return requests and decisions, with clear separation between a return request and an approved/received return.

## Reports and auditability

Provide accurate operational filters and summary metrics. Ensure the dashboard definitions match order/payment records. Record consequential admin actions and status changes.

## Tests

Test valid and invalid status transitions, unauthorized actions, order ownership, tracking data validation, cancellation/refund edge cases, duplicate notification prevention, webhook/status interaction, and status history.

## Prompt 07 acceptance criteria

An authorized admin can manage a real order through the supported lifecycle, record tracking information, and provide customers with accurate status. Payment/refund state remains consistent. The order timeline is auditable. Documentation and tests are updated.

---

# PROMPT 08 — Full QA, Security Review, Production Readiness, and Final Documentation

## Objective

Verify the integrated platform end-to-end, fix defects found, and produce an evidence-based release-readiness report. Do not deploy to production without explicit authorization.

## 1. Full route and feature regression

Revisit every route and major feature recorded in `docs/FEATURE_MATRIX.md`. Verify:
- Header, footer, navigation, homepage, hero, and all content sections.
- Product listing, search/filter, category, product detail, image galleries, and stock behavior.
- Media upload/replacement and homepage content persistence.
- Login/logout, authorization, profile, addresses, and customer order history.
- Cart, pricing, coupons, shipping, tax configuration, and checkout.
- Payment creation, verification, webhooks, retries, and refund paths.
- Admin dashboard, product/category CRUD, inventory, customer lookup, order processing, and tracking.
- Notifications and failure handling.
- Responsive mobile/tablet/desktop layouts.
- Loading, empty, validation, not-found, success, and error states.
- SEO metadata, canonical URLs, sitemap/robots behavior, and structured data where appropriate.
- Accessibility basics: semantic structure, labels, keyboard navigation, focus visibility, contrast, and alt text.

Do not mark a feature complete solely because a page renders.

## 2. Automated verification

Run the project's actual available commands for:
- Type checking.
- Linting.
- Unit tests.
- Integration tests.
- End-to-end tests.
- Production build.
- Migration/schema validation where supported.
- Dependency/security checks where available.

Do not invent command output. Record exact commands, outcomes, and relevant failure summaries. Fix regressions caused by the implementation. If an existing failure cannot safely be fixed in scope, document it as a blocker with evidence.

## 3. End-to-end scenarios

Use test accounts and non-production provider credentials/fixtures. Do not run real payments.

Test at least:
1. Admin logs in and creates a product.
2. Product image is uploaded and appears on the storefront.
3. Admin updates the hero image and homepage content; changes persist.
4. Customer browses the product, adds it to cart, and sees the correct server-calculated total.
5. Customer submits checkout and a valid order is created.
6. Successful test payment is verified through the trusted server-side path.
7. Invalid/failed payment remains unpaid and can be safely retried.
8. Duplicate webhook events do not double-process payment/order state.
9. Admin processes and dispatches an order and records tracking.
10. Customer sees accurate order status.
11. Cancellation, return, and refund flows obey configured rules.
12. Unauthorized users cannot read or mutate admin/customer data.
13. Low stock and concurrent checkout conditions do not silently oversell.
14. Notification failure does not corrupt order state.
15. Core routes behave correctly on mobile and desktop.

Adapt scenarios to the implemented, approved scope and mark unsupported scenarios as blocked or deferred rather than pretending they passed.

## 4. Security review

Recheck:
- Authentication and server-side role enforcement.
- Customer ownership and tenant/data boundaries if applicable.
- Secret exposure in code, build output, logs, and client bundles.
- Server-side price calculation.
- Upload authorization and validation.
- Payment signature/webhook verification.
- Duplicate-event/idempotency handling.
- Inventory concurrency and data consistency.
- Input validation, rate limiting, unsafe redirects, and injection risks.
- Error responses and personal-data exposure.
- Dependency vulnerabilities and production environment configuration.

Do not run destructive tests against production. Use isolated test data and environments.

## 5. Performance and UX review

Inspect image optimization, loading behavior, layout shifts, excessive client-side JavaScript, repeated requests, caching/revalidation, mobile responsiveness, and major accessibility issues. Optimize based on observed issues without unnecessary rewrites or fragile micro-optimizations.

## 6. Documentation reconciliation

Read and update every relevant Markdown file. At minimum:
- `README.md`
- `docs/PROJECT_AUDIT.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/FEATURE_MATRIX.md`
- `docs/PROGRESS.md`
- `docs/DECISIONS.md`
- `docs/ENVIRONMENT_SETUP.md`

Update any other existing documentation made inaccurate by code changes. Ensure setup commands, routes, environment variable names, migrations, payment/webhook configuration, media configuration, tests, and deployment instructions match actual implementation.

Do not include credentials, tokens, customer personal data, or production secrets in documentation.

## 7. Final deliverables

Produce:
1. Final implementation summary.
2. Final route and feature matrix.
3. Test report with exact commands and actual results.
4. Security review findings and remaining risks.
5. Payment and order lifecycle verification results.
6. Environment and deployment checklist.
7. Backup/migration/recovery considerations.
8. Known bugs, blocked items, deferred features, and client decisions.
9. Files changed and major architectural decisions.
10. Final `docs/PROGRESS.md` status and any remaining next actions.
11. A clear release recommendation: `READY_FOR_REVIEW`, `BLOCKED`, or `NOT_READY`.

Use `READY_FOR_REVIEW` only when required checks have passed and no unresolved critical blocker remains. This status is not permission to deploy. Production deployment requires explicit authorization.

## Prompt 08 acceptance criteria

- All in-scope features have a truthful status and verification evidence.
- Relevant automated checks have been run and failures are documented.
- Critical security and data-integrity issues are resolved or clearly block release.
- Documentation matches the actual code.
- No real payments or unapproved production changes were performed.
- Final report distinguishes verified behavior from assumptions and untested cases.

---

# Required End-of-Phase Report Template

Use this template at the end of every prompt/phase:

## Phase [number] — [name]

**Status:** `VERIFIED_COMPLETE` / `PARTIALLY_IMPLEMENTED` / `BLOCKED` / `NOT_TESTED`

### Completed
- List only work actually completed.

### Acceptance criteria
- For each criterion, report pass/fail/not tested and supporting evidence.

### Files changed
- List actual files created or modified and why.

### Verification
- Exact commands run.
- Actual results.
- Relevant test/build failures.

### Security/data integrity
- Findings, fixes, and unresolved risks.

### Documentation updated
- List updated Markdown files.

### Remaining issues/blockers
- Explain missing credentials, decisions, integrations, or failures.

### Next exact task
- State the next phase and first concrete action.

**Continue to the next prompt only after the current phase's report and documentation are updated.** If blocked, finish all safe independent tasks in the phase, document the blocker, and do not falsely declare the phase complete.

---

# Final Instruction to the AI Agent

Read this entire playbook before acting. Inspect the repository and existing project instructions. Execute Prompt 01 first, then proceed sequentially through Prompt 08, respecting each phase's scope, dependencies, acceptance criteria, and checkpoint report.

Do not stop after generating a plan if implementation access is available. Do not attempt all phases in one uncontrolled batch. Implement, test, document, and verify one phase at a time. If context limits or a session restart interrupts work, resume from `docs/PROGRESS.md` and verify the current repository state before continuing.

The target is a maintainable, secure, production-ready organic e-commerce platform—not merely a visually convincing demo. Never claim completion without evidence.
