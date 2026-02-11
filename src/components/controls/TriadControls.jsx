import { NOTES } from "../lib/music";
import { INVERSIONS, INVERSION_LABELS, TRIAD_SHAPES, getTriadLabel } from "../lib/triads";

export default function TriadControls({ triadState, updateTriad }) {
  const { rootNote, inversionIndex, shapeIndex, showFingering, showNoteNames } = triadState;
  const inversionKey = INVERSIONS[inversionIndex];
  const total = TRIAD_SHAPES[inversionKey].length;
  const shapeLabel = getTriadLabel(inversionKey, shapeIndex);

  return (
    <>
      <span style={{ fontSize: "0.6rem", color: "#777", fontFamily: "'Outfit', sans-serif" }}>Root:</span>

      <select
        value={rootNote}
        onChange={(e) => updateTriad({ rootNote: Number(e.target.value) })}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid #1e1e2e",
          background: "#0e0e16",
          color: "#c8ccd4",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.75rem",
          cursor: "pointer",
        }}
      >
        {NOTES.map((note, i) => (
          <option key={i} value={i}>{note}</option>
        ))}
      </select>

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
        {INVERSIONS.map((inv, i) => {
          const active = inversionIndex === i;
          return (
            <button
              key={inv}
              onClick={() => updateTriad({ inversionIndex: i, shapeIndex: 0 })}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                border: `1px solid ${active ? "#e84e3c66" : "#1e1e2e"}`,
                background: active ? "rgba(232,78,60,0.22)" : "#0e0e16",
                color: active ? "#ffa09a" : "#777",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.62rem",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {INVERSION_LABELS[inv]}
            </button>
          );
        })}
      </span>

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <button
        onClick={() => updateTriad({ shapeIndex: (shapeIndex + total - 1) % total })}
        title="Previous shape (\u2190 arrow key)"
        style={{
          padding: "5px 8px",
          borderRadius: 6,
          border: "1px solid #1e1e2e",
          background: "#0e0e16",
          color: "#888",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.75rem",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {"<"}
      </button>

      <span style={{
        fontSize: "0.62rem",
        color: "#999",
        fontFamily: "'JetBrains Mono', monospace",
        padding: "4px 8px",
        background: "rgba(232,78,60,0.08)",
        border: "1px solid rgba(232,78,60,0.15)",
        borderRadius: 6,
        whiteSpace: "nowrap",
      }}>
        {shapeIndex + 1}/{total} {shapeLabel}
      </span>

      <button
        onClick={() => updateTriad({ shapeIndex: (shapeIndex + 1) % total })}
        title="Next shape (\u2192 arrow key)"
        style={{
          padding: "5px 8px",
          borderRadius: 6,
          border: "1px solid #1e1e2e",
          background: "#0e0e16",
          color: "#888",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.75rem",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {">"}
      </button>

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <button
        onClick={() => updateTriad({ showNoteNames: !showNoteNames, showFingering: false })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${showNoteNames ? "#3ca0dc66" : "#1e1e2e"}`,
          background: showNoteNames ? "rgba(60,160,220,0.18)" : "#0e0e16",
          color: showNoteNames ? "#78c8f0" : "#777",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Notes
      </button>
      <button
        onClick={() => updateTriad({ showFingering: !showFingering, showNoteNames: false })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${showFingering ? "#3ca0dc66" : "#1e1e2e"}`,
          background: showFingering ? "rgba(60,160,220,0.18)" : "#0e0e16",
          color: showFingering ? "#78c8f0" : "#777",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Fingering
      </button>
    </>
  );
}
