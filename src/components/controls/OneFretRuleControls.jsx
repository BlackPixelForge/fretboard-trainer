import { FORMS } from "../lib/scales";

export default function OneFretRuleControls({ oneFretRuleState, updateOneFretRule, oneFretRuleInfo }) {
  const { positionFret, selectedFormIndex, showFingering, showNoteNames } = oneFretRuleState;

  return (
    <>
      <span style={{ fontSize: "0.6rem", color: "#777", fontFamily: "'Outfit', sans-serif" }}>Fret:</span>

      <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(fret => {
          const active = positionFret === fret;
          return (
            <button
              key={fret}
              onClick={() => updateOneFretRule({ positionFret: fret })}
              style={{
                minWidth: 28,
                height: 26,
                borderRadius: 6,
                border: `1px solid ${active ? "#d4a01766" : "#1e1e2e"}`,
                background: active ? "rgba(212,160,23,0.22)" : "#0e0e16",
                color: active ? "#f0d060" : "#777",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 2px",
                transition: "all 0.2s",
              }}
            >
              {fret}
            </button>
          );
        })}
      </span>

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <span style={{ fontSize: "0.6rem", color: "#777", fontFamily: "'Outfit', sans-serif" }}>Form / Key:</span>

      <span style={{ display: "inline-flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
        {oneFretRuleInfo.map((info, i) => {
          const active = selectedFormIndex === i;
          return (
            <button
              key={i}
              onClick={() => updateOneFretRule({ selectedFormIndex: i })}
              title={`${info.formName} — ${info.rootNoteName} Major`}
              style={{
                minWidth: 60,
                height: 28,
                borderRadius: 6,
                border: `1px solid ${active ? "#e84e3c66" : "#1e1e2e"}`,
                background: active ? "rgba(232,78,60,0.22)" : "#0e0e16",
                color: active ? "#ffa09a" : "#777",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 6px",
                gap: 4,
                transition: "all 0.2s",
              }}
            >
              <span>{info.formName}</span>
              <span style={{ color: active ? "#f0d060" : "#666", fontWeight: 600 }}>{info.rootNoteName}</span>
            </button>
          );
        })}
      </span>

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <button
        onClick={() => updateOneFretRule({ showNoteNames: !showNoteNames, showFingering: false })}
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
        onClick={() => updateOneFretRule({ showFingering: !showFingering, showNoteNames: false })}
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
