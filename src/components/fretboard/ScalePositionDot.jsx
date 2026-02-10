import { getScalePositionColor } from "../lib/colors";

export default function ScalePositionDot({ degree, finger, showFingering, showNoteNames, noteName, isRoot }) {
  const colors = getScalePositionColor(degree, isRoot);
  const label = showFingering ? String(finger) : showNoteNames ? noteName : String(degree);

  return (
    <div style={{
      width: isRoot ? 34 : 28,
      height: isRoot ? 34 : 28,
      borderRadius: isRoot ? "6px" : "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: isRoot ? 3 : 2,
      cursor: "default",
      background: isRoot ? "rgba(232,78,60,0.40)" : colors.bg,
      border: isRoot ? "2px solid #e84e3c" : `1.5px solid ${colors.border}`,
      boxShadow: isRoot
        ? "0 0 12px rgba(232,78,60,0.5), inset 0 0 8px rgba(232,78,60,0.2)"
        : "none",
      animation: isRoot ? "rootPulse 2s infinite ease-in-out" : "fadeIn 0.2s ease",
      transition: "all 0.25s ease",
      transform: isRoot ? "rotate(45deg)" : "none",
    }}>
      <span style={{
        transform: isRoot ? "rotate(-45deg)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isRoot ? "0.72rem" : "0.65rem",
        fontWeight: isRoot ? 800 : 700,
        color: isRoot ? "#ffb0a8" : colors.text,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "-0.02em",
      }}>
        {label}
        {showFingering && !isRoot && (
          <span style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            fontSize: "0.45rem",
            color: colors.text,
            opacity: 0.85,
          }}>
            {degree}
          </span>
        )}
      </span>
    </div>
  );
}
