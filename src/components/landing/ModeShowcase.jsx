"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import FretboardVisual from "./FretboardVisual";

// CAGED showcase: dots showing different CAGED shape colors
const CAGED_DOTS = [
  // E shape (red)
  { string: 0, fret: 1, degree: 1, isRoot: true, cagedShape: "E", label: "R" },
  { string: 1, fret: 1, degree: 5, cagedShape: "E", label: "5" },
  { string: 2, fret: 1, degree: 3, cagedShape: "E", label: "3" },
  { string: 3, fret: 2, degree: 1, isRoot: true, cagedShape: "E", label: "R" },
  { string: 4, fret: 2, degree: 5, cagedShape: "E", label: "5" },
  { string: 5, fret: 1, degree: 1, isRoot: true, cagedShape: "E", label: "R" },
  // G shape (blue) continuation
  { string: 0, fret: 3, degree: 3, cagedShape: "G", label: "3" },
  { string: 1, fret: 3, degree: 1, isRoot: true, cagedShape: "G", label: "R" },
  { string: 2, fret: 3, degree: 5, cagedShape: "G", label: "5" },
  { string: 3, fret: 4, degree: 3, cagedShape: "G", label: "3" },
  { string: 4, fret: 4, degree: 1, isRoot: true, cagedShape: "G", label: "R" },
  { string: 5, fret: 3, degree: 3, cagedShape: "G", label: "3" },
];

// Scale position dots with degree colors
const SCALE_DOTS = [
  { string: 0, fret: 1, degree: 1, isRoot: true, label: "1" },
  { string: 0, fret: 3, degree: 2, label: "2" },
  { string: 0, fret: 5, degree: 3, label: "3" },
  { string: 1, fret: 1, degree: 5, label: "5" },
  { string: 1, fret: 2, degree: 6, label: "6" },
  { string: 1, fret: 4, degree: 7, label: "7" },
  { string: 2, fret: 1, degree: 2, label: "2" },
  { string: 2, fret: 3, degree: 3, label: "3" },
  { string: 2, fret: 5, degree: 4, label: "4" },
  { string: 3, fret: 1, degree: 6, label: "6" },
  { string: 3, fret: 2, degree: 7, label: "7" },
  { string: 3, fret: 4, degree: 1, isRoot: true, label: "1" },
];

// Quiz showcase: single pulsing dot
const QUIZ_DOTS = [
  { string: 2, fret: 3, degree: 3, label: "?" },
];

const SHOWCASES = [
  {
    title: "CAGED Shapes",
    color: "#8c64dc",
    dots: CAGED_DOTS,
    text: "Five chord shapes. Infinite positions. See how C, A, G, E, and D open shapes tile across the entire fretboard, giving you a visual map of every chord tone.",
  },
  {
    title: "Scale Positions",
    color: "#e84e3c",
    dots: SCALE_DOTS,
    text: "Seven forms, one system. Each scale position covers a region of the fretboard. Together, they give you complete coverage — every note, every key.",
  },
  {
    title: "Quiz Mode",
    color: "#ffc832",
    dots: QUIZ_DOTS,
    isQuiz: true,
    text: "Test what you've learned. Identify notes by position or find every occurrence of a note across all six strings. Track your streak and accuracy.",
  },
];

const ANSWER_BUBBLES = ["C", "D", "E", "G"];

function ShowcaseBlock({ showcase, index }) {
  const ref = useRef(null);
  const reversed = index % 2 === 1;

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
      { threshold: 0.15 }
    );

    el.style.opacity = "0";
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 48,
        flexDirection: reversed ? "row-reverse" : "row",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/* Text side */}
      <div style={{ flex: "1 1 320px", minWidth: 280, maxWidth: 500 }}>
        <h3 style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
          color: "var(--text-primary)",
          margin: "0 0 6px",
          letterSpacing: "-0.02em",
        }}>
          {showcase.title}
        </h3>
        <div style={{
          width: 32,
          height: 2,
          background: showcase.color,
          borderRadius: 1,
          marginBottom: 20,
        }} />
        <p style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
          fontSize: "1rem",
          color: "var(--text-secondary)",
          lineHeight: 1.65,
          margin: "0 0 24px",
        }}>
          {showcase.text}
        </p>
        <Link
          href="/app"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: showcase.color,
            textDecoration: "none",
            letterSpacing: "0.01em",
          }}
        >
          Try it →
        </Link>
      </div>

      {/* Visual side */}
      <div style={{
        flex: "1 1 300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        minWidth: 0,
      }}>
        <FretboardVisual
          strings={4}
          frets={5}
          dots={showcase.dots}
          animate={false}
        />

        {/* Quiz answer bubbles */}
        {showcase.isQuiz && (
          <div style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
          }}>
            {ANSWER_BUBBLES.map((note) => (
              <div key={note} style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,200,50,0.12)",
                border: "1.5px solid #ffc83260",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#ffe080",
              }}>
                {note}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ModeShowcase() {
  return (
    <section style={{
      padding: "40px 24px 80px",
      maxWidth: 1000,
      margin: "0 auto",
    }}>
      {SHOWCASES.map((showcase, i) => (
        <div key={showcase.title}>
          {/* Warm glow divider */}
          <div style={{
            width: "100%",
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "60%",
              height: 1,
              background: "radial-gradient(ellipse at center, rgba(210,170,90,0.12) 0%, transparent 70%)",
            }} />
          </div>

          <ShowcaseBlock showcase={showcase} index={i} />
        </div>
      ))}
    </section>
  );
}
