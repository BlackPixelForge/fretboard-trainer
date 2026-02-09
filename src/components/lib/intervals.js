export const INTERVAL_LABELS = {
  1: "R", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7",
};

export const INTERVAL_NAMES = {
  1: "Root",
  2: "Major 2nd",
  3: "Major 3rd",
  4: "Perfect 4th",
  5: "Perfect 5th",
  6: "Major 6th",
  7: "Major 7th",
};

export function getIntervalLabel(noteIndex, keyNotes) {
  const idx = keyNotes.indexOf(noteIndex);
  if (idx < 0) return null;
  return INTERVAL_LABELS[idx + 1] || null;
}

export function getIntervalDegree(noteIndex, keyNotes) {
  const idx = keyNotes.indexOf(noteIndex);
  if (idx < 0) return null;
  return idx + 1;
}

import { getNoteAt, isInKey } from "./music";
import { FRET_COUNT } from "./fretboard";

export function generateIntervalQuiz(keyNotes, selectedStrings, region) {
  const strings = Array.from(selectedStrings);
  if (strings.length === 0) return null;

  const candidates = [];
  for (const s of strings) {
    for (let f = region.start; f <= Math.min(region.end, FRET_COUNT); f++) {
      const noteIndex = getNoteAt(s, f);
      if (isInKey(noteIndex, keyNotes)) {
        const degree = keyNotes.indexOf(noteIndex) + 1;
        candidates.push({ stringIndex: s, fret: f, correctInterval: degree });
      }
    }
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
