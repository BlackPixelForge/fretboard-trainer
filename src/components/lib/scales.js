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
 * Returns pre-computed note coordinates instead of position groups.
 * Two alternating patterns create staircase diagonals across the fretboard:
 *   Pattern A: strings 5,3,1 get degrees {5,6}; strings 4,2,0 get degrees {1,2,3}
 *   Pattern B: inverted
 * Returns { sets: [set1, set2] } where set1 has lower min fret.
 * Each set: { notes: [{ stringIndex, fret, degree, finger, positionGroupIndex }, ...] }
 */
export function getDiagonalPentatonicSets(rootNoteIndex, keyNotes) {
  const PENT = new Set([1, 2, 3, 5, 6]);

  function buildDiagonalSet(isPatternA) {
    const notes = [];
    let floorFret = 0;

    // Process strings from low E (si=5) to high E (si=0)
    for (let si = 5; si >= 0; si--) {
      const isOddSi = si % 2 === 1; // si=5,3,1
      const allowedDegrees = isPatternA
        ? (isOddSi ? new Set([5, 6]) : new Set([1, 2, 3]))
        : (isOddSi ? new Set([1, 2, 3]) : new Set([5, 6]));

      // Find all matching frets on this string
      const candidates = [];
      for (let fret = 0; fret <= FRET_COUNT; fret++) {
        const noteIndex = getNoteAt(si, fret);
        const degreeIdx = keyNotes.indexOf(noteIndex);
        if (degreeIdx < 0) continue;
        const degree = degreeIdx + 1;
        if (!allowedDegrees.has(degree)) continue;
        candidates.push({ fret, degree });
      }
      candidates.sort((a, b) => a.fret - b.fret);

      // Filter to >= floorFret and group into contiguous clusters (gap <= 5)
      const valid = candidates.filter(c => c.fret >= floorFret);
      const requiredCount = allowedDegrees.size;
      let selected = selectCluster(valid, requiredCount);
      let isComplete = !!selected;

      // Near fretboard edge: accept partial cluster (>= 2 notes) from strict degrees
      if (!selected) {
        selected = selectCluster(valid, 2);
      }

      // If strict degrees don't have enough, broaden to any pentatonic degree
      if (!selected) {
        const broadCandidates = [];
        for (let fret = floorFret; fret <= FRET_COUNT; fret++) {
          const noteIndex = getNoteAt(si, fret);
          const degreeIdx = keyNotes.indexOf(noteIndex);
          if (degreeIdx < 0) continue;
          const degree = degreeIdx + 1;
          if (!PENT.has(degree)) continue;
          broadCandidates.push({ fret, degree });
        }
        selected = selectCluster(broadCandidates, 2);
      }

      if (!selected) continue;

      const positionGroupIndex = si >= 4 ? 0 : si >= 2 ? 1 : 2;
      for (const c of selected) {
        notes.push({
          stringIndex: si,
          fret: c.fret,
          degree: c.degree,
          finger: 0, // computed below
          positionGroupIndex,
        });
      }
      // Only advance floorFret on complete matches — keeps flexibility near fretboard edge
      if (isComplete) {
        floorFret = Math.min(...selected.map(c => c.fret));
      }
    }

    // Extension on high E (si=0): if only 2 notes, try adding next pentatonic degree
    const highENotes = notes.filter(n => n.stringIndex === 0);
    if (highENotes.length === 2) {
      const maxFret = Math.max(...highENotes.map(n => n.fret));
      const existingDegrees = new Set(highENotes.map(n => n.degree));
      for (let fret = maxFret + 1; fret <= Math.min(maxFret + 3, FRET_COUNT); fret++) {
        const noteIndex = getNoteAt(0, fret);
        const degreeIdx = keyNotes.indexOf(noteIndex);
        if (degreeIdx < 0) continue;
        const degree = degreeIdx + 1;
        if (PENT.has(degree) && !existingDegrees.has(degree)) {
          notes.push({ stringIndex: 0, fret, degree, finger: 0, positionGroupIndex: 2 });
          break;
        }
      }
    }

    // Add faded non-pentatonic notes (degrees 4, 7) within each string's diagonal range
    for (let si = 5; si >= 0; si--) {
      const stringPentNotes = notes.filter(n => n.stringIndex === si);
      if (stringPentNotes.length === 0) continue;
      const minF = Math.min(...stringPentNotes.map(n => n.fret)) - 2;
      const maxF = Math.max(...stringPentNotes.map(n => n.fret)) + 2;
      const pgi = si >= 4 ? 0 : si >= 2 ? 1 : 2;
      for (let fret = Math.max(0, minF); fret <= Math.min(FRET_COUNT, maxF); fret++) {
        const noteIndex = getNoteAt(si, fret);
        const degreeIdx = keyNotes.indexOf(noteIndex);
        if (degreeIdx < 0) continue;
        const degree = degreeIdx + 1;
        if (PENT.has(degree)) continue;
        notes.push({ stringIndex: si, fret, degree, finger: 0, positionGroupIndex: pgi, isPentatonic: false });
      }
    }

    // Compute fingers per string pair (5+4, 3+2, 1+0)
    for (const pair of [[5, 4], [3, 2], [1, 0]]) {
      const pairNotes = notes.filter(n => pair.includes(n.stringIndex));
      if (pairNotes.length === 0) continue;
      const baseFret = Math.min(...pairNotes.map(n => n.fret));
      for (const n of pairNotes) {
        n.finger = Math.max(1, Math.min(4, n.fret - baseFret + 1));
      }
    }

    return { notes };
  }

  // Group candidates into contiguous clusters and return first with enough notes
  function selectCluster(candidates, requiredCount) {
    const clusters = [];
    let current = [];
    for (const c of candidates) {
      if (current.length > 0 && c.fret - current[current.length - 1].fret > 5) {
        clusters.push(current);
        current = [];
      }
      current.push(c);
    }
    if (current.length > 0) clusters.push(current);

    for (const cluster of clusters) {
      if (cluster.length >= requiredCount) {
        return cluster.slice(0, requiredCount);
      }
    }
    return null;
  }

  const setA = buildDiagonalSet(true);
  const setB = buildDiagonalSet(false);

  const minA = setA.notes.length > 0 ? Math.min(...setA.notes.map(n => n.fret)) : Infinity;
  const minB = setB.notes.length > 0 ? Math.min(...setB.notes.map(n => n.fret)) : Infinity;

  return { sets: minA <= minB ? [setA, setB] : [setB, setA] };
}
