import { MODES } from "../lib/fretboard";
import { getNoteAt, getNoteName, isInKey, getScaleDegree } from "../lib/music";
import { getNoteColor } from "../lib/colors";
import NoteDot from "./NoteDot";
import QuizTarget from "./QuizTarget";

export default function FretCell({
  si, f, keyNotes, rootNote, mode, selectedStrings, selectedRegion, region,
  highlightRoot, showDegrees, quizNote, selectedAnswer, isNoteVisible, onToggleReveal, hideAll,
}) {
  const noteIndex = getNoteAt(si, f);
  const noteName = getNoteName(noteIndex);
  const inKey = isInKey(noteIndex, keyNotes);
  const visible = isNoteVisible(si, f);
  const degree = getScaleDegree(noteIndex, keyNotes);
  const colors = getNoteColor(noteIndex, keyNotes, rootNote, highlightRoot, mode, quizNote, si, f);
  const isInRegion = selectedRegion === "all" || (f >= region.start && f <= region.end);
  const isRoot = highlightRoot && noteIndex === rootNote;

  return (
    <div style={{
      flex: f === 0 ? "0 0 40px" : "1 0 0",
      minWidth: f === 0 ? 40 : 52,
      height: "100%",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRight: f > 0 ? "2px solid #2a2218" : "none",
      borderLeft: f === 1 ? "4px solid #d4c8a0" : "none",
      background: isInRegion && selectedRegion !== "all" ? "rgba(255,255,255,0.01)" : "transparent",
    }}>
      {/* String wire */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: 0, right: 0,
        height: Math.max(1, 3 - si * 0.3),
        background: `linear-gradient(90deg, ${si >= 3 ? "#8a7a5a" : "#c0b090"}, ${si >= 3 ? "#7a6a4a" : "#b0a080"})`,
        transform: "translateY(-50%)",
        opacity: 0.6,
      }} />

      {/* Note rendering */}
      {inKey && isInRegion && (() => {
        const isFindTarget = mode === MODES.QUIZ_FIND && quizNote && quizNote.string === si && quizNote.fret === f;
        const answered = mode === MODES.QUIZ_FIND && selectedAnswer !== null;

        if (mode === MODES.QUIZ_FIND && !isFindTarget) return null;

        if (isFindTarget) {
          return <QuizTarget answered={answered} noteName={noteName} selectedAnswer={selectedAnswer} />;
        }

        return (
          <NoteDot
            visible={visible}
            isRoot={isRoot}
            colors={colors}
            noteName={noteName}
            degree={degree}
            showDegrees={showDegrees}
            canClick={selectedStrings.has(si)}
            onClick={() => onToggleReveal(si, f)}
            hideAll={hideAll}
          />
        );
      })()}
    </div>
  );
}
