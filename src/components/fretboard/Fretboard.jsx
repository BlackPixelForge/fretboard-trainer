import { useState, useCallback } from "react";
import { STRING_TUNING } from "../lib/music";
import FretNumbers from "./FretNumbers";
import FretMarkers from "./FretMarkers";
import StringRow from "./StringRow";

export default function Fretboard({
  keyNotes, rootNote, mode, selectedStrings, selectedRegion, region,
  highlightRoot, showDegrees, quizNote, selectedAnswer, isNoteVisible, onToggleReveal, hideAll,
  getNoteDisplayData, scalePositionState, cagedState, intervalState, identifyState,
  scrollRef,
}) {
  const [scrolledEnd, setScrolledEnd] = useState(false);

  const handleScroll = useCallback((e) => {
    const el = e.currentTarget;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setScrolledEnd(atEnd);
  }, []);

  return (
    <div
      className={`fretboard-scroll-wrapper${scrolledEnd ? " scrolled-end" : ""}`}
      style={{
        background: "linear-gradient(180deg, #1a1510 0%, #15120d 100%)",
        borderRadius: 12,
        border: "1px solid #2a2218",
        overflow: "hidden",
        boxShadow: "inset 0 2px 20px rgba(0,0,0,0.4), 0 4px 30px rgba(0,0,0,0.3)",
      }}
    >
      <div
        ref={scrollRef}
        className="fretboard-scroll"
        onScroll={handleScroll}
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "16px 0 16px 42px",
        }}
      >
        <div style={{ minWidth: 1076 }}>
          <FretNumbers />

          {STRING_TUNING.map((string, si) => (
            <StringRow
              key={si}
              string={string}
              si={si}
              keyNotes={keyNotes}
              rootNote={rootNote}
              mode={mode}
              selectedStrings={selectedStrings}
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

          <FretMarkers />
        </div>
      </div>
    </div>
  );
}
