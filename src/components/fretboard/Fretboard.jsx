import { useState, useCallback } from "react";
import { STRING_TUNING } from "../lib/music";
import FretNumbers from "./FretNumbers";
import FretMarkers from "./FretMarkers";
import StringRow from "./StringRow";

export default function Fretboard({
  keyNotes, rootNote, mode, selectedRegion, region,
  highlightRoot, showDegrees, quizNote, selectedAnswer, isNoteVisible, onToggleReveal, hideAll,
  getNoteDisplayData, scalePositionState, cagedState, intervalState, identifyState,
  scrollRef, embedded,
}) {
  const [scrolledEnd, setScrolledEnd] = useState(false);

  const handleScroll = useCallback((e) => {
    const el = e.currentTarget;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setScrolledEnd(atEnd);
  }, []);

  return (
    <div className="fretboard-container" style={{ position: "relative", margin: "8px 0" }}>
      <div
        className={`fretboard-scroll-wrapper${scrolledEnd ? " scrolled-end" : ""}`}
        style={{
          background: "linear-gradient(180deg, #1a1510 0%, #15120d 100%)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid #2a2218",
          overflow: "hidden",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.4), 0 4px 30px rgba(0,0,0,0.3), 0 0 60px rgba(210,170,90,0.03), 0 1px 0 rgba(255,255,255,0.03)",
          position: "relative",
          zIndex: 1,
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
                key={string.name + string.octave}
                string={string}
                si={si}
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

            <FretMarkers />
          </div>
        </div>

        {/* Blur overlay for embedded demo — obscures frets beyond 5 */}
        {embedded && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              background: "linear-gradient(to right, transparent 26%, rgba(10,10,15,0.7) 36%)",
              maskImage: "linear-gradient(to right, transparent 24%, black 34%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 24%, black 34%)",
              pointerEvents: "none",
              zIndex: 2,
              borderRadius: "var(--radius-xl)",
            }}
          />
        )}
      </div>
    </div>
  );
}
