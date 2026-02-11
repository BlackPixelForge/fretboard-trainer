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
        color: "#889",
        margin: 0,
        lineHeight: 1.6,
      }}>
        {mode === MODES.EXPLORE && (
          <>
            <strong style={{ color: "#3ca0dc" }}>Explore Mode:</strong> Click any note dot to reveal/hide it. Use <em>Hide All</em> to blank the fretboard and test yourself by clicking to reveal. Toggle <em>Scale Degrees</em> to see interval numbers. Focus on one string or region at a time for deeper learning.
          </>
        )}
        {mode === MODES.SCALE_POSITIONS && (
          <>
            <strong style={{ color: "#e84e3c" }}>Scale Positions:</strong> Navigate 9 scale positions by root string and finger — e.g. 6(4) means root on string 6 with finger 4. Each position covers a 4-fret span. Toggle <em>Fingering</em> to see finger numbers (1=Index, 2=Middle, 3=Ring, 4=Pinky). Use the arrow buttons to step through positions.
          </>
        )}
        {mode === MODES.CAGED && (
          <>
            <strong style={{ color: "#3ca0dc" }}>CAGED System:</strong> See how the 5 open chord shapes (C, A, G, E, D) tile across the entire fretboard. Filled dots are chord tones (R=Root, 3=Third, 5=Fifth). Toggle <em>Scale Tones</em> to see the surrounding scale notes. Select individual shapes to focus on one at a time.
          </>
        )}
        {mode === MODES.INTERVALS && (
          <>
            <strong style={{ color: "#50be50" }}>Interval Trainer:</strong> See notes as interval labels (R, 2, 3...) instead of note names. Filter specific intervals to focus on finding them across the fretboard. Enable <em>Quiz</em> mode to test your interval recognition — identify the interval at a highlighted position.
          </>
        )}
        {mode === MODES.ONE_FRET_RULE && (
          <>
            <strong style={{ color: "#d4a017" }}>One Fret Rule:</strong> At any fret position, the 7 scale forms produce 7 different keys. Shift one fret and you cover all 12 keys. Pick a fret, then use <em>left/right arrow keys</em> or the {"<"}/{">"}  buttons to step through all 7 forms and see each key. The root fret and string update as you go.
          </>
        )}
        {mode === MODES.TRIADS && (
          <>
            <strong style={{ color: "#e84e3c" }}>Triads:</strong> Step through 48 movable triad shapes &mdash; 4 qualities (Major, Minor, Dim, Aug) across 4 string sets. Use <em>arrow keys</em> or the {"<"}/{">"} buttons to navigate. Toggle <em>Notes</em> to see note names, or <em>Fingering</em> for finger numbers. Switch inversions to see Root Position, 1st, and 2nd inversion voicings.
          </>
        )}
        {mode === MODES.QUIZ_IDENTIFY && (
          <>
            <strong style={{ color: "#ffc832" }}>Find Note Quiz:</strong> You{"'"}re given a note name — click every fret position where you think that note lives. Selected positions show a gold <strong>?</strong> marker (click again to deselect). When ready, hit <em>Finish Selections</em> to reveal results: green = correct, red = wrong, amber pulsing = missed. Use string and region filters to narrow your focus.
          </>
        )}
        {mode === MODES.QUIZ_FIND && (
          <>
            <strong style={{ color: "#ffc832" }}>Name Note Quiz:</strong> A position is highlighted on the fretboard — select the correct note name from the answer bubbles below the question. After answering, the correct choice lights up green. Build your streak!
          </>
        )}
      </p>
    </div>
  );
}
