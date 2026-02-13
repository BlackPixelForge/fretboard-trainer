import { MODES } from "../lib/fretboard";

const LEARN_MODES = [
  { key: MODES.EXPLORE, label: "Explore" },
  { key: MODES.SCALE_POSITIONS, label: "Positions" },
  { key: MODES.CAGED, label: "CAGED" },
  { key: MODES.INTERVALS, label: "Intervals" },
  { key: MODES.ONE_FRET_RULE, label: "1-Fret Rule" },
  { key: MODES.TRIADS, label: "Triads" },
];

const QUIZ_MODES = [
  { key: MODES.QUIZ_FIND, label: "Name Note" },
  { key: MODES.QUIZ_IDENTIFY, label: "Find Note" },
];

const LEARN_GRADIENT = "linear-gradient(135deg, #e84e3c, #c83828)";
const QUIZ_GRADIENT = "linear-gradient(135deg, #ffc832, #e6a03c)";

function isLearnMode(key) {
  return LEARN_MODES.some(m => m.key === key);
}

export default function ModeSelector({ mode, onModeChange }) {
  return (
    <div
      className="mode-selector-scroll"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        background: "#14141e",
        borderRadius: 8,
        padding: 2,
        border: "1px solid #1e1e2e",
      }}
    >
      {LEARN_MODES.map(m => (
        <button key={m.key} onClick={() => onModeChange(m.key)} style={{
          padding: "7px 14px",
          borderRadius: 6,
          border: "none",
          background: mode === m.key ? LEARN_GRADIENT : "transparent",
          color: mode === m.key ? "#fff" : "#888",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          fontWeight: mode === m.key ? 600 : 400,
          cursor: "pointer",
          transition: "all 0.2s",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>{m.label}</button>
      ))}

      {/* Divider between Learn and Quiz */}
      <span style={{
        width: 1,
        height: 20,
        background: "#2a2a3a",
        margin: "0 4px",
        flexShrink: 0,
      }} />

      {QUIZ_MODES.map(m => (
        <button key={m.key} onClick={() => onModeChange(m.key)} style={{
          padding: "7px 14px",
          borderRadius: 6,
          border: "none",
          background: mode === m.key ? QUIZ_GRADIENT : "transparent",
          color: mode === m.key ? "#fff" : "#888",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          fontWeight: mode === m.key ? 600 : 400,
          cursor: "pointer",
          transition: "all 0.2s",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>{m.label}</button>
      ))}
    </div>
  );
}
