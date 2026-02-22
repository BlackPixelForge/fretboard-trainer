import { INTERVAL_LABELS, INTERVAL_NAMES } from "../lib/intervals";

const DEGREES = [1, 2, 3, 4, 5, 6, 7];

const EMBEDDED_INTERVALS_ALLOWED = new Set([1, 5]);

export default function IntervalControls({ intervalState, updateInterval, renderSection, embedded }) {
  const { showIntervals, intervalFilter, quizMode } = intervalState;

  const primaryControls = (
    <>
      <button
        onClick={() => updateInterval({ showIntervals: !showIntervals })}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${showIntervals ? "rgba(60,160,220,0.35)" : "var(--border-muted)"}`,
          background: showIntervals ? "var(--accent-blue-glow)" : "var(--surface-base)",
          color: showIntervals ? "var(--accent-blue-text)" : "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: showIntervals
            ? "0 0 12px rgba(60,160,220,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        {showIntervals ? "Intervals" : "Note Names"}
      </button>

      {!embedded && (
      <>
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />

      <button
        onClick={() => updateInterval({ quizMode: !quizMode })}
        style={{
          padding: "5px 10px",
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${quizMode ? "rgba(255,200,50,0.35)" : "var(--border-muted)"}`,
          background: quizMode ? "var(--accent-gold-glow)" : "var(--surface-base)",
          color: quizMode ? "var(--accent-gold-text)" : "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.68rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: `all var(--duration-normal) var(--ease-smooth)`,
          boxShadow: quizMode
            ? "0 0 12px rgba(255,200,50,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        {quizMode ? "Quiz On" : "Quiz Off"}
      </button>
      </>
      )}
    </>
  );

  const degreeFilters = (
    <>
      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Filter:</span>

      {DEGREES.map((d) => {
        const active = intervalFilter.has(d);
        const locked = embedded && !EMBEDDED_INTERVALS_ALLOWED.has(d);
        return (
          <button
            key={d}
            onClick={() => {
              if (locked) return;
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
              border: `1px solid ${active ? "rgba(80,190,80,0.35)" : "var(--border-muted)"}`,
              background: active ? "var(--accent-green-glow)" : "var(--surface-base)",
              color: active ? "var(--accent-green-text)" : "#666",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              fontWeight: 600,
              cursor: locked ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: `all var(--duration-normal) var(--ease-smooth)`,
              opacity: locked ? 0.35 : 1,
              boxShadow: active
                ? "0 0 12px rgba(80,190,80,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                : "inset 0 1px 0 rgba(255,255,255,0.02)",
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
      <span style={{ width: 1, height: 20, background: "var(--border-muted)", margin: "0 4px" }} />
      {degreeFilters}
    </>
  );
}
