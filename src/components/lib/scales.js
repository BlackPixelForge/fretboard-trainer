// Major scale positions (5 CAGED-derived positions)
// Each position maps to a CAGED letter: E, D, C, A, G
// rel = fret offset from anchor, finger = 1-4 (index-pinky), degree = scale degree 1-7

// String indices: 0=high E, 1=B, 2=G, 3=D, 4=A, 5=low E
// The B string (index 1) has a 4-semitone interval from G, vs 5 for all others

export const POSITION_CAGED_MAP = ["E", "D", "C", "A", "G"];

export const POSITION_OFFSETS = [0, 3, 5, 7, 10];

// Position 1 (E shape) - starts from root on low E string
export const MAJOR_SCALE_POSITIONS = [
  {
    // Position 1 — E shape
    strings: [
      [{ rel: 0, finger: 1, degree: 1 }, { rel: 2, finger: 3, degree: 2 }, { rel: 4, finger: 4, degree: 3 }], // high E (si=0)
      [{ rel: 0, finger: 1, degree: 5 }, { rel: 2, finger: 3, degree: 6 }, { rel: 4, finger: 4, degree: 7 }], // B (si=1) — shifted +1 vs standard due to B string offset
      [{ rel: -1, finger: 1, degree: 2 }, { rel: 1, finger: 2, degree: 3 }, { rel: 2, finger: 3, degree: 4 }], // G (si=2)
      [{ rel: -1, finger: 1, degree: 6 }, { rel: 1, finger: 3, degree: 7 }, { rel: 2, finger: 4, degree: 1 }], // D (si=3)
      [{ rel: -1, finger: 1, degree: 3 }, { rel: 1, finger: 3, degree: 4 }, { rel: 2, finger: 4, degree: 5 }], // A (si=4)
      [{ rel: 0, finger: 1, degree: 1 }, { rel: 2, finger: 3, degree: 2 }, { rel: 4, finger: 4, degree: 3 }], // low E (si=5)
    ],
  },
  {
    // Position 2 — D shape
    strings: [
      [{ rel: 0, finger: 1, degree: 3 }, { rel: 2, finger: 3, degree: 4 }, { rel: 3, finger: 4, degree: 5 }], // high E
      [{ rel: 0, finger: 1, degree: 7 }, { rel: 1, finger: 2, degree: 1 }, { rel: 3, finger: 4, degree: 2 }], // B
      [{ rel: 0, finger: 1, degree: 4 }, { rel: 2, finger: 3, degree: 5 }, { rel: 4, finger: 4, degree: 6 }], // G
      [{ rel: 0, finger: 1, degree: 1 }, { rel: 2, finger: 3, degree: 2 }, { rel: 4, finger: 4, degree: 3 }], // D
      [{ rel: 0, finger: 1, degree: 5 }, { rel: 2, finger: 3, degree: 6 }, { rel: 3, finger: 4, degree: 7 }], // A
      [{ rel: 0, finger: 1, degree: 3 }, { rel: 2, finger: 3, degree: 4 }, { rel: 3, finger: 4, degree: 5 }], // low E
    ],
  },
  {
    // Position 3 — C shape
    strings: [
      [{ rel: 0, finger: 1, degree: 5 }, { rel: 2, finger: 3, degree: 6 }, { rel: 3, finger: 4, degree: 7 }], // high E
      [{ rel: 0, finger: 1, degree: 2 }, { rel: 1, finger: 2, degree: 3 }, { rel: 3, finger: 4, degree: 4 }], // B
      [{ rel: 0, finger: 1, degree: 6 }, { rel: 2, finger: 3, degree: 7 }, { rel: 3, finger: 4, degree: 1 }], // G
      [{ rel: 0, finger: 1, degree: 3 }, { rel: 2, finger: 3, degree: 4 }, { rel: 4, finger: 4, degree: 5 }], // D
      [{ rel: 0, finger: 1, degree: 7 }, { rel: 1, finger: 2, degree: 1 }, { rel: 3, finger: 4, degree: 2 }], // A
      [{ rel: 0, finger: 1, degree: 5 }, { rel: 2, finger: 3, degree: 6 }, { rel: 3, finger: 4, degree: 7 }], // low E
    ],
  },
  {
    // Position 4 — A shape
    strings: [
      [{ rel: 0, finger: 1, degree: 7 }, { rel: 1, finger: 2, degree: 1 }, { rel: 3, finger: 4, degree: 2 }], // high E
      [{ rel: 0, finger: 1, degree: 4 }, { rel: 1, finger: 2, degree: 5 }],                                     // B
      [{ rel: -1, finger: 1, degree: 1 }, { rel: 1, finger: 2, degree: 2 }, { rel: 2, finger: 3, degree: 3 }], // G
      [{ rel: 0, finger: 1, degree: 5 }, { rel: 2, finger: 3, degree: 6 }, { rel: 4, finger: 4, degree: 7 }], // D
      [{ rel: 0, finger: 1, degree: 2 }, { rel: 1, finger: 2, degree: 3 }, { rel: 3, finger: 4, degree: 4 }], // A — note: could also be mapped differently
      [{ rel: 0, finger: 1, degree: 7 }, { rel: 1, finger: 2, degree: 1 }, { rel: 3, finger: 4, degree: 2 }], // low E
    ],
  },
  {
    // Position 5 — G shape
    strings: [
      [{ rel: 0, finger: 1, degree: 2 }, { rel: 2, finger: 3, degree: 3 }],                                     // high E
      [{ rel: -1, finger: 1, degree: 5 }, { rel: 1, finger: 2, degree: 6 }, { rel: 2, finger: 3, degree: 7 }], // B
      [{ rel: 0, finger: 1, degree: 3 }, { rel: 2, finger: 3, degree: 4 }],                                     // G
      [{ rel: 0, finger: 1, degree: 7 }, { rel: 1, finger: 2, degree: 1 }, { rel: 3, finger: 4, degree: 2 }], // D
      [{ rel: -1, finger: 1, degree: 4 }, { rel: 1, finger: 2, degree: 5 }, { rel: 2, finger: 3, degree: 6 }], // A
      [{ rel: 0, finger: 1, degree: 2 }, { rel: 2, finger: 3, degree: 3 }],                                     // low E
    ],
  },
];

/**
 * Get the anchor fret for a position in a given key.
 * rootNoteIndex: 0-11 (C=0), positionIndex: 0-4
 * The anchor fret is where the position's "1" finger falls on the low E string.
 */
export function getPositionAnchorFret(rootNoteIndex, positionIndex) {
  // Low E string open note is E = 4
  const lowEOpen = 4;
  // Base fret where root falls on low E
  let baseFret = (rootNoteIndex - lowEOpen + 12) % 12;
  // Apply position offset
  let anchor = baseFret + POSITION_OFFSETS[positionIndex];
  // Keep in playable range
  if (anchor > 12) anchor -= 12;
  return anchor;
}

/**
 * Get all notes for a scale position in a given key.
 * Returns array of { stringIndex, fret, finger, degree }
 */
export function getScalePositionNotes(rootNoteIndex, positionIndex) {
  const anchor = getPositionAnchorFret(rootNoteIndex, positionIndex);
  const position = MAJOR_SCALE_POSITIONS[positionIndex];
  const notes = [];

  for (let si = 0; si < 6; si++) {
    const stringNotes = position.strings[si];
    for (const note of stringNotes) {
      const fret = anchor + note.rel;
      if (fret >= 0 && fret <= 15) {
        notes.push({
          stringIndex: si,
          fret,
          finger: note.finger,
          degree: note.degree,
        });
      }
    }
  }

  return notes;
}

/**
 * Check if a fret position is in a given scale position.
 * Returns { finger, degree } or null.
 */
export function isInScalePosition(stringIndex, fret, rootNoteIndex, positionIndex) {
  const anchor = getPositionAnchorFret(rootNoteIndex, positionIndex);
  const position = MAJOR_SCALE_POSITIONS[positionIndex];
  const stringNotes = position.strings[stringIndex];

  for (const note of stringNotes) {
    const noteFret = anchor + note.rel;
    if (noteFret === fret) {
      return { finger: note.finger, degree: note.degree };
    }
  }

  return null;
}
