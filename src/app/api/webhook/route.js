import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users, subscriptions, processedEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

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
    logger.error("invalid_webhook", { reason: err.message });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: insert event ID first, catch duplicate as the guard
  try {
    await db.insert(processedEvents).values({
      eventId: event.id,
      eventType: event.type,
    });
  } catch (err) {
    // Unique constraint violation means duplicate — safe to skip
    if (
      err.message?.includes("unique") ||
      err.message?.includes("duplicate") ||
      err.code === "23505"
    ) {
      logger.info("webhook_duplicate_skipped", {
        eventId: event.id,
        eventType: event.type,
      });
      return NextResponse.json({ received: true });
    }
    throw err;
  }

  logger.info("webhook_received", {
    eventId: event.id,
    eventType: event.type,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );
        const customerId = session.customer;

        const user = await db.query.users.findFirst({
          where: eq(users.stripeCustomerId, customerId),
        });

        if (!user) {
          logger.error("webhook_user_not_found", { customerId });
          return NextResponse.json(
            { error: "User not found" },
            { status: 500 }
          );
        }

        await db.insert(subscriptions).values({
          userId: user.id,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          currentPeriodStart: new Date(
            subscription.current_period_start * 1000
          ),
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });
        logger.info("subscription_activated", {
          userId: user.id,
          subscriptionId: subscription.id,
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          );
          await db
            .update(subscriptions)
            .set({
              status: subscription.status,
              currentPeriodStart: new Date(
                subscription.current_period_start * 1000
              ),
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              updatedAt: new Date(),
            })
            .where(
              eq(subscriptions.stripeSubscriptionId, invoice.subscription)
            );
          logger.info("subscription_renewed", {
            subscriptionId: invoice.subscription,
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
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

        if (event.type === "customer.subscription.deleted") {
          logger.info("subscription_canceled", {
            subscriptionId: subscription.id,
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await db
            .update(subscriptions)
            .set({ status: "past_due", updatedAt: new Date() })
            .where(
              eq(subscriptions.stripeSubscriptionId, invoice.subscription)
            );
          logger.warn("payment_failed", {
            subscriptionId: invoice.subscription,
          });
        }
        break;
      }
    }

  } catch (err) {
    logger.error("webhook_processing_error", {
      eventType: event.type,
      error: err.message,
    });
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
