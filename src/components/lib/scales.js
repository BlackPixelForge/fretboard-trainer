import { STRING_TUNING } from "./music";
import { FRET_COUNT } from "./fretboard";

// Convert guitar string number (1=high E, 6=low E) to stringIndex (0=high E, 5=low E)
function toStringIndex(guitarString) {
  return guitarString - 1;
}

// Build notes array from compact form: array of [guitarString, [offset, degree] pairs...]
function buildNotes(formDef) {
  const notes = [];
  for (const [gs, ...pairs] of formDef) {
    const si = toStringIndex(gs);
    for (const [offset, degree] of pairs) {
      notes.push({ stringIndex: si, offset, degree });
    }
  }
  return notes;
}

// 5 correct major scale form patterns
// Each form: { name, rootStringIndex, rootFinger, notes[] }
// notes[]: { stringIndex, offset, degree } where actualFret = rootFret + offset
export const FORMS = [
  {
    name: "6(1)",
    rootStringIndex: toStringIndex(6), // stringIndex 5
    rootFinger: 1,
    notes: buildNotes([
      [6, [0,1], [2,2], [4,3]],
      [5, [0,4], [2,5], [4,6]],
      [4, [1,7], [2,1], [4,2]],
      [3, [1,3], [2,4], [4,5]],
      [2, [2,6], [4,7]],
      [1, [0,1]],
    ]),
  },
  {
    name: "6(2)",
    rootStringIndex: toStringIndex(6), // stringIndex 5
    rootFinger: 2,
    notes: buildNotes([
      [6, [-1,7], [0,1], [2,2]],
      [5, [-1,3], [0,4], [2,5]],
      [4, [-1,6], [1,7], [2,1]],
      [3, [-1,2], [1,3], [2,4]],
      [2, [0,5], [2,6]],
      [1, [-1,7], [0,1]],
    ]),
  },
  {
    name: "6(4)",
    rootStringIndex: toStringIndex(6), // stringIndex 5
    rootFinger: 4,
    notes: buildNotes([
      [6, [-3,6], [-1,7], [0,1]],
      [5, [-3,2], [-1,3], [0,4]],
      [4, [-3,5], [-1,6]],
      [3, [-4,7], [-3,1], [-1,2]],
      [2, [-3,3], [-2,4], [0,5]],
      [1, [-3,6], [-1,7], [0,1]],
    ]),
  },
  {
    name: "5(1)",
    rootStringIndex: toStringIndex(5), // stringIndex 4
    rootFinger: 1,
    notes: buildNotes([
      [6, [0,5], [2,6], [4,7]],
      [5, [0,1], [2,2], [4,3]],
      [4, [0,4], [2,5], [4,6]],
      [3, [1,7], [2,1], [4,2]],
      [2, [2,3], [3,4], [5,5]],
      [1, [2,6], [4,7], [5,1]],
    ]),
  },
  {
    name: "5(2)",
    rootStringIndex: toStringIndex(5), // stringIndex 4
    rootFinger: 2,
    notes: buildNotes([
      [6, [0,5], [2,6]],
      [5, [-1,7], [0,1], [2,2]],
      [4, [-1,3], [0,4], [2,5]],
      [3, [-1,6], [1,7], [2,1]],
      [2, [0,2], [2,3], [3,4]],
      [1, [0,5], [2,6], [4,7], [5,1]],
    ]),
  },
  {
    name: "5(4)",
    rootStringIndex: toStringIndex(5), // stringIndex 4
    rootFinger: 4,
    notes: buildNotes([
      [6, [-3,3], [-2,4], [0,5]],
      [5, [-3,6], [-1,7], [0,1]],
      [4, [-3,2], [-1,3], [0,4]],
      [3, [-3,5], [-1,6]],
      [2, [-3,7], [-2,1], [0,2]],
      [1, [-3,3], [-2,4], [0,5], [2,6], [4,7], [5,1]],
    ]),
  },
  {
    name: "4(1)",
    rootStringIndex: toStringIndex(4), // stringIndex 3
    rootFinger: 1,
    notes: buildNotes([
      [6, [0,2], [2,3], [3,4]],
      [5, [0,5], [2,6], [4,7]],
      [4, [0,1], [2,2], [4,3]],
      [3, [0,4], [2,5], [4,6]],
      [2, [2,7], [3,1], [5,2]],
      [1, [2,3], [3,4], [5,5], [7,6], [9,7], [10,1]],
    ]),
  },
];

/**
 * Get display label for a position, e.g. "6(1)"
 */
export function getPositionLabel(positionIndex) {
  return FORMS[positionIndex].name;
}

/**
 * Compute the root fret for a form in a given key.
 * rootFret is where the root note sits on the form's root string.
 */
function getRootFret(rootNoteIndex, form) {
  const openNote = STRING_TUNING[form.rootStringIndex].note;
  let rootFret = (rootNoteIndex - openNote + 12) % 12;
  if (rootFret === 0) rootFret = 12; // avoid open string
  return rootFret;
}

/**
 * Get the fret where finger 1 sits for a position in a given key.
 */
export function getPositionFret(rootNoteIndex, positionIndex) {
  const form = FORMS[positionIndex];
  const rootFret = getRootFret(rootNoteIndex, form);
  return rootFret - (form.rootFinger - 1);
}

/**
 * Get all notes for a scale position in a given key.
 * Returns array of { stringIndex, fret, finger, degree }
 */
export function getScalePositionNotes(rootNoteIndex, keyNotes, positionIndex) {
  const form = FORMS[positionIndex];
  const rootFret = getRootFret(rootNoteIndex, form);
  const results = [];

  for (const note of form.notes) {
    const actualFret = rootFret + note.offset;
    if (actualFret < 0 || actualFret > FRET_COUNT) continue;
    const finger = Math.max(1, Math.min(4, note.offset + form.rootFinger));
    results.push({
      stringIndex: note.stringIndex,
      fret: actualFret,
      finger,
      degree: note.degree,
    });
  }

  return results;
}

/**
 * Check if a fret position is in a given scale position.
 * Returns { finger, degree } or null.
 */
export function isInScalePosition(stringIndex, fret, rootNoteIndex, keyNotes, positionIndex) {
  const form = FORMS[positionIndex];
  const rootFret = getRootFret(rootNoteIndex, form);

  for (const note of form.notes) {
    const actualFret = rootFret + note.offset;
    if (actualFret < 0 || actualFret > FRET_COUNT) continue;
    if (note.stringIndex === stringIndex && actualFret === fret) {
      const finger = Math.max(1, Math.min(4, note.offset + form.rootFinger));
      return {
        finger,
        degree: note.degree,
      };
    }
  }

  return null;
}

/**
 * Inverse of getPositionFret: given a position fret (finger 1 fret) and form index,
 * compute the root note index (0–11).
 */
export function getRootNoteForPosition(positionFret, formIndex) {
  const form = FORMS[formIndex];
  const rootFret = positionFret + (form.rootFinger - 1);
  const openNote = STRING_TUNING[form.rootStringIndex].note;
  return (openNote + rootFret) % 12;
}

/**
 * Generate major scale notes (7 note indices) from any root note index
 * using the W-W-H-W-W-W-H interval pattern.
 */
const MAJOR_SCALE_OFFSETS = [0, 2, 4, 5, 7, 9, 11];

export function computeKeyNotes(rootNoteIndex) {
  return MAJOR_SCALE_OFFSETS.map(offset => (rootNoteIndex + offset) % 12);
}
