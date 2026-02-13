export const FRET_COUNT = 19;
export const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19];
export const DOUBLE_MARKERS = [12];

export const MODES = {
  EXPLORE: "explore",
  SCALE_POSITIONS: "scale_positions",
  CAGED: "caged",
  INTERVALS: "intervals",
  ONE_FRET_RULE: "one_fret_rule",
  TRIADS: "triads",
  QUIZ_IDENTIFY: "quiz_identify",
  QUIZ_FIND: "quiz_find",
};

// Adjacent regions intentionally overlap by 1-2 frets (e.g. mid_low 5-8 and mid 7-10)
// so practice transitions feel smooth — notes near a boundary appear in both regions.
export const FRET_REGIONS = {
  all: { start: 0, end: 19, label: "All Frets" },
  open: { start: 0, end: 4, label: "Open Position (0-4)" },
  mid_low: { start: 5, end: 8, label: "Frets 5-8" },
  mid: { start: 7, end: 10, label: "Frets 7-10" },
  mid_high: { start: 9, end: 12, label: "Frets 9-12" },
  high: { start: 12, end: 15, label: "Frets 12-15" },
  upper: { start: 15, end: 19, label: "Frets 15-19" },
};
