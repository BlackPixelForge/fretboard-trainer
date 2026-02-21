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
        let border = "var(--border-visible)";
        let textColor = "var(--text-primary)";
        let shadow = "inset 0 1px 0 rgba(255,255,255,0.02)";
        let anim = "none";

        if (showResult && isCorrectChoice) {
          bg = "rgba(80,200,80,0.25)";
          border = "#50c850";
          textColor = "#80f080";
          shadow = "0 0 14px rgba(80,200,80,0.35)";
          anim = "springCorrect 0.5s var(--ease-spring)";
        } else if (showResult && isSelected && !isCorrectChoice) {
          bg = "rgba(220,60,60,0.25)";
          border = "#dc3c3c";
          textColor = "#f08080";
          shadow = "0 0 14px rgba(220,60,60,0.35)";
          anim = "springWrong 0.5s var(--ease-out-expo)";
        } else if (!showResult) {
          bg = "rgba(255,200,50,0.08)";
          border = "rgba(255,200,50,0.30)";
          textColor = "#eee";
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
              fontFamily: "var(--font-mono)",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: selectedAnswer !== null ? "default" : "pointer",
              transition: `all var(--duration-normal) var(--ease-smooth)`,
              boxShadow: shadow,
              opacity: showResult && !isSelected && !isCorrectChoice ? 0.45 : 1,
              animation: anim,
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
