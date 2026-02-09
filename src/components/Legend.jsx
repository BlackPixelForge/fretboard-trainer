import { MODES } from "./lib/fretboard";
import { SCALE_DEGREES, getNoteName } from "./lib/music";
import { getNoteColor, CAGED_SHAPE_COLORS, getScalePositionColor } from "./lib/colors";
import { CAGED_ORDER } from "./lib/caged";
import { POSITION_CAGED_MAP } from "./lib/scales";
import { INTERVAL_LABELS, INTERVAL_NAMES } from "./lib/intervals";

export default function Legend({ keyNotes, rootNote, highlightRoot, mode, quizNote, scalePositionState, cagedState, intervalState }) {
  return (
    <div style={{
      marginTop: 16,
      display: "flex",
      flexWrap: "wrap",
      gap: "8px 16px",
      padding: "12px 16px",
      background: "#0e0e16",
      borderRadius: 10,
      border: "1px solid #1a1a28",
    }}>
      {/* Default scale degree legend for Explore and Quiz modes */}
      {(mode === MODES.EXPLORE || mode === MODES.QUIZ_IDENTIFY || mode === MODES.QUIZ_FIND) && (
        <>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", color: "#444", marginRight: 4 }}>Scale Degrees:</span>
          {SCALE_DEGREES.map((d, i) => {
            const noteIndex = keyNotes[i];
            const colors = getNoteColor(noteIndex, keyNotes, rootNote, highlightRoot, mode, quizNote, -1, -1);
            return (
              <span key={d} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: "0.68rem", fontFamily: "'JetBrains Mono', monospace",
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: colors.bg, border: `1.5px solid ${colors.border}`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.55rem", fontWeight: 700, color: colors.text,
                }}>{d}</span>
                <span style={{ color: "#555" }}>{getNoteName(noteIndex)}</span>
              </span>
            );
          })}
        </>
      )}

      {/* Scale Positions legend */}
      {mode === MODES.SCALE_POSITIONS && scalePositionState && (
        <>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", color: "#444", marginRight: 4 }}>
            Position {scalePositionState.positionIndex + 1} of 5
          </span>
          <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 4px" }} />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.62rem", color: "#555" }}>Fingering:</span>
          {[
            { num: 1, label: "Index" },
            { num: 2, label: "Middle" },
            { num: 3, label: "Ring" },
            { num: 4, label: "Pinky" },
          ].map(({ num, label }) => (
            <span key={num} style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              fontSize: "0.62rem", fontFamily: "'JetBrains Mono', monospace",
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: "50%",
                background: "rgba(60,160,220,0.1)", border: "1px solid #3ca0dc44",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.55rem", fontWeight: 700, color: "#3ca0dc",
              }}>{num}</span>
              <span style={{ color: "#555" }}>{label}</span>
            </span>
          ))}
          <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 4px" }} />
          <span style={{ fontSize: "0.62rem", color: "#555", fontFamily: "'Outfit', sans-serif" }}>
            {POSITION_CAGED_MAP[scalePositionState.positionIndex]} shape
          </span>
        </>
      )}

      {/* CAGED legend */}
      {mode === MODES.CAGED && (
        <>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", color: "#444", marginRight: 4 }}>CAGED Shapes:</span>
          {CAGED_ORDER.map((letter) => {
            const color = CAGED_SHAPE_COLORS[letter];
            const active = cagedState?.selectedShape === "all" || cagedState?.selectedShape === letter;
            return (
              <span key={letter} style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: "0.68rem", fontFamily: "'JetBrains Mono', monospace",
                opacity: active ? 1 : 0.35,
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 4,
                  background: color.bg, border: `1.5px solid ${color.border}`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.55rem", fontWeight: 700, color: color.text,
                }}>{letter}</span>
              </span>
            );
          })}
          <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 4px" }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.6rem", color: "#555", fontFamily: "'Outfit', sans-serif" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid #555" }} />
            Chord tone
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.6rem", color: "#444", fontFamily: "'Outfit', sans-serif" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "transparent", border: "1px dashed #444" }} />
            Scale tone
          </span>
        </>
      )}

      {/* Intervals legend */}
      {mode === MODES.INTERVALS && (
        <>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", color: "#444", marginRight: 4 }}>Intervals:</span>
          {SCALE_DEGREES.map((d, i) => {
            const deg = i + 1;
            const noteIndex = keyNotes[i];
            const colors = getNoteColor(noteIndex, keyNotes, rootNote, true, mode, null, -1, -1);
            const active = intervalState?.intervalFilter?.has(deg);
            return (
              <span key={d} style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: "0.62rem", fontFamily: "'JetBrains Mono', monospace",
                opacity: active ? 1 : 0.3,
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: deg === 1 ? 3 : "50%",
                  background: colors.bg, border: `1.5px solid ${colors.border}`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.5rem", fontWeight: 700, color: colors.text,
                }}>{INTERVAL_LABELS[deg]}</span>
                <span style={{ color: "#555" }}>{INTERVAL_NAMES[deg]}</span>
              </span>
            );
          })}
        </>
      )}
    </div>
  );
}
