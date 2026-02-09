import { SCALE_DEGREES, getNoteName } from "./lib/music";
import { getNoteColor } from "./lib/colors";

export default function Legend({ keyNotes, rootNote, highlightRoot, mode, quizNote }) {
  return (
    <div style={{
      marginTop: 16,
      display: "flex",
      flexWrap: "wrap",
      gap: "8px 16px",
      padding: "12px 16px",
      background: "#0e0e16",
      borderRadius: 10,
      border: "1px solid #1a1a28",
    }}>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", color: "#444", marginRight: 4 }}>Scale Degrees:</span>
      {SCALE_DEGREES.map((d, i) => {
        const noteIndex = keyNotes[i];
        const colors = getNoteColor(noteIndex, keyNotes, rootNote, highlightRoot, mode, quizNote, -1, -1);
        return (
          <span key={d} style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: "0.68rem", fontFamily: "'JetBrains Mono', monospace",
          }}>
            <span style={{
              width: 16, height: 16, borderRadius: "50%",
              background: colors.bg, border: `1.5px solid ${colors.border}`,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.55rem", fontWeight: 700, color: colors.text,
            }}>{d}</span>
            <span style={{ color: "#555" }}>{getNoteName(noteIndex)}</span>
          </span>
        );
      })}
    </div>
  );
}
