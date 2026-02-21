import { getCAGEDColor } from "../lib/colors";

export default function CAGEDDot({ letter, isChordTone, type, degree }) {
  const colors = getCAGEDColor(letter, isChordTone);
  const label = isChordTone ? type : String(degree);

  return (
    <div style={{
      width: isChordTone ? 30 : 26,
      height: isChordTone ? 30 : 26,
      borderRadius: type === "R" ? "6px" : "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: isChordTone ? 3 : 1,
      cursor: "default",
      background: colors.bg,
      border: `1.5px ${isChordTone ? "solid" : "dashed"} ${colors.border}`,
      boxShadow: isChordTone && type === "R"
        ? `0 0 10px ${colors.bg}`
        : isChordTone ? "none" : "inset 0 0 4px rgba(180,180,180,0.08)",
      animation: isChordTone ? "positionTransition 300ms var(--ease-out-expo)" : "positionTransition 350ms var(--ease-out-expo)",
      transform: type === "R" ? "rotate(45deg)" : "none",
    }}>
      <span style={{
        transform: type === "R" ? "rotate(-45deg)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isChordTone ? "0.7rem" : "0.6rem",
        fontWeight: isChordTone ? 800 : 600,
        color: colors.text,
        fontFamily: "var(--font-mono)",
        letterSpacing: "-0.02em",
      }}>
        {label}
      </span>
    </div>
  );
}
