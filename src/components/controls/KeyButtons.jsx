import { DIATONIC_KEYS } from "../lib/music";

const KEY_LABELS = Object.keys(DIATONIC_KEYS).map(k => ({
  value: k,
  label: k.split(" /")[0].replace(" Major", ""),
}));

export default function KeyButtons({ selectedKey, onKeyChange }) {
  return (
    <>
      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
      <span style={{ fontSize: "0.65rem", color: "#777", fontFamily: "'Outfit', sans-serif", marginRight: 2 }}>Key:</span>
      {KEY_LABELS.map(({ value, label }) => {
        const active = selectedKey === value;
        return (
          <button key={value} onClick={() => onKeyChange(value)} style={{
            minWidth: 26, height: 26, borderRadius: "50%",
            border: `1px solid ${active ? "#f0c83266" : "#1e1e2e"}`,
            background: active ? "rgba(240,200,50,0.18)" : "#0e0e16",
            color: active ? "#f0d060" : "#666",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px", transition: "all 0.2s",
          }}>{label}</button>
        );
      })}
    </>
  );
}
