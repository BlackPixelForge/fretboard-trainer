import { FORMS, getPositionLabel } from "../lib/scales";

export default function ScalePositionControls({ scalePositionState, updateScalePosition, renderSection }) {
  const { positionIndex, showFingering, showNoteNames } = scalePositionState;
  const total = FORMS.length;

  const positionButtons = (
    <>
      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Position:</span>

      <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
        {FORMS.map((form, i) => {
          const active = positionIndex === i;
          return (
            <button
              key={i}
              onClick={() => updateScalePosition({ positionIndex: i })}
              title={`Position ${form.name}`}
              style={{
                minWidth: 34,
                height: 28,
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${active ? "rgba(232,78,60,0.35)" : "var(--border-muted)"}`,
                background: active ? "var(--accent-red-glow)" : "var(--surface-base)",
                color: active ? "var(--accent-red-text)" : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                transition: `all var(--duration-normal) var(--ease-smooth)`,
                boxShadow: active
                  ? "0 0 12px rgba(232,78,60,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                  : "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            >
              {form.name}
            </button>
          );
        })}
      </span>

      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />

      <button
        onClick={() => {
          const prev = positionIndex > 0 ? positionIndex - 1 : total - 1;
          updateScalePosition({ positionIndex: prev });
        }}
        aria-label="Previous scale position"
        style={{
          padding: "5px 8px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-muted)",
          background: "var(--surface-base)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        {"<"}
      </button>
      <button
        onClick={() => {
          const next = positionIndex < total - 1 ? positionIndex + 1 : 0;
          updateScalePosition({ positionIndex: next });
        }}
        aria-label="Next scale position"
        style={{
          padding: "5px 8px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-muted)",
          background: "var(--surface-base)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        {">"}
      </button>
    </>
  );

  const toggleButtons = (
    <>
      <button
        onClick={() => updateScalePosition({ showNoteNames: !showNoteNames, showFingering: false })}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${showNoteNames ? "rgba(60,160,220,0.35)" : "var(--border-muted)"}`,
          background: showNoteNames ? "var(--accent-blue-glow)" : "var(--surface-base)",
          color: showNoteNames ? "var(--accent-blue-text)" : "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: showNoteNames
            ? "0 0 12px rgba(60,160,220,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        Notes
      </button>
      <button
        onClick={() => updateScalePosition({ showFingering: !showFingering, showNoteNames: false })}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${showFingering ? "rgba(60,160,220,0.35)" : "var(--border-muted)"}`,
          background: showFingering ? "var(--accent-blue-glow)" : "var(--surface-base)",
          color: showFingering ? "var(--accent-blue-text)" : "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: showFingering
            ? "0 0 12px rgba(60,160,220,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        Fingering
      </button>
    </>
  );

  if (renderSection === "primary") return positionButtons;
  if (renderSection === "secondary") return toggleButtons;

  return (
    <>
      {positionButtons}
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
      {toggleButtons}
    </>
  );
}
