"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "rgba(10,10,15,0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: "none",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #e84e3c 0%, #ffc832 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Fretboard Navigator
      </Link>

      {session ? (
        <Link
          href="/app/account"
          style={{
            textDecoration: "none",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid var(--border-subtle)",
            transition: "border-color var(--duration-normal) var(--ease-smooth), color var(--duration-normal) var(--ease-smooth)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-visible)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          Account
        </Link>
      ) : (
        <Link
          href="/login"
          style={{
            textDecoration: "none",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#fff",
            padding: "6px 16px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #e84e3c, #c83020)",
            transition: "box-shadow var(--duration-slow) var(--ease-out-expo)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(232,78,60,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Sign In
        </Link>
      )}
    </nav>
  );
}
