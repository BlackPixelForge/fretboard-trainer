import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getCheckoutLimiter } from "@/lib/ratelimit";

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await getCheckoutLimiter().limit(ip);
  if (!success) {
    logger.warn("rate_limit_hit", { ip, endpoint: "/api/checkout" });
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
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
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?checkout=cancel`,
    });

    logger.info("checkout_created", {
      userId: session.user.id,
      priceId: process.env.STRIPE_PRICE_ID,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    logger.error("checkout_error", { error: err.message });
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
