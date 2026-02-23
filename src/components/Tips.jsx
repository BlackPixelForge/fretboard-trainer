import { MODES } from "./lib/fretboard";

export default function Tips({ mode }) {
  return (
    <div className="p-2.5 sm:px-4 sm:py-3.5" style={{
      marginTop: 12,
      background: "linear-gradient(135deg, rgba(60,160,220,0.04), rgba(60,160,220,0.01))",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid rgba(60,160,220,0.1)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.15)",
      position: "relative",
    }}>
      <p style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.72rem",
        color: "#889",
        margin: 0,
        lineHeight: 1.6,
      }}>
        {mode === MODES.EXPLORE && (
          <>
            <strong style={{ color: "var(--accent-blue)" }}>Explore Mode:</strong> Click any note dot to reveal/hide it. Use <em>Hide All</em> to blank the fretboard and test yourself by clicking to reveal. Toggle <em>Scale Degrees</em> to see interval numbers. Focus on one string or region at a time for deeper learning.
          </>
        )}
        {mode === MODES.SCALE_POSITIONS && (
          <>
            <strong style={{ color: "var(--accent-red)" }}>Scale Positions:</strong> Navigate 7 major scale positions by root string and finger — e.g. 6(4) means root on string 6 with finger 4. Each position covers a 4-fret span. Toggle <em>Fingering</em> to see finger numbers (1=Index, 2=Middle, 3=Ring, 4=Pinky). Use the arrow buttons to step through positions. Enable <em>Diagonal</em> to see the major pentatonic played diagonally across 2–3 adjacent positions — switch <em>Set 1</em> / <em>Set 2</em> (or use arrow keys) to cover the full fretboard.
          </>
        )}
        {mode === MODES.CAGED && (
          <>
            <strong style={{ color: "var(--accent-blue)" }}>CAGED System:</strong> See how the 5 open chord shapes (C, A, G, E, D) tile across the entire fretboard. Filled dots are chord tones (R=Root, 3=Third, 5=Fifth). Toggle <em>Scale Tones</em> to see the surrounding scale notes. Select individual shapes to focus on one at a time.
          </>
        )}
        {mode === MODES.INTERVALS && (
          <>
            <strong style={{ color: "var(--accent-green)" }}>Interval Trainer:</strong> See notes as interval labels (R, 2, 3...) instead of note names. Filter specific intervals to focus on finding them across the fretboard. Enable <em>Quiz</em> mode to test your interval recognition — identify the interval at a highlighted position.
          </>
        )}
        {mode === MODES.ONE_FRET_RULE && (
          <>
            <strong style={{ color: "#d4a017" }}>One Fret Rule:</strong> At any fret, the 7 scale forms produce 7 different keys. Pick the next fret up or down and the 7 forms there fill in the remaining 5 — giving you all 12 keys from just two adjacent frets. Use <em>left/right arrow keys</em> or the {"<"}/{">"}  buttons to step through forms and see each key. The root fret and string update as you go.
          </>
        )}
        {mode === MODES.TRIADS && (
          <>
            <strong style={{ color: "var(--accent-red)" }}>Triads:</strong> Step through 48 movable triad shapes &mdash; 4 qualities (Major, Minor, Dim, Aug) across 4 string sets. Use <em>arrow keys</em> or the {"<"}/{">"} buttons to navigate. Toggle <em>Notes</em> to see note names, or <em>Fingering</em> for finger numbers. Switch inversions to see Root Position, 1st, and 2nd inversion voicings.
          </>
        )}
        {mode === MODES.QUIZ_IDENTIFY && (
          <>
            <strong style={{ color: "var(--accent-gold)" }}>Find Note Quiz:</strong> You{"'"}re given a note name — click every fret position where you think that note lives. Selected positions show a gold <strong>?</strong> marker (click again to deselect). When ready, hit <em>Finish Selections</em> to reveal results: green = correct, red = wrong, amber pulsing = missed. Use string and region filters to narrow your focus.
          </>
        )}
        {mode === MODES.QUIZ_FIND && (
          <>
            <strong style={{ color: "var(--accent-gold)" }}>Name Note Quiz:</strong> A position is highlighted on the fretboard — select the correct note name from the answer bubbles below the question. After answering, the correct choice lights up green. Build your streak!
          </>
        )}
      </p>
    </div>
  );
}
