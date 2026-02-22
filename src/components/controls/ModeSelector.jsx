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

export default function ModeSelector({ mode, onModeChange, embedded }) {
  const renderTab = (m, gradient) => {
    const active = mode === m.key;
    return (
      <button key={m.key} onClick={() => onModeChange(m.key)} style={{
        padding: "7px 14px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        background: active ? gradient : "transparent",
        color: active ? "#fff" : "var(--text-muted)",
        fontFamily: "var(--font-sans)",
        fontSize: "0.75rem",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: `all var(--duration-normal) var(--ease-out-expo)`,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        flexShrink: 0,
        boxShadow: active
          ? "0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "none",
        textShadow: active ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
      }}>{m.label}</button>
    );
  };

  return (
    <div
      className="mode-selector-scroll"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        background: "linear-gradient(180deg, #16161f, #12121b)",
        borderRadius: "var(--radius-md)",
        padding: 3,
        border: "1px solid var(--border-muted)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
      }}
    >
      {LEARN_MODES.map(m => renderTab(m, LEARN_GRADIENT))}

      {/* Divider between Learn and Quiz — hidden when embedded */}
      {!embedded && (
        <span style={{
          width: 1,
          height: 20,
          background: "linear-gradient(180deg, transparent, var(--border-visible), transparent)",
          margin: "0 6px",
          flexShrink: 0,
        }} />
      )}

      {!embedded && QUIZ_MODES.map(m => renderTab(m, QUIZ_GRADIENT))}
    </div>
  );
}
