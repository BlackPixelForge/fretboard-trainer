import { getScaleDegree } from "./music";

const DEGREE_COLORS = {
  "1": { bg: "rgba(232,78,60,0.30)", border: "#e84e3c", text: "#ffa09a" },
  "2": { bg: "rgba(230,160,60,0.30)", border: "#e6a03c", text: "#f0c878" },
  "3": { bg: "rgba(240,200,50,0.30)", border: "#f0c832", text: "#f5dc6e" },
  "4": { bg: "rgba(80,190,80,0.30)", border: "#50be50", text: "#80e080" },
  "5": { bg: "rgba(60,160,220,0.30)", border: "#3ca0dc", text: "#78c8f0" },
  "6": { bg: "rgba(140,100,220,0.30)", border: "#8c64dc", text: "#b098e8" },
  "7": { bg: "rgba(200,80,160,0.30)", border: "#c850a0", text: "#e088c8" },
};

const DEFAULT_COLOR = { bg: "rgba(180,180,180,0.2)", border: "#999", text: "#ccc" };

export const CAGED_SHAPE_COLORS = {
  C: { bg: "rgba(140,100,220,0.30)", border: "#8c64dc", text: "#b098e8" },
  A: { bg: "rgba(230,160,60,0.30)", border: "#e6a03c", text: "#f0c878" },
  G: { bg: "rgba(60,160,220,0.30)", border: "#3ca0dc", text: "#78c8f0" },
  E: { bg: "rgba(232,78,60,0.30)", border: "#e84e3c", text: "#ffa09a" },
  D: { bg: "rgba(80,190,80,0.30)", border: "#50be50", text: "#80e080" },
};

export function getScalePositionColor(degree, isRoot) {
  if (isRoot) {
    return { bg: "rgba(232,78,60,0.40)", border: "#e84e3c", text: "#ffa09a" };
  }
  return DEGREE_COLORS[String(degree)] || DEFAULT_COLOR;
}

export function getCAGEDColor(shapeLetter, isChordTone) {
  const base = CAGED_SHAPE_COLORS[shapeLetter] || DEFAULT_COLOR;
  if (isChordTone) return base;
  return {
    bg: "rgba(180,180,180,0.12)",
    border: base.border + "99",
    text: base.text + "cc",
  };
}

export function getTriadColor(interval, isRoot) {
  if (isRoot) return { bg: "rgba(232,78,60,0.40)", border: "#e84e3c", text: "#ffa09a" };
  if (interval.includes("3")) return DEGREE_COLORS["3"];
  return DEGREE_COLORS["5"];
}

// --- Diagonal Pentatonic position colors ---

export const DIAGONAL_POSITION_COLORS = [
  { bg: "rgba(160,100,240,0.30)", border: "#a064f0", text: "#C8A0F8" },  // Purple
  { bg: "rgba(50,200,150,0.30)",  border: "#32c896", text: "#78E8C0" },  // Teal
  { bg: "rgba(240,170,50,0.30)",  border: "#f0aa32", text: "#F8D080" },  // Amber
];

export function getDiagonalPositionColor(positionGroupIndex, isPentatonic, isRoot) {
  if (isRoot) {
    return { bg: "rgba(232,78,60,0.40)", border: "#e84e3c", text: "#ffa09a" };
  }
  if (!isPentatonic) {
    return { bg: "rgba(180,180,180,0.12)", border: "#999999", text: "#888888" };
  }
  return DIAGONAL_POSITION_COLORS[positionGroupIndex] || DIAGONAL_POSITION_COLORS[0];
}

export function getNoteColor(noteIndex, keyNotes, rootNote, highlightRoot, mode, quizNote, s, f) {
  if (mode === "quiz_find" && quizNote && s === quizNote.string && f === quizNote.fret) {
    return { bg: "rgba(255,200,50,0.30)", border: "#ffc832", text: "#ffe080", glow: "0 0 12px rgba(255,200,50,0.4)" };
  }
  if (highlightRoot && noteIndex === rootNote) {
    return { bg: "rgba(232,78,60,0.30)", border: "#e84e3c", text: "#ffa09a", glow: "0 0 10px rgba(232,78,60,0.3)" };
  }
  const degree = getScaleDegree(noteIndex, keyNotes);
  return DEGREE_COLORS[degree] || DEFAULT_COLOR;
}
