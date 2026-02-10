import { MODES } from "../lib/fretboard";

const LEARN_MODES = [
  { key: MODES.EXPLORE, label: "Explore" },
  { key: MODES.SCALE_POSITIONS, label: "Positions" },
  { key: MODES.CAGED, label: "CAGED" },
  { key: MODES.INTERVALS, label: "Intervals" },
];

const QUIZ_MODES = [
  { key: MODES.QUIZ_FIND, label: "Find Note" },
  { key: MODES.QUIZ_IDENTIFY, label: "Name Note" },
];

function ModeGroup({ label, modes, currentMode, onModeChange, activeGradient }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{
        fontSize: "0.6rem",
        color: "#777",
        fontFamily: "'Outfit', sans-serif",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontWeight: 500,
        minWidth: 30,
      }}>{label}</span>
      <div style={{ display: "flex", gap: "2px", background: "#14141e", borderRadius: 8, padding: 2, border: "1px solid #1e1e2e" }}>
        {modes.map(m => (
          <button key={m.key} onClick={() => onModeChange(m.key)} style={{
            padding: "7px 14px",
            borderRadius: 6,
            border: "none",
            background: currentMode === m.key ? activeGradient : "transparent",
            color: currentMode === m.key ? "#fff" : "#888",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.75rem",
            fontWeight: currentMode === m.key ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}>{m.label}</button>
        ))}
      </div>
    </div>
  );
}

export default function ModeSelector({ mode, onModeChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
      <ModeGroup
        label="Learn"
        modes={LEARN_MODES}
        currentMode={mode}
        onModeChange={onModeChange}
        activeGradient="linear-gradient(135deg, #e84e3c, #c83828)"
      />
      <ModeGroup
        label="Quiz"
        modes={QUIZ_MODES}
        currentMode={mode}
        onModeChange={onModeChange}
        activeGradient="linear-gradient(135deg, #ffc832, #e6a03c)"
      />
    </div>
  );
}
