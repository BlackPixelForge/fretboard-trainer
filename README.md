# Fretboard Navigator

A guitar fretboard note memorization trainer. Learn diatonic scale note positions across the entire fretboard through interactive learning and quiz modes.

**Live app:** [fretboard-trainer.vercel.app](https://fretboard-trainer.vercel.app)

## Learning Modes

- **Explore** — View all notes in a key with toggles for naturals, sharps, and scale degrees. Click notes to reveal/hide them, or use "Hide All" to self-test.
- **Scale Positions** — Navigate the 7 major scale position forms that tile seamlessly across the fretboard. Named by root string + fretting finger (e.g. 6(4) = root on string 6, finger 4). Toggle between scale degrees, note names, and fingering.
- **CAGED** — See how the 5 open chord shapes (C, A, G, E, D) tile across the fretboard, with chord tone vs scale tone distinction. Each shape maps to one of the 7 scale positions.
- **Intervals** — View notes as interval labels (R, 2, 3…) with filtering. Includes an interval quiz sub-mode.
- **1-Fret Rule** — Pick a fret position and see which 7 keys the 7 scale position forms produce at that fret. Shift ±1 fret to cover all 12 chromatic keys.
- **Triads** — Browse 48 movable triad shapes across 4 string sets, 4 qualities, and 3 inversions for any chromatic root. Includes auto-cycle playback with speed control, and a harmonized chords panel showing I–ii–iii–IV–V–vi–vii° for the current key.

## Quiz Modes

- **Name Note** — A fret position is highlighted; pick the correct note name from multiple-choice bubbles.
- **Find Note** — Given a note name, find and tap every occurrence of that note on the fretboard.

Both quizzes support key selection, fret region filtering, per-string filtering, streak tracking, and score/accuracy stats.

## Local Development

```bash
npm install
npm run dev
```

Opens at [localhost:3000](http://localhost:3000).
