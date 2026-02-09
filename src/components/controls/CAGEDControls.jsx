import { CAGED_ORDER } from "../lib/caged";
import { CAGED_SHAPE_COLORS } from "../lib/colors";

export default function CAGEDControls({ cagedState, updateCAGED }) {
  const { selectedShape, showScaleTones } = cagedState;

  return (
    <>
      <span style={{ fontSize: "0.6rem", color: "#444", fontFamily: "'Outfit', sans-serif" }}>Shape:</span>

      <button
        onClick={() => updateCAGED({ selectedShape: "all" })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${selectedShape === "all" ? "#88888855" : "#1e1e2e"}`,
          background: selectedShape === "all" ? "rgba(180,180,180,0.12)" : "#0e0e16",
          color: selectedShape === "all" ? "#ccc" : "#555",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.68rem",
          fontWeight: selectedShape === "all" ? 600 : 400,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        All
      </button>

      {CAGED_ORDER.map((letter) => {
        const active = selectedShape === letter;
        const color = CAGED_SHAPE_COLORS[letter];
        return (
          <button
            key={letter}
            onClick={() => updateCAGED({ selectedShape: letter })}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: `1.5px solid ${active ? color.border : "#1e1e2e"}`,
              background: active ? color.bg : "#0e0e16",
              color: active ? color.text : "#555",
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
            {letter}
          </button>
        );
      })}

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <button
        onClick={() => updateCAGED({ showScaleTones: !showScaleTones })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${showScaleTones ? "#3ca0dc44" : "#1e1e2e"}`,
          background: showScaleTones ? "rgba(60,160,220,0.1)" : "#0e0e16",
          color: showScaleTones ? "#3ca0dc" : "#555",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Scale Tones
      </button>
    </>
  );
}
