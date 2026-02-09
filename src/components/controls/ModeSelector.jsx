import { MODES } from "../lib/fretboard";

const MODE_OPTIONS = [
  { key: MODES.EXPLORE, label: "Explore" },
  { key: MODES.QUIZ_FIND, label: "Find Note" },
  { key: MODES.QUIZ_IDENTIFY, label: "Name Note" },
];

export default function ModeSelector({ mode, onModeChange }) {
  return (
    <div style={{ display: "flex", gap: "2px", background: "#14141e", borderRadius: 8, padding: 2, border: "1px solid #1e1e2e" }}>
      {MODE_OPTIONS.map(m => (
        <button key={m.key} onClick={() => onModeChange(m.key)} style={{
          padding: "7px 14px",
          borderRadius: 6,
          border: "none",
          background: mode === m.key ? "linear-gradient(135deg, #e84e3c, #c83828)" : "transparent",
          color: mode === m.key ? "#fff" : "#666",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.75rem",
          fontWeight: mode === m.key ? 600 : 400,
          cursor: "pointer",
          transition: "all 0.2s",
          letterSpacing: "0.02em",
        }}>{m.label}</button>
      ))}
    </div>
  );
}
