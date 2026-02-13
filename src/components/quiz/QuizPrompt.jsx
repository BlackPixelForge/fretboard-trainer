import { MODES } from "../lib/fretboard";
import { getStringLabel } from "../lib/music";

export default function QuizPrompt({ mode, quizTarget, quizNote, identifyState, onFinish, onNewRound }) {
  const buttonStyle = {
    padding: "6px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255,200,50,0.4)",
    background: "rgba(255,200,50,0.12)",
    color: "#ffc832",
    fontFamily: "var(--font-sans)",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{
      padding: "10px 20px",
      background: "linear-gradient(135deg, rgba(255,200,50,0.12), rgba(255,200,50,0.04))",
      border: "1px solid rgba(255,200,50,0.3)",
      borderRadius: 10,
      fontFamily: "var(--font-sans)",
    }}>
      {mode === MODES.QUIZ_IDENTIFY && quizTarget && (
        <>
          {identifyState?.phase === "selecting" && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.85rem", color: "#ffe080" }}>
                Find all <strong style={{ fontSize: "1.1rem" }}>{quizTarget.name}</strong> notes
              </span>
              <span style={{ fontSize: "0.75rem", color: "#889" }}>
                {identifyState.selections.size} selected
              </span>
              <button
                onClick={onFinish}
                disabled={identifyState.selections.size === 0}
                style={{
                  ...buttonStyle,
                  opacity: identifyState.selections.size === 0 ? 0.4 : 1,
                  cursor: identifyState.selections.size === 0 ? "default" : "pointer",
                }}
              >
                Finish Selections
              </button>
            </div>
          )}
          {identifyState?.phase === "results" && identifyState.results && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.85rem", color: "#ffe080" }}>
                <strong>{quizTarget.name}</strong> —{" "}
                <span style={{ color: "#80f080" }}>{identifyState.results.correct} correct</span>
                {identifyState.results.incorrect > 0 && (
                  <>, <span style={{ color: "#f08080" }}>{identifyState.results.incorrect} wrong</span></>
                )}
                {identifyState.results.missed > 0 && (
                  <>, <span style={{ color: "#ffe080" }}>{identifyState.results.missed} missed</span></>
                )}
                {" — "}
                <strong style={{ color: identifyState.results.percentage === 100 ? "#80f080" : "#ffc832" }}>
                  {identifyState.results.percentage}%
                </strong>
              </span>
              <button onClick={onNewRound} style={buttonStyle}>
                New Round
              </button>
            </div>
          )}
        </>
      )}
      {mode === MODES.QUIZ_FIND && quizNote && (
        <span style={{ fontSize: "0.85rem", color: "#ffe080" }}>
          What note is on the <strong>{getStringLabel(quizNote.string)}</strong> string, <strong>fret {quizNote.fret}</strong>?
        </span>
      )}
    </div>
  );
}
