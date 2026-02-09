import { FRET_COUNT, FRET_MARKERS, DOUBLE_MARKERS } from "../lib/fretboard";

export default function FretMarkers() {
  return (
    <div style={{ display: "flex", marginTop: 8, paddingRight: 16 }}>
      <div style={{ width: 48, flexShrink: 0 }} />
      {Array.from({ length: FRET_COUNT + 1 }, (_, f) => (
        <div key={f} style={{
          flex: f === 0 ? "0 0 40px" : "1 0 0",
          minWidth: f === 0 ? 40 : 52,
          display: "flex",
          justifyContent: "center",
          gap: 4,
        }}>
          {FRET_MARKERS.includes(f) && (
            <>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: DOUBLE_MARKERS.includes(f) ? "#4a4030" : "#3a3020",
              }} />
              {DOUBLE_MARKERS.includes(f) && (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4a4030" }} />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
