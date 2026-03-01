"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleMagicLink(e) {
    e.preventDefault();
    setLoading(true);
    await signIn("resend", { email, callbackUrl: "/app" });
    setEmailSent(true);
    setLoading(false);
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
          maxWidth: 400,
          width: "100%",
          background: "rgba(14,14,22,0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "48px 32px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "1.6rem",
            color: "var(--text-primary)",
            margin: "0 0 8px",
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          Sign in
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            margin: "0 0 32px",
            textAlign: "center",
          }}
        >
          to Fretboard Navigator
        </p>

        {/* Google OAuth */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/app" })}
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "background 150ms, border-color 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "24px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            or
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,0.06)",
            }}
          />
        </div>

        {/* Magic link form */}
        {emailSent ? (
          <div
            style={{
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                color: "var(--text-primary)",
                margin: "0 0 8px",
              }}
            >
              Check your email
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              A sign-in link was sent to {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 12,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #e84e3c 0%, #d44030 100%)",
                color: "#fff",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 150ms",
              }}
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
