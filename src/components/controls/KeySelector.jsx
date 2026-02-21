import { DIATONIC_KEYS } from "../lib/music";

const CHEVRON_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23777' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

export default function KeySelector({ selectedKey, onKeyChange }) {
  return (
    <select value={selectedKey} onChange={e => onKeyChange(e.target.value)} style={{
      padding: "7px 28px 7px 12px",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-muted)",
      background: `var(--surface-raised) url("${CHEVRON_SVG}") no-repeat right 10px center`,
      color: "var(--text-primary)",
      fontFamily: "var(--font-mono)",
      fontSize: "0.72rem",
      cursor: "pointer",
      outline: "none",
      appearance: "none",
      WebkitAppearance: "none",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      transition: `all var(--duration-normal) var(--ease-smooth)`,
    }}>
      {Object.keys(DIATONIC_KEYS).map(k => (
        <option key={k} value={k}>{k}</option>
      ))}
    </select>
  );
}
