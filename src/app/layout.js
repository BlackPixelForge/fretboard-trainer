import "./globals.css";

export const metadata = {
  title: "Fretboard Navigator",
  description: "Diatonic Note Memorization Trainer — learn the guitar fretboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
