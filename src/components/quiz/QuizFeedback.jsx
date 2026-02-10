export default function QuizFeedback({ feedback }) {
  if (!feedback) return null;

  return (
    <div style={{
      padding: "8px 16px",
      borderRadius: 8,
      background: feedback.correct ? "rgba(80,200,80,0.18)" : "rgba(220,60,60,0.18)",
      border: `1px solid ${feedback.correct ? "rgba(80,200,80,0.4)" : "rgba(220,60,60,0.4)"}`,
      color: feedback.correct ? "#80f080" : "#f08080",
      fontFamily: "'Outfit', sans-serif",
      fontSize: "0.8rem",
      fontWeight: 500,
      animation: "fadeIn 0.2s ease",
    }}>
      {feedback.message}
    </div>
  );
}
