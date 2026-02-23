import { STRING_TUNING, getNoteAt } from "./music";
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
  if (positionIndex < 0 || positionIndex >= FORMS.length) return null;
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
  // If any note in the form would land at a negative fret, shift up one octave
  const minOffset = Math.min(...form.notes.map(n => n.offset));
  if (rootFret + minOffset < 0) rootFret += 12;
  return rootFret;
}

/**
 * Get the fret where finger 1 sits for a position in a given key.
 */
export function getPositionFret(rootNoteIndex, positionIndex) {
  if (positionIndex < 0 || positionIndex >= FORMS.length) return null;
  const form = FORMS[positionIndex];
  const rootFret = getRootFret(rootNoteIndex, form);
  let posFret = rootFret - (form.rootFinger - 1);
  if (posFret < 0) posFret += 12;
  return posFret;
}

/**
 * Get all notes for a scale position in a given key.
 * Returns array of { stringIndex, fret, finger, degree }
 */
export function getScalePositionNotes(rootNoteIndex, keyNotes, positionIndex) {
  if (positionIndex < 0 || positionIndex >= FORMS.length) return [];
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
  if (positionIndex < 0 || positionIndex >= FORMS.length) return null;
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
  if (formIndex < 0 || formIndex >= FORMS.length) return null;
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

// --- Diagonal Pentatonic ---

export const PENTATONIC_DEGREES = new Set([1, 2, 3, 5, 6]);

/**
 * Compute diagonal pentatonic sets for a given key.
 * Two fixed groups cover the fretboard using adjacent scale positions:
 *   Group A: form indices 4 (5(2)), 2 (6(4)), optionally 1 (6(2))
 *   Group B: form indices 0 (6(1)), 6 (4(1))
 * Returns { sets: [set1, set2] } where set1 has lower position frets.
 * Each set: { positions: [{ formIndex, positionGroupIndex }], extension: { ... } | null }
 */
export function getDiagonalPentatonicSets(rootNoteIndex, keyNotes) {
  const posFrets = {};
  for (const i of [0, 1, 2, 4, 6]) {
    posFrets[i] = getPositionFret(rootNoteIndex, i);
  }

  // Check if 6(2) (index 1) fits between 6(4) and 6(1)
  const sixTwoFits = posFrets[2] < posFrets[1] && posFrets[1] < posFrets[0];

  const groupAIndices = sixTwoFits ? [4, 2, 1] : [4, 2];
  const groupBIndices = [0, 6];

  // Sort each group by ascending position fret
  groupAIndices.sort((a, b) => posFrets[a] - posFrets[b]);
  groupBIndices.sort((a, b) => posFrets[a] - posFrets[b]);

  const buildPositions = (indices) =>
    indices.map((formIndex, i) => ({ formIndex, positionGroupIndex: i }));

  const computeExtension = (indices, targetStringIndex) => {
    if (indices.length >= 3) return null;

    const targetNoteIndex = keyNotes[2]; // degree 3
    const minFret = Math.min(...indices.map(i => posFrets[i]));
    const maxFret = Math.max(...indices.map(i => posFrets[i])) + 4;
    const midFret = (minFret + maxFret) / 2;

    let bestFret = null;
    let bestDist = Infinity;
    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      if (getNoteAt(targetStringIndex, fret) === targetNoteIndex) {
        const dist = Math.abs(fret - midFret);
        if (dist < bestDist) {
          bestDist = dist;
          bestFret = fret;
        }
      }
    }
    if (bestFret === null) return null;

    // Find nearest position for finger estimation
    let nearestPosFret = posFrets[indices[0]];
    let nearestDist = Infinity;
    let nearestPGI = 0;
    for (let i = 0; i < indices.length; i++) {
      const d = Math.abs(bestFret - posFrets[indices[i]]);
      if (d < nearestDist) {
        nearestDist = d;
        nearestPosFret = posFrets[indices[i]];
        nearestPGI = i;
      }
    }
    const finger = Math.max(1, Math.min(4, bestFret - nearestPosFret + 1));

    return { stringIndex: targetStringIndex, fret: bestFret, degree: 3, positionGroupIndex: nearestPGI, finger };
  };

  const groupA = {
    positions: buildPositions(groupAIndices),
    extension: computeExtension(groupAIndices, 2), // G string (stringIndex 2)
  };
  const groupB = {
    positions: buildPositions(groupBIndices),
    extension: computeExtension(groupBIndices, 1), // B string (stringIndex 1)
  };

  // Set 1 = group with lower min position fret
  const minA = Math.min(...groupAIndices.map(i => posFrets[i]));
  const minB = Math.min(...groupBIndices.map(i => posFrets[i]));

  const set1 = minA <= minB ? groupA : groupB;
  const set2 = minA <= minB ? groupB : groupA;

  return { sets: [set1, set2] };
}
