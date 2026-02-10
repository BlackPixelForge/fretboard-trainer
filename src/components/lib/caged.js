// CAGED system shapes
// Each shape defined relative to root fret on its anchor string
// si = string index (0=high E, 5=low E), rel = fret offset from root fret

import { STRING_TUNING } from "./music";

export const CAGED_ORDER = ["C", "A", "G", "E", "D"];

const SHAPES = {
  E: {
    rootString: 5,
    chordTones: [
      { si: 5, rel: 0, type: "R" },
      { si: 4, rel: 2, type: "5" },
      { si: 3, rel: 2, type: "R" },
      { si: 2, rel: 1, type: "3" },
      { si: 1, rel: 0, type: "5" },
      { si: 0, rel: 0, type: "R" },
    ],
    scaleTones: [
      { si: 5, rel: 2, degree: 2 },
      { si: 4, rel: 0, degree: 4 },
      { si: 3, rel: 1, degree: 7 },
      { si: 2, rel: 2, degree: 4 },
      { si: 1, rel: 2, degree: 6 },
      { si: 0, rel: 2, degree: 2 },
    ],
  },
  A: {
    rootString: 4,
    chordTones: [
      { si: 4, rel: 0, type: "R" },
      { si: 3, rel: 2, type: "5" },
      { si: 2, rel: 2, type: "R" },
      { si: 1, rel: 2, type: "3" },
      { si: 0, rel: 0, type: "5" },
    ],
    scaleTones: [
      { si: 5, rel: 0, degree: 5 },
      { si: 5, rel: 2, degree: 6 },
      { si: 5, rel: 4, degree: 7 },
      { si: 4, rel: 2, degree: 2 },
      { si: 4, rel: 4, degree: 3 },
      { si: 3, rel: 4, degree: 6 },
      { si: 2, rel: 1, degree: 7 },
      { si: 1, rel: 0, degree: 2 },
      { si: 1, rel: 3, degree: 4 },
      { si: 0, rel: 2, degree: 6 },
      { si: 0, rel: 4, degree: 7 },
    ],
  },
  G: {
    rootString: 5,
    chordTones: [
      { si: 5, rel: 0, type: "R" },
      { si: 4, rel: -1, type: "3" },
      { si: 3, rel: -3, type: "5" },
      { si: 2, rel: -3, type: "R" },
      { si: 1, rel: -3, type: "3" },
      { si: 0, rel: 0, type: "R" },
    ],
    scaleTones: [
      { si: 5, rel: -3, degree: 6 },
      { si: 5, rel: -1, degree: 7 },
      { si: 4, rel: -3, degree: 2 },
      { si: 3, rel: -1, degree: 6 },
      { si: 2, rel: -1, degree: 2 },
      { si: 1, rel: 0, degree: 5 },
      { si: 0, rel: -3, degree: 6 },
      { si: 0, rel: -1, degree: 7 },
    ],
  },
  C: {
    rootString: 4,
    chordTones: [
      { si: 4, rel: 0, type: "R" },
      { si: 3, rel: -1, type: "3" },
      { si: 2, rel: -3, type: "5" },
      { si: 1, rel: -2, type: "R" },
      { si: 0, rel: -3, type: "3" },
    ],
    scaleTones: [
      { si: 5, rel: -3, degree: 3 },
      { si: 5, rel: -2, degree: 4 },
      { si: 5, rel: 0, degree: 5 },
      { si: 4, rel: -3, degree: 6 },
      { si: 4, rel: -1, degree: 7 },
      { si: 3, rel: -3, degree: 2 },
      { si: 2, rel: -1, degree: 6 },
      { si: 1, rel: -3, degree: 7 },
      { si: 1, rel: 0, degree: 2 },
      { si: 0, rel: 0, degree: 5 },
    ],
  },
  D: {
    rootString: 3,
    chordTones: [
      { si: 3, rel: 0, type: "R" },
      { si: 2, rel: 2, type: "5" },
      { si: 1, rel: 3, type: "R" },
      { si: 0, rel: 2, type: "3" },
    ],
    scaleTones: [
      { si: 5, rel: 0, degree: 2 },
      { si: 5, rel: 2, degree: 3 },
      { si: 5, rel: 3, degree: 4 },
      { si: 4, rel: 0, degree: 5 },
      { si: 4, rel: 2, degree: 6 },
      { si: 4, rel: 3, degree: 7 },
      { si: 3, rel: 2, degree: 2 },
      { si: 2, rel: 0, degree: 4 },
      { si: 1, rel: 0, degree: 6 },
      { si: 0, rel: 0, degree: 2 },
    ],
  },
};

/**
 * Get all 5 CAGED shapes tiled across the fretboard for a given root.
 * rootNoteIndex: 0-11 (C=0)
 * Returns array of { letter, chordTones: [{si, fret, type}], scaleTones: [{si, fret, degree}] }
 */
export function getCAGEDShapes(rootNoteIndex) {
  return CAGED_ORDER.map((letter) => {
    const shape = SHAPES[letter];
    const openNote = STRING_TUNING[shape.rootString].note;
    const rootFret = (rootNoteIndex - openNote + 12) % 12;

    const chordTones = [];
    const scaleTones = [];

    // Generate at base octave and +12 to tile across frets 0-15
    for (const base of [rootFret, rootFret + 12]) {
      for (const t of shape.chordTones) {
        const fret = base + t.rel;
        if (fret >= 0 && fret <= 15) {
          chordTones.push({ si: t.si, fret, type: t.type });
        }
      }
      for (const t of shape.scaleTones) {
        const fret = base + t.rel;
        if (fret >= 0 && fret <= 15) {
          scaleTones.push({ si: t.si, fret, degree: t.degree });
        }
      }
    }

    return { letter, chordTones, scaleTones };
  });
}

/**
 * Check if a fret position belongs to a CAGED shape.
 * Returns { letter, isChordTone, type, degree } or null.
 * If selectedShape is "all", checks all shapes and returns the first match.
 */
export function getCAGEDInfo(stringIndex, fret, rootNoteIndex, selectedShape) {
  const shapes = getCAGEDShapes(rootNoteIndex);

  const shapesToCheck =
    selectedShape === "all"
      ? shapes
      : shapes.filter((s) => s.letter === selectedShape);

  for (const shape of shapesToCheck) {
    for (const ct of shape.chordTones) {
      if (ct.si === stringIndex && ct.fret === fret) {
        return { letter: shape.letter, isChordTone: true, type: ct.type, degree: null };
      }
    }
    for (const st of shape.scaleTones) {
      if (st.si === stringIndex && st.fret === fret) {
        return { letter: shape.letter, isChordTone: false, type: null, degree: st.degree };
      }
    }
  }

  return null;
}
