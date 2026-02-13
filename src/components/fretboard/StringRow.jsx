import { FRET_COUNT } from "../lib/fretboard";
import FretCell from "./FretCell";

export default function StringRow({
  string, si, keyNotes, rootNote, mode, selectedRegion, region,
  highlightRoot, showDegrees, quizNote, selectedAnswer, isNoteVisible, onToggleReveal, hideAll,
  getNoteDisplayData, scalePositionState, cagedState, intervalState, identifyState,
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      height: 36,
      position: "relative",
    }}>
      {/* String label */}
      <div style={{
        width: 48,
        flexShrink: 0,
        textAlign: "center",
        fontSize: "0.7rem",
        fontWeight: 600,
        color: "#5a5040",
        fontFamily: "var(--font-mono)",
      }}>
        {string.name}{si === 0 ? "\u00B9" : si === 5 ? "\u2076" : ""}
      </div>

      {/* Frets */}
      {Array.from({ length: FRET_COUNT + 1 }, (_, f) => (
        <FretCell
          key={f}
          si={si}
          f={f}
          keyNotes={keyNotes}
          rootNote={rootNote}
          mode={mode}
          selectedRegion={selectedRegion}
          region={region}
          highlightRoot={highlightRoot}
          showDegrees={showDegrees}
          quizNote={quizNote}
          selectedAnswer={selectedAnswer}
          isNoteVisible={isNoteVisible}
          onToggleReveal={onToggleReveal}
          hideAll={hideAll}
          getNoteDisplayData={getNoteDisplayData}
          scalePositionState={scalePositionState}
          cagedState={cagedState}
          intervalState={intervalState}
          identifyState={identifyState}
        />
      ))}
    </div>
  );
}
