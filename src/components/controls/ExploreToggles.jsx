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
      borderRadius: 6,
      border: `1px solid ${toggle.val ? "#3ca0dc66" : "#1e1e2e"}`,
      background: toggle.val ? "rgba(60,160,220,0.18)" : "#0e0e16",
      color: toggle.val ? "#78c8f0" : "#777",
      fontFamily: "'Outfit', sans-serif",
      fontSize: "0.68rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
    }}>{toggle.label}</button>
  );

  if (renderSection === "primary") {
    return <>{primaryToggles.map(renderToggle)}</>;
  }

  if (renderSection === "secondary") {
    return (
      <>
        {secondaryToggles.map(renderToggle)}
        <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
        <button onClick={onResetRevealed} style={{
          padding: "5px 10px", borderRadius: 6, border: "1px solid #1e1e2e",
          background: "#0e0e16", color: "#777",
          fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", fontWeight: 500, cursor: "pointer",
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
      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
      <button onClick={onResetRevealed} style={{
        padding: "5px 10px", borderRadius: 6, border: "1px solid #1e1e2e",
        background: "#0e0e16", color: "#777",
        fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", fontWeight: 500, cursor: "pointer",
      }}>Reset Revealed</button>
    </>
  );
}
