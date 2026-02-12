import { useState } from "react";
import { MODES } from "./lib/fretboard";
import { getHarmonizedChords, getKeySignatureDisplay, KEY_DISPLAY_NAMES } from "./lib/harmonies";

const QUALITY_COLORS = {
  major: {
    bg: "rgba(232,78,60,0.15)",
    border: "rgba(232,78,60,0.4)",
    activeBg: "rgba(232,78,60,0.35)",
    activeBorder: "#e84e3c",
    glow: "rgba(232,78,60,0.5)",
    text: "#ffa09a",
  },
  minor: {
    bg: "rgba(60,160,220,0.15)",
    border: "rgba(60,160,220,0.4)",
    activeBg: "rgba(60,160,220,0.35)",
    activeBorder: "#3ca0dc",
    glow: "rgba(60,160,220,0.5)",
    text: "#8cd4f0",
  },
  diminished: {
    bg: "rgba(200,80,160,0.15)",
    border: "rgba(200,80,160,0.4)",
    activeBg: "rgba(200,80,160,0.35)",
    activeBorder: "#c850a0",
    glow: "rgba(200,80,160,0.5)",
    text: "#e0a0d0",
  },
};

function LearnSection({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: "1px solid #1a1a28", marginTop: 10 }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "none",
          border: "none",
          color: "#8a8fa6",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Outfit, sans-serif",
          fontSize: "0.8rem",
        }}
      >
        <span>Learn About Chord Harmonization</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: "0 14px 14px", animation: "slideDown 0.2s ease", color: "#c8ccd4", fontSize: "0.82rem", lineHeight: 1.6, fontFamily: "Outfit, sans-serif" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function HarmoniesPanel({ mode, triadState, harmoniesState, onToggleExpanded, onChordTap }) {
  const { expanded, keyRoot, activeDegree } = harmoniesState;
  const chords = getHarmonizedChords(keyRoot);
  const keyName = KEY_DISPLAY_NAMES[keyRoot];
  const keySig = getKeySignatureDisplay(keyRoot);
  const isTriads = mode === MODES.TRIADS;

  const [tooltip, setTooltip] = useState(null);

  const handleChordClick = (chord) => {
    if (isTriads) {
      onChordTap(chord);
    } else {
      setTooltip(chord.degree);
      setTimeout(() => setTooltip(null), 2000);
    }
  };

  // Collapsed: clickable bar with chord preview
  if (!expanded) {
    const preview = chords.slice(0, 7).map(c => c.chordName).join(" · ");
    return (
      <div style={{ marginTop: 12 }}>
        <button
          onClick={onToggleExpanded}
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "#0e0e16",
            border: "1px solid #1a1a28",
            borderRadius: 8,
            color: "#c8ccd4",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "Outfit, sans-serif",
            fontSize: "0.85rem",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#2a2a3a"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a28"}
        >
          <span style={{ color: "#8a8fa6", fontSize: "0.75rem" }}>▶</span>
          <span style={{ color: "#8a8fa6" }}>Scale Harmonies:</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem", letterSpacing: "0.02em" }}>{preview}</span>
        </button>
      </div>
    );
  }

  // Expanded view
  return (
    <div style={{
      marginTop: 12,
      background: "#0e0e16",
      border: "1px solid #1a1a28",
      borderRadius: 8,
      overflow: "hidden",
      animation: "slideDown 0.2s ease",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 14px",
        borderBottom: "1px solid #1a1a28",
      }}>
        <div>
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.9rem", color: "#e8e8f0", fontWeight: 600 }}>
            Key of {keyName} Major
          </span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#8a8fa6", marginLeft: 10 }}>
            {keySig}
          </span>
        </div>
        <button
          onClick={onToggleExpanded}
          style={{
            background: "none",
            border: "none",
            color: "#8a8fa6",
            cursor: "pointer",
            fontSize: "0.75rem",
            padding: "4px 8px",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          ▲ Collapse
        </button>
      </div>

      {/* Chord cells */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        padding: "12px 14px",
        justifyContent: "center",
      }}>
        {chords.map((chord) => {
          const colors = QUALITY_COLORS[chord.quality];
          const isActive = activeDegree === chord.degree;
          const showTooltip = !isTriads && tooltip === chord.degree;

          return (
            <div key={chord.degree} style={{ position: "relative" }}>
              <button
                onClick={() => handleChordClick(chord)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  padding: "8px 12px",
                  minWidth: 54,
                  background: isActive ? colors.activeBg : colors.bg,
                  border: `1.5px solid ${isActive ? colors.activeBorder : colors.border}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isActive ? `0 0 12px ${colors.glow}` : "none",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = colors.activeBorder;
                    e.currentTarget.style.background = colors.activeBg;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.background = colors.bg;
                  }
                }}
              >
                <span style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.7rem",
                  color: "#8a8fa6",
                }}>
                  {chord.degree === 8 ? "I" : chord.numeral}
                </span>
                <span style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: isActive ? colors.text : "#e0e0e8",
                }}>
                  {chord.chordName}
                </span>
              </button>

              {/* Tooltip for non-Triads modes */}
              {showTooltip && (
                <div style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  padding: "4px 10px",
                  background: "#2a2a3a",
                  border: "1px solid #3a3a4a",
                  borderRadius: 4,
                  fontSize: "0.72rem",
                  color: "#c8ccd4",
                  fontFamily: "Outfit, sans-serif",
                  animation: "slideDown 0.15s ease",
                  zIndex: 10,
                }}>
                  Switch to Triads to see this chord on the fretboard
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quality legend */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 16,
        padding: "4px 14px 10px",
        fontSize: "0.72rem",
        fontFamily: "Outfit, sans-serif",
        color: "#8a8fa6",
      }}>
        {[
          { label: "Major (I, IV, V)", quality: "major" },
          { label: "Minor (ii, iii, vi)", quality: "minor" },
          { label: "Dim (vii°)", quality: "diminished" },
        ].map(({ label, quality }) => (
          <div key={quality} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: QUALITY_COLORS[quality].activeBorder,
              display: "inline-block",
            }} />
            {label}
          </div>
        ))}
      </div>

      {/* Learn section */}
      <LearnSection>
        <p style={{ marginTop: 0 }}>
          Every major scale produces the same chord quality pattern when you harmonize it by stacking thirds:
        </p>
        <p style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.85rem",
          color: "#e8e8f0",
          textAlign: "center",
          padding: "8px 0",
        }}>
          Major · minor · minor · Major · Major · minor · dim
        </p>
        <p>
          This means if you know the notes of a major scale, you automatically know all 7 diatonic chords.
          For example, in <strong style={{ color: "#e8e8f0" }}>{keyName} Major</strong>, the scale notes
          are {chords.slice(0, 7).map(c => c.chordName.replace(/[m°]/g, "")).join(" · ")}, and applying the
          quality pattern gives you: {chords.slice(0, 7).map(c => c.chordName).join(", ")}.
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong style={{ color: "#8a8fa6" }}>Roman numerals:</strong> Uppercase (I, IV, V) = major chords.
          Lowercase (ii, iii, vi) = minor chords. The ° symbol = diminished.
        </p>
      </LearnSection>
    </div>
  );
}
