import { getScaleDegree } from "./music";

const DEGREE_COLORS = {
  "1": { bg: "rgba(232,78,60,0.12)", border: "#e84e3c", text: "#e84e3c" },
  "2": { bg: "rgba(230,160,60,0.12)", border: "#e6a03c", text: "#e6a03c" },
  "3": { bg: "rgba(240,200,50,0.12)", border: "#f0c832", text: "#f0c832" },
  "4": { bg: "rgba(80,190,80,0.12)", border: "#50be50", text: "#50be50" },
  "5": { bg: "rgba(60,160,220,0.12)", border: "#3ca0dc", text: "#3ca0dc" },
  "6": { bg: "rgba(140,100,220,0.12)", border: "#8c64dc", text: "#8c64dc" },
  "7": { bg: "rgba(200,80,160,0.12)", border: "#c850a0", text: "#c850a0" },
};

const DEFAULT_COLOR = { bg: "rgba(180,180,180,0.1)", border: "#888", text: "#aaa" };

export function getNoteColor(noteIndex, keyNotes, rootNote, highlightRoot, mode, quizNote, s, f) {
  if (mode === "quiz_find" && quizNote && s === quizNote.string && f === quizNote.fret) {
    return { bg: "rgba(255,200,50,0.15)", border: "#ffc832", text: "#ffc832", glow: "0 0 12px rgba(255,200,50,0.4)" };
  }
  if (highlightRoot && noteIndex === rootNote) {
    return { bg: "rgba(232,78,60,0.15)", border: "#e84e3c", text: "#e84e3c", glow: "0 0 10px rgba(232,78,60,0.3)" };
  }
  const degree = getScaleDegree(noteIndex, keyNotes);
  return DEGREE_COLORS[degree] || DEFAULT_COLOR;
}
