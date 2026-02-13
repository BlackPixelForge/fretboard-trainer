export default function QuizTarget({ answered, noteName, selectedAnswer }) {
  if (!answered) {
    // Pulsing target indicator
    return (
      <div style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 4,
        background: "radial-gradient(circle, rgba(255,200,50,0.2) 0%, rgba(255,200,50,0.05) 70%, transparent 100%)",
        border: "2.5px solid #ffc832",
        animation: "pulseGlow 1.5s infinite",
        cursor: "default",
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#ffc832",
          boxShadow: "0 0 8px rgba(255,200,50,0.6)",
        }} />
      </div>
    );
  }

  // Revealed answer after answering
  const revealCorrect = selectedAnswer === noteName;
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
      background: revealCorrect ? "rgba(80,200,80,0.35)" : "rgba(255,200,50,0.35)",
      border: `2.5px solid ${revealCorrect ? "#50c850" : "#ffc832"}`,
      boxShadow: revealCorrect
        ? "0 0 16px rgba(80,200,80,0.5)"
        : "0 0 16px rgba(255,200,50,0.5)",
      animation: "fadeIn 0.25s ease",
      fontSize: "0.82rem",
      fontWeight: 800,
      color: revealCorrect ? "#80f080" : "#ffe080",
      fontFamily: "var(--font-mono)",
    }}>
      {noteName}
    </div>
  );
}
