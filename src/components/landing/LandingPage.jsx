"use client";

import Link from "next/link";
import Hero from "./Hero";
import FeatureGrid from "./FeatureGrid";
import DemoSection from "./DemoSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div
      className="app-grain"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a0f 0%, #12121c 40%, #0e0e16 100%)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Global warm ambient glow */}
      <div style={{
        position: "fixed",
        top: "15%",
        left: "50%",
        width: "80vw",
        height: "60vh",
        transform: "translateX(-50%)",
        background: "radial-gradient(ellipse at center, rgba(210,170,90,0.025) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <FeatureGrid />
        <DemoSection />

        {/* Closing CTA */}
        <section style={{
          padding: "80px 24px",
          display: "flex",
          justifyContent: "center",
        }}>
          <div style={{
            maxWidth: 600,
            width: "100%",
            textAlign: "center",
            background: "rgba(14,14,22,0.6)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 16,
            padding: "48px 32px",
            boxShadow: "0 0 80px rgba(210,170,90,0.03), 0 4px 30px rgba(0,0,0,0.2)",
            position: "relative",
          }}>
            {/* Panel light reflection */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
              pointerEvents: "none",
            }} />

            <h2
              className="hero-gradient-text"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                letterSpacing: "-0.03em",
                margin: "0 0 12px",
              }}
            >
              Start learning the fretboard
            </h2>

            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              margin: "0 0 28px",
            }}>
              Try the demo above, then subscribe for full access.
            </p>

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
        </section>

        <Footer />
      </div>
    </div>
  );
}
