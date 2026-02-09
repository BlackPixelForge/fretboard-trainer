import { POSITION_CAGED_MAP } from "../lib/scales";

export default function ScalePositionControls({ scalePositionState, updateScalePosition }) {
  const { positionIndex, showFingering } = scalePositionState;

  return (
    <>
      <span style={{ fontSize: "0.6rem", color: "#444", fontFamily: "'Outfit', sans-serif" }}>Position:</span>

      {[0, 1, 2, 3, 4].map((i) => {
        const active = positionIndex === i;
        return (
          <button
            key={i}
            onClick={() => updateScalePosition({ positionIndex: i })}
            title={`Position ${i + 1} (${POSITION_CAGED_MAP[i]} shape)`}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: `1px solid ${active ? "#e84e3c55" : "#1e1e2e"}`,
              background: active ? "rgba(232,78,60,0.15)" : "#0e0e16",
              color: active ? "#e84e3c" : "#555",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "all 0.2s",
            }}
          >
            {i + 1}
          </button>
        );
      })}

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <button
        onClick={() => {
          const prev = positionIndex > 0 ? positionIndex - 1 : 4;
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
          const next = positionIndex < 4 ? positionIndex + 1 : 0;
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

      <span style={{
        fontSize: "0.6rem",
        color: "#555",
        fontFamily: "'Outfit', sans-serif",
        marginLeft: 4,
      }}>
        ({POSITION_CAGED_MAP[positionIndex]} shape)
      </span>
    </>
  );
}
