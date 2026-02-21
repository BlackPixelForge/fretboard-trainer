import { FORMS } from "../lib/scales";
import { getNoteName } from "../lib/music";

export default function OneFretRuleControls({ oneFretRuleState, updateOneFretRule, oneFretRuleInfo, rootNote, renderSection }) {
  const { positionFret, selectedFormIndex, showFingering, showNoteNames, showChordTones } = oneFretRuleState;
  const total = FORMS.length;
  const currentInfo = oneFretRuleInfo[selectedFormIndex];

  const fretSelector = (
    <>
      {/* Key badge — computed from selected form */}
      <span style={{
        padding: "7px 14px",
        background: "rgba(212,160,23,0.12)",
        border: "1px solid rgba(212,160,23,0.3)",
        borderRadius: "var(--radius-md)",
        fontFamily: "var(--font-sans)",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#f0d060",
      }}>
        {getNoteName(rootNote)} Major
      </span>
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Fret:</span>

      {/* Mobile: select dropdown */}
      <select
        className="sm:hidden"
        value={positionFret}
        onChange={(e) => updateOneFretRule({ positionFret: Number(e.target.value) })}
        style={{
          padding: "6px 10px",
          borderRadius: "var(--radius-md)",
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
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${active ? "rgba(212,160,23,0.35)" : "var(--border-muted)"}`,
                background: active ? "rgba(212,160,23,0.22)" : "var(--surface-base)",
                color: active ? "#f0d060" : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 2px",
                transition: `all var(--duration-normal) var(--ease-smooth)`,
                boxShadow: active
                  ? "0 0 12px rgba(212,160,23,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                  : "inset 0 1px 0 rgba(255,255,255,0.02)",
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
      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Form / Key:</span>

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
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${active ? "rgba(232,78,60,0.35)" : "var(--border-muted)"}`,
                background: active ? "var(--accent-red-glow)" : "var(--surface-base)",
                color: active ? "var(--accent-red-text)" : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.55rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 6px",
                gap: 4,
                transition: `all var(--duration-normal) var(--ease-smooth)`,
                boxShadow: active
                  ? "0 0 12px rgba(232,78,60,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                  : "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            >
              <span>{info.formName}</span>
              <span style={{ color: active ? "#f0d060" : "#666", fontWeight: 600 }}>{info.rootNoteName}</span>
            </button>
          );
        })}
      </span>

      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />

      {/* Prev/Next step buttons */}
      <button
        onClick={() => {
          const prev = selectedFormIndex > 0 ? selectedFormIndex - 1 : total - 1;
          updateOneFretRule({ selectedFormIndex: prev });
        }}
        title="Previous form (← arrow key)"
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
      <button
        onClick={() => {
          const next = selectedFormIndex < total - 1 ? selectedFormIndex + 1 : 0;
          updateOneFretRule({ selectedFormIndex: next });
        }}
        title="Next form (→ arrow key)"
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

      {/* Root fret info */}
      <span style={{
        fontSize: "0.6rem",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-sans)",
        padding: "4px 8px",
        background: "rgba(232,78,60,0.08)",
        border: "1px solid rgba(232,78,60,0.15)",
        borderRadius: "var(--radius-sm)",
      }}>
        Root: str {currentInfo.rootGuitarString}, fret {currentInfo.rootFret}
      </span>

      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />

      <button
        onClick={() => updateOneFretRule({ showChordTones: !showChordTones })}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${showChordTones ? "rgba(240,200,50,0.35)" : "var(--border-muted)"}`,
          background: showChordTones ? "var(--accent-gold-glow)" : "var(--surface-base)",
          color: showChordTones ? "#f0d060" : "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: showChordTones
            ? "0 0 12px rgba(240,200,50,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        Chord
      </button>
      <button
        onClick={() => updateOneFretRule({ showNoteNames: !showNoteNames, showFingering: false })}
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
        onClick={() => updateOneFretRule({ showFingering: !showFingering, showNoteNames: false })}
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
    </>
  );

  if (renderSection === "primary") return fretSelector;
  if (renderSection === "secondary") return formCards;

  return (
    <>
      {fretSelector}
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
      {formCards}
    </>
  );
}
