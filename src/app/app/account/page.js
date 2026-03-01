import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AccountPanel from "../../../components/AccountPanel";

export const metadata = {
  title: "Account — Fretboard Navigator",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const sub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, session.user.id),
  });

  const subscriptionData = sub
    ? {
        status: sub.status,
        currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      }
    : null;

  return (
    <AccountPanel
      user={{ name: session.user.name, email: session.user.email }}
      subscription={subscriptionData}
    />
  );
}
