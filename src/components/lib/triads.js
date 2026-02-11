import { STRING_TUNING, getNoteAt, getNoteName } from "./music";
import { FRET_COUNT } from "./fretboard";

export const STRING_SETS = [
  { name: "1st", strings: [5, 4, 3] },  // guitar strings 6-5-4
  { name: "2nd", strings: [4, 3, 2] },  // 5-4-3
  { name: "3rd", strings: [3, 2, 1] },  // 4-3-2
  { name: "4th", strings: [2, 1, 0] },  // 3-2-1
];

export const QUALITIES = ["major", "minor", "diminished", "augmented"];
export const QUALITY_LABELS = {
  major: "Major", minor: "Minor", diminished: "Dim", augmented: "Aug",
};

export const INVERSIONS = ["rootPosition", "firstInversion", "secondInversion"];
export const INVERSION_LABELS = {
  rootPosition: "Root Position", firstInversion: "1st Inversion", secondInversion: "2nd Inversion",
};

// 48 triad shapes: 3 inversions x 16 shapes (4 string sets x 4 qualities)
// offset = fret offset from root note's fret (X)
// B-string compensation already baked into sets 3 & 4
export const TRIAD_SHAPES = {
  rootPosition: [
    // Set 1 (strings 6-5-4, si [5,4,3]), root on si 5
    { stringSetIndex: 0, quality: "major", rootSi: 5, notes: [
      { si: 5, offset: 0, interval: "R", finger: 4 },
      { si: 4, offset: -1, interval: "3", finger: 3 },
      { si: 3, offset: -3, interval: "5", finger: 1 },
    ]},
    { stringSetIndex: 0, quality: "minor", rootSi: 5, notes: [
      { si: 5, offset: 0, interval: "R", finger: 4 },
      { si: 4, offset: -2, interval: "\u266d3", finger: 2 },
      { si: 3, offset: -3, interval: "5", finger: 1 },
    ]},
    { stringSetIndex: 0, quality: "diminished", rootSi: 5, notes: [
      { si: 5, offset: 0, interval: "R", finger: 4 },
      { si: 4, offset: -2, interval: "\u266d3", finger: 2 },
      { si: 3, offset: -4, interval: "\u266d5", finger: 1 },
    ]},
    { stringSetIndex: 0, quality: "augmented", rootSi: 5, notes: [
      { si: 5, offset: 0, interval: "R", finger: 3 },
      { si: 4, offset: -1, interval: "3", finger: 2 },
      { si: 3, offset: -2, interval: "\u266f5", finger: 1 },
    ]},
    // Set 2 (strings 5-4-3, si [4,3,2]), root on si 4
    { stringSetIndex: 1, quality: "major", rootSi: 4, notes: [
      { si: 4, offset: 0, interval: "R", finger: 4 },
      { si: 3, offset: -1, interval: "3", finger: 3 },
      { si: 2, offset: -3, interval: "5", finger: 1 },
    ]},
    { stringSetIndex: 1, quality: "minor", rootSi: 4, notes: [
      { si: 4, offset: 0, interval: "R", finger: 4 },
      { si: 3, offset: -2, interval: "\u266d3", finger: 2 },
      { si: 2, offset: -3, interval: "5", finger: 1 },
    ]},
    { stringSetIndex: 1, quality: "diminished", rootSi: 4, notes: [
      { si: 4, offset: 0, interval: "R", finger: 4 },
      { si: 3, offset: -2, interval: "\u266d3", finger: 2 },
      { si: 2, offset: -4, interval: "\u266d5", finger: 1 },
    ]},
    { stringSetIndex: 1, quality: "augmented", rootSi: 4, notes: [
      { si: 4, offset: 0, interval: "R", finger: 3 },
      { si: 3, offset: -1, interval: "3", finger: 2 },
      { si: 2, offset: -2, interval: "\u266f5", finger: 1 },
    ]},
    // Set 3 (strings 4-3-2, si [3,2,1]), root on si 3 — B-string adjusted
    { stringSetIndex: 2, quality: "major", rootSi: 3, notes: [
      { si: 3, offset: 0, interval: "R", finger: 3 },
      { si: 2, offset: -1, interval: "3", finger: 2 },
      { si: 1, offset: -2, interval: "5", finger: 1 },
    ]},
    { stringSetIndex: 2, quality: "minor", rootSi: 3, notes: [
      { si: 3, offset: 0, interval: "R", finger: 3 },
      { si: 2, offset: -2, interval: "\u266d3", finger: 1 },
      { si: 1, offset: -2, interval: "5", finger: 1 },
    ]},
    { stringSetIndex: 2, quality: "diminished", rootSi: 3, notes: [
      { si: 3, offset: 0, interval: "R", finger: 4 },
      { si: 2, offset: -2, interval: "\u266d3", finger: 2 },
      { si: 1, offset: -3, interval: "\u266d5", finger: 1 },
    ]},
    { stringSetIndex: 2, quality: "augmented", rootSi: 3, notes: [
      { si: 3, offset: 0, interval: "R", finger: 2 },
      { si: 2, offset: -1, interval: "3", finger: 1 },
      { si: 1, offset: -1, interval: "\u266f5", finger: 1 },
    ]},
    // Set 4 (strings 3-2-1, si [2,1,0]), root on si 2 — B-string adjusted
    { stringSetIndex: 3, quality: "major", rootSi: 2, notes: [
      { si: 2, offset: 0, interval: "R", finger: 3 },
      { si: 1, offset: 0, interval: "3", finger: 4 },
      { si: 0, offset: -2, interval: "5", finger: 1 },
    ]},
    { stringSetIndex: 3, quality: "minor", rootSi: 2, notes: [
      { si: 2, offset: 0, interval: "R", finger: 3 },
      { si: 1, offset: -1, interval: "\u266d3", finger: 2 },
      { si: 0, offset: -2, interval: "5", finger: 1 },
    ]},
    { stringSetIndex: 3, quality: "diminished", rootSi: 2, notes: [
      { si: 2, offset: 0, interval: "R", finger: 4 },
      { si: 1, offset: -1, interval: "\u266d3", finger: 3 },
      { si: 0, offset: -3, interval: "\u266d5", finger: 1 },
    ]},
    { stringSetIndex: 3, quality: "augmented", rootSi: 2, notes: [
      { si: 2, offset: 0, interval: "R", finger: 2 },
      { si: 1, offset: 0, interval: "3", finger: 3 },
      { si: 0, offset: -1, interval: "\u266f5", finger: 1 },
    ]},
  ],

  firstInversion: [
    // Set 1 (si [5,4,3]), root on si 3
    { stringSetIndex: 0, quality: "major", rootSi: 3, notes: [
      { si: 5, offset: 2, interval: "3", finger: 3 },
      { si: 4, offset: 0, interval: "5", finger: 1 },
      { si: 3, offset: 0, interval: "R", finger: 1 },
    ]},
    { stringSetIndex: 0, quality: "minor", rootSi: 3, notes: [
      { si: 5, offset: 1, interval: "\u266d3", finger: 2 },
      { si: 4, offset: 0, interval: "5", finger: 1 },
      { si: 3, offset: 0, interval: "R", finger: 1 },
    ]},
    { stringSetIndex: 0, quality: "diminished", rootSi: 3, notes: [
      { si: 5, offset: 1, interval: "\u266d3", finger: 3 },
      { si: 4, offset: -1, interval: "\u266d5", finger: 1 },
      { si: 3, offset: 0, interval: "R", finger: 2 },
    ]},
    { stringSetIndex: 0, quality: "augmented", rootSi: 3, notes: [
      { si: 5, offset: 2, interval: "3", finger: 3 },
      { si: 4, offset: 1, interval: "\u266f5", finger: 2 },
      { si: 3, offset: 0, interval: "R", finger: 1 },
    ]},
    // Set 2 (si [4,3,2]), root on si 2
    { stringSetIndex: 1, quality: "major", rootSi: 2, notes: [
      { si: 4, offset: 2, interval: "3", finger: 3 },
      { si: 3, offset: 0, interval: "5", finger: 1 },
      { si: 2, offset: 0, interval: "R", finger: 1 },
    ]},
    { stringSetIndex: 1, quality: "minor", rootSi: 2, notes: [
      { si: 4, offset: 1, interval: "\u266d3", finger: 2 },
      { si: 3, offset: 0, interval: "5", finger: 1 },
      { si: 2, offset: 0, interval: "R", finger: 1 },
    ]},
    { stringSetIndex: 1, quality: "diminished", rootSi: 2, notes: [
      { si: 4, offset: 1, interval: "\u266d3", finger: 3 },
      { si: 3, offset: -1, interval: "\u266d5", finger: 1 },
      { si: 2, offset: 0, interval: "R", finger: 2 },
    ]},
    { stringSetIndex: 1, quality: "augmented", rootSi: 2, notes: [
      { si: 4, offset: 2, interval: "3", finger: 3 },
      { si: 3, offset: 1, interval: "\u266f5", finger: 2 },
      { si: 2, offset: 0, interval: "R", finger: 1 },
    ]},
    // Set 3 (si [3,2,1]), root on si 1 — B-string adjusted
    { stringSetIndex: 2, quality: "major", rootSi: 1, notes: [
      { si: 3, offset: 1, interval: "3", finger: 3 },
      { si: 2, offset: -1, interval: "5", finger: 1 },
      { si: 1, offset: 0, interval: "R", finger: 2 },
    ]},
    { stringSetIndex: 2, quality: "minor", rootSi: 1, notes: [
      { si: 3, offset: 0, interval: "\u266d3", finger: 2 },
      { si: 2, offset: -1, interval: "5", finger: 1 },
      { si: 1, offset: 0, interval: "R", finger: 3 },
    ]},
    { stringSetIndex: 2, quality: "diminished", rootSi: 1, notes: [
      { si: 3, offset: 0, interval: "\u266d3", finger: 3 },
      { si: 2, offset: -2, interval: "\u266d5", finger: 1 },
      { si: 1, offset: 0, interval: "R", finger: 4 },
    ]},
    { stringSetIndex: 2, quality: "augmented", rootSi: 1, notes: [
      { si: 3, offset: 1, interval: "3", finger: 2 },
      { si: 2, offset: 0, interval: "\u266f5", finger: 1 },
      { si: 1, offset: 0, interval: "R", finger: 1 },
    ]},
    // Set 4 (si [2,1,0]), root on si 0 — B-string adjusted
    { stringSetIndex: 3, quality: "major", rootSi: 0, notes: [
      { si: 2, offset: 1, interval: "3", finger: 2 },
      { si: 1, offset: 0, interval: "5", finger: 1 },
      { si: 0, offset: 0, interval: "R", finger: 1 },
    ]},
    { stringSetIndex: 3, quality: "minor", rootSi: 0, notes: [
      { si: 2, offset: 0, interval: "\u266d3", finger: 1 },
      { si: 1, offset: 0, interval: "5", finger: 1 },
      { si: 0, offset: 0, interval: "R", finger: 1 },
    ]},
    { stringSetIndex: 3, quality: "diminished", rootSi: 0, notes: [
      { si: 2, offset: 0, interval: "\u266d3", finger: 2 },
      { si: 1, offset: -1, interval: "\u266d5", finger: 1 },
      { si: 0, offset: 0, interval: "R", finger: 3 },
    ]},
    { stringSetIndex: 3, quality: "augmented", rootSi: 0, notes: [
      { si: 2, offset: 1, interval: "3", finger: 2 },
      { si: 1, offset: 1, interval: "\u266f5", finger: 3 },
      { si: 0, offset: 0, interval: "R", finger: 1 },
    ]},
  ],

  secondInversion: [
    // Set 1 (si [5,4,3]), root on si 4
    { stringSetIndex: 0, quality: "major", rootSi: 4, notes: [
      { si: 5, offset: 0, interval: "5", finger: 2 },
      { si: 4, offset: 0, interval: "R", finger: 3 },
      { si: 3, offset: -1, interval: "3", finger: 1 },
    ]},
    { stringSetIndex: 0, quality: "minor", rootSi: 4, notes: [
      { si: 5, offset: 0, interval: "5", finger: 3 },
      { si: 4, offset: 0, interval: "R", finger: 4 },
      { si: 3, offset: -2, interval: "\u266d3", finger: 1 },
    ]},
    { stringSetIndex: 0, quality: "diminished", rootSi: 4, notes: [
      { si: 5, offset: -1, interval: "\u266d5", finger: 2 },
      { si: 4, offset: 0, interval: "R", finger: 3 },
      { si: 3, offset: -2, interval: "\u266d3", finger: 1 },
    ]},
    { stringSetIndex: 0, quality: "augmented", rootSi: 4, notes: [
      { si: 5, offset: 1, interval: "\u266f5", finger: 3 },
      { si: 4, offset: 0, interval: "R", finger: 2 },
      { si: 3, offset: -1, interval: "3", finger: 1 },
    ]},
    // Set 2 (si [4,3,2]), root on si 3
    { stringSetIndex: 1, quality: "major", rootSi: 3, notes: [
      { si: 4, offset: 0, interval: "5", finger: 2 },
      { si: 3, offset: 0, interval: "R", finger: 3 },
      { si: 2, offset: -1, interval: "3", finger: 1 },
    ]},
    { stringSetIndex: 1, quality: "minor", rootSi: 3, notes: [
      { si: 4, offset: 0, interval: "5", finger: 3 },
      { si: 3, offset: 0, interval: "R", finger: 4 },
      { si: 2, offset: -2, interval: "\u266d3", finger: 1 },
    ]},
    { stringSetIndex: 1, quality: "diminished", rootSi: 3, notes: [
      { si: 4, offset: -1, interval: "\u266d5", finger: 2 },
      { si: 3, offset: 0, interval: "R", finger: 3 },
      { si: 2, offset: -2, interval: "\u266d3", finger: 1 },
    ]},
    { stringSetIndex: 1, quality: "augmented", rootSi: 3, notes: [
      { si: 4, offset: 1, interval: "\u266f5", finger: 3 },
      { si: 3, offset: 0, interval: "R", finger: 2 },
      { si: 2, offset: -1, interval: "3", finger: 1 },
    ]},
    // Set 3 (si [3,2,1]), root on si 2 — B-string adjusted
    { stringSetIndex: 2, quality: "major", rootSi: 2, notes: [
      { si: 3, offset: 0, interval: "5", finger: 1 },
      { si: 2, offset: 0, interval: "R", finger: 1 },
      { si: 1, offset: 0, interval: "3", finger: 1 },
    ]},
    { stringSetIndex: 2, quality: "minor", rootSi: 2, notes: [
      { si: 3, offset: 0, interval: "5", finger: 2 },
      { si: 2, offset: 0, interval: "R", finger: 3 },
      { si: 1, offset: -1, interval: "\u266d3", finger: 1 },
    ]},
    { stringSetIndex: 2, quality: "diminished", rootSi: 2, notes: [
      { si: 3, offset: -1, interval: "\u266d5", finger: 1 },
      { si: 2, offset: 0, interval: "R", finger: 3 },
      { si: 1, offset: -1, interval: "\u266d3", finger: 2 },
    ]},
    { stringSetIndex: 2, quality: "augmented", rootSi: 2, notes: [
      { si: 3, offset: 1, interval: "\u266f5", finger: 2 },
      { si: 2, offset: 0, interval: "R", finger: 1 },
      { si: 1, offset: 0, interval: "3", finger: 1 },
    ]},
    // Set 4 (si [2,1,0]), root on si 1 — B-string adjusted
    { stringSetIndex: 3, quality: "major", rootSi: 1, notes: [
      { si: 2, offset: -1, interval: "5", finger: 1 },
      { si: 1, offset: 0, interval: "R", finger: 3 },
      { si: 0, offset: -1, interval: "3", finger: 2 },
    ]},
    { stringSetIndex: 3, quality: "minor", rootSi: 1, notes: [
      { si: 2, offset: -1, interval: "5", finger: 2 },
      { si: 1, offset: 0, interval: "R", finger: 3 },
      { si: 0, offset: -2, interval: "\u266d3", finger: 1 },
    ]},
    { stringSetIndex: 3, quality: "diminished", rootSi: 1, notes: [
      { si: 2, offset: -2, interval: "\u266d5", finger: 1 },
      { si: 1, offset: 0, interval: "R", finger: 3 },
      { si: 0, offset: -2, interval: "\u266d3", finger: 1 },
    ]},
    { stringSetIndex: 3, quality: "augmented", rootSi: 1, notes: [
      { si: 2, offset: 0, interval: "\u266f5", finger: 2 },
      { si: 1, offset: 0, interval: "R", finger: 3 },
      { si: 0, offset: -1, interval: "3", finger: 1 },
    ]},
  ],
};

/**
 * Get all valid fret positions for a shape given a root note.
 * Returns array of positions, each = [{si, fret, interval, finger, noteName, isRoot}, ...]
 */
export function getTriadPositions(rootNoteIndex, inversionKey, shapeIndex) {
  const shape = TRIAD_SHAPES[inversionKey]?.[shapeIndex];
  if (!shape) return [];

  const openNote = STRING_TUNING[shape.rootSi].note;
  const baseX = (rootNoteIndex - openNote + 12) % 12;
  const positions = [];

  for (const startX of [baseX, baseX + 12]) {
    const notes = shape.notes.map(n => {
      const fret = startX + n.offset;
      return {
        si: n.si,
        fret,
        interval: n.interval,
        finger: n.finger,
        noteName: fret >= 0 && fret <= FRET_COUNT ? getNoteName(getNoteAt(n.si, fret)) : null,
        isRoot: n.interval === "R",
      };
    });
    if (notes.every(n => n.fret >= 0 && n.fret <= FRET_COUNT)) {
      positions.push(notes);
    }
  }

  return positions;
}

/**
 * Check if (si, fret) is part of current triad shape.
 * Returns { interval, finger, noteName, isRoot } or null.
 */
export function getTriadInfo(si, fret, rootNoteIndex, inversionKey, shapeIndex) {
  const positions = getTriadPositions(rootNoteIndex, inversionKey, shapeIndex);
  for (const pos of positions) {
    for (const note of pos) {
      if (note.si === si && note.fret === fret) {
        return {
          interval: note.interval,
          finger: note.finger,
          noteName: note.noteName,
          isRoot: note.isRoot,
        };
      }
    }
  }
  return null;
}

/**
 * Get the set of string indices used by current shape.
 */
export function getTriadStrings(inversionKey, shapeIndex) {
  const shape = TRIAD_SHAPES[inversionKey]?.[shapeIndex];
  if (!shape) return [];
  return STRING_SETS[shape.stringSetIndex].strings;
}

/**
 * Get display label: "Set 1 \u00b7 Major"
 */
export function getTriadLabel(inversionKey, shapeIndex) {
  const shape = TRIAD_SHAPES[inversionKey]?.[shapeIndex];
  if (!shape) return "";
  return `Set ${shape.stringSetIndex + 1} \u00b7 ${QUALITY_LABELS[shape.quality]}`;
}
