export default function ScoreBar({ score, streak, bestStreak }) {
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const highStreak = streak >= 5;

  return (
    <div style={{
      marginLeft: "auto",
      display: "flex", gap: "16px",
      fontFamily: "var(--font-mono)",
      fontSize: "0.72rem",
      color: "var(--text-secondary)",
    }}>
      <span>Score: <strong style={{ color: "var(--text-primary)" }}>{score.correct}/{score.total}</strong></span>
      <span>Accuracy: <strong style={{ color: accuracy >= 80 ? "#50c850" : accuracy >= 50 ? "#e6a03c" : "#dc3c3c" }}>{accuracy}%</strong></span>
      <span>Streak: <strong style={{
        color: highStreak ? "var(--accent-gold)" : "var(--text-primary)",
        animation: highStreak ? "streakGlow 1.5s ease-in-out infinite" : "none",
      }}>{streak}</strong></span>
      <span style={{ color: "var(--text-muted)" }}>Best: {bestStreak}</span>
    </div>
  );
}
