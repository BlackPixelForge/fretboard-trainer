import { MODES } from "./lib/fretboard";

export default function Tips({ mode }) {
  return (
    <div style={{
      marginTop: 12,
      padding: "14px 18px",
      background: "linear-gradient(135deg, rgba(60,160,220,0.04), rgba(60,160,220,0.01))",
      borderRadius: 10,
      border: "1px solid rgba(60,160,220,0.1)",
    }}>
      <p style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "0.72rem",
        color: "#556",
        margin: 0,
        lineHeight: 1.6,
      }}>
        {mode === MODES.EXPLORE && (
          <>
            <strong style={{ color: "#3ca0dc" }}>Explore Mode:</strong> Click any note dot to reveal/hide it. Use <em>Hide All</em> to blank the fretboard and test yourself by clicking to reveal. Toggle <em>Scale Degrees</em> to see interval numbers. Focus on one string or region at a time for deeper learning.
          </>
        )}
        {mode === MODES.QUIZ_IDENTIFY && (
          <>
            <strong style={{ color: "#ffc832" }}>Name the Note Quiz:</strong> You{"'"}re given a note name — find and click every occurrence on the fretboard. Use the string and region filters to focus your practice on specific areas. Build your streak!
          </>
        )}
        {mode === MODES.QUIZ_FIND && (
          <>
            <strong style={{ color: "#ffc832" }}>Find the Note Quiz:</strong> A position is highlighted on the fretboard — select the correct note name from the answer bubbles below the question. After answering, the correct choice lights up green. Build your streak!
          </>
        )}
      </p>
    </div>
  );
}
