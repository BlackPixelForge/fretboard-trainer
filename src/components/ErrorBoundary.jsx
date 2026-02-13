"use client";

import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1a2e",
            fontFamily: "var(--font-sans)",
          }}
        >
          <div
            style={{
              background: "#252540",
              borderRadius: "12px",
              padding: "2.5rem",
              textAlign: "center",
              maxWidth: "400px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            <h2
              style={{
                color: "#e8e8f0",
                fontSize: "1.25rem",
                fontWeight: 600,
                margin: "0 0 0.75rem",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: "#8888aa",
                fontSize: "0.875rem",
                margin: "0 0 1.5rem",
                fontFamily: "var(--font-mono)",
              }}
            >
              An unexpected error occurred.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "#e84e3c",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0.6rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
