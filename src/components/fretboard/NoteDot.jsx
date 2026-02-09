export default function NoteDot({ visible, isRoot, colors, noteName, degree, showDegrees, onClick, canClick }) {
  return (
    <div
      onClick={canClick ? onClick : undefined}
      style={{
        width: visible && isRoot ? 34 : 28,
        height: visible && isRoot ? 34 : 28,
        borderRadius: visible && isRoot ? "6px" : "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: visible && isRoot ? 3 : 2,
        cursor: canClick ? "pointer" : "default",
        background: visible
          ? (isRoot ? "rgba(232,78,60,0.25)" : colors.bg)
          : "rgba(255,255,255,0.04)",
        border: visible
          ? (isRoot ? "2px solid #e84e3c" : `1.5px solid ${colors.border}`)
          : "1px dashed #333",
        boxShadow: visible && isRoot
          ? "0 0 12px rgba(232,78,60,0.5), inset 0 0 8px rgba(232,78,60,0.2)"
          : visible && colors.glow ? colors.glow
          : "none",
        animation: visible && isRoot ? "rootPulse 2s infinite ease-in-out"
          : visible ? "fadeIn 0.2s ease" : "none",
        transition: "all 0.25s ease",
        fontSize: visible && isRoot ? "0.72rem" : "0.65rem",
        fontWeight: visible && isRoot ? 800 : 700,
        color: visible ? (isRoot ? "#ff6b5a" : colors.text) : "transparent",
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "-0.02em",
        transform: visible && isRoot ? "rotate(45deg)" : "none",
      }}
    >
      <span style={{ transform: visible && isRoot ? "rotate(-45deg)" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {visible ? (showDegrees && degree ? degree : noteName) : ""}
      </span>
    </div>
  );
}
