import { DIATONIC_KEYS } from "../lib/music";

export default function KeySelector({ selectedKey, onKeyChange }) {
  return (
    <select value={selectedKey} onChange={e => onKeyChange(e.target.value)} style={{
      padding: "7px 12px",
      borderRadius: 8,
      border: "1px solid #1e1e2e",
      background: "#14141e",
      color: "#c8ccd4",
      fontFamily: "var(--font-mono)",
      fontSize: "0.72rem",
      cursor: "pointer",
      outline: "none",
    }}>
      {Object.keys(DIATONIC_KEYS).map(k => (
        <option key={k} value={k}>{k}</option>
      ))}
    </select>
  );
}
