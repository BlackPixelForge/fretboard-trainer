import { FORMS } from "../lib/scales";

export default function OneFretRuleControls({ oneFretRuleState, updateOneFretRule, oneFretRuleInfo, renderSection }) {
  const { positionFret, selectedFormIndex, showFingering, showNoteNames, showChordTones } = oneFretRuleState;
  const total = FORMS.length;
  const currentInfo = oneFretRuleInfo[selectedFormIndex];

  const fretSelector = (
    <>
      <span style={{ fontSize: "0.6rem", color: "#777", fontFamily: "var(--font-sans)" }}>Fret:</span>

      {/* Mobile: select dropdown */}
      <select
        className="sm:hidden"
        value={positionFret}
        onChange={(e) => updateOneFretRule({ positionFret: Number(e.target.value) })}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid #d4a01766",
          background: "rgba(212,160,23,0.12)",
          color: "#f0d060",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map(fret => (
          <option key={fret} value={fret}>{fret}</option>
        ))}
      </select>

      {/* Desktop: individual buttons */}
      <span className="hidden sm:inline-flex" style={{ gap: 2, alignItems: "center" }}>
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
                fontFamily: "var(--font-mono)",
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
    </>
  );

  const formCards = (
    <>
      <span style={{ fontSize: "0.6rem", color: "#777", fontFamily: "var(--font-sans)" }}>Form / Key:</span>

      <span style={{ display: "inline-flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
        {oneFretRuleInfo.map((info, i) => {
          const active = selectedFormIndex === i;
          return (
            <button
              key={i}
              onClick={() => updateOneFretRule({ selectedFormIndex: i })}
              title={`${info.formName} — ${info.rootNoteName} Major — root on string ${info.rootGuitarString}, fret ${info.rootFret}`}
              style={{
                minWidth: 60,
                height: 28,
                borderRadius: 6,
                border: `1px solid ${active ? "#e84e3c66" : "#1e1e2e"}`,
                background: active ? "rgba(232,78,60,0.22)" : "#0e0e16",
                color: active ? "#ffa09a" : "#777",
                fontFamily: "var(--font-mono)",
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

      {/* Prev/Next step buttons */}
      <button
        onClick={() => {
          const prev = selectedFormIndex > 0 ? selectedFormIndex - 1 : total - 1;
          updateOneFretRule({ selectedFormIndex: prev });
        }}
        title="Previous form (← arrow key)"
        style={{
          padding: "5px 8px",
          borderRadius: 6,
          border: "1px solid #1e1e2e",
          background: "#0e0e16",
          color: "#888",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {"<"}
      </button>
      <button
        onClick={() => {
          const next = selectedFormIndex < total - 1 ? selectedFormIndex + 1 : 0;
          updateOneFretRule({ selectedFormIndex: next });
        }}
        title="Next form (→ arrow key)"
        style={{
          padding: "5px 8px",
          borderRadius: 6,
          border: "1px solid #1e1e2e",
          background: "#0e0e16",
          color: "#888",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {">"}
      </button>

      {/* Root fret info */}
      <span style={{
        fontSize: "0.6rem",
        color: "#999",
        fontFamily: "var(--font-sans)",
        padding: "4px 8px",
        background: "rgba(232,78,60,0.08)",
        border: "1px solid rgba(232,78,60,0.15)",
        borderRadius: 6,
      }}>
        Root: str {currentInfo.rootGuitarString}, fret {currentInfo.rootFret}
      </span>

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <button
        onClick={() => updateOneFretRule({ showChordTones: !showChordTones })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${showChordTones ? "#f0c83266" : "#1e1e2e"}`,
          background: showChordTones ? "rgba(240,200,50,0.18)" : "#0e0e16",
          color: showChordTones ? "#f0d060" : "#777",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Chord
      </button>
      <button
        onClick={() => updateOneFretRule({ showNoteNames: !showNoteNames, showFingering: false })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${showNoteNames ? "#3ca0dc66" : "#1e1e2e"}`,
          background: showNoteNames ? "rgba(60,160,220,0.18)" : "#0e0e16",
          color: showNoteNames ? "#78c8f0" : "#777",
          fontFamily: "var(--font-sans)",
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
          fontFamily: "var(--font-sans)",
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

  if (renderSection === "primary") return fretSelector;
  if (renderSection === "secondary") return formCards;

  return (
    <>
      {fretSelector}
      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
      {formCards}
    </>
  );
}
