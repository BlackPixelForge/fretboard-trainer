"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const FretboardTrainer = dynamic(
  () => import("../FretboardTrainer"),
  { ssr: false, loading: () => (
    <div style={{
      minHeight: 360,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-dim)",
      fontFamily: "var(--font-mono)",
      fontSize: "0.85rem",
    }}>
      Loading demo…
    </div>
  )}
);

export default function DemoSection() {
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
      { threshold: 0.05 }
    );

    el.style.opacity = "0";
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{
      padding: "40px 24px 80px",
      maxWidth: 1200,
      margin: "0 auto",
    }}>
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          color: "var(--text-primary)",
          margin: "0 0 16px",
          letterSpacing: "-0.03em",
        }}>
          Try It Yourself
        </h2>
        <div style={{
          width: 40,
          height: 2,
          background: "linear-gradient(90deg, #e84e3c, #ffc832)",
          margin: "0 auto 16px",
          borderRadius: 1,
        }} />
        <p style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
          fontSize: "0.95rem",
          color: "var(--text-secondary)",
          margin: 0,
        }}>
          All 8 modes, live. Tap around — this is the real thing.
        </p>
      </div>

      {/* Demo panel */}
      <div
        ref={ref}
        style={{
          position: "relative",
          background: "rgba(14,14,22,0.7)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 0 80px rgba(210,170,90,0.03), 0 4px 30px rgba(0,0,0,0.3)",
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
          zIndex: 1,
        }} />

        {/* Inner glow */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "80%",
          height: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at center top, rgba(210,170,90,0.02) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        <FretboardTrainer embedded />
      </div>

      {/* Nudge + CTA */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--text-dim)",
          margin: "0 0 20px",
        }}>
          C major only — full app has all keys, regions & more
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
            Open Full App →
          </button>
        </Link>
      </div>
    </section>
  );
}
