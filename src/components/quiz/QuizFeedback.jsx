export default function QuizFeedback({ feedback }) {
  if (!feedback) return null;

  return (
    <div style={{
      padding: "8px 16px",
      borderRadius: "var(--radius-md)",
      background: feedback.correct ? "rgba(80,200,80,0.18)" : "rgba(220,60,60,0.18)",
      border: `1px solid ${feedback.correct ? "rgba(80,200,80,0.4)" : "rgba(220,60,60,0.4)"}`,
      color: feedback.correct ? "#80f080" : "#f08080",
      fontFamily: "var(--font-sans)",
      fontSize: "0.8rem",
      fontWeight: 500,
      animation: feedback.correct
        ? "springCorrect 0.5s var(--ease-spring)"
        : "springWrong 0.5s var(--ease-out-expo)",
      boxShadow: feedback.correct
        ? "0 0 16px rgba(80,200,80,0.15)"
        : "0 0 16px rgba(220,60,60,0.15)",
    }}>
      {feedback.message}
    </div>
  );
}
