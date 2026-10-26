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

---

## 2. Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Database & Run Migrations:**
   ```bash
   npx prisma migrate dev --name init
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
   npx tsc --noEmit     # Type checking
   npm run lint         # ESLint code quality
   npm run build        # Production build verification
   ```

---

## 3. Production Deployment (Vercel)

1. Connect the Git repository to the Vercel project dashboard.
2. In the Vercel Project Settings > Environment Variables, configure:
   - `DATABASE_URL` (pointing to a hosted PostgreSQL database, e.g. Neon, Supabase, or Railway)
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (`https://pavishnaorganicworlds.vercel.app`)
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
3. Configure build command:
   ```bash
   npx prisma generate && next build
   ```
4. Configure Razorpay webhook endpoint in the Razorpay Dashboard:
   - Webhook URL: `https://pavishnaorganicworlds.vercel.app/api/webhooks/razorpay`
   - Secret: Matches `RAZORPAY_WEBHOOK_SECRET`
   - Events: `payment.captured`, `payment.failed`, `order.paid`
