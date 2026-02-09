import { STRING_TUNING } from "./music";
import { FRET_COUNT } from "./fretboard";

// String(Finger) position system: 9 positions
// 3 root strings (6=low E, 5=A, 4=D) × 3 root fingers (1=index, 2=middle, 4=pinky)
export const POSITIONS = [
  { rootString: 5, rootFinger: 1 },  // 6(1)
  { rootString: 5, rootFinger: 2 },  // 6(2)
  { rootString: 5, rootFinger: 4 },  // 6(4)
  { rootString: 4, rootFinger: 1 },  // 5(1)
  { rootString: 4, rootFinger: 2 },  // 5(2)
  { rootString: 4, rootFinger: 4 },  // 5(4)
  { rootString: 3, rootFinger: 1 },  // 4(1)
  { rootString: 3, rootFinger: 2 },  // 4(2)
  { rootString: 3, rootFinger: 4 },  // 4(4)
];

// Guitar string numbers: stringIndex 0=high E=1, 1=B=2, 2=G=3, 3=D=4, 4=A=5, 5=low E=6
function guitarStringNumber(stringIndex) {
  return 6 - stringIndex;
}

/**
 * Get display label for a position, e.g. "6(4)"
 */
export function getPositionLabel(positionIndex) {
  const pos = POSITIONS[positionIndex];
  return `${guitarStringNumber(pos.rootString)}(${pos.rootFinger})`;
}

/**
 * Get the fret where finger 1 sits for a position in a given key.
 * positionFret = rootFret - (rootFinger - 1)
 */
export function getPositionFret(rootNoteIndex, positionIndex) {
  const pos = POSITIONS[positionIndex];
  const openNote = STRING_TUNING[pos.rootString].note;
  // Find the lowest fret on the root string where the root note occurs
  let rootFret = (rootNoteIndex - openNote + 12) % 12;
  if (rootFret === 0) rootFret = 12; // use fret 12 instead of open string for position calculation
  let positionFret = rootFret - (pos.rootFinger - 1);
  if (positionFret < 0) positionFret += 12;
  return positionFret;
}

// Major scale intervals in semitones from root: W W H W W W H
const MAJOR_SCALE_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

/**
 * Get all notes for a scale position in a given key.
 * Returns array of { stringIndex, fret, finger, degree }
 */
export function getScalePositionNotes(rootNoteIndex, keyNotes, positionIndex) {
  const positionFret = getPositionFret(rootNoteIndex, positionIndex);
  const notes = [];

  for (let si = 0; si < 6; si++) {
    const openNote = STRING_TUNING[si].note;
    for (let fret = positionFret; fret <= positionFret + 3; fret++) {
      const actualFret = fret > FRET_COUNT ? fret - 12 : fret;
      if (actualFret < 0 || actualFret > FRET_COUNT) continue;
      const noteIndex = (openNote + actualFret) % 12;
      const degreeIndex = keyNotes.indexOf(noteIndex);
      if (degreeIndex === -1) continue;
      const finger = fret - positionFret + 1;
      notes.push({
        stringIndex: si,
        fret: actualFret,
        finger,
        degree: degreeIndex + 1,
      });
    }
  }

  return notes;
}

/**
 * Check if a fret position is in a given scale position.
 * Returns { finger, degree } or null.
 */
export function isInScalePosition(stringIndex, fret, rootNoteIndex, keyNotes, positionIndex) {
  const positionFret = getPositionFret(rootNoteIndex, positionIndex);
  const openNote = STRING_TUNING[stringIndex].note;
  const noteIndex = (openNote + fret) % 12;

  // Check if this note is in the key
  const degreeIndex = keyNotes.indexOf(noteIndex);
  if (degreeIndex === -1) return null;

  // Check if this fret falls within the 4-fret position window
  // Need to handle wrap-around for high frets
  let offset = fret - positionFret;
  if (offset < -6) offset += 12; // handle wrap from high frets back
  if (offset > 6) offset -= 12;

  if (offset < 0 || offset > 3) return null;

  return {
    finger: offset + 1,
    degree: degreeIndex + 1,
  };
}
