import { INTERVAL_LABELS, INTERVAL_NAMES } from "../lib/intervals";

const DEGREES = [1, 2, 3, 4, 5, 6, 7];

export default function IntervalControls({ intervalState, updateInterval, renderSection }) {
  const { showIntervals, intervalFilter, quizMode } = intervalState;

  const primaryControls = (
    <>
      <button
        onClick={() => updateInterval({ showIntervals: !showIntervals })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${showIntervals ? "#3ca0dc66" : "#1e1e2e"}`,
          background: showIntervals ? "rgba(60,160,220,0.18)" : "#0e0e16",
          color: showIntervals ? "#78c8f0" : "#777",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {showIntervals ? "Intervals" : "Note Names"}
      </button>

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <button
        onClick={() => updateInterval({ quizMode: !quizMode })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${quizMode ? "#ffc83266" : "#1e1e2e"}`,
          background: quizMode ? "rgba(255,200,50,0.18)" : "#0e0e16",
          color: quizMode ? "#ffe080" : "#777",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {quizMode ? "Quiz On" : "Quiz Off"}
      </button>
    </>
  );

  const degreeFilters = (
    <>
      <span style={{ fontSize: "0.6rem", color: "#777", fontFamily: "var(--font-sans)" }}>Filter:</span>

      {DEGREES.map((d) => {
        const active = intervalFilter.has(d);
        return (
          <button
            key={d}
            onClick={() => {
              const next = new Set(intervalFilter);
              if (next.has(d)) next.delete(d);
              else next.add(d);
              updateInterval({ intervalFilter: next });
            }}
            title={INTERVAL_NAMES[d]}
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: `1px solid ${active ? "#50be5066" : "#1e1e2e"}`,
              background: active ? "rgba(80,190,80,0.20)" : "#0e0e16",
              color: active ? "#80e080" : "#666",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "all 0.2s",
            }}
          >
            {INTERVAL_LABELS[d]}
          </button>
        );
      })}
    </>
  );

  if (renderSection === "primary") return primaryControls;
  if (renderSection === "secondary") return degreeFilters;

  return (
    <>
      {primaryControls}
      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
      {degreeFilters}
    </>
  );
}
