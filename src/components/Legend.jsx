import { MODES } from "./lib/fretboard";
import { SCALE_DEGREES, getNoteName } from "./lib/music";
import { getNoteColor, CAGED_SHAPE_COLORS, getScalePositionColor, getTriadColor, DIAGONAL_POSITION_COLORS } from "./lib/colors";
import { CAGED_ORDER } from "./lib/caged";
import { getPositionLabel } from "./lib/scales";
import { INTERVAL_LABELS, INTERVAL_NAMES } from "./lib/intervals";
import { INVERSIONS, INVERSION_LABELS, getTriadLabel } from "./lib/triads";

export default function Legend({ keyNotes, rootNote, highlightRoot, mode, quizNote, scalePositionState, cagedState, intervalState, oneFretRuleState, oneFretRuleInfo, triadState }) {
  return (
    <div className="p-2.5 sm:p-3 sm:px-4" style={{
      marginTop: 16,
      display: "flex",
      flexWrap: "wrap",
      gap: "8px 16px",
      background: "linear-gradient(135deg, rgba(14,14,22,0.85), rgba(10,10,16,0.9))",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.2)",
      position: "relative",
    }}>
      {/* Default scale degree legend for Explore and Quiz modes */}
      {(mode === MODES.EXPLORE || mode === MODES.QUIZ_IDENTIFY || mode === MODES.QUIZ_FIND) && (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "#777", marginRight: 4 }}>Scale Degrees:</span>
          {SCALE_DEGREES.map((d, i) => {
            const noteIndex = keyNotes[i];
            const colors = getNoteColor(noteIndex, keyNotes, rootNote, highlightRoot, mode, quizNote, -1, -1);
            return (
              <span key={d} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: "0.68rem", fontFamily: "var(--font-mono)",
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: colors.bg, border: `1.5px solid ${colors.border}`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.55rem", fontWeight: 700, color: colors.text,
                }}>{d}</span>
                <span style={{ color: "#999" }}>{getNoteName(noteIndex)}</span>
              </span>
            );
          })}
        </>
      )}

      {/* Scale Positions legend — diagonal variant */}
      {mode === MODES.SCALE_POSITIONS && scalePositionState?.diagonalPentatonic && (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "#777", marginRight: 4 }}>
            Diagonal Pentatonic &mdash; Set {scalePositionState.diagonalSet + 1}
          </span>
          <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 4px" }} />
          {DIAGONAL_POSITION_COLORS.map((color, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              fontSize: "0.62rem", fontFamily: "var(--font-mono)",
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: "50%",
                background: color.bg, border: `1.5px solid ${color.border}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.5rem", fontWeight: 700, color: color.text,
              }}>{i + 1}</span>
              <span style={{ color: "#999" }}>{["Pos A", "Pos B", "Pos C"][i]}</span>
            </span>
          ))}
          <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 4px" }} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: "0.6rem", color: "#888", fontFamily: "var(--font-sans)",
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "rgba(180,180,180,0.08)", border: "1px dashed #99999966",
            }} />
            Faded = non-pentatonic (4th, 7th)
          </span>
        </>
      )}

      {/* Scale Positions legend — normal */}
      {mode === MODES.SCALE_POSITIONS && scalePositionState && !scalePositionState.diagonalPentatonic && (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "#777", marginRight: 4 }}>
            Position {getPositionLabel(scalePositionState.positionIndex)}
          </span>
          <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 4px" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "#999" }}>Fingering:</span>
          {[
            { num: 1, label: "Index" },
            { num: 2, label: "Middle" },
            { num: 3, label: "Ring" },
            { num: 4, label: "Pinky" },
          ].map(({ num, label }) => (
            <span key={num} style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              fontSize: "0.62rem", fontFamily: "var(--font-mono)",
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: "50%",
                background: "rgba(60,160,220,0.2)", border: "1px solid #3ca0dc66",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.55rem", fontWeight: 700, color: "#78c8f0",
              }}>{num}</span>
              <span style={{ color: "#999" }}>{label}</span>
            </span>
          ))}
        </>
      )}

      {/* One Fret Rule legend */}
      {mode === MODES.ONE_FRET_RULE && oneFretRuleState && oneFretRuleInfo && (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "#777", marginRight: 4 }}>
            Form {oneFretRuleInfo[oneFretRuleState.selectedFormIndex]?.formName} &mdash; {getNoteName(oneFretRuleInfo[oneFretRuleState.selectedFormIndex]?.rootNote)} Major
            <span style={{ color: "#666", marginLeft: 6, fontSize: "0.6rem" }}>
              (root: string {oneFretRuleInfo[oneFretRuleState.selectedFormIndex]?.rootGuitarString}, fret {oneFretRuleInfo[oneFretRuleState.selectedFormIndex]?.rootFret})
            </span>
          </span>
          <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 4px" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "#999" }}>Fingering:</span>
          {[
            { num: 1, label: "Index" },
            { num: 2, label: "Middle" },
            { num: 3, label: "Ring" },
            { num: 4, label: "Pinky" },
          ].map(({ num, label }) => (
            <span key={num} style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              fontSize: "0.62rem", fontFamily: "var(--font-mono)",
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: "50%",
                background: "rgba(60,160,220,0.2)", border: "1px solid #3ca0dc66",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.55rem", fontWeight: 700, color: "#78c8f0",
              }}>{num}</span>
              <span style={{ color: "#999" }}>{label}</span>
            </span>
          ))}
        </>
      )}

      {/* CAGED legend */}
      {mode === MODES.CAGED && (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "#777", marginRight: 4 }}>CAGED Shapes:</span>
          {CAGED_ORDER.map((letter) => {
            const color = CAGED_SHAPE_COLORS[letter];
            const active = cagedState?.selectedShape === "all" || cagedState?.selectedShape === letter;
            return (
              <span key={letter} style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: "0.68rem", fontFamily: "var(--font-mono)",
                opacity: active ? 1 : 0.5,
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.6rem", color: "#999", fontFamily: "var(--font-sans)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid #888" }} />
            Chord tone
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.6rem", color: "#999", fontFamily: "var(--font-sans)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(180,180,180,0.08)", border: "1px dashed #666" }} />
            Scale tone
          </span>
        </>
      )}

      {/* Triads legend */}
      {mode === MODES.TRIADS && triadState && (() => {
        const invKey = INVERSIONS[triadState.inversionIndex];
        const label = getTriadLabel(invKey, triadState.shapeIndex);
        const invLabel = INVERSION_LABELS[invKey];
        const intervals = [
          { key: "R", label: "Root" },
          { key: "3", label: "3rd" },
          { key: "5", label: "5th" },
        ];
        return (
          <>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "#777", marginRight: 4 }}>
              {label} &middot; {invLabel}
            </span>
            <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 4px" }} />
            {intervals.map(({ key, label: iLabel }) => {
              const isRoot = key === "R";
              const colors = getTriadColor(key, isRoot);
              return (
                <span key={key} style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  fontSize: "0.62rem", fontFamily: "var(--font-mono)",
                }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: isRoot ? 3 : "50%",
                    background: colors.bg, border: `1.5px solid ${colors.border}`,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.5rem", fontWeight: 700, color: colors.text,
                  }}>{key}</span>
                  <span style={{ color: "#999" }}>{iLabel}</span>
                </span>
              );
            })}
            <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 4px" }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "#999" }}>Fingering:</span>
            {[
              { num: 1, label: "Index" },
              { num: 2, label: "Middle" },
              { num: 3, label: "Ring" },
              { num: 4, label: "Pinky" },
            ].map(({ num, label: fLabel }) => (
              <span key={num} style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: "0.62rem", fontFamily: "var(--font-mono)",
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: "rgba(60,160,220,0.2)", border: "1px solid #3ca0dc66",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.55rem", fontWeight: 700, color: "#78c8f0",
                }}>{num}</span>
                <span style={{ color: "#999" }}>{fLabel}</span>
              </span>
            ))}
          </>
        );
      })()}

      {/* Intervals legend */}
      {mode === MODES.INTERVALS && (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "#777", marginRight: 4 }}>Intervals:</span>
          {SCALE_DEGREES.map((d, i) => {
            const deg = i + 1;
            const noteIndex = keyNotes[i];
            const colors = getNoteColor(noteIndex, keyNotes, rootNote, true, mode, null, -1, -1);
            const active = intervalState?.intervalFilter?.has(deg);
            return (
              <span key={d} style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: "0.62rem", fontFamily: "var(--font-mono)",
                opacity: active ? 1 : 0.45,
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: deg === 1 ? 3 : "50%",
                  background: colors.bg, border: `1.5px solid ${colors.border}`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.5rem", fontWeight: 700, color: colors.text,
                }}>{INTERVAL_LABELS[deg]}</span>
                <span style={{ color: "#999" }}>{INTERVAL_NAMES[deg]}</span>
              </span>
            );
          })}
        </>
      )}
    </div>
  );
}
