// Major scale harmonization — pure data and logic, zero React dependencies

// The universal harmonization pattern for any major key
// W-W-H-W-W-W-H = +2,+2,+1,+2,+2,+2,+1 semitones from root
export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

export const HARMONIZATION_PATTERN = [
  { degree: 1, numeral: "I",    quality: "major" },
  { degree: 2, numeral: "ii",   quality: "minor" },
  { degree: 3, numeral: "iii",  quality: "minor" },
  { degree: 4, numeral: "IV",   quality: "major" },
  { degree: 5, numeral: "V",    quality: "major" },
  { degree: 6, numeral: "vi",   quality: "minor" },
  { degree: 7, numeral: "vii°", quality: "diminished" },
];

// Quality suffixes for chord name display
const QUALITY_SUFFIX = {
  major: "",
  minor: "m",
  diminished: "°",
};

// Correct enharmonic note spellings per key (indexed by root chromatic index 0-11)
// Each array has 7 entries matching the 7 scale degrees
export const MAJOR_KEY_SPELLINGS = {
  0:  ["C",  "D",  "E",  "F",  "G",  "A",  "B"],    // C
  1:  ["Db", "Eb", "F",  "Gb", "Ab", "Bb", "C"],     // Db / C#
  2:  ["D",  "E",  "F#", "G",  "A",  "B",  "C#"],    // D
  3:  ["Eb", "F",  "G",  "Ab", "Bb", "C",  "D"],     // Eb
  4:  ["E",  "F#", "G#", "A",  "B",  "C#", "D#"],    // E
  5:  ["F",  "G",  "A",  "Bb", "C",  "D",  "E"],     // F
  6:  ["F#", "G#", "A#", "B",  "C#", "D#", "E#"],    // F# / Gb
  7:  ["G",  "A",  "B",  "C",  "D",  "E",  "F#"],    // G
  8:  ["Ab", "Bb", "C",  "Db", "Eb", "F",  "G"],     // Ab
  9:  ["A",  "B",  "C#", "D",  "E",  "F#", "G#"],    // A
  10: ["Bb", "C",  "D",  "Eb", "F",  "G",  "A"],     // Bb
  11: ["B",  "C#", "D#", "E",  "F#", "G#", "A#"],    // B
};

// Display names for keys (using common/preferred spelling)
export const KEY_DISPLAY_NAMES = {
  0: "C", 1: "Db", 2: "D", 3: "Eb", 4: "E", 5: "F",
  6: "F#", 7: "G", 8: "Ab", 9: "A", 10: "Bb", 11: "B",
};

// Key signatures
export const KEY_SIGNATURES = {
  0:  "no sharps/flats",
  1:  "5b: Bb Eb Ab Db Gb",
  2:  "2#: F# C#",
  3:  "3b: Bb Eb Ab",
  4:  "4#: F# C# G# D#",
  5:  "1b: Bb",
  6:  "6#: F# C# G# D# A# E#",
  7:  "1#: F#",
  8:  "4b: Bb Eb Ab Db",
  9:  "3#: F# C# G#",
  10: "2b: Bb Eb",
  11: "5#: F# C# G# D# A#",
};

// Returns 8 chord objects (7 degrees + octave repeat) for a given root
export function getHarmonizedChords(rootNoteIndex) {
  const spellings = MAJOR_KEY_SPELLINGS[rootNoteIndex];
  const chords = HARMONIZATION_PATTERN.map((pattern, i) => {
    const chordRootIndex = (rootNoteIndex + MAJOR_SCALE_INTERVALS[i]) % 12;
    const noteName = spellings[i];
    return {
      degree: pattern.degree,
      numeral: pattern.numeral,
      quality: pattern.quality,
      chordName: noteName + QUALITY_SUFFIX[pattern.quality],
      rootNoteIndex: chordRootIndex,
    };
  });

  // Add octave (degree 8 = repeat of degree 1)
  chords.push({
    degree: 8,
    numeral: "I",
    quality: "major",
    chordName: spellings[0],
    rootNoteIndex: rootNoteIndex,
  });

  return chords;
}

export function getKeySignatureDisplay(rootNoteIndex) {
  return KEY_SIGNATURES[rootNoteIndex] || "";
}
