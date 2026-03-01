import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCheckoutLimiter } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await getCheckoutLimiter().limit(ip);
  if (!success) {
    logger.warn("rate_limit_hit", { ip, endpoint: "/api/portal" });
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No subscription found" },
      { status: 400 }
    );
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    logger.error("portal_session_error", {
      userId: session.user.id,
      error: err.message,
    });
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
