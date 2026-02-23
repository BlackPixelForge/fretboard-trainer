import { getScalePositionColor, getDiagonalPositionColor } from "../lib/colors";

export default function ScalePositionDot({ degree, finger, showFingering, showNoteNames, noteName, isRoot, isChordTone, colorOverride }) {
  const colors = colorOverride
    ? getDiagonalPositionColor(colorOverride.positionGroupIndex, colorOverride.isPentatonic, isRoot)
    : getScalePositionColor(degree, isRoot);
  const label = showFingering ? String(finger) : showNoteNames ? noteName : String(degree);
  // When isChordTone is defined (chord toggle active), non-chord-tones get faded/dashed treatment
  const faded = isChordTone === false;

  return (
    <div style={{
      width: isRoot ? 34 : faded ? 26 : 28,
      height: isRoot ? 34 : faded ? 26 : 28,
      borderRadius: isRoot ? "6px" : "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: isRoot ? 3 : faded ? 1 : 2,
      cursor: "default",
      background: isRoot ? "rgba(232,78,60,0.40)" : faded ? "rgba(180,180,180,0.08)" : colors.bg,
      border: isRoot ? "2px solid #e84e3c" : faded ? `1.5px dashed ${colors.border}66` : `1.5px solid ${colors.border}`,
      boxShadow: isRoot
        ? "0 0 12px rgba(232,78,60,0.5), inset 0 0 8px rgba(232,78,60,0.2)"
        : faded ? "inset 0 0 4px rgba(180,180,180,0.08)" : "none",
      animation: isRoot ? "rootPulse 2s infinite ease-in-out" : "positionTransition 300ms var(--ease-out-expo)",
      transition: "all 0.25s ease",
      transform: isRoot ? "rotate(45deg)" : "none",
      opacity: faded ? 0.5 : 1,
    }}>
      <span style={{
        transform: isRoot ? "rotate(-45deg)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isRoot ? "0.72rem" : faded ? "0.6rem" : "0.65rem",
        fontWeight: isRoot ? 800 : faded ? 600 : 700,
        color: isRoot ? "#ffb0a8" : faded ? colors.text + "cc" : colors.text,
        fontFamily: "var(--font-mono)",
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
