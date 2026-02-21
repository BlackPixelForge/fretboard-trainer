import Link from "next/link";
import FretboardVisual from "./FretboardVisual";

// Hero fretboard dots — a C major chord shape spread across the neck
const HERO_DOTS = [
  // String 0 (high E)
  { string: 0, fret: 1, degree: 5, label: "5" },
  { string: 0, fret: 3, degree: 6, label: "6" },
  { string: 0, fret: 5, degree: 7, label: "7" },
  // String 1 (B)
  { string: 1, fret: 1, degree: 1, isRoot: true, label: "R" },
  { string: 1, fret: 3, degree: 2, label: "2" },
  { string: 1, fret: 5, degree: 3, label: "3" },
  // String 2 (G)
  { string: 2, fret: 2, degree: 5, label: "5" },
  { string: 2, fret: 4, degree: 6, label: "6" },
  { string: 2, fret: 5, degree: 7, label: "7" },
  // String 3 (D)
  { string: 3, fret: 2, degree: 2, label: "2" },
  { string: 3, fret: 3, degree: 3, label: "3" },
  { string: 3, fret: 5, degree: 4, label: "4" },
  // String 4 (A)
  { string: 4, fret: 2, degree: 6, label: "6" },
  { string: 4, fret: 3, degree: 1, isRoot: true, label: "R" },
  { string: 4, fret: 5, degree: 2, label: "2" },
  // String 5 (low E)
  { string: 5, fret: 1, degree: 3, label: "3" },
  { string: 5, fret: 3, degree: 4, label: "4" },
  { string: 5, fret: 5, degree: 5, label: "5" },
];

const STATS = [
  { num: "8", label: "modes", color: "#e84e3c" },
  { num: "7", label: "positions", color: "#ffc832" },
  { num: "5", label: "CAGED shapes", color: "#3ca0dc" },
  { num: "48", label: "triad voicings", color: "#50be50" },
];

export default function Hero() {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px 60px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "35%",
        width: "60vw",
        height: "60vh",
        background: "radial-gradient(ellipse at center, rgba(210,170,90,0.04) 0%, transparent 65%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 60,
        maxWidth: 1200,
        width: "100%",
        position: "relative",
        zIndex: 1,
        flexWrap: "wrap",
      }}>
        {/* Text block */}
        <div style={{
          flex: "1 1 420px",
          minWidth: 300,
        }}>
          <h1
            className="hero-gradient-text"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              margin: "0 0 20px",
            }}
          >
            Fretboard Navigator
          </h1>

          <p style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
            color: "var(--text-secondary)",
            letterSpacing: "0.01em",
            margin: "0 0 32px",
            lineHeight: 1.5,
          }}>
            Master the guitar fretboard
          </p>

          {/* Stats strip */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            marginBottom: 36,
            flexWrap: "wrap",
            rowGap: 8,
          }}>
            {STATS.map((stat, i) => (
              <span key={stat.label} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <span style={{
                    color: "var(--text-dim)",
                    margin: "0 12px",
                    fontSize: "0.6rem",
                  }}>
                    ·
                  </span>
                )}
                <span style={{ color: stat.color, fontWeight: 700 }}>{stat.num}</span>
                <span style={{ color: "var(--text-muted)", marginLeft: 5 }}>{stat.label}</span>
              </span>
            ))}
          </div>

          <Link href="/app" style={{ textDecoration: "none" }}>
            <button
              className="landing-cta"
              style={{
                color: "#fff",
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "16px 32px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Start Learning →
            </button>
          </Link>
        </div>

        {/* Fretboard visual */}
        <div style={{
          flex: "1 1 380px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: "rotate(-2deg)",
          minWidth: 0,
        }}>
          <FretboardVisual
            strings={6}
            frets={6}
            dots={HERO_DOTS}
            animate={true}
          />
        </div>
      </div>
    </section>
  );
}
