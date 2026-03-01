import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/lib/entitlement";
import ErrorBoundary from "../../components/ErrorBoundary";
import FretboardTrainer from "../../components/FretboardTrainer";
import PaywallPrompt from "../../components/PaywallPrompt";

export default async function AppPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean);
  const isAdmin = adminEmails.includes(session.user.email);
  const hasAccess = isAdmin || await hasActiveSubscription(session.user.id);

  if (!hasAccess) {
    return <PaywallPrompt />;
  }

  return (
    <ErrorBoundary>
      <FretboardTrainer />
    </ErrorBoundary>
  );
}
