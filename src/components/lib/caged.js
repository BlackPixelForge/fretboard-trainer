// CAGED system shapes
// Each shape has chord tones (R, 3, 5) and surrounding scale tones
// si = string index (0=high E, 5=low E), rel = fret offset from shape anchor

export const CAGED_ORDER = ["C", "A", "G", "E", "D"];

export const CAGED_OFFSETS = { C: 0, A: 3, G: 5, E: 7, D: 10 };

export const CAGED_SHAPES = {
  C: {
    letter: "C",
    chordTones: [
      { si: 0, rel: 0, type: "R" },
      { si: 1, rel: 1, type: "3" },
      { si: 2, rel: 0, type: "5" },
      { si: 3, rel: 2, type: "R" },
      { si: 4, rel: 3, type: "3" },
    ],
    scaleTones: [
      { si: 0, rel: 2, degree: 2 }, { si: 0, rel: 3, degree: 3 },
      { si: 1, rel: 3, degree: 4 },
      { si: 2, rel: 2, degree: 6 }, { si: 2, rel: 3, degree: 7 },
      { si: 3, rel: 0, degree: 6 }, { si: 3, rel: 4, degree: 2 },
      { si: 4, rel: 1, degree: 2 },
      { si: 5, rel: 0, degree: 5 }, { si: 5, rel: 2, degree: 6 }, { si: 5, rel: 3, degree: 7 },
    ],
  },
  A: {
    letter: "A",
    chordTones: [
      { si: 0, rel: 0, type: "R" },
      { si: 1, rel: 2, type: "5" },
      { si: 2, rel: 2, type: "R" },
      { si: 3, rel: 2, type: "5" },
      { si: 4, rel: 0, type: "R" },
    ],
    scaleTones: [
      { si: 0, rel: 2, degree: 2 }, { si: 0, rel: 3, degree: 3 },
      { si: 1, rel: 0, degree: 4 }, { si: 1, rel: 3, degree: 6 },
      { si: 2, rel: -1, degree: 6 }, { si: 2, rel: 1, degree: 7 },
      { si: 3, rel: 0, degree: 4 }, { si: 3, rel: 4, degree: 7 },
      { si: 4, rel: 2, degree: 2 }, { si: 4, rel: 3, degree: 3 },
      { si: 5, rel: 0, degree: 5 }, { si: 5, rel: 2, degree: 6 }, { si: 5, rel: 3, degree: 7 },
    ],
  },
  G: {
    letter: "G",
    chordTones: [
      { si: 0, rel: 3, type: "R" },
      { si: 1, rel: 0, type: "5" },
      { si: 2, rel: 0, type: "R" },
      { si: 3, rel: 0, type: "5" },
      { si: 4, rel: 2, type: "R" },
      { si: 5, rel: 3, type: "R" },
    ],
    scaleTones: [
      { si: 0, rel: 0, degree: 6 }, { si: 0, rel: 1, degree: 7 },
      { si: 1, rel: 2, degree: 6 }, { si: 1, rel: 3, degree: 7 },
      { si: 2, rel: 2, degree: 2 },
      { si: 3, rel: 2, degree: 6 }, { si: 3, rel: 3, degree: 7 },
      { si: 4, rel: 0, degree: 7 },
      { si: 5, rel: 0, degree: 6 }, { si: 5, rel: 1, degree: 7 },
    ],
  },
  E: {
    letter: "E",
    chordTones: [
      { si: 0, rel: 0, type: "R" },
      { si: 1, rel: 0, type: "5" },
      { si: 2, rel: 1, type: "3" },
      { si: 3, rel: 2, type: "R" },
      { si: 4, rel: 2, type: "5" },
      { si: 5, rel: 0, type: "R" },
    ],
    scaleTones: [
      { si: 0, rel: 2, degree: 2 }, { si: 0, rel: 4, degree: 3 },
      { si: 1, rel: 2, degree: 6 }, { si: 1, rel: 4, degree: 7 },
      { si: 2, rel: -1, degree: 2 }, { si: 2, rel: 2, degree: 4 },
      { si: 3, rel: -1, degree: 6 }, { si: 3, rel: 1, degree: 7 },
      { si: 4, rel: -1, degree: 3 }, { si: 4, rel: 1, degree: 4 },
      { si: 5, rel: 2, degree: 2 }, { si: 5, rel: 4, degree: 3 },
    ],
  },
  D: {
    letter: "D",
    chordTones: [
      { si: 0, rel: 3, type: "5" },
      { si: 1, rel: 3, type: "R" },
      { si: 2, rel: 2, type: "5" },
      { si: 3, rel: 0, type: "R" },
    ],
    scaleTones: [
      { si: 0, rel: 0, degree: 3 }, { si: 0, rel: 2, degree: 4 },
      { si: 1, rel: 0, degree: 6 }, { si: 1, rel: 1, degree: 7 },
      { si: 2, rel: 0, degree: 4 }, { si: 2, rel: 4, degree: 7 },
      { si: 3, rel: 2, degree: 2 }, { si: 3, rel: 4, degree: 3 },
      { si: 4, rel: 0, degree: 5 }, { si: 4, rel: 2, degree: 6 }, { si: 4, rel: 3, degree: 7 },
      { si: 5, rel: 0, degree: 3 }, { si: 5, rel: 2, degree: 4 }, { si: 5, rel: 3, degree: 5 },
    ],
  },
};

/**
 * Get all 5 CAGED shapes tiled across the fretboard for a given root.
 * rootNoteIndex: 0-11 (C=0)
 * Returns array of { letter, anchor, chordTones: [{si, fret, type}], scaleTones: [{si, fret, degree}] }
 */
export function getCAGEDShapes(rootNoteIndex) {
  const lowEOpen = 4;
  const baseFret = (rootNoteIndex - lowEOpen + 12) % 12;

  return CAGED_ORDER.map((letter) => {
    const shape = CAGED_SHAPES[letter];
    const anchor = baseFret + CAGED_OFFSETS[letter];

    const chordTones = shape.chordTones
      .map((t) => ({ si: t.si, fret: anchor + t.rel, type: t.type }))
      .filter((t) => t.fret >= 0 && t.fret <= 15);

    const scaleTones = shape.scaleTones
      .map((t) => ({ si: t.si, fret: anchor + t.rel, degree: t.degree }))
      .filter((t) => t.fret >= 0 && t.fret <= 15);

    return { letter, anchor, chordTones, scaleTones };
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
