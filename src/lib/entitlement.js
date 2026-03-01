import { db } from "./db";
import { subscriptions } from "./db/schema";
import { eq, and, or } from "drizzle-orm";

/**
 * Check if a user has an active subscription.
 * "Active" means status is 'active'/'trialing', or canceled but period hasn't ended yet.
 */
export async function hasActiveSubscription(userId) {
  const activeSub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      or(
        eq(subscriptions.status, "active"),
        eq(subscriptions.status, "trialing")
      )
    ),
  });

  if (activeSub) return true;

  // Allow canceled subscriptions that haven't expired yet (grace period)
  const canceledSub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "canceled")
    ),
  });

  if (canceledSub && canceledSub.currentPeriodEnd > new Date()) {
    return true;
  }

  return false;
}
