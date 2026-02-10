import { MODES } from "../lib/fretboard";
import { getStringLabel } from "../lib/music";

export default function QuizPrompt({ mode, quizTarget, quizNote }) {
  return (
    <div style={{
      padding: "10px 20px",
      background: "linear-gradient(135deg, rgba(255,200,50,0.12), rgba(255,200,50,0.04))",
      border: "1px solid rgba(255,200,50,0.3)",
      borderRadius: 10,
      fontFamily: "'Outfit', sans-serif",
    }}>
      {mode === MODES.QUIZ_IDENTIFY && quizTarget && (
        <span style={{ fontSize: "0.85rem", color: "#ffe080" }}>
          Find all <strong style={{ fontSize: "1.1rem" }}>{quizTarget.name}</strong> notes on the fretboard
        </span>
      )}
      {mode === MODES.QUIZ_FIND && quizNote && (
        <span style={{ fontSize: "0.85rem", color: "#ffe080" }}>
          What note is on the <strong>{getStringLabel(quizNote.string)}</strong> string, <strong>fret {quizNote.fret}</strong>?
        </span>
      )}
    </div>
  );
}
