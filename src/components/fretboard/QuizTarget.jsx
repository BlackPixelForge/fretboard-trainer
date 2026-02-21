export default function QuizTarget({ answered, noteName, selectedAnswer }) {
  if (!answered) {
    // Pulsing target indicator
    return (
      <div style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 4,
        background: "radial-gradient(circle, rgba(255,200,50,0.25) 0%, rgba(255,200,50,0.05) 70%, transparent 100%)",
        border: "2.5px solid var(--accent-gold)",
        animation: "pulseGlow 1.5s infinite",
        cursor: "default",
        boxShadow: "0 0 20px rgba(255,200,50,0.2)",
      }}>
        <div style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: "var(--accent-gold)",
          boxShadow: "0 0 12px rgba(255,200,50,0.7)",
        }} />
      </div>
    );
  }

  // Revealed answer after answering
  const revealCorrect = selectedAnswer === noteName;
  return (
    <div style={{
      width: 38,
      height: 38,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 4,
      background: revealCorrect ? "rgba(80,200,80,0.35)" : "rgba(255,200,50,0.35)",
      border: `2.5px solid ${revealCorrect ? "#50c850" : "var(--accent-gold)"}`,
      boxShadow: revealCorrect
        ? "0 0 20px rgba(80,200,80,0.5)"
        : "0 0 20px rgba(255,200,50,0.5)",
      animation: revealCorrect
        ? "springCorrect 0.5s var(--ease-spring)"
        : "positionTransition 300ms var(--ease-out-expo)",
      fontSize: "0.82rem",
      fontWeight: 800,
      color: revealCorrect ? "#80f080" : "#ffe080",
      fontFamily: "var(--font-mono)",
    }}>
      {noteName}
    </div>
  );
}
