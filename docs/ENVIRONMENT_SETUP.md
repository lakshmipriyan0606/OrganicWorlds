# Pavishna Organic Worlds — Environment & Deployment Configuration

This document specifies the required environment variables, configuration settings, and deployment procedures for Pavishna Organic Worlds. **Never commit actual production secrets, API keys, or private credentials to version control.**

---

## 1. Environment Variables Specification

Create a local environment file `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

### 1.1 Core Application Settings
| Variable Name | Required | Default / Example Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | `http://localhost:3000` | Canonical site URL for OpenGraph and API callbacks. |
| `NEXT_PUBLIC_APP_NAME` | Yes | `Pavishna Organic Worlds` | Application brand name for UI and emails. |
| `NEXT_PUBLIC_CURRENCY` | Yes | `INR` | Default ISO currency code. |

### 1.2 Database Configuration (Phase 02)
| Variable Name | Required | Example Value | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `file:./dev.db` (Local SQLite) or `postgresql://user:pass@host:5432/db` (Prod PostgreSQL) | Connection string for Prisma ORM. |

### 1.3 Authentication & Session Security (Phase 02)
| Variable Name | Required | Example Value | Description |
|---|---|---|---|
| `AUTH_SECRET` | Yes | `your-secure-random-32-char-secret` | Encryption key for signing session tokens and cookies. |
| `ADMIN_INITIAL_EMAIL` | Optional | `admin@pavishnaorganicworlds.com` | Default email for bootstrapping the initial administrator account. |
| `ADMIN_INITIAL_PASSWORD` | Optional | `your-secure-bootstrap-pass` | Initial bootstrap password (must be rotated upon first login). |

### 1.4 Payment Gateway: Razorpay (Phase 06)
| Variable Name | Required | Example Value | Description |
|---|---|---|---|
| `RAZORPAY_KEY_ID` | Yes (Commerce) | `rzp_test_...` | Razorpay public/client key ID for checkout handoff. |
| `RAZORPAY_KEY_SECRET` | Yes (Server) | `secret_...` | Razorpay private secret for order creation & signature verification (SERVER ONLY). |
| `RAZORPAY_WEBHOOK_SECRET` | Yes (Webhooks) | `whsec_...` | Webhook secret for verifying incoming raw request signatures (SERVER ONLY). |

### 1.5 Media & Storage (Phase 04)
| Variable Name | Required | Example Value | Description |
|---|---|---|---|
| `STORAGE_PROVIDER` | No | `local` (default) or `cloudinary` / `s3` | Storage backend for product and CMS image uploads. |

### 1.6 Email Service & Password Recovery Configuration
| Variable Name | Required | Example Value | Description |
|---|---|---|---|
| `EMAIL_PROVIDER` | No | `resend`, `smtp`, or `auto` (default) | Email transport driver. Defaults to `resend` if `RESEND_API_KEY` is present, or local memory driver in dev/test. |
| `RESEND_API_KEY` | Optional (Prod) | `re_123456789...` | API key from Resend (https://resend.com) for dispatching recovery emails. |
| `EMAIL_FROM` | Optional | `Pavishna Organic Worlds <security@pavishnaorganicworlds.com>` | Verified sender address for transactional security emails. |
| `SMTP_HOST` | Optional | `smtp.mailgun.org` | SMTP server hostname if using standard SMTP transport. |
| `SMTP_PORT` | Optional | `587` | SMTP port (587 for TLS, 465 for SSL). |
| `SMTP_USER` | Optional | `postmaster@domain.com` | SMTP authentication username. |
| `SMTP_PASS` | Optional | `smtp-secret-password` | SMTP authentication password. |

---

## 2. Database Schema Changes & Migration Instructions

### 2.1 Password Recovery & Session Revocation Schema
The schema includes the following security primitives in `prisma/schema.prisma`:
1. **`User.tokenVersion`**: Integer defaulting to `1`. Every issued session JWT contains `tokenVersion`. When a password reset occurs, `tokenVersion` is atomically incremented. All existing sessions with older versions are immediately rejected server-side without waiting for JWT expiration.
2. **`PasswordResetToken` Model**:
   - `id`: Unique identifier (`cuid`).
   - `userId`: Relation to `User` with cascade delete.
   - `tokenHash`: SHA-256 hash of the 64-character raw hex token (cryptographically generated with `crypto.randomBytes(32)`). Plaintext tokens are NEVER stored in the database.
   - `expiresAt`: Time-limited expiration (60 minutes).
   - `usedAt`: Nullable timestamp recording single-use consumption.

### 2.2 Migration Instructions
- **Local Development (SQLite):**
  ```bash
  npx prisma db push
  ```
- **Production Deployment (PostgreSQL):**
  When targeting production PostgreSQL:
  1. Ensure `prisma/schema.prisma` datasource provider is set to `"postgresql"`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
  2. Generate and apply migration:
     ```bash
     npx prisma migrate dev --name add_password_recovery_and_session_revocation
     # Or in CI/CD pipeline:
     npx prisma migrate deploy
     ```

---

## 3. Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Database & Run Migrations:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to access the storefront.
   Access `http://localhost:3000/admin` to log into the administrative control panel.

4. **Run Verification Commands:**
   ```bash
   npm run test         # Unit & integration regression test runner (9 suites, 157 tests)
   npm run test:e2e     # Playwright browser end-to-end automation (13 tests across 2 specs)
   npm run test:full    # Unified full verification: unit tests + E2E + tsc + lint + build
   npx tsc --noEmit     # TypeScript type checking (strict mode)
   npm run lint         # ESLint code quality inspection
   npm run build        # Production Next.js 16 build verification
   ```

5. **Test Accounts & Seed Credentials (Development & Test Environments Only):**
   | Role | Email | Password |
   |---|---|---|
   | Administrator | `admin@pavishnaorganicworlds.com` | `AdminPavishna2026!Secure` |
   | Customer | `customer@example.com` | `CustomerPavishna2026!Secure` |

---

## 4. Production Deployment (Vercel)

1. Connect the Git repository to the Vercel project dashboard.
2. In the Vercel Project Settings > Environment Variables, configure:
   - `DATABASE_URL` (pointing to a hosted PostgreSQL database, e.g. Neon, Supabase, or Railway)
   - `AUTH_SECRET` (fatal error if omitted in production)
   - `NEXT_PUBLIC_SITE_URL` (`https://pavishnaorganicworlds.vercel.app`)
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `RESEND_API_KEY` & `EMAIL_FROM` (for transactional emails and password recovery)
   - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` (optional, for distributed multi-instance rate limiting)
3. Configure build command:
   ```bash
   npx prisma generate && next build
   ```
4. Configure Razorpay webhook endpoint in the Razorpay Dashboard:
   - Webhook URL: `https://pavishnaorganicworlds.vercel.app/api/webhooks/razorpay`
   - Secret: Matches `RAZORPAY_WEBHOOK_SECRET`
   - Events: `payment.captured`, `payment.failed`, `order.paid`

