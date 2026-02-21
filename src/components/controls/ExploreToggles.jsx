export default function ExploreToggles({
  showNaturals, setShowNaturals,
  showSharps, setShowSharps,
  showDegrees, setShowDegrees,
  highlightRoot, setHighlightRoot,
  hideAll, setHideAll,
  onResetRevealed,
  renderSection,
}) {
  const primaryToggles = [
    { label: "Naturals", val: showNaturals, set: setShowNaturals },
    { label: "Sharps/Flats", val: showSharps, set: setShowSharps },
    { label: "Hide All", val: hideAll, set: setHideAll },
  ];

  const secondaryToggles = [
    { label: "Scale Degrees", val: showDegrees, set: setShowDegrees },
    { label: "Root Highlight", val: highlightRoot, set: setHighlightRoot },
  ];

  const renderToggle = (toggle) => (
    <button key={toggle.label} onClick={() => toggle.set(p => !p)} style={{
      padding: "5px 10px",
      borderRadius: "var(--radius-sm)",
      border: `1px solid ${toggle.val ? "rgba(60,160,220,0.35)" : "var(--border-muted)"}`,
      background: toggle.val ? "var(--accent-blue-glow)" : "var(--surface-base)",
      color: toggle.val ? "var(--accent-blue-text)" : "var(--text-muted)",
      fontFamily: "var(--font-sans)",
      fontSize: "0.68rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: `all var(--duration-normal) var(--ease-smooth)`,
      boxShadow: toggle.val
        ? "0 0 12px rgba(60,160,220,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
        : "inset 0 1px 0 rgba(255,255,255,0.02)",
    }}>{toggle.label}</button>
  );

  if (renderSection === "primary") {
    return <>{primaryToggles.map(renderToggle)}</>;
  }

  if (renderSection === "secondary") {
    return (
      <>
        {secondaryToggles.map(renderToggle)}
        <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
        <button onClick={onResetRevealed} style={{
          padding: "5px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-muted)",
          background: "var(--surface-base)", color: "var(--text-muted)",
          fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 500, cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}>Reset Revealed</button>
      </>
    );
  }

  // Default: render everything (backward compatible)
  const allToggles = [
    { label: "Naturals", val: showNaturals, set: setShowNaturals },
    { label: "Sharps/Flats", val: showSharps, set: setShowSharps },
    { label: "Scale Degrees", val: showDegrees, set: setShowDegrees },
    { label: "Root Highlight", val: highlightRoot, set: setHighlightRoot },
    { label: "Hide All", val: hideAll, set: setHideAll },
  ];

  return (
    <>
      {allToggles.map(renderToggle)}
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
      <button onClick={onResetRevealed} style={{
        padding: "5px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-muted)",
        background: "var(--surface-base)", color: "var(--text-muted)",
        fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 500, cursor: "pointer",
        transition: `all var(--duration-normal) var(--ease-smooth)`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      }}>Reset Revealed</button>
    </>
  );
}
