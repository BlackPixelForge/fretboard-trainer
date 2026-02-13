import { getTriadColor } from "../lib/colors";

export default function TriadDot({ interval, finger, noteName, isRoot, showFingering, showNoteNames }) {
  const colors = getTriadColor(interval, isRoot);
  const label = showFingering ? String(finger) : showNoteNames ? noteName : interval;

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
      background: colors.bg,
      border: isRoot ? `2px solid ${colors.border}` : `1.5px solid ${colors.border}`,
      boxShadow: isRoot
        ? `0 0 12px rgba(232,78,60,0.5), inset 0 0 8px rgba(232,78,60,0.2)`
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
        fontSize: isRoot ? "0.72rem" : "0.6rem",
        fontWeight: isRoot ? 800 : 700,
        color: isRoot ? "#ffb0a8" : colors.text,
        fontFamily: "var(--font-mono)",
        letterSpacing: "-0.02em",
      }}>
        {label}
      </span>
    </div>
  );
}
