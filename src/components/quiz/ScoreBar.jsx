export default function ScoreBar({ score, streak, bestStreak }) {
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div style={{
      marginLeft: "auto",
      display: "flex", gap: "16px",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.72rem",
      color: "#999",
    }}>
      <span>Score: <strong style={{ color: "#c8ccd4" }}>{score.correct}/{score.total}</strong></span>
      <span>Accuracy: <strong style={{ color: accuracy >= 80 ? "#50c850" : accuracy >= 50 ? "#e6a03c" : "#dc3c3c" }}>{accuracy}%</strong></span>
      <span>Streak: <strong style={{ color: streak >= 5 ? "#ffc832" : "#c8ccd4" }}>{streak}</strong></span>
      <span style={{ color: "#777" }}>Best: {bestStreak}</span>
    </div>
  );
}
