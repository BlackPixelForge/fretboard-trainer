import { FRET_COUNT, FRET_MARKERS } from "../lib/fretboard";

export default function FretNumbers() {
  return (
    <div style={{ display: "flex", marginBottom: 8, paddingRight: 16 }}>
      <div style={{ width: 48, flexShrink: 0 }} />
      {Array.from({ length: FRET_COUNT + 1 }, (_, f) => (
        <div key={f} style={{
          flex: f === 0 ? "0 0 40px" : "1 0 0",
          minWidth: f === 0 ? 40 : 52,
          textAlign: "center",
          fontSize: "0.6rem",
          color: FRET_MARKERS.includes(f) ? "#888" : "#555",
          fontWeight: FRET_MARKERS.includes(f) ? 600 : 400,
          fontFamily: "var(--font-mono)",
        }}>
          {f === 0 ? "" : f}
        </div>
      ))}
    </div>
  );
}
