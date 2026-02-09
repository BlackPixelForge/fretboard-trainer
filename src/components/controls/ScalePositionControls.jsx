import { POSITIONS, getPositionLabel } from "../lib/scales";

export default function ScalePositionControls({ scalePositionState, updateScalePosition }) {
  const { positionIndex, showFingering } = scalePositionState;
  const total = POSITIONS.length;

  // Group positions by root string: [6(1),6(2),6(4)] [5(1),5(2),5(4)] [4(1),4(2),4(4)]
  const groups = [
    { label: "6", indices: [0, 1, 2] },
    { label: "5", indices: [3, 4, 5] },
    { label: "4", indices: [6, 7, 8] },
  ];

  return (
    <>
      <span style={{ fontSize: "0.6rem", color: "#444", fontFamily: "'Outfit', sans-serif" }}>Position:</span>

      {groups.map((group, gi) => (
        <span key={group.label} style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
          {gi > 0 && <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 2px" }} />}
          {group.indices.map((i) => {
            const active = positionIndex === i;
            const label = getPositionLabel(i);
            return (
              <button
                key={i}
                onClick={() => updateScalePosition({ positionIndex: i })}
                title={`Position ${label}`}
                style={{
                  minWidth: 34,
                  height: 28,
                  borderRadius: 6,
                  border: `1px solid ${active ? "#e84e3c55" : "#1e1e2e"}`,
                  background: active ? "rgba(232,78,60,0.15)" : "#0e0e16",
                  color: active ? "#e84e3c" : "#555",
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
                {label}
              </button>
            );
          })}
        </span>
      ))}

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
          color: "#666",
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
          color: "#666",
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
        onClick={() => updateScalePosition({ showFingering: !showFingering })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${showFingering ? "#3ca0dc44" : "#1e1e2e"}`,
          background: showFingering ? "rgba(60,160,220,0.1)" : "#0e0e16",
          color: showFingering ? "#3ca0dc" : "#555",
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
