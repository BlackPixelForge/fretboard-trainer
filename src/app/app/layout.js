import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Fretboard Navigator",
  description: "Diatonic Note Memorization Trainer",
};

export default function AppLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
