import { CAGED_ORDER } from "../lib/caged";
import { CAGED_SHAPE_COLORS } from "../lib/colors";

const CAGED_POSITIONS = { C: "5(4)", A: "5(1)", G: "6(4)", E: "6(1)", D: "4(1)" };

const EMBEDDED_CAGED_ALLOWED = new Set(["C", "A"]);

export default function CAGEDControls({ cagedState, updateCAGED, renderSection, embedded }) {
  const { selectedShape, showScaleTones } = cagedState;

  const shapeButtons = (
    <>
      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Shape:</span>

      {!embedded && (
      <button
        onClick={() => updateCAGED({ selectedShape: "all" })}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${selectedShape === "all" ? "rgba(136,136,136,0.35)" : "var(--border-muted)"}`,
          background: selectedShape === "all" ? "rgba(180,180,180,0.18)" : "var(--surface-base)",
          color: selectedShape === "all" ? "#ddd" : "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: selectedShape === "all" ? 600 : 400,
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: selectedShape === "all"
            ? "0 0 12px rgba(180,180,180,0.06), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        All
      </button>
      )}

      {CAGED_ORDER.map((letter) => {
        const active = selectedShape === letter;
        const color = CAGED_SHAPE_COLORS[letter];
        const locked = embedded && !EMBEDDED_CAGED_ALLOWED.has(letter);
        return (
          <div key={letter} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button
              onClick={() => !locked && updateCAGED({ selectedShape: letter })}
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius-sm)",
                border: `1.5px solid ${active ? color.border : "var(--border-muted)"}`,
                background: active ? color.bg : "var(--surface-base)",
                color: active ? color.text : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 700,
                cursor: locked ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                transition: `all var(--duration-normal) var(--ease-smooth)`,
                opacity: locked ? 0.35 : 1,
                boxShadow: active
                  ? `0 0 12px ${color.bg}, inset 0 1px 0 rgba(255,255,255,0.04)`
                  : "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            >
              {letter}
            </button>
            <span style={{
              fontSize: "0.5rem",
              color: active ? color.text : "var(--text-dim)",
              fontFamily: "var(--font-mono)",
              lineHeight: 1,
              transition: `all var(--duration-normal) var(--ease-smooth)`,
              opacity: locked ? 0.35 : 1,
            }}>
              {CAGED_POSITIONS[letter]}
            </span>
          </div>
        );
      })}
    </>
  );

  const scaleToneToggle = (
    <button
      onClick={() => updateCAGED({ showScaleTones: !showScaleTones })}
      style={{
        padding: "5px 10px",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${showScaleTones ? "rgba(60,160,220,0.35)" : "var(--border-muted)"}`,
        background: showScaleTones ? "var(--accent-blue-glow)" : "var(--surface-base)",
        color: showScaleTones ? "var(--accent-blue-text)" : "var(--text-muted)",
        fontFamily: "var(--font-sans)",
        fontSize: "0.68rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: `all var(--duration-normal) var(--ease-smooth)`,
        boxShadow: showScaleTones
          ? "0 0 12px rgba(60,160,220,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      Scale Tones
    </button>
  );

  if (renderSection === "primary") return shapeButtons;
  if (renderSection === "secondary") return scaleToneToggle;

  return (
    <>
      {shapeButtons}
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
      {scaleToneToggle}
    </>
  );
}
