"use client";

const DEGREE_COLORS = {
  1: { bg: "rgba(232,78,60,0.40)", border: "#e84e3c" },
  2: { bg: "rgba(230,160,60,0.30)", border: "#e6a03c" },
  3: { bg: "rgba(240,200,50,0.30)", border: "#f0c832" },
  4: { bg: "rgba(80,190,80,0.30)", border: "#50be50" },
  5: { bg: "rgba(60,160,220,0.30)", border: "#3ca0dc" },
  6: { bg: "rgba(140,100,220,0.30)", border: "#8c64dc" },
  7: { bg: "rgba(200,80,160,0.30)", border: "#c850a0" },
};

const CAGED_COLORS = {
  C: { bg: "rgba(140,100,220,0.30)", border: "#8c64dc" },
  A: { bg: "rgba(230,160,60,0.30)", border: "#e6a03c" },
  G: { bg: "rgba(60,160,220,0.30)", border: "#3ca0dc" },
  E: { bg: "rgba(232,78,60,0.30)", border: "#e84e3c" },
  D: { bg: "rgba(80,190,80,0.30)", border: "#50be50" },
};

// String thicknesses (high E to low E)
const STRING_HEIGHTS = [1, 1.2, 1.5, 2, 2.5, 3];

export default function FretboardVisual({
  strings = 6,
  frets = 7,
  dots = [],
  animate = false,
  className = "",
}) {
  const cellW = 72;
  const cellH = 28;
  const padTop = 8;
  const padBottom = 8;
  const padLeft = 8;
  const padRight = 8;
  const boardW = padLeft + frets * cellW + padRight;
  const boardH = padTop + strings * cellH + padBottom;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: boardW,
        maxWidth: "100%",
      }}
    >
      {/* Warm glow behind */}
      <div style={{
        position: "absolute",
        inset: -30,
        background: "radial-gradient(ellipse at center, rgba(210,170,90,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        width: boardW,
        maxWidth: "100%",
        height: boardH,
        background: "linear-gradient(180deg, #1a1510 0%, #15120d 100%)",
        borderRadius: 14,
        border: "1px solid #2a2218",
        boxShadow: "inset 0 2px 20px rgba(0,0,0,0.4), 0 4px 30px rgba(0,0,0,0.3), 0 0 60px rgba(210,170,90,0.03), 0 1px 0 rgba(255,255,255,0.03)",
        overflow: "hidden",
      }}>
        {/* Fret bars */}
        {Array.from({ length: frets + 1 }).map((_, i) => (
          <div key={`fret-${i}`} style={{
            position: "absolute",
            left: padLeft + i * cellW,
            top: padTop,
            width: i === 0 ? 4 : 2,
            height: strings * cellH,
            background: i === 0 ? "#8b7355" : "#2a2218",
            zIndex: 1,
          }} />
        ))}

        {/* Strings */}
        {Array.from({ length: strings }).map((_, si) => (
          <div key={`string-${si}`} style={{
            position: "absolute",
            left: padLeft,
            top: padTop + si * cellH + cellH / 2,
            width: frets * cellW,
            height: STRING_HEIGHTS[si],
            background: `linear-gradient(90deg, #a89070, #8b7355)`,
            zIndex: 2,
            opacity: 0.7,
          }} />
        ))}

        {/* Dots */}
        {dots.map((dot, i) => {
          const isRoot = dot.isRoot;
          const colors = dot.cagedShape
            ? CAGED_COLORS[dot.cagedShape] || DEGREE_COLORS[1]
            : DEGREE_COLORS[dot.degree || 1] || DEGREE_COLORS[1];

          const size = isRoot ? 30 : 24;
          const x = padLeft + (dot.fret - 0.5) * cellW - size / 2;
          const y = padTop + dot.string * cellH + cellH / 2 - size / 2;

          // Animation: stagger by string (strum effect) then by fret
          const delay = animate
            ? dot.string * 50 + dot.fret * 30
            : 0;

          return (
            <div key={`dot-${i}`} style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: isRoot ? 6 : "50%",
              background: isRoot ? "rgba(232,78,60,0.40)" : colors.bg,
              border: isRoot ? "2px solid #e84e3c" : `1.5px solid ${colors.border}`,
              boxShadow: isRoot
                ? "0 0 12px rgba(232,78,60,0.5), inset 0 0 8px rgba(232,78,60,0.2)"
                : `0 0 8px ${colors.bg}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              transform: isRoot ? "rotate(45deg)" : "none",
              animation: animate
                ? `${isRoot ? "heroStrumDiamond" : "heroStrum"} 400ms var(--ease-spring) ${delay}ms both`
                : "none",
            }}>
              {dot.label && (
                <span style={{
                  transform: isRoot ? "rotate(-45deg)" : "none",
                  fontSize: isRoot ? "0.65rem" : "0.6rem",
                  fontWeight: isRoot ? 800 : 700,
                  color: isRoot ? "#ffb0a8" : colors.border,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "-0.02em",
                  opacity: 0.9,
                }}>
                  {dot.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
