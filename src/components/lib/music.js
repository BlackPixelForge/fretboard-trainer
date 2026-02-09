export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const NATURAL_NOTES = ["C", "D", "E", "F", "G", "A", "B"];
export const SHARP_NOTES = ["C#", "D#", "F#", "G#", "A#"];

export const STRING_TUNING = [
  { name: "E", note: 4, octave: 4 },  // high E
  { name: "B", note: 11, octave: 3 },
  { name: "G", note: 7, octave: 3 },
  { name: "D", note: 2, octave: 3 },
  { name: "A", note: 9, octave: 2 },
  { name: "E", note: 4, octave: 2 },  // low E
];

export const DIATONIC_KEYS = {
  "C Major / A Minor": [0, 2, 4, 5, 7, 9, 11],
  "G Major / E Minor": [7, 9, 11, 0, 2, 4, 6],
  "D Major / B Minor": [2, 4, 6, 7, 9, 11, 1],
  "A Major / F# Minor": [9, 11, 1, 2, 4, 6, 8],
  "E Major / C# Minor": [4, 6, 8, 9, 11, 1, 3],
  "F Major / D Minor": [5, 7, 9, 10, 0, 2, 4],
  "Bb Major / G Minor": [10, 0, 2, 3, 5, 7, 9],
  "Eb Major / C Minor": [3, 5, 7, 8, 10, 0, 2],
};

export const SCALE_DEGREES = ["1", "2", "3", "4", "5", "6", "7"];

export function getNoteAt(stringIndex, fret) {
  const openNote = STRING_TUNING[stringIndex].note;
  return (openNote + fret) % 12;
}

export function getNoteName(noteIndex) {
  return NOTES[noteIndex];
}

export function isInKey(noteIndex, keyNotes) {
  return keyNotes.includes(noteIndex);
}

export function getScaleDegree(noteIndex, keyNotes) {
  const idx = keyNotes.indexOf(noteIndex);
  return idx >= 0 ? SCALE_DEGREES[idx] : null;
}

export function getStringLabel(si) {
  const labels = ["high E", "B", "G", "D", "A", "low E"];
  return labels[si];
}
