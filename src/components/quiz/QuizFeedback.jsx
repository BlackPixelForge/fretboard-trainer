export default function QuizFeedback({ feedback }) {
  if (!feedback) return null;

  return (
    <div style={{
      padding: "8px 16px",
      borderRadius: 8,
      background: feedback.correct ? "rgba(80,200,80,0.1)" : "rgba(220,60,60,0.1)",
      border: `1px solid ${feedback.correct ? "rgba(80,200,80,0.3)" : "rgba(220,60,60,0.3)"}`,
      color: feedback.correct ? "#50c850" : "#dc3c3c",
      fontFamily: "'Outfit', sans-serif",
      fontSize: "0.8rem",
      fontWeight: 500,
      animation: "fadeIn 0.2s ease",
    }}>
      {feedback.message}
    </div>
  );
}
