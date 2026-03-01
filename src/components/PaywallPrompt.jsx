"use client";

import { useState } from "react";

export default function PaywallPrompt() {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url, error } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        console.error("Checkout error:", error);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, #0a0a0f 0%, #12121c 40%, #0e0e16 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          background: "rgba(14,14,22,0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "48px 32px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "1.8rem",
            color: "var(--text-primary)",
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
          }}
        >
          Subscribe to Fretboard Navigator
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            margin: "0 0 8px",
            lineHeight: 1.5,
          }}
        >
          Get full access to all 8 training modes, every key, all 19 frets,
          scale positions, CAGED shapes, triads, and quizzes.
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--text-dim)",
            margin: "0 0 32px",
          }}
        >
          Cancel anytime. Access continues until the end of your billing period.
        </p>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="landing-cta"
          style={{
            color: "#fff",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "1rem",
            padding: "16px 40px",
            borderRadius: 10,
            border: "none",
            cursor: loading ? "wait" : "pointer",
            letterSpacing: "0.01em",
            opacity: loading ? 0.7 : 1,
            transition: "opacity 150ms",
          }}
        >
          {loading ? "Redirecting to checkout..." : "Subscribe Now"}
        </button>
      </div>
    </div>
  );
}
