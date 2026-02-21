import "./globals.css";

export const metadata = {
  title: "Fretboard Navigator — Master the Guitar Fretboard",
  description:
    "Interactive guitar fretboard trainer with 8 learning modes: scale positions, CAGED shapes, triads, intervals, and quizzes. Free, no account needed.",
  openGraph: {
    title: "Fretboard Navigator",
    description:
      "Master the guitar fretboard with 8 interactive modes — scale positions, CAGED shapes, 48 triad voicings, and more.",
    siteName: "Fretboard Navigator",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
