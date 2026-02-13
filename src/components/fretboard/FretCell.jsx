import { MODES } from "../lib/fretboard";
import { getNoteAt, getNoteName, isInKey, getScaleDegree } from "../lib/music";
import { getNoteColor } from "../lib/colors";
import NoteDot from "./NoteDot";
import QuizTarget from "./QuizTarget";
import ScalePositionDot from "./ScalePositionDot";
import CAGEDDot from "./CAGEDDot";
import TriadDot from "./TriadDot";

export default function FretCell({
  si, f, keyNotes, rootNote, mode, selectedRegion, region,
  highlightRoot, showDegrees, quizNote, selectedAnswer, isNoteVisible, onToggleReveal, hideAll,
  getNoteDisplayData, scalePositionState, cagedState, intervalState, identifyState,
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

      {/* New mode rendering: Scale Positions + One Fret Rule */}
      {(mode === MODES.SCALE_POSITIONS || mode === MODES.ONE_FRET_RULE) && visible && (() => {
        const data = getNoteDisplayData(si, f);
        if (!data) return null;
        return (
          <ScalePositionDot
            degree={data.degree}
            finger={data.finger}
            showFingering={data.showFingering}
            showNoteNames={data.showNoteNames}
            noteName={data.noteName}
            isRoot={data.isRoot}
            isChordTone={data.isChordTone}
          />
        );
      })()}

      {/* New mode rendering: CAGED */}
      {mode === MODES.CAGED && visible && (() => {
        const data = getNoteDisplayData(si, f);
        if (!data) return null;
        return (
          <CAGEDDot
            letter={data.letter}
            isChordTone={data.isChordTone}
            type={data.chordType}
            degree={data.degree}
          />
        );
      })()}

      {/* New mode rendering: Triads */}
      {mode === MODES.TRIADS && visible && (() => {
        const data = getNoteDisplayData(si, f);
        if (!data) return null;
        return (
          <TriadDot
            interval={data.interval}
            finger={data.finger}
            noteName={data.noteName}
            isRoot={data.isRoot}
            showFingering={data.showFingering}
            showNoteNames={data.showNoteNames}
          />
        );
      })()}

      {/* New mode rendering: Intervals */}
      {mode === MODES.INTERVALS && (() => {
        // In quiz mode, show quiz target dot
        if (intervalState?.quizMode) {
          const isTarget = intervalState.quizNote &&
            intervalState.quizNote.string === si && intervalState.quizNote.fret === f;
          if (!isTarget) return null;
          const answered = intervalState.selectedAnswer !== null;
          if (!answered) {
            return <QuizTarget answered={false} noteName="?" selectedAnswer={null} />;
          }
          // After answering, show the interval label
          const data = getNoteDisplayData(si, f);
          const label = data ? data.intervalLabel : noteName;
          return (
            <NoteDot
              visible={true}
              isRoot={data?.isRoot}
              colors={colors}
              noteName={label}
              degree={degree}
              showDegrees={false}
              canClick={false}
              onClick={() => {}}
              hideAll={false}
            />
          );
        }
        // Non-quiz interval mode
        if (!visible) return null;
        const data = getNoteDisplayData(si, f);
        if (!data) return null;
        return (
          <NoteDot
            visible={true}
            isRoot={data.isRoot}
            colors={colors}
            noteName={data.intervalLabel}
            degree={degree}
            showDegrees={false}
            canClick={false}
            onClick={() => {}}
            hideAll={false}
          />
        );
      })()}

      {/* Batch identify mode rendering */}
      {mode === MODES.QUIZ_IDENTIFY && inKey && isInRegion && (() => {
        if (identifyState?.phase === "selecting") {
          const id = `${si}-${f}`;
          const isSelected = identifyState.selections.has(id);
          if (isSelected) {
            return (
              <div
                onClick={() => onToggleReveal(si, f)}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", zIndex: 2, cursor: "pointer",
                  background: "rgba(255,200,50,0.3)",
                  border: "2px solid #ffc832",
                  boxShadow: "0 0 8px rgba(255,200,50,0.4)",
                  animation: "fadeIn 0.15s ease",
                  fontSize: "0.7rem", fontWeight: 700, color: "#ffe080",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >?</div>
            );
          }
          return (
            <div
              onClick={() => onToggleReveal(si, f)}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", zIndex: 2, cursor: "pointer",
                background: "rgba(255,255,255,0.06)",
                border: "1px dashed #333",
                transition: "all 0.25s ease",
              }}
            />
          );
        }
        if (identifyState?.phase === "results") {
          const id = `${si}-${f}`;
          const result = identifyState.results?.positionMap?.get(id);
          let bg, border, text, shadow, anim;
          if (result === "correct") {
            bg = "rgba(80,200,80,0.35)"; border = "#50c850"; text = "#80f080";
            shadow = "0 0 6px rgba(80,200,80,0.4)"; anim = "fadeIn 0.2s ease";
          } else if (result === "incorrect") {
            bg = "rgba(220,60,60,0.35)"; border = "#dc3c3c"; text = "#f08080";
            shadow = "0 0 6px rgba(220,60,60,0.4)"; anim = "fadeIn 0.2s ease";
          } else if (result === "missed") {
            bg = "rgba(255,200,50,0.25)"; border = "#ffc832"; text = "#ffe080";
            shadow = "0 0 8px rgba(255,200,50,0.4)"; anim = "rootPulse 2s infinite ease-in-out";
          } else {
            bg = "rgba(255,255,255,0.06)"; border = "#333"; text = "#555";
            shadow = "none"; anim = "none";
          }
          return (
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 2,
              background: bg,
              border: result ? `2px solid ${border}` : `1px solid ${border}`,
              boxShadow: shadow,
              animation: anim,
              fontSize: "0.6rem", fontWeight: 700, color: text,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {noteName}
            </div>
          );
        }
        return null;
      })()}

      {/* Original mode rendering: Explore + Find Quiz modes */}
      {(mode === MODES.EXPLORE || mode === MODES.QUIZ_FIND) &&
        inKey && isInRegion && (() => {
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
            canClick={true}
            onClick={() => onToggleReveal(si, f)}
            hideAll={hideAll}
          />
        );
      })()}
    </div>
  );
}
