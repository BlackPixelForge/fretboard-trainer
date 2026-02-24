import { FORMS, getPositionLabel } from "../lib/scales";

export default function ScalePositionControls({ scalePositionState, updateScalePosition, embedded }) {
  const { positionIndex, showFingering, showNoteNames, diagonalPentatonic, diagonalSet } = scalePositionState;
  const total = FORMS.length;
  const diagonalActive = diagonalPentatonic;

  const positionButtons = (
    <>
      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Position:</span>

      <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
        {FORMS.map((form, i) => {
          const active = !diagonalActive && positionIndex === i;
          const locked = (embedded && i !== 0) || diagonalActive;
          return (
            <button
              key={i}
              onClick={() => !locked && updateScalePosition({ positionIndex: i })}
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
                cursor: locked ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                transition: `all var(--duration-normal) var(--ease-smooth)`,
                opacity: locked ? 0.35 : 1,
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

      {!embedded && (
      <>
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />

      <button
        onClick={() => {
          if (diagonalActive) return;
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
          cursor: diagonalActive ? "not-allowed" : "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
          opacity: diagonalActive ? 0.35 : 1,
        }}
      >
        {"<"}
      </button>
      <button
        onClick={() => {
          if (diagonalActive) return;
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
          cursor: diagonalActive ? "not-allowed" : "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
          opacity: diagonalActive ? 0.35 : 1,
        }}
      >
        {">"}
      </button>
      </>
      )}
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
        onClick={() => !diagonalActive && updateScalePosition({ showFingering: !showFingering, showNoteNames: false })}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${!diagonalActive && showFingering ? "rgba(60,160,220,0.35)" : "var(--border-muted)"}`,
          background: !diagonalActive && showFingering ? "var(--accent-blue-glow)" : "var(--surface-base)",
          color: !diagonalActive && showFingering ? "var(--accent-blue-text)" : "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: diagonalActive ? "not-allowed" : "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          opacity: diagonalActive ? 0.35 : 1,
          boxShadow: !diagonalActive && showFingering
            ? "0 0 12px rgba(60,160,220,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        Fingering
      </button>
    </>
  );

  const diagonalControls = !embedded && (
    <>
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
      <button
        onClick={() => updateScalePosition({ diagonalPentatonic: !diagonalPentatonic, diagonalSet: 0 })}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${diagonalActive ? "rgba(160,100,240,0.4)" : "var(--border-muted)"}`,
          background: diagonalActive ? "rgba(160,100,240,0.12)" : "var(--surface-base)",
          color: diagonalActive ? "#C8A0F8" : "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: diagonalActive
            ? "0 0 12px rgba(160,100,240,0.1), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        Diagonal Pentatonics
      </button>
      {diagonalActive && (
        <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
          {[0, 1].map((setIdx) => {
            const active = diagonalSet === setIdx;
            return (
              <button
                key={setIdx}
                onClick={() => updateScalePosition({ diagonalSet: setIdx })}
                style={{
                  padding: "4px 8px",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${active ? "rgba(160,100,240,0.4)" : "var(--border-muted)"}`,
                  background: active ? "rgba(160,100,240,0.12)" : "var(--surface-base)",
                  color: active ? "#C8A0F8" : "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: `all var(--duration-normal) var(--ease-smooth)`,
                  boxShadow: active
                    ? "0 0 8px rgba(160,100,240,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                    : "inset 0 1px 0 rgba(255,255,255,0.02)",
                }}
              >
                Set {setIdx + 1}
              </button>
            );
          })}
        </span>
      )}
    </>
  );

  return (
    <>
      {positionButtons}
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
      {toggleButtons}
      {diagonalControls}
    </>
  );
}
