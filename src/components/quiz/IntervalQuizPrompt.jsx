import { INTERVAL_LABELS } from "../lib/intervals";

const ALL_DEGREES = [1, 2, 3, 4, 5, 6, 7];

export default function IntervalQuizPrompt({ quizNote, onAnswer, selectedAnswer, correctInterval }) {
  if (!quizNote) return null;

  const showResult = selectedAnswer !== null;

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {ALL_DEGREES.map((d) => {
        const label = INTERVAL_LABELS[d];
        const isSelected = selectedAnswer === d;
        const isCorrect = d === correctInterval;

        let bg = "rgba(255,200,50,0.05)";
        let border = "rgba(255,200,50,0.25)";
        let textColor = "#ddd";
        let shadow = "inset 0 1px 0 rgba(255,255,255,0.02)";
        let anim = "none";

        if (showResult && isCorrect) {
          bg = "rgba(80,200,80,0.25)";
          border = "#50c850";
          textColor = "#80f080";
          shadow = "0 0 14px rgba(80,200,80,0.35)";
          anim = "springCorrect 0.5s var(--ease-spring)";
        } else if (showResult && isSelected && !isCorrect) {
          bg = "rgba(220,60,60,0.25)";
          border = "#dc3c3c";
          textColor = "#f08080";
          shadow = "0 0 14px rgba(220,60,60,0.35)";
          anim = "springWrong 0.5s var(--ease-out-expo)";
        }

        return (
          <button
            key={d}
            onClick={() => onAnswer(d)}
            disabled={selectedAnswer !== null}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: `2px solid ${border}`,
              background: bg,
              color: textColor,
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: selectedAnswer !== null ? "default" : "pointer",
              transition: `all var(--duration-normal) var(--ease-smooth)`,
              boxShadow: shadow,
              opacity: showResult && !isSelected && !isCorrect ? 0.45 : 1,
              animation: anim,
              outline: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
