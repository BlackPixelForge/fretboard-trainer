import { FRET_REGIONS } from "../lib/fretboard";

export default function RegionSelector({ selectedRegion, onRegionChange }) {
  return (
    <select value={selectedRegion} onChange={e => onRegionChange(e.target.value)} style={{
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
      {Object.entries(FRET_REGIONS).map(([k, v]) => (
        <option key={k} value={k}>{v.label}</option>
      ))}
    </select>
  );
}
