import { useState } from "react";
import { INVERSIONS, TRIAD_SHAPES } from "./lib/triads";
import { getTriadColor } from "./lib/colors";

const INTERVAL_PILL_STYLE = (interval, isRoot) => {
  const colors = getTriadColor(interval, isRoot);
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "1px 6px", borderRadius: isRoot ? 3 : 10,
    background: colors.bg, border: `1.5px solid ${colors.border}`,
    fontSize: "0.65rem", fontWeight: 700, color: colors.text,
    fontFamily: "var(--font-mono)",
  };
};

function Section({ title, defaultOpen, highlight, children }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div style={{
      borderBottom: "1px solid #1a1a28",
    }}>
      <button
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 0", background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 600,
          color: highlight ? "#ffa09a" : "#c8ccd4",
          transition: "color 0.2s",
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: "0.65rem", color: "#555", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          ▼
        </span>
      </button>
      {open && (
        <div style={{
          paddingBottom: 14,
          animation: "slideDown 0.2s ease",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

const textStyle = {
  fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "#999",
  lineHeight: 1.7, margin: 0,
};

const strongStyle = { color: "#c8ccd4", fontWeight: 600 };
const emStyle = { color: "#bbb", fontStyle: "italic" };

export default function TriadExplainer({ triadState }) {
  const [panelOpen, setPanelOpen] = useState(false);

  const invKey = INVERSIONS[triadState.inversionIndex];
  const currentShape = TRIAD_SHAPES[invKey]?.[triadState.shapeIndex];
  const currentQuality = currentShape?.quality || "major";
  const currentStringSetIndex = currentShape?.stringSetIndex ?? 0;

  if (!panelOpen) {
    return (
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => setPanelOpen(true)}
          aria-label="Open triad theory guide"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px",
            background: "linear-gradient(135deg, rgba(232,78,60,0.06), rgba(232,78,60,0.02))",
            border: "1px solid rgba(232,78,60,0.15)", borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 500,
            color: "#e8907a", cursor: "pointer",
            transition: `all var(--duration-normal) var(--ease-smooth)`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
          }}
        >
          <span style={{ fontSize: "0.8rem" }}>📖</span>
          Learn About Triads
        </button>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: 12,
      padding: "14px 18px",
      background: "linear-gradient(180deg, #10101a, var(--surface-base))",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      animation: "slideDown 300ms var(--ease-out-expo)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.2)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.82rem", fontWeight: 700, color: "#c8ccd4" }}>
          Triad Theory Guide
        </span>
        <button
          onClick={() => setPanelOpen(false)}
          aria-label="Close triad theory guide"
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "#555",
            padding: "4px 8px",
          }}
        >
          Close ✕
        </button>
      </div>

      {/* Section 1 */}
      <Section title="What Is a Triad?" defaultOpen={true}>
        <p style={textStyle}>
          <strong style={{ ...strongStyle, color: "#ffa09a" }}>A triad is a three-note chord — the most fundamental building block of harmony on the guitar.</strong>
        </p>
        <p style={{ ...textStyle, marginTop: 10 }}>
          Every triad is built by stacking two intervals on top of a root note. The three notes are:
        </p>
        <ul style={{ ...textStyle, paddingLeft: 18, marginTop: 8 }}>
          <li style={{ marginBottom: 4 }}>
            <span style={INTERVAL_PILL_STYLE("R", true)}>R</span>{" "}
            <strong style={strongStyle}>Root:</strong> The note the chord is named after. In a C Major triad, C is the root.
          </li>
          <li style={{ marginBottom: 4 }}>
            <span style={INTERVAL_PILL_STYLE("3", false)}>3rd</span>{" "}
            <strong style={strongStyle}>Third:</strong> Determines whether the chord sounds major (happy/bright) or minor (sad/dark).
          </li>
          <li style={{ marginBottom: 4 }}>
            <span style={INTERVAL_PILL_STYLE("5", false)}>5th</span>{" "}
            <strong style={strongStyle}>Fifth:</strong> Provides stability and fullness. Altering the 5th creates tension.
          </li>
        </ul>
        <p style={{ ...textStyle, marginTop: 8 }}>
          Together, these three notes — Root, Third, and Fifth — form every major, minor, diminished, and augmented chord you{"'"}ll ever play.
        </p>
      </Section>

      {/* Section 2 */}
      <Section title="The Four Triad Qualities" highlight={false}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              key: "major", label: "Major", formula: "R - 3 - 5",
              intervals: [["R", true], ["3", false], ["5", false]],
              desc: 'The "default" triad. Sounds bright, happy, and resolved. Built with a major 3rd (4 half steps above the root) and a perfect 5th (7 half steps above the root).',
              example: "C Major = C, E, G",
            },
            {
              key: "minor", label: "Minor", formula: "R - ♭3 - 5",
              intervals: [["R", true], ["♭3", false], ["5", false]],
              desc: "Lower the 3rd by one half step from a major triad. Sounds darker, sadder, more introspective. The 5th stays the same.",
              example: "C Minor = C, E♭, G",
            },
            {
              key: "diminished", label: "Diminished", formula: "R - ♭3 - ♭5",
              intervals: [["R", true], ["♭3", false], ["♭5", false]],
              desc: "Lower both the 3rd AND the 5th by one half step from major. Sounds tense, unstable, and wants to resolve somewhere.",
              example: "C Diminished = C, E♭, G♭",
            },
            {
              key: "augmented", label: "Augmented", formula: "R - 3 - ♯5",
              intervals: [["R", true], ["3", false], ["♯5", false]],
              desc: "Raise the 5th by one half step from major. The 3rd stays natural. Sounds mysterious, suspended, dreamlike.",
              example: "C Augmented = C, E, G♯",
            },
          ].map(q => {
            const active = q.key === currentQuality;
            return (
              <div key={q.key} style={{
                padding: "10px 12px", borderRadius: 8,
                background: active ? "rgba(232,78,60,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${active ? "rgba(232,78,60,0.25)" : "#1a1a28"}`,
                transition: "all 0.3s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 700,
                    color: active ? "#ffa09a" : "#c8ccd4",
                  }}>
                    {q.label}
                  </span>
                  <span style={{ display: "inline-flex", gap: 3 }}>
                    {q.intervals.map(([iv, isR], i) => (
                      <span key={i} style={INTERVAL_PILL_STYLE(iv, isR)}>{iv}</span>
                    ))}
                  </span>
                  {active && (
                    <span style={{
                      fontSize: "0.55rem", color: "#e84e3c", fontFamily: "var(--font-sans)",
                      fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
                    }}>
                      current
                    </span>
                  )}
                </div>
                <p style={{ ...textStyle, fontSize: "0.68rem", marginTop: 4 }}>{q.desc}</p>
                <p style={{ ...textStyle, fontSize: "0.65rem", marginTop: 4 }}>
                  <em style={emStyle}>Example: {q.example}</em>
                </p>
              </div>
            );
          })}
        </div>

        {/* Transformation diagram */}
        <div style={{
          marginTop: 12, padding: "10px 14px", borderRadius: 8,
          background: "rgba(60,160,220,0.04)", border: "1px solid rgba(60,160,220,0.1)",
        }}>
          <p style={{ ...textStyle, fontSize: "0.65rem", color: "#78c8f0", fontWeight: 600, marginBottom: 8 }}>
            How they relate:
          </p>
          <pre style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem",
            color: "#889", lineHeight: 1.5, margin: 0, whiteSpace: "pre",
            overflowX: "auto",
          }}>
{`         Major (R 3 5)
        /      |       \\
 lower 3rd  lower 3rd   raise 5th
      |     + lower 5th      |
    Minor    Diminished   Augmented
  (R ♭3 5)  (R ♭3 ♭5)   (R 3 ♯5)`}
          </pre>
        </div>
      </Section>

      {/* Section 3 */}
      <Section title="Inversions — Same Notes, Different Order">
        <p style={textStyle}>
          A triad has three notes, and any of them can be the lowest-sounding note. Changing which note is on the bottom is called an <strong style={strongStyle}>inversion</strong>. The notes themselves don{"'"}t change — only their order from low to high.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          {[
            {
              index: 0, label: "Root Position", formula: "R - 3 - 5", bass: "Root on bottom",
              desc: 'The most "grounded" sound. The root is the bass note, giving the chord its strongest sense of identity.',
            },
            {
              index: 1, label: "First Inversion", formula: "3 - 5 - R", bass: "3rd on bottom",
              desc: "The 3rd is now the lowest note. The chord sounds lighter and more melodic. Often used to create smoother movement between chords.",
            },
            {
              index: 2, label: "Second Inversion", formula: "5 - R - 3", bass: "5th on bottom",
              desc: 'The 5th is the bass note. Has a more open, sometimes "floating" quality. Common in classical and fingerstyle playing.',
            },
          ].map(inv => {
            const active = inv.index === triadState.inversionIndex;
            return (
              <div key={inv.index} style={{
                padding: "10px 12px", borderRadius: 8,
                background: active ? "rgba(232,78,60,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${active ? "rgba(232,78,60,0.25)" : "#1a1a28"}`,
                transition: "all 0.3s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 700,
                    color: active ? "#ffa09a" : "#c8ccd4",
                  }}>
                    {inv.label}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#889",
                  }}>
                    {inv.formula}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-sans)", fontSize: "0.58rem", color: "#666",
                  }}>
                    ({inv.bass})
                  </span>
                  {active && (
                    <span style={{
                      fontSize: "0.55rem", color: "#e84e3c", fontFamily: "var(--font-sans)",
                      fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
                    }}>
                      current
                    </span>
                  )}
                </div>
                <p style={{ ...textStyle, fontSize: "0.68rem" }}>{inv.desc}</p>
              </div>
            );
          })}
        </div>
        <p style={{ ...textStyle, marginTop: 10 }}>
          Why learn all three? Because each inversion gives you a <strong style={strongStyle}>different position on the neck</strong> for the same chord. This means you can play a C Major triad in many places — not just one shape — and connect chords smoothly without jumping around the fretboard.
        </p>
      </Section>

      {/* Section 4 */}
      <Section title="String Sets — Covering the Whole Neck">
        <p style={textStyle}>
          The guitar has 6 strings, but a triad only uses 3. By grouping the strings into four overlapping sets of three, we can play triads across the entire neck:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
          {[
            { index: 0, label: "String Set 1", strings: "Strings 6, 5, 4", desc: "the three lowest/thickest strings" },
            { index: 1, label: "String Set 2", strings: "Strings 5, 4, 3", desc: null },
            { index: 2, label: "String Set 3", strings: "Strings 4, 3, 2", desc: null },
            { index: 3, label: "String Set 4", strings: "Strings 3, 2, 1", desc: "the three highest/thinnest strings" },
          ].map(ss => {
            const active = ss.index === currentStringSetIndex;
            return (
              <div key={ss.index} style={{
                padding: "8px 12px", borderRadius: 6,
                background: active ? "rgba(232,78,60,0.08)" : "transparent",
                border: `1px solid ${active ? "rgba(232,78,60,0.25)" : "transparent"}`,
                transition: "all 0.3s",
              }}>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600,
                  color: active ? "#ffa09a" : "#c8ccd4",
                }}>
                  {ss.label}:
                </span>{" "}
                <span style={{ ...textStyle, fontSize: "0.68rem" }}>
                  {ss.strings}
                  {ss.desc && <span style={{ color: "#666" }}> ({ss.desc})</span>}
                </span>
                {active && (
                  <span style={{
                    marginLeft: 8, fontSize: "0.55rem", color: "#e84e3c",
                    fontFamily: "var(--font-sans)", fontWeight: 600,
                    letterSpacing: "0.05em", textTransform: "uppercase",
                  }}>
                    current
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p style={{ ...textStyle, marginTop: 10 }}>
          Each string set gives you a unique voicing of the same chord. Lower string sets sound fuller and darker; higher string sets sound brighter and more delicate.
        </p>
        <p style={{ ...textStyle, marginTop: 8 }}>
          <strong style={strongStyle}>The B-string quirk:</strong> Guitar tuning is almost uniform — each string is a perfect 4th (5 frets) above the next — except between strings 3 (G) and 2 (B), which is a major 3rd (4 frets). This means shapes on String Sets 3 and 4 look slightly different from String Sets 1 and 2, even though they produce the same intervals.
        </p>
      </Section>

      {/* Section 5 */}
      <Section title="How Shapes Move Across the Neck">
        <p style={textStyle}>
          Every triad shape in this tool is <strong style={strongStyle}>movable</strong>. The shape stays exactly the same — you just slide it up or down the neck to change the key.
        </p>
        <p style={{ ...textStyle, marginTop: 8 }}>
          For example, if you learn a Major triad shape on String Set 1 and play it with the root at fret 5, that{"'"}s an A Major triad. Slide the same shape so the root is at fret 7, and now it{"'"}s a B Major triad. The finger pattern doesn{"'"}t change — only the starting fret.
        </p>
        <p style={{ ...textStyle, marginTop: 8 }}>
          This is why learning these 48 shapes (4 qualities × 4 string sets × 3 inversions) unlocks the <strong style={strongStyle}>entire fretboard</strong>. For any key, you have 16 different ways to voice the triad, spread across different areas of the neck.
        </p>
      </Section>
    </div>
  );
}
