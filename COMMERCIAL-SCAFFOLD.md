# Fretboard Navigator — Commercial Infrastructure Scaffold

> **Purpose:** Blueprint for adding authentication, payments, and a paywall to the Fretboard Navigator app. Written to be self-contained so a future Claude Code session (or any developer) can pick this up with zero prior context.
>
> **Date created:** 2026-02-13
> **Current state:** Purely client-side Next.js 16 app, zero backend surface. See `CLAUDE.md` for full app architecture.

---

## Table of Contents

1. [Current Architecture Summary](#1-current-architecture-summary)
2. [Target Architecture](#2-target-architecture)
3. [Technology Choices](#3-technology-choices)
4. [Implementation Phases](#4-implementation-phases)
5. [Phase 1: Route Restructuring & Landing Page](#5-phase-1-route-restructuring--landing-page)
6. [Phase 2: Database Setup](#6-phase-2-database-setup)
7. [Phase 3: Authentication](#7-phase-3-authentication)
8. [Phase 4: Payment Integration](#8-phase-4-payment-integration)
9. [Phase 5: Route Protection Middleware](#9-phase-5-route-protection-middleware)
10. [Phase 6: Security Hardening](#10-phase-6-security-hardening)
11. [Phase 7: Logging & Monitoring](#11-phase-7-logging--monitoring)
12. [Environment Variables](#12-environment-variables)
13. [Database Schema](#13-database-schema)
14. [New File Tree](#14-new-file-tree)
15. [API Route Specifications](#15-api-route-specifications)
16. [Key Decisions & Rationale](#16-key-decisions--rationale)
17. [Testing Checklist](#17-testing-checklist)
18. [Deployment Checklist](#18-deployment-checklist)

---

## 1. Current Architecture Summary

```
What exists today:
- Next.js 16 App Router, React 19, Tailwind CSS v4
- Single "use client" boundary at FretboardTrainer.jsx (~980 lines)
- Zero API routes, zero middleware, zero database
- Zero environment variables, zero auth
- 3 production dependencies: next, react, react-dom
- Deployed on Vercel
- Single page: src/app/page.js → <FretboardTrainer />
```

The trainer app itself is complete and working. This scaffold adds the commercial layer around it without modifying the trainer's internal logic.

---

## 2. Target Architecture

```
Public routes (no auth required):
  /                    → Landing page (marketing, pricing)
  /login               → Sign in / sign up
  /api/auth/[...]      → Auth.js route handlers
  /api/webhook         → Stripe webhook receiver

Protected routes (auth + active subscription required):
  /app                 → The fretboard trainer
  /app/account         → Subscription management, cancel/resubscribe
  /api/checkout        → Create Stripe checkout session
  /api/portal          → Create Stripe customer portal session
```

---

## 3. Technology Choices

| Concern | Choice | Why |
|---------|--------|-----|
| Auth | **Auth.js v5** (next-auth) | First-party Next.js support, handles OAuth + email login, free, well-documented |
| Auth providers | **Google OAuth + Email magic link** | Google covers most users; magic link for the rest. No password storage. |
| Payments | **Stripe Checkout + Customer Portal** | Industry standard, hosted checkout page (PCI compliance handled by Stripe), customer self-service portal for cancellations |
| Database | **Supabase Postgres** (or **Turso SQLite**) | Supabase has a generous free tier, works well with Auth.js adapter. Turso is the lighter alternative. |
| ORM | **Drizzle** | Lightweight, type-safe-ish even in JS, good Next.js integration |
| Rate limiting | **@upstash/ratelimit** | Serverless-friendly, works on Vercel edge |
| Email (magic links) | **Resend** | Simple API, generous free tier, built for transactional email |

### Dependencies to Add

```json
{
  "dependencies": {
    "next-auth": "^5",
    "@auth/drizzle-adapter": "^1",
    "drizzle-orm": "^0.35",
    "stripe": "^17",
    "@upstash/ratelimit": "^2",
    "@upstash/redis": "^1",
    "resend": "^4"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30",
    "dotenv": "^16"
  }
}
```

> **Note:** Pin exact versions at implementation time. The versions above are approximate and should be verified against the latest stable releases.

---

## 4. Implementation Phases

```
Phase 1: Route restructuring & landing page     (no new deps)
Phase 2: Database setup                          (drizzle, db driver)
Phase 3: Authentication                          (next-auth, resend)
Phase 4: Payment integration                     (stripe)
Phase 5: Route protection middleware             (ties auth + payment together)
Phase 6: Security hardening                      (headers, rate limiting, CSRF)
Phase 7: Logging & monitoring                    (structured logging)
```

Each phase is independently deployable. The app remains functional between phases.

---

## 5. Phase 1: Route Restructuring & Landing Page

**Goal:** Move the trainer behind `/app` and create a public landing page at `/`.

### 5.1 Move the trainer

```
BEFORE:                          AFTER:
src/app/page.js (trainer)   →   src/app/app/page.js (trainer)
                                 src/app/page.js (landing page)
```

**`src/app/app/page.js`** (new — the protected trainer page):
```jsx
import ErrorBoundary from "../../components/ErrorBoundary";
import FretboardTrainer from "../../components/FretboardTrainer";

export default function TrainerPage() {
  return (
    <ErrorBoundary>
      <FretboardTrainer />
    </ErrorBoundary>
  );
}
```

**`src/app/app/layout.js`** (new — trainer-specific layout, minimal):
```jsx
export const metadata = {
  title: "Fretboard Navigator",
  description: "Diatonic Note Memorization Trainer",
};

export default function AppLayout({ children }) {
  return <>{children}</>;
}
```

**`src/app/page.js`** (rewrite — becomes landing page):
```jsx
export default function LandingPage() {
  return (
    <main>
      {/* Hero section */}
      {/* Feature highlights (the 8 modes) */}
      {/* Pricing section */}
      {/* CTA → /login */}
    </main>
  );
}
```

> **Implementation note:** The landing page content is a design task. Start with a minimal version that has a heading, a short description, pricing, and a "Get Started" button linking to `/login`. Iterate on design later.

### 5.2 Verify nothing breaks

- `npm run build` should succeed
- Visiting `/app` shows the trainer
- Visiting `/` shows the landing page
- All existing trainer functionality works unchanged at the new path

---

## 6. Phase 2: Database Setup

**Goal:** Set up a Postgres database with tables for users, accounts, sessions, and subscriptions.

### 6.1 Install dependencies

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv
```

> **Alternative:** If using Supabase instead of Neon, install `postgres` instead of `@neondatabase/serverless`. If using Turso, install `@libsql/client`.

### 6.2 Database schema

**`src/lib/db/schema.js`**:
```js
import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

// Auth.js required tables
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionToken: text("session_token").unique().notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Application-specific: subscription entitlements
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").unique().notNull(),
  stripePriceId: text("stripe_price_id").notNull(),
  status: text("status").notNull(), // 'active', 'canceled', 'past_due', 'unpaid'
  currentPeriodStart: timestamp("current_period_start", { mode: "date" }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }).notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
```

### 6.3 Database connection

**`src/lib/db/index.js`**:
```js
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL, { schema });
```

### 6.4 Drizzle config

**`drizzle.config.js`** (project root):
```js
import "dotenv/config";

export default {
  schema: "./src/lib/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
```

### 6.5 Migration commands

Add to `package.json` scripts:
```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

### 6.6 Verify

```bash
# After creating the database on Supabase/Neon/Turso dashboard:
npm run db:push    # Push schema to database
npm run db:studio  # Visual inspector — confirm tables exist
```

---

## 7. Phase 3: Authentication

**Goal:** Users can sign in with Google or email magic link. Session persists across page loads.

### 7.1 Install

```bash
npm install next-auth@5 @auth/drizzle-adapter resend
```

### 7.2 Auth.js config

**`src/lib/auth.js`**:
```js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import * as schema from "./db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM, // e.g. "Fretboard Navigator <noreply@yourdomain.com>"
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
```

### 7.3 Auth API route

**`src/app/api/auth/[...nextauth]/route.js`**:
```js
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

### 7.4 Login page

**`src/app/login/page.js`**:
```jsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/app");

  return <LoginForm />;
}
```

**`src/components/LoginForm.jsx`**:
```jsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");

  return (
    <div>
      <h1>Sign in to Fretboard Navigator</h1>

      <button onClick={() => signIn("google", { callbackUrl: "/app" })}>
        Continue with Google
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn("resend", { email, callbackUrl: "/app" });
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <button type="submit">Send magic link</button>
      </form>
    </div>
  );
}
```

### 7.5 Session provider

Wrap the app layout so client components can access session state:

**`src/app/app/layout.js`** (update):
```jsx
import { SessionProvider } from "next-auth/react";

export default function AppLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 7.6 Verify

- Visit `/login` → see Google button and email form
- Sign in with Google → redirected to `/app` → trainer works
- Sign in with email → magic link arrives → click → redirected to `/app`
- Hard refresh `/app` → session persists
- `npm run build` succeeds

---

## 8. Phase 4: Payment Integration

**Goal:** Users can subscribe via Stripe Checkout. Webhook updates entitlement status. Users can manage subscription via Stripe Customer Portal.

### 8.1 Install

```bash
npm install stripe
```

### 8.2 Stripe helper

**`src/lib/stripe.js`**:
```js
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

### 8.3 Checkout API route

**`src/app/api/checkout/route.js`**:
```js
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  // Reuse existing Stripe customer or create new one
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, session.user.id));
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // Created in Stripe dashboard
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?checkout=cancel`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
```

### 8.4 Customer portal API route

**`src/app/api/portal/route.js`**:
```js
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 400 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/account`,
  });

  return NextResponse.json({ url: portalSession.url });
}
```

### 8.5 Webhook handler

**`src/app/api/webhook/route.js`**:
```js
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const customerId = session.customer;

      const user = await db.query.users.findFirst({
        where: eq(users.stripeCustomerId, customerId),
      });

      if (user) {
        await db.insert(subscriptions).values({
          userId: user.id,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      if (invoice.subscription) {
        await db
          .update(subscriptions)
          .set({ status: "past_due", updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

### 8.6 Entitlement check helper

**`src/lib/entitlement.js`**:
```js
import { db } from "./db";
import { subscriptions } from "./db/schema";
import { eq, and, or } from "drizzle-orm";

/**
 * Check if a user has an active subscription.
 * "Active" means status is 'active' or 'canceled but period hasn't ended yet'.
 */
export async function hasActiveSubscription(userId) {
  const sub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      or(
        eq(subscriptions.status, "active"),
        eq(subscriptions.status, "trialing")
      )
    ),
  });

  if (sub) return true;

  // Also allow canceled subscriptions that haven't expired yet
  const canceledButActive = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "canceled"),
    ),
  });

  if (canceledButActive && canceledButActive.currentPeriodEnd > new Date()) {
    return true;
  }

  return false;
}
```

### 8.7 Verify

- Stripe test mode: create a product + price in Stripe dashboard
- Hit `/api/checkout` while logged in → redirected to Stripe Checkout
- Complete test payment → webhook fires → subscription row created
- Hit `/api/portal` → redirected to Stripe portal → can cancel
- Cancel → webhook fires → subscription status updated

---

## 9. Phase 5: Route Protection Middleware

**Goal:** Unauthenticated users get redirected to `/login`. Authenticated users without a subscription see a paywall. Only active subscribers access `/app`.

### 9.1 Middleware

**`src/middleware.js`** (project root of `src/`):
```js
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes — always accessible
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/webhook") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Everything under /app and /api (except webhook) requires auth
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

> **Note on subscription checks in middleware:** Middleware runs on the edge and cannot easily query the database. The subscription check happens at the page level instead (see 9.2).

### 9.2 Page-level subscription gate

**`src/app/app/page.js`** (update):
```jsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/lib/entitlement";
import ErrorBoundary from "@/components/ErrorBoundary";
import FretboardTrainer from "@/components/FretboardTrainer";
import PaywallPrompt from "@/components/PaywallPrompt";

export default async function TrainerPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const hasAccess = await hasActiveSubscription(session.user.id);

  if (!hasAccess) {
    return <PaywallPrompt />;
  }

  return (
    <ErrorBoundary>
      <FretboardTrainer />
    </ErrorBoundary>
  );
}
```

**`src/components/PaywallPrompt.jsx`**:
```jsx
"use client";

import { useState } from "react";

export default function PaywallPrompt() {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div>
      <h1>Subscribe to Fretboard Navigator</h1>
      <p>Get full access to all 8 training modes.</p>
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? "Redirecting to checkout..." : "Subscribe"}
      </button>
    </div>
  );
}
```

### 9.3 Verify

- Logged out → visit `/app` → redirected to `/login`
- Logged in, no subscription → visit `/app` → see paywall
- Click subscribe → Stripe Checkout → pay → redirected back → see trainer
- Cancel subscription in portal → wait for period end → see paywall again

---

## 10. Phase 6: Security Hardening

### 10.1 Security headers

**`next.config.mjs`** (replace existing):
```js
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires these
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

> **CSP note:** The above CSP is a starting point. After deployment, test all pages and adjust if fonts, images, or Stripe elements are blocked. Use browser console CSP violation reports to fine-tune.

### 10.2 Rate limiting

**`src/lib/ratelimit.js`**:
```js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const authLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 attempts per minute
  analytics: true,
  prefix: "ratelimit:auth",
});

export const checkoutLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 checkout attempts per minute
  analytics: true,
  prefix: "ratelimit:checkout",
});
```

Apply in API routes:
```js
// At the top of any API route handler:
import { checkoutLimiter } from "@/lib/ratelimit";

const ip = request.headers.get("x-forwarded-for") ?? "unknown";
const { success } = await checkoutLimiter.limit(ip);
if (!success) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
```

### 10.3 Webhook signature verification

Already implemented in Phase 4 (section 8.5). The `stripe.webhooks.constructEvent()` call verifies the signature. Never skip this.

### 10.4 Self-host fonts (optional but recommended)

Replace the Google Fonts `@import` in `globals.css` with locally hosted font files:

```bash
# Download fonts
mkdir -p public/fonts
# Download JetBrains Mono and Outfit woff2 files into public/fonts/
```

Then in `globals.css`, replace the `@import url(...)` with `@font-face` declarations pointing to `/fonts/...`.

This eliminates the Google Fonts privacy concern (Google can no longer correlate font requests with your authenticated users).

---

## 11. Phase 7: Logging & Monitoring

### 11.1 Structured logging

**`src/lib/logger.js`**:
```js
/**
 * Minimal structured logger for Vercel.
 * Vercel captures console.log output and makes it searchable.
 * Structured JSON format enables filtering in Vercel dashboard.
 */
export function log(level, event, data = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...data,
  };
  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (event, data) => log("info", event, data),
  warn: (event, data) => log("warn", event, data),
  error: (event, data) => log("error", event, data),
};
```

### 11.2 What to log

```
Auth events:
  - login_success    { userId, provider }
  - login_failure    { email, provider, reason }

Payment events:
  - checkout_created { userId, priceId }
  - webhook_received { eventType, subscriptionId }
  - webhook_error    { eventType, error }
  - subscription_activated { userId, subscriptionId }
  - subscription_canceled  { userId, subscriptionId }

Security events:
  - rate_limit_hit   { ip, endpoint }
  - invalid_webhook  { reason }
```

---

## 12. Environment Variables

### Required in production (Vercel dashboard)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Auth.js
AUTH_SECRET=           # Generate with: npx auth secret
AUTH_URL=https://yourdomain.com

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Resend (resend.com)
RESEND_API_KEY=
EMAIL_FROM=Fretboard Navigator <noreply@yourdomain.com>

# Stripe (dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Upstash Redis (upstash.com) — for rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### Local development (`.env.local`)

Same keys but with test/development values:
- Stripe keys: use `sk_test_...` and test webhook secret
- Database: local or dev Supabase/Neon instance
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

---

## 13. Database Schema

```
┌──────────────────┐     ┌──────────────────┐
│ users            │     │ accounts         │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │◄────│ userId (FK)      │
│ name             │     │ provider         │
│ email (unique)   │     │ providerAccountId│
│ emailVerified    │     │ type             │
│ image            │     │ access_token     │
│ stripeCustomerId │     │ refresh_token    │
│ createdAt        │     │ ...              │
└──────────────────┘     └──────────────────┘
        │
        │  1:many
        ▼
┌──────────────────┐     ┌──────────────────────┐
│ sessions         │     │ subscriptions         │
├──────────────────┤     ├──────────────────────-┤
│ id (PK)          │     │ id (PK)               │
│ userId (FK)      │     │ userId (FK)           │
│ sessionToken     │     │ stripeSubscriptionId  │
│ expires          │     │ stripePriceId         │
└──────────────────┘     │ status                │
                         │ currentPeriodStart    │
┌──────────────────┐     │ currentPeriodEnd      │
│ verificationTokens│    │ cancelAtPeriodEnd     │
├──────────────────┤     │ createdAt             │
│ identifier       │     │ updatedAt             │
│ token            │     └───────────────────────┘
│ expires          │
└──────────────────┘
```

---

## 14. New File Tree

Files to ADD (existing files remain unchanged unless noted):

```
src/
├── middleware.js                          # NEW — route protection
├── lib/
│   ├── db/
│   │   ├── index.js                      # NEW — database connection
│   │   └── schema.js                     # NEW — Drizzle schema
│   ├── auth.js                           # NEW — Auth.js configuration
│   ├── stripe.js                         # NEW — Stripe client
│   ├── entitlement.js                    # NEW — subscription check
│   ├── ratelimit.js                      # NEW — rate limiting
│   └── logger.js                         # NEW — structured logging
├── app/
│   ├── page.js                           # MODIFIED — becomes landing page
│   ├── login/
│   │   └── page.js                       # NEW — login page
│   ├── app/
│   │   ├── layout.js                     # NEW — SessionProvider wrapper
│   │   ├── page.js                       # NEW — trainer with auth gate
│   │   └── account/
│   │       └── page.js                   # NEW — subscription management
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.js              # NEW — Auth.js handlers
│       ├── checkout/
│       │   └── route.js                  # NEW — create Stripe session
│       ├── portal/
│       │   └── route.js                  # NEW — Stripe customer portal
│       └── webhook/
│           └── route.js                  # NEW — Stripe webhook
├── components/
│   ├── LoginForm.jsx                     # NEW — sign-in UI
│   └── PaywallPrompt.jsx                 # NEW — subscribe CTA
drizzle.config.js                         # NEW — Drizzle CLI config
next.config.mjs                           # MODIFIED — security headers
```

**Unchanged files (the entire trainer):**
All files in `components/fretboard/`, `components/quiz/`, `components/controls/`, `components/lib/`, `FretboardTrainer.jsx`, `Legend.jsx`, `Tips.jsx`, `TriadExplainer.jsx`, `HarmoniesPanel.jsx` — zero modifications needed.

---

## 15. API Route Specifications

### POST `/api/checkout`
- **Auth:** Required (session cookie)
- **Rate limit:** 3/minute per IP
- **Request body:** None
- **Response:** `{ url: "https://checkout.stripe.com/..." }`
- **Errors:** 401 Unauthorized, 429 Too Many Requests, 500 Internal Error

### POST `/api/portal`
- **Auth:** Required (session cookie)
- **Rate limit:** 3/minute per IP
- **Request body:** None
- **Response:** `{ url: "https://billing.stripe.com/..." }`
- **Errors:** 401 Unauthorized, 400 No Subscription, 429 Too Many Requests

### POST `/api/webhook`
- **Auth:** Stripe signature verification (not session-based)
- **Rate limit:** None (Stripe controls the rate)
- **Request body:** Raw Stripe event payload
- **Response:** `{ received: true }`
- **Errors:** 400 Invalid Signature
- **Events handled:**
  - `checkout.session.completed` → create subscription record
  - `customer.subscription.updated` → update status/period
  - `customer.subscription.deleted` → mark canceled
  - `invoice.payment_failed` → mark past_due

---

## 16. Key Decisions & Rationale

### Why Auth.js over Clerk?
- Free, no per-user pricing. For a paid app, Clerk's per-MAU cost eats into margins.
- Full control over the auth flow and data.
- Trade-off: more setup work upfront.

### Why Stripe Checkout (hosted) over embedded?
- PCI compliance handled entirely by Stripe. You never touch card numbers.
- Stripe handles SCA/3DS automatically.
- Trade-off: user leaves your site briefly for checkout. This is standard and expected.

### Why subscription over one-time payment?
- Recurring revenue is more sustainable for an educational tool.
- Stripe Customer Portal gives users self-service cancel/resubscribe.
- Easy to change: swap `mode: "subscription"` to `mode: "payment"` in the checkout route for one-time.

### Why page-level subscription check instead of middleware?
- Middleware runs on Vercel Edge Runtime, which has limited database driver support.
- A database query per request in middleware adds latency to every page load.
- Page-level check only runs when rendering protected pages, not on every static asset.

### Why not check subscription in the client?
- Client checks can be bypassed. The server-side check in `page.js` ensures the trainer component never even ships to the browser unless the user has paid.
- The entire `FretboardTrainer` bundle is only sent after server-side verification.

### What about the JS bundle being inspectable?
- Anyone with browser DevTools can read the trainer's JavaScript source regardless of auth.
- This is inherent to all client-side web apps and is acceptable: you're selling the polished experience, ongoing updates, and convenience — not secret algorithms.
- If this becomes a concern, consider: server-side rendering of fret positions (major architecture change), or accept it as the nature of web apps.

---

## 17. Testing Checklist

### Auth flows
- [ ] Google OAuth sign-in → redirect to `/app`
- [ ] Email magic link sign-in → email received → click → redirect to `/app`
- [ ] Sign out → session cleared → redirect to landing page
- [ ] Visit `/app` logged out → redirect to `/login`
- [ ] Visit `/login` logged in → redirect to `/app`
- [ ] Session persists across browser refresh
- [ ] Session expires after configured timeout

### Payment flows
- [ ] Authenticated user without subscription → sees paywall
- [ ] Click subscribe → redirect to Stripe Checkout
- [ ] Complete test payment (card 4242424242424242) → webhook fires → redirect to trainer
- [ ] Webhook creates subscription record in database
- [ ] Visit `/api/portal` → redirect to Stripe portal
- [ ] Cancel in portal → webhook fires → subscription status updated
- [ ] Canceled user still has access until period end
- [ ] After period end → paywall shown again
- [ ] Failed payment → webhook fires → status set to past_due

### Security
- [ ] Security headers present in response (check with securityheaders.com)
- [ ] CSP doesn't block fonts, Stripe, or app functionality
- [ ] Forged webhook request (no valid signature) → 400 error
- [ ] Rate limit: 6th login attempt within 60s → 429 error
- [ ] Rate limit: 4th checkout attempt within 60s → 429 error
- [ ] Direct API route access without session → 401 error

### Edge cases
- [ ] User deletes cookies mid-session → graceful redirect to login
- [ ] Stripe webhook arrives before checkout redirect completes → subscription still created
- [ ] User subscribes, cancels, resubscribes → new subscription record, access restored
- [ ] Two browser tabs → session consistent across both

---

## 18. Deployment Checklist

### Before first deploy
- [ ] Create Stripe account, complete identity verification
- [ ] Create product + price in Stripe dashboard
- [ ] Configure Stripe webhook endpoint: `https://yourdomain.com/api/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Create Google OAuth credentials (console.cloud.google.com)
  - Authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
- [ ] Create Resend account, verify sending domain
- [ ] Create database (Supabase/Neon), run `npm run db:push`
- [ ] Create Upstash Redis instance
- [ ] Set all environment variables in Vercel dashboard
- [ ] Configure Stripe Customer Portal (branding, cancellation flow)

### Deploy
- [ ] `git push` to trigger Vercel deployment
- [ ] Verify build succeeds
- [ ] Run through testing checklist above with Stripe test mode
- [ ] Switch Stripe to live mode
- [ ] Update environment variables with live Stripe keys
- [ ] Redeploy
- [ ] Make a real purchase to verify end-to-end

### Post-deploy
- [ ] Monitor Vercel logs for errors in first 24 hours
- [ ] Check Stripe dashboard for webhook delivery failures
- [ ] Test password reset / account recovery flow
- [ ] Set up Stripe email notifications for failed payments
