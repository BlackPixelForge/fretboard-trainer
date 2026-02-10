import { STRING_TUNING } from "../lib/music";

export default function StringToggles({ selectedStrings, onToggleString }) {
  return (
    <>
      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
      <span style={{ fontSize: "0.65rem", color: "#777", fontFamily: "'Outfit', sans-serif", marginRight: 2 }}>Strings:</span>
      {STRING_TUNING.map((st, i) => (
        <button key={i} onClick={() => onToggleString(i)} style={{
          width: 26, height: 26, borderRadius: "50%",
          border: `1px solid ${selectedStrings.has(i) ? "#e84e3c66" : "#1e1e2e"}`,
          background: selectedStrings.has(i) ? "rgba(232,78,60,0.20)" : "#0e0e16",
          color: selectedStrings.has(i) ? "#ffa09a" : "#666",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem", fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 0, transition: "all 0.2s",
        }}>{st.name}</button>
      ))}
    </>
  );
}
