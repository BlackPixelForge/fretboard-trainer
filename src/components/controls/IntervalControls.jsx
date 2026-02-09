import { INTERVAL_LABELS, INTERVAL_NAMES } from "../lib/intervals";

const DEGREES = [1, 2, 3, 4, 5, 6, 7];

export default function IntervalControls({ intervalState, updateInterval }) {
  const { showIntervals, intervalFilter, quizMode } = intervalState;

  return (
    <>
      <button
        onClick={() => updateInterval({ showIntervals: !showIntervals })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${showIntervals ? "#3ca0dc44" : "#1e1e2e"}`,
          background: showIntervals ? "rgba(60,160,220,0.1)" : "#0e0e16",
          color: showIntervals ? "#3ca0dc" : "#555",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {showIntervals ? "Intervals" : "Note Names"}
      </button>

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
      <span style={{ fontSize: "0.6rem", color: "#444", fontFamily: "'Outfit', sans-serif" }}>Filter:</span>

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
              border: `1px solid ${active ? "#50be5055" : "#1e1e2e"}`,
              background: active ? "rgba(80,190,80,0.12)" : "#0e0e16",
              color: active ? "#50be50" : "#444",
              fontFamily: "'JetBrains Mono', monospace",
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

      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />

      <button
        onClick={() => updateInterval({ quizMode: !quizMode })}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: `1px solid ${quizMode ? "#ffc83244" : "#1e1e2e"}`,
          background: quizMode ? "rgba(255,200,50,0.1)" : "#0e0e16",
          color: quizMode ? "#ffc832" : "#555",
          fontFamily: "'Outfit', sans-serif",
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
}
