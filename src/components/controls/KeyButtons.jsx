// Chromatic root selector: 7 natural note buttons + sharp/flat modifier
// rootNote: 0-11 (C=0), onRootChange: (index) => void

const NATURALS = [
  { name: "C", index: 0 },
  { name: "D", index: 2 },
  { name: "E", index: 4 },
  { name: "F", index: 5 },
  { name: "G", index: 7 },
  { name: "A", index: 9 },
  { name: "B", index: 11 },
];

// E and B have no standard sharp; C and F have no standard flat
const NO_SHARP = new Set([4, 11]); // E, B
const NO_FLAT = new Set([0, 5]);   // C, F

function decomposeRoot(rootNote) {
  // Find which natural + accidental produces this rootNote
  for (const nat of NATURALS) {
    if (nat.index === rootNote) return { natural: nat.index, accidental: null };
    if (!NO_SHARP.has(nat.index) && (nat.index + 1) % 12 === rootNote) return { natural: nat.index, accidental: "sharp" };
    if (!NO_FLAT.has(nat.index) && (nat.index + 11) % 12 === rootNote) return { natural: nat.index, accidental: "flat" };
  }
  // Fallback: treat as sharp of preceding natural
  for (const nat of NATURALS) {
    if ((nat.index + 1) % 12 === rootNote) return { natural: nat.index, accidental: "sharp" };
  }
  return { natural: 0, accidental: null };
}

export default function KeyButtons({ rootNote, onRootChange }) {
  const { natural, accidental } = decomposeRoot(rootNote);

  const handleNatural = (natIndex) => {
    // If currently has an accidental and the new natural supports it, keep it
    if (accidental === "sharp" && !NO_SHARP.has(natIndex)) {
      onRootChange((natIndex + 1) % 12);
    } else if (accidental === "flat" && !NO_FLAT.has(natIndex)) {
      onRootChange((natIndex + 11) % 12);
    } else {
      onRootChange(natIndex);
    }
  };

  const handleAccidental = (type) => {
    if (type === accidental) {
      // Toggle off → go to natural
      onRootChange(natural);
    } else if (type === "sharp" && !NO_SHARP.has(natural)) {
      onRootChange((natural + 1) % 12);
    } else if (type === "flat" && !NO_FLAT.has(natural)) {
      onRootChange((natural + 11) % 12);
    }
  };

  const sharpDisabled = NO_SHARP.has(natural);
  const flatDisabled = NO_FLAT.has(natural);

  return (
    <>
      <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
      <span style={{ fontSize: "0.65rem", color: "#777", fontFamily: "'Outfit', sans-serif", marginRight: 2 }}>Key:</span>
      {NATURALS.map(({ name, index }) => {
        const active = natural === index;
        return (
          <button key={name} onClick={() => handleNatural(index)} style={{
            minWidth: 26, height: 26, borderRadius: "50%",
            border: `1px solid ${active ? "#f0c83266" : "#1e1e2e"}`,
            background: active ? "rgba(240,200,50,0.18)" : "#0e0e16",
            color: active ? "#f0d060" : "#666",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px", transition: "all 0.2s",
          }}>{name}</button>
        );
      })}
      <span style={{ width: 1, height: 16, background: "#1e1e2e", margin: "0 2px" }} />
      {/* Sharp button */}
      <button
        onClick={() => handleAccidental("sharp")}
        disabled={sharpDisabled}
        style={{
          minWidth: 22, height: 22, borderRadius: 4,
          border: `1px solid ${accidental === "sharp" ? "#f0c83266" : "#1e1e2e"}`,
          background: accidental === "sharp" ? "rgba(240,200,50,0.18)" : "#0e0e16",
          color: sharpDisabled ? "#333" : accidental === "sharp" ? "#f0d060" : "#666",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem", fontWeight: 700, cursor: sharpDisabled ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 3px", transition: "all 0.2s",
          opacity: sharpDisabled ? 0.4 : 1,
        }}
      >#</button>
      {/* Flat button */}
      <button
        onClick={() => handleAccidental("flat")}
        disabled={flatDisabled}
        style={{
          minWidth: 22, height: 22, borderRadius: 4,
          border: `1px solid ${accidental === "flat" ? "#f0c83266" : "#1e1e2e"}`,
          background: accidental === "flat" ? "rgba(240,200,50,0.18)" : "#0e0e16",
          color: flatDisabled ? "#333" : accidental === "flat" ? "#f0d060" : "#666",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem", fontWeight: 700, cursor: flatDisabled ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 3px", transition: "all 0.2s",
          opacity: flatDisabled ? 0.4 : 1,
        }}
      >b</button>
    </>
  );
}
