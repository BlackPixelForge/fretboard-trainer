import { getNoteAt, getNoteName } from "../lib/music";

export default function AnswerBubbles({ quizNote, findChoices, selectedAnswer, onAnswer }) {
  if (!quizNote || findChoices.length === 0) return null;

  const correctNote = getNoteName(getNoteAt(quizNote.string, quizNote.fret));
  const showResult = selectedAnswer !== null;

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {findChoices.map((choice) => {
        const isSelected = selectedAnswer === choice;
        const isCorrectChoice = choice === correctNote;

        let bg = "rgba(255,255,255,0.04)";
        let border = "#2a2a3a";
        let textColor = "#c8ccd4";
        let shadow = "none";

        if (showResult && isCorrectChoice) {
          bg = "rgba(80,200,80,0.15)";
          border = "#50c850";
          textColor = "#50c850";
          shadow = "0 0 10px rgba(80,200,80,0.3)";
        } else if (showResult && isSelected && !isCorrectChoice) {
          bg = "rgba(220,60,60,0.15)";
          border = "#dc3c3c";
          textColor = "#dc3c3c";
          shadow = "0 0 10px rgba(220,60,60,0.3)";
        } else if (!showResult) {
          bg = "rgba(255,200,50,0.05)";
          border = "rgba(255,200,50,0.25)";
          textColor = "#ddd";
        }

        return (
          <button
            key={choice}
            onClick={() => onAnswer(choice)}
            disabled={selectedAnswer !== null}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: `2px solid ${border}`,
              background: bg,
              color: textColor,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: selectedAnswer !== null ? "default" : "pointer",
              transition: "all 0.2s",
              boxShadow: shadow,
              opacity: showResult && !isSelected && !isCorrectChoice ? 0.35 : 1,
              transform: showResult && isCorrectChoice ? "scale(1.1)" : "scale(1)",
              outline: "none",
            }}
          >
            {choice}
          </button>
        );
      })}
    </div>
  );
}
