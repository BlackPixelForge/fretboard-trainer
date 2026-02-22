import { NOTES } from "../lib/music";
import { INVERSIONS, INVERSION_LABELS, TRIAD_SHAPES, getTriadLabel } from "../lib/triads";

export default function TriadControls({ triadState, updateTriad, onRootChange, renderSection, embedded }) {
  const { rootNote, inversionIndex, shapeIndex, showFingering, showNoteNames, autoPlay, autoPlaySpeed } = triadState;
  const inversionKey = INVERSIONS[inversionIndex];
  const total = TRIAD_SHAPES[inversionKey].length;
  const shapeLabel = getTriadLabel(inversionKey, shapeIndex);

  const primaryControls = (
    <>
      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Root:</span>

      <select
        value={rootNote}
        onChange={(e) => !embedded && (onRootChange || ((v) => updateTriad({ rootNote: v })))(Number(e.target.value))}
        disabled={embedded}
        style={{
          padding: "6px 10px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-muted)",
          background: "var(--surface-base)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          cursor: embedded ? "not-allowed" : "pointer",
          opacity: embedded ? 0.5 : 1,
        }}
      >
        {NOTES.map((note, i) => (
          <option key={i} value={i}>{note}</option>
        ))}
      </select>

      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />

      <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
        {INVERSIONS.map((inv, i) => {
          const active = inversionIndex === i;
          const locked = embedded && i !== 0;
          return (
            <button
              key={inv}
              onClick={() => !locked && updateTriad({ inversionIndex: i, shapeIndex: 0 })}
              style={{
                padding: "5px 10px",
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${active ? "rgba(232,78,60,0.35)" : "var(--border-muted)"}`,
                background: active ? "var(--accent-red-glow)" : "var(--surface-base)",
                color: active ? "var(--accent-red-text)" : "var(--text-muted)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.62rem",
                fontWeight: active ? 600 : 400,
                cursor: locked ? "not-allowed" : "pointer",
                transition: `all var(--duration-normal) var(--ease-smooth)`,
                whiteSpace: "nowrap",
                opacity: locked ? 0.35 : 1,
                boxShadow: active
                  ? "0 0 12px rgba(232,78,60,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                  : "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            >
              {INVERSION_LABELS[inv]}
            </button>
          );
        })}
      </span>

      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />

      <button
        onClick={() => updateTriad({ shapeIndex: (shapeIndex + total - 1) % total })}
        title="Previous shape (← arrow key)"
        aria-label="Previous triad shape"
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

      <span style={{
        fontSize: "0.62rem",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-mono)",
        padding: "4px 8px",
        background: "rgba(232,78,60,0.08)",
        border: "1px solid rgba(232,78,60,0.15)",
        borderRadius: "var(--radius-sm)",
        whiteSpace: "nowrap",
      }}>
        {shapeIndex + 1}/{total} {shapeLabel}
      </span>

      <button
        onClick={() => updateTriad({ shapeIndex: (shapeIndex + 1) % total })}
        title="Next shape (→ arrow key)"
        aria-label="Next triad shape"
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

  const secondaryControls = (
    <>
      <button
        onClick={() => updateTriad({ showNoteNames: !showNoteNames, showFingering: false })}
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
        onClick={() => updateTriad({ showFingering: !showFingering, showNoteNames: false })}
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

      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />

      <button
        onClick={() => updateTriad({ autoPlay: !autoPlay })}
        title={autoPlay ? "Pause auto-cycle" : "Play auto-cycle"}
        aria-label={autoPlay ? "Pause auto-cycle" : "Play auto-cycle"}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${autoPlay ? "rgba(74,222,128,0.35)" : "var(--border-muted)"}`,
          background: autoPlay ? "rgba(74,222,128,0.18)" : "var(--surface-base)",
          color: autoPlay ? "#4ade80" : "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: autoPlay
            ? "0 0 12px rgba(74,222,128,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        {autoPlay ? "\u23F8" : "\u25B6"}
      </button>

      <input
        type="range"
        min={500}
        max={5000}
        step={100}
        value={autoPlaySpeed}
        onChange={(e) => updateTriad({ autoPlaySpeed: Number(e.target.value) })}
        title={`Speed: ${(autoPlaySpeed / 1000).toFixed(1)}s`}
        aria-label="Auto-cycle speed"
        style={{
          width: 80,
          accentColor: "#4ade80",
          cursor: "pointer",
        }}
      />
      <span style={{
        fontSize: "0.6rem",
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)",
        minWidth: 28,
      }}>
        {(autoPlaySpeed / 1000).toFixed(1)}s
      </span>
    </>
  );

  if (renderSection === "primary") return primaryControls;
  if (renderSection === "secondary") return secondaryControls;

  return (
    <>
      {primaryControls}
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
      {secondaryControls}
    </>
  );
}
