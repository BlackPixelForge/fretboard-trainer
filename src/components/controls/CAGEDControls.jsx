import { CAGED_ORDER } from "../lib/caged";
import { CAGED_SHAPE_COLORS } from "../lib/colors";

const CAGED_POSITIONS = { C: "5(4)", A: "5(1)", G: "6(4)", E: "6(1)", D: "4(1)" };

export default function CAGEDControls({ cagedState, updateCAGED, renderSection }) {
  const { selectedShape, showScaleTones } = cagedState;

  const shapeButtons = (
    <>
      <span style={{ fontSize: "0.6rem", color: "#777", fontFamily: "'Outfit', sans-serif" }}>Shape:</span>

      <button
        onClick={() => updateCAGED({ selectedShape: "all" })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${selectedShape === "all" ? "#88888877" : "#1e1e2e"}`,
          background: selectedShape === "all" ? "rgba(180,180,180,0.18)" : "#0e0e16",
          color: selectedShape === "all" ? "#ddd" : "#777",
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
          <div key={letter} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button
              onClick={() => updateCAGED({ selectedShape: letter })}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: `1.5px solid ${active ? color.border : "#1e1e2e"}`,
                background: active ? color.bg : "#0e0e16",
                color: active ? color.text : "#777",
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
            <span style={{
              fontSize: "0.5rem",
              color: active ? color.text : "#555",
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 1,
              transition: "all 0.2s",
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
        borderRadius: 6,
        border: `1px solid ${showScaleTones ? "#3ca0dc66" : "#1e1e2e"}`,
        background: showScaleTones ? "rgba(60,160,220,0.18)" : "#0e0e16",
        color: showScaleTones ? "#78c8f0" : "#777",
        fontFamily: "'Outfit', sans-serif",
        fontSize: "0.68rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
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
      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
      {scaleToneToggle}
    </>
  );
}
