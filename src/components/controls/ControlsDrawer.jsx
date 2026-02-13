"use client";
import { useState } from "react";

export default function ControlsDrawer({ alwaysVisible, drawerContent }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Always-visible controls */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        alignItems: "center",
      }}>
        {alwaysVisible}
      </div>

      {/* Toggle button — mobile only */}
      <button
        className="controls-drawer-toggle"
        onClick={() => setOpen(o => !o)}
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          width: "100%",
          marginTop: 8,
          padding: "6px 0",
          background: "rgba(60,160,220,0.06)",
          border: "1px solid rgba(60,160,220,0.15)",
          borderRadius: 6,
          color: "#78c8f0",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {open ? "Hide controls" : "More controls"}{" "}
        <span style={{
          display: "inline-block",
          transition: "transform 0.25s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          fontSize: "0.6rem",
        }}>▼</span>
      </button>

      {/* Drawer content — animates open/closed on mobile, always open on sm+ */}
      <div className={`controls-drawer-content${open ? " controls-drawer-open" : ""}`}>
        <div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
            paddingTop: 8,
          }}>
            {drawerContent}
          </div>
        </div>
      </div>
    </div>
  );
}
