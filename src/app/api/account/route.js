import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, accounts, sessions, subscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function DELETE(request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Cancel any active Stripe subscriptions
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (user?.stripeCustomerId) {
      const cancelable = new Set(["active", "trialing", "past_due", "unpaid", "paused"]);
      for await (const sub of stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "all",
      })) {
        if (cancelable.has(sub.status)) {
          await stripe.subscriptions.cancel(sub.id);
        }
      }
    }

    // Delete all user data — cascading deletes handle accounts, sessions, subscriptions
    await db.delete(users).where(eq(users.id, userId));

    logger.info("account_deleted", { userId });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("account_deletion_error", {
      userId,
      error: err.message,
    });
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
