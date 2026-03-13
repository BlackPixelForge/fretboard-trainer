import NavBar from "../../components/landing/NavBar";

export const metadata = {
  title: "Fretboard Navigator",
  description: "Diatonic Note Memorization Trainer",
};

export default function AppLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
