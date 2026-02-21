"use client";

import { useEffect, useRef } from "react";

const FEATURES = [
  {
    name: "Explore",
    color: "#3ca0dc",
    description: "Click to reveal notes across the fretboard. Toggle between note names, sharps, and scale degrees.",
  },
  {
    name: "Scale Positions",
    color: "#e84e3c",
    description: "Navigate 7 major scale forms that tile seamlessly. See fingerings, degrees, or note names.",
  },
  {
    name: "CAGED",
    color: "#8c64dc",
    description: "Watch 5 open chord shapes tile across the neck. Chord tones vs. scale tones, color-coded by shape.",
  },
  {
    name: "Intervals",
    color: "#50be50",
    description: "See every note as its interval from the root. Filter by degree, test yourself with interval quizzes.",
  },
  {
    name: "1-Fret Rule",
    color: "#ffc832",
    description: "Pick any fret — see which keys all 7 forms produce. Shift one fret to cover all 12 keys.",
  },
  {
    name: "Triads",
    color: "#e6a03c",
    description: "Browse 48 movable triad shapes across 4 string sets. Auto-cycle with speed control.",
  },
  {
    name: "Name Note",
    color: "#ffc832",
    isQuiz: true,
    description: "A fret lights up — name that note. Multiple choice with streak tracking and accuracy stats.",
  },
  {
    name: "Find Note",
    color: "#ffc832",
    isQuiz: true,
    description: "Given a note, find every occurrence on the fretboard. Batch quiz with instant visual feedback.",
  },
];

function FeatureCard({ feature, style }) {
  return (
    <div
      className="feature-card panel"
      style={{
        position: "relative",
        background: "rgba(14,14,22,0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 12,
        padding: "24px 20px 20px",
        borderTop: `2px solid ${feature.color}`,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* LED dot */}
      <div style={{
        position: "absolute",
        top: 14,
        right: 14,
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: feature.color,
        boxShadow: `0 0 8px ${feature.color}60, 0 0 16px ${feature.color}30`,
      }} />

      <h3 style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: "1rem",
        color: "var(--text-primary)",
        margin: "0 0 8px",
      }}>
        {feature.name}
      </h3>

      <p style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 400,
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
        margin: 0,
        lineHeight: 1.55,
      }}>
        {feature.description}
      </p>
    </div>
  );
}

export default function FeatureGrid() {
  const gridRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = `landingFadeUp 500ms var(--ease-out-expo) ${entry.target.dataset.delay}ms both`;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const cards = el.querySelectorAll(".feature-card");
    cards.forEach((card, i) => {
      card.dataset.delay = String(i * 60);
      card.style.opacity = "0";
      observer.observe(card);
    });

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
          Eight ways to learn
        </h2>
        <div style={{
          width: 40,
          height: 2,
          background: "linear-gradient(90deg, #e84e3c, #ffc832)",
          margin: "0 auto",
          borderRadius: 1,
        }} />
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.name} feature={feature} />
        ))}
      </div>
    </section>
  );
}
