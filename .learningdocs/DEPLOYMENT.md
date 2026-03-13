# Deployment & Services Guide

This document describes every external service powering Fretboard Navigator, how they connect, and what environment variables each requires.

## Architecture Overview

```
User (browser)
  │
  ├── scaleshapes.com ──► Vercel (Next.js app)
  │                          │
  │                          ├── Auth.js ──► Google OAuth (sign-in)
  │                          │           ──► Resend (magic link emails)
  │                          │
  │                          ├── Drizzle ORM ──► Neon Postgres (database)
  │                          │
  │                          ├── Stripe SDK ──► Stripe (checkout, subscriptions, billing portal)
  │                          │
  │                          └── Upstash SDK ──► Upstash Redis (rate limiting)
  │
  └── Stripe webhook ──► POST /api/webhook ──► Neon Postgres (subscription records)
```

## Services

### 1. Vercel — Hosting & Deployment

- **What it does**: Hosts the Next.js app, runs serverless API routes, serves static assets
- **Dashboard**: https://vercel.com
- **Domain**: `scaleshapes.com` (custom domain configured in Vercel)
- **Deployment**: Auto-deploys on push to `main` branch
- **Environment variables**: All 13 env vars are configured here under Settings → Environment Variables
- **Logs**: Vercel captures structured JSON logs from the app's logger utility — viewable in the Vercel dashboard under Logs

### 2. Neon — PostgreSQL Database

- **What it does**: Stores all persistent data — users, OAuth accounts, sessions, verification tokens, Stripe subscriptions, and processed webhook events
- **Dashboard**: https://console.neon.tech
- **Driver**: `@neondatabase/serverless` (serverless-friendly, no persistent connections)
- **ORM**: Drizzle ORM with schema at `src/lib/db/schema.js`
- **Tables**: `users`, `accounts`, `sessions`, `verificationTokens`, `subscriptions`, `processedEvents`
- **Schema management**: `npm run db:push` syncs schema to database, `npm run db:studio` opens a browser UI to inspect data

| Env Var | Value Format | Purpose |
|---------|-------------|---------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | Connection string |

### 3. Auth.js (NextAuth v5) — Authentication

- **What it does**: Handles user sign-in/sign-out, session management, and OAuth token exchange
- **Adapter**: DrizzleAdapter — stores sessions and tokens in Neon Postgres (not JWTs)
- **Middleware**: `src/proxy.js` protects all `/app` and `/api` routes (except `/api/auth` and `/api/webhook`), redirecting unauthenticated users to `/login`

**Two sign-in providers:**

#### 3a. Google OAuth

- **Setup location**: https://console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client
- **Authorized redirect URI**: `https://scaleshapes.com/api/auth/callback/google`

| Env Var | Value Format | Purpose |
|---------|-------------|---------|
| `GOOGLE_CLIENT_ID` | `...apps.googleusercontent.com` | OAuth client identifier |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | OAuth client secret |

#### 3b. Resend (Magic Link Email)

- **Setup location**: https://resend.com → API Keys
- **DNS**: Requires verified sending domain — MX/DKIM/SPF records for `mail.scaleshapes.com`

| Env Var | Value Format | Purpose |
|---------|-------------|---------|
| `RESEND_API_KEY` | `re_...` | API key for sending emails |
| `EMAIL_FROM` | `Name <noreply@mail.scaleshapes.com>` | Sender address shown to users |

#### Auth.js Core

| Env Var | Value Format | Purpose |
|---------|-------------|---------|
| `AUTH_SECRET` | 64-char hex string | Encrypts session cookies |
| `AUTH_URL` | `http://localhost:3000` (dev) | Callback base URL (Vercel auto-sets in prod) |

### 4. Stripe — Payments & Subscriptions

- **What it does**: Handles subscription checkout, recurring billing, customer portal for managing subscriptions, and webhooks for payment lifecycle events
- **Dashboard**: https://dashboard.stripe.com
- **API version**: `2024-12-18.acacia` (pinned in `src/lib/stripe.js`)

**API routes:**
| Route | Purpose |
|-------|---------|
| `POST /api/checkout` | Creates a Stripe Checkout Session, redirects user to Stripe's hosted payment page |
| `POST /api/portal` | Creates a Billing Portal session for managing/canceling subscriptions |
| `POST /api/webhook` | Receives Stripe webhook events, updates subscription records in DB |
| `DELETE /api/account` | Cancels Stripe subscriptions, then cascade-deletes user from DB |

**Webhook events handled:**
- `checkout.session.completed` — Creates subscription record
- `invoice.paid` — Renews subscription period dates
- `customer.subscription.updated` — Syncs status changes
- `customer.subscription.deleted` — Marks as canceled
- `invoice.payment_failed` — Marks as `past_due`

**Webhook setup**: Stripe Dashboard → Developers → Webhooks → Add endpoint → `https://scaleshapes.com/api/webhook` → select the 5 events above → copy the signing secret

| Env Var | Value Format | Purpose |
|---------|-------------|---------|
| `STRIPE_SECRET_KEY` | `sk_live_...` (prod) or `sk_test_...` (test) | Authenticates API calls to Stripe |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Verifies webhook signatures are from Stripe |
| `STRIPE_PRICE_ID` | `price_...` | The subscription product price to charge |
| `NEXT_PUBLIC_APP_URL` | `https://scaleshapes.com` | Used for checkout success/cancel redirect URLs |

### 5. Upstash — Redis Rate Limiting

- **What it does**: Distributed rate limiting to prevent abuse of auth and checkout endpoints
- **Dashboard**: https://console.upstash.com
- **Library**: `@upstash/ratelimit` + `@upstash/redis`

**Rate limits:**
| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/signin`, `/api/auth/callback/resend` | 5 requests | 60 seconds per IP |
| `/api/checkout`, `/api/portal` | 3 requests | 60 seconds per IP |

| Env Var | Value Format | Purpose |
|---------|-------------|---------|
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | Redis REST API endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Base64 string | Authentication token |

## All Environment Variables

| # | Variable | Service | Required In |
|---|----------|---------|-------------|
| 1 | `DATABASE_URL` | Neon | Vercel + .env.local |
| 2 | `AUTH_SECRET` | Auth.js | Vercel + .env.local |
| 3 | `AUTH_URL` | Auth.js | .env.local only (Vercel auto-sets) |
| 4 | `GOOGLE_CLIENT_ID` | Google OAuth | Vercel + .env.local |
| 5 | `GOOGLE_CLIENT_SECRET` | Google OAuth | Vercel + .env.local |
| 6 | `RESEND_API_KEY` | Resend | Vercel + .env.local |
| 7 | `EMAIL_FROM` | Resend | Vercel + .env.local |
| 8 | `STRIPE_SECRET_KEY` | Stripe | Vercel + .env.local |
| 9 | `STRIPE_WEBHOOK_SECRET` | Stripe | Vercel + .env.local |
| 10 | `STRIPE_PRICE_ID` | Stripe | Vercel + .env.local |
| 11 | `NEXT_PUBLIC_APP_URL` | Stripe | Vercel + .env.local |
| 12 | `UPSTASH_REDIS_REST_URL` | Upstash | Vercel + .env.local |
| 13 | `UPSTASH_REDIS_REST_TOKEN` | Upstash | Vercel + .env.local |

## Switching Between Stripe Test & Live Mode

Stripe test and live modes are completely separate environments. Products, customers, and webhooks don't cross between them.

**To switch modes**, update these 3 env vars on Vercel:

| Env Var | Test Mode | Live Mode |
|---------|-----------|-----------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Test webhook `whsec_...` | Live webhook `whsec_...` |
| `STRIPE_PRICE_ID` | Test price `price_...` | Live price `price_...` |

After switching, clear `stripeCustomerId` from your user row in the database (test customer IDs don't exist in live mode and vice versa). Use `npm run db:studio` to edit the row.

## Request Flow

### Sign-in Flow
1. User visits `/app` → middleware (`proxy.js`) checks session → no session → redirect to `/login`
2. User clicks Google or enters email → Auth.js handles OAuth or sends magic link via Resend
3. Auth callback creates/updates user in Neon → session cookie set → redirect to `/app`

### Subscription Flow
1. Authenticated user without subscription sees `PaywallPrompt`
2. Click "Subscribe Now" → `POST /api/checkout` → creates Stripe customer (if first time) → creates Checkout Session
3. User redirected to Stripe's hosted checkout page → enters payment
4. Stripe sends `checkout.session.completed` webhook → `/api/webhook` creates subscription record in Neon
5. User redirected to `/app?checkout=success` → subscription active → full trainer loads

### Billing Management
1. User visits `/app/account` → sees subscription status
2. Click "Manage Subscription" → `POST /api/portal` → redirected to Stripe Billing Portal
3. User can cancel, update payment method, view invoices
4. Stripe sends `customer.subscription.updated` or `deleted` webhook → DB updated
