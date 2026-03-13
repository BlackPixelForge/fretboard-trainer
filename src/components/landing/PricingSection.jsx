"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const FEATURES = [
  "All 8 learning & quiz modes",
  "Every diatonic key",
  "Full 19-fret fretboard",
  "7 major scale positions",
  "5 CAGED shapes",
  "48 triad voicings",
  "Streak tracking & accuracy stats",
];

export default function PricingSection() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animation = "landingFadeUp 600ms var(--ease-out-expo) both";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    el.style.opacity = "0";
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{
      padding: "80px 24px",
      maxWidth: 1100,
      margin: "0 auto",
    }}>
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2 style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          color: "var(--text-primary)",
          margin: "0 0 16px",
          letterSpacing: "-0.03em",
        }}>
          Pricing
        </h2>
        <div style={{
          width: 40,
          height: 2,
          background: "linear-gradient(90deg, #e84e3c, #ffc832)",
          margin: "0 auto",
          borderRadius: 1,
        }} />
      </div>

      {/* Pricing card */}
      <div
        ref={ref}
        style={{
          maxWidth: 420,
          margin: "0 auto",
          position: "relative",
          background: "rgba(14,14,22,0.85)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 16,
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 0 80px rgba(210,170,90,0.03), 0 4px 30px rgba(0,0,0,0.2)",
        }}
      >
        {/* Top edge light reflection */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
          pointerEvents: "none",
        }} />

        {/* Price */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: "3rem",
            letterSpacing: "-0.04em",
            background: "linear-gradient(135deg, #e84e3c 0%, #ffc832 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            $5
          </span>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "1.1rem",
            color: "var(--text-muted)",
            marginLeft: 4,
          }}>
            /month
          </span>
        </div>

        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--text-dim)",
          margin: "0 0 28px",
          letterSpacing: "0.01em",
        }}>
          Cancel anytime
        </p>

        {/* Feature list */}
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 32px",
          textAlign: "left",
        }}>
          {FEATURES.map((feature) => (
            <li
              key={feature}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                padding: "8px 0",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: "var(--accent-green)", fontSize: "0.85rem", flexShrink: 0 }}>
                &#10003;
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href="/app" style={{ textDecoration: "none" }}>
          <button
            className="landing-cta"
            style={{
              width: "100%",
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
            Get Started →
          </button>
        </Link>
      </div>
    </section>
  );
}
