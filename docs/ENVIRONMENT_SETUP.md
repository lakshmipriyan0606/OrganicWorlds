# Pavishna Organic Worlds — Environment Setup

**Stack:** Next.js 16.4.2 • React 19.3.0 • TypeScript 5 • Prisma 6.19.3 • SQLite • Tailwind CSS 4 • Framer Motion 14 • Razorpay (test/simulated)

---

## Prerequisites

- Node.js 20+
- npm 10+

---

## 1. Clone and Install

```bash
git clone <repo-url>
cd OrganicWorlds
npm install
```

---

## 2. Environment Variables

Create `.env` in the project root:

```env
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_SECRET="another-secret-min-32-chars"

# Razorpay (test mode — simulated checkout works without real keys in dev)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Email (optional for password reset in dev)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="noreply@example.com"
SMTP_PASS="smtp-password"
```

> **Note:** The application runs in simulated payment mode when Razorpay keys are absent or in test mode. All checkout flows work without real payment credentials in development.

---

## 3. Database Setup

```bash
# Apply Prisma migrations
npx prisma migrate dev

# Seed the database with botanical catalog data
npx prisma db seed
```

The database lives at `prisma/dev.db` (SQLite). To inspect it:

```bash
npx prisma studio
```

---

## 4. Development Server

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

> **Windows / Turbopack note:** On Windows, if Turbopack enters a fast-refresh loop, stop the server and restart with `npm run dev`. This is a known issue with Turbopack watching its own cache directory on Windows. Production builds are unaffected.

---

## 5. Admin Access

After seeding:
- Navigate to `http://localhost:3000/admin/login`
- Default admin credentials are set by the seed script (see `prisma/seed.ts`)

---

## 6. Running Tests

```bash
# TypeScript type check
npx tsc --noEmit

# ESLint
npm run lint -- --quiet

# Unit + integration test suites (requires dev server at :3000)
npm run dev &   # start dev server first
npx tsx tests/run-all-tests.ts

# Playwright E2E tests (requires dev server at :3000)
npx playwright test

# Production build verification
npm run build
```

**Expected results (all green):**
- TypeScript: 0 errors
- ESLint: 0 errors
- Unit tests: 9/9 suites PASSED
- Playwright: 13/13 tests PASSED
- Build: exit code 0

---

## 7. Production Build

```bash
npm run build
npm run start
```

### Known build-time output

During `npm run build`, you will see warnings like:

```
Admin metrics error: Error: During prerendering, `cookies()` rejects...
```

These are **expected and harmless**. Next.js 16 with `cacheComponents: true` probes all route handlers during static generation. Auth routes that call `cookies()` correctly reject during prerender and are served dynamically at runtime. The build succeeds with exit code 0 and all such routes are classified `ƒ (Dynamic)`.

> **Do not** add `export const dynamic = 'force-dynamic'` to these routes — it is incompatible with `nextConfig.cacheComponents` in Next.js 16 and will cause a build failure.

---

## 8. Production Deployment Checklist

Before deploying to production:

- [ ] Switch `DATABASE_URL` to a PostgreSQL connection string and run `npx prisma migrate deploy`
- [ ] Set strong, unique `SESSION_SECRET` and `NEXTAUTH_SECRET`
- [ ] Configure real Razorpay live keys
- [ ] Replace `/public/uploads` file storage with S3, GCS, or Cloudinary
- [ ] Configure SMTP for transactional email (password reset)
- [ ] Set `NEXT_PUBLIC_APP_URL` to the production domain
- [ ] Enable HTTPS and configure HSTS headers
- [ ] Set up a CDN for the `/_next/static` and `/images` paths

---

## 9. Key Next.js 16 Constraints

This project uses Next.js 16 with `cacheComponents: true` and `partialPrefetching: true`. The following **cannot** be used in route segment configs:

- `export const dynamicParams` — incompatible with `cacheComponents`
- `export const dynamic = 'force-dynamic'` — incompatible with `cacheComponents`
- `export const revalidate` — incompatible with `cacheComponents` in some contexts

Use `revalidatePath()` or `revalidateTag()` from `next/cache` for on-demand cache invalidation instead.

The proxy file follows Next.js 16 convention: `src/proxy.ts` (not `middleware.ts`).
