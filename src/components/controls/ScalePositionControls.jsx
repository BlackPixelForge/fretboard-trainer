import { FORMS, getPositionLabel } from "../lib/scales";

export default function ScalePositionControls({ scalePositionState, updateScalePosition }) {
  const { positionIndex, showFingering, showNoteNames } = scalePositionState;
  const total = FORMS.length;

  return (
    <>
      <span style={{ fontSize: "0.6rem", color: "#777", fontFamily: "'Outfit', sans-serif" }}>Position:</span>

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
                borderRadius: 6,
                border: `1px solid ${active ? "#e84e3c66" : "#1e1e2e"}`,
                background: active ? "rgba(232,78,60,0.22)" : "#0e0e16",
                color: active ? "#ffa09a" : "#777",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                transition: "all 0.2s",
              }}
            >
              {form.name}
            </button>
          );
        })}
      </span>

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <button
        onClick={() => {
          const prev = positionIndex > 0 ? positionIndex - 1 : total - 1;
          updateScalePosition({ positionIndex: prev });
        }}
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
      <button
        onClick={() => {
          const next = positionIndex < total - 1 ? positionIndex + 1 : 0;
          updateScalePosition({ positionIndex: next });
        }}
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
        onClick={() => updateScalePosition({ showNoteNames: !showNoteNames, showFingering: false })}
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
        onClick={() => updateScalePosition({ showFingering: !showFingering, showNoteNames: false })}
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
