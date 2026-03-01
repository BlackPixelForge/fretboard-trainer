import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Sign In — Fretboard Navigator",
};

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/app");

  return <LoginForm />;
}
