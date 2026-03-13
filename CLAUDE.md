# Fretboard Navigator

## What This Is

A guitar fretboard note memorization trainer. Users learn diatonic scale note positions across the fretboard through eight interactive modes:

**Learn modes:**
- **Explore** — View all notes in a key, toggle naturals/sharps/scale degrees, click to reveal/hide individual notes, use "Hide All" to self-test
- **Scale Positions** — 7 major scale forms: 6(1), 6(2), 6(4), 5(1), 5(2), 5(4), 4(1). Named by root string + fretting finger. Cycle: 6(1)→6(2)→6(4)→5(1)→5(2)→5(4)→4(1)→[repeat]. 5 map to CAGED shapes; 6(2) and 5(2) are connecting positions. Forms are hardcoded from standard guitar pedagogy. **Diagonal Pentatonic** sub-mode — see dedicated section below.
- **CAGED** — 5 open chord shapes tiling the fretboard. Position mappings: E→6(1), G→6(4), A→5(1), C→5(4), D→4(1). Colors: C=purple, A=orange, G=blue, E=red, D=green.
- **Intervals** — View notes as interval labels (R, 2, 3...) with filtering, includes interval quiz sub-mode
- **1-Fret Rule** — Pick a fret, see which key each of the 7 forms produces. Key computed via `getRootNoteForPosition()` + `computeKeyNotes()`. Root fret offsets: (0, +2, +4) per root-string group. Reuses `ScalePositionDot`.
- **Triads** — 48 movable triad shapes (4 string sets × 4 qualities × 3 inversions). `TRIAD_SHAPES[inversionKey][shapeIndex]`, shape index: `(stringSetIndex * 4) + qualityOffset` (major=0, minor=1, dim=2, aug=3). `HarmoniesPanel` maintains its own `keyRoot` separate from `triadState.rootNote`.

**Quiz modes:**
- **Name Note** — A fret position is highlighted with a pulsing dot; pick the correct note name from multiple-choice bubbles
- **Find Note** — Given a note name, find and select every occurrence of that note on the fretboard in a batch quiz

Supports 8 diatonic keys, 6 fret regions, per-string filtering, streak tracking, and score/accuracy stats.

## Tech Stack

- **Next.js 16** (App Router) with JavaScript (not TypeScript)
- **React 19** — no state management library, plain `useState` hooks
- **Tailwind CSS v4** — CSS-based config via `@import "tailwindcss"` in globals.css (no tailwind.config file)
- **Vercel** — zero-config deployment target

## Architecture

Two routes: `/` serves a marketing landing page (`LandingPage.jsx`), `/app` serves the full trainer (`FretboardTrainer.jsx`). One `"use client"` boundary at `FretboardTrainer.jsx` — the entire app is interactive. No server components below `page.js`.

The landing page embeds a restricted live demo of the trainer via `<FretboardTrainer embedded />`. The `embedded` prop (defaults to `undefined`/falsy) gates all demo restrictions — the `/app` route passes no props, so all existing behavior is unchanged. See "Embedded Demo Mode" below.

Dynamic styles (computed colors per scale degree, quiz state indicators) use inline `style` props. Global animations (fadeIn, pulseGlow, rootPulse, slideDown, positionTransition, shapePulse) are defined as `@keyframes` in `globals.css`.

The orchestrator uses `getNoteDisplayData(s, f)` to return mode-specific metadata for each fret position, which FretCell uses to dispatch to the correct dot component (NoteDot, ScalePositionDot, CAGEDDot).

## File Structure

```
src/
├── app/
│   ├── globals.css              # Tailwind directives + Google Fonts + @keyframes
│   ├── layout.js                # Root layout with metadata
│   ├── page.js                  # Landing page at / (imports LandingPage)
│   └── app/
│       └── page.js              # Full trainer at /app (imports FretboardTrainer)
└── components/
    ├── FretboardTrainer.jsx     # State orchestrator ("use client"), all hooks & handlers
    │                            # Accepts optional `embedded` prop for restricted demo mode
    ├── Legend.jsx               # Mode-specific color/shape legends
    ├── Tips.jsx                 # Mode-specific instructions
    ├── TriadExplainer.jsx       # Collapsible triad theory panel (quality, inversions, string sets)
    ├── HarmoniesPanel.jsx       # Collapsible scale harmonies panel (I-ii-iii-IV-V-vi-vii°)
    ├── landing/
    │   ├── LandingPage.jsx      # Marketing landing page at /
    │   ├── Hero.jsx             # Hero section with animated fretboard visual
    │   ├── FeatureGrid.jsx      # 8-card feature overview grid
    │   ├── FretboardVisual.jsx  # Decorative SVG-like fretboard (used by Hero)
    │   ├── DemoSection.jsx      # Live embedded demo — lazy-loads FretboardTrainer with embedded prop
    │   └── Footer.jsx           # Site footer
    ├── controls/
    │   ├── ModeSelector.jsx     # Grouped two-row mode tabs (Learn + Quiz)
    │   ├── KeySelector.jsx      # Dropdown: 8 diatonic keys
    │   ├── RegionSelector.jsx   # Dropdown: fret region filter
    │   ├── ExploreToggles.jsx   # Naturals, Sharps, Degrees, Root Highlight, Hide All
    │   ├── StringToggles.jsx    # Per-string circular toggle buttons
    │   ├── ScalePositionControls.jsx  # 7 form buttons (6(1)..4(1)), prev/next, notes/fingering, diagonal toggle + set buttons
    │   ├── CAGEDControls.jsx    # Shape picker (C/A/G/E/D + All) with position labels, scale tones toggle
    │   ├── IntervalControls.jsx # Interval/note toggle, degree filter, quiz toggle
    │   ├── OneFretRuleControls.jsx # Fret selector (1-12), form/key cards, notes/fingering toggles
    │   └── TriadControls.jsx    # Root picker (12 chromatic), inversions, shape stepper, notes/fingering, auto-play
    ├── fretboard/
    │   ├── Fretboard.jsx        # Board container (wood background, shadow)
    │   ├── FretNumbers.jsx      # Fret number header row
    │   ├── FretMarkers.jsx      # Dot inlays (single + double at 12th)
    │   ├── StringRow.jsx        # One guitar string (label + fret cells)
    │   ├── FretCell.jsx         # Wire + note at one fret position, dispatches to dot variants
    │   ├── NoteDot.jsx          # Normal note circle (explore/identify/interval modes)
    │   ├── ScalePositionDot.jsx # Scale position dot with degree/note name/fingering label
    │   ├── CAGEDDot.jsx         # CAGED dot with shape color, chord/scale tone distinction
    │   └── QuizTarget.jsx       # Pulsing target dot / revealed answer (find mode)
    ├── quiz/
    │   ├── QuizPrompt.jsx       # "Find all C notes" / "What note is on..."
    │   ├── QuizFeedback.jsx     # Correct/wrong message flash
    │   ├── AnswerBubbles.jsx    # Multiple choice note circles
    │   ├── IntervalQuizPrompt.jsx # Interval quiz answer bubbles (R, 2, 3...)
    │   └── ScoreBar.jsx         # Score, accuracy %, streak, best streak
    └── lib/
        ├── music.js             # NOTES, STRING_TUNING, DIATONIC_KEYS, SCALE_DEGREES,
        │                        # getNoteAt(), getNoteName(), isInKey(), getScaleDegree(),
        │                        # getStringLabel() — zero React dependencies
        ├── fretboard.js         # FRET_COUNT (19), FRET_MARKERS, DOUBLE_MARKERS,
        │                        # MODES (8 modes), FRET_REGIONS — zero React dependencies
        ├── colors.js            # getNoteColor(), CAGED_SHAPE_COLORS, getScalePositionColor(),
        │                        # getCAGEDColor(), DIAGONAL_POSITION_COLORS,
        │                        # getDiagonalPositionColor() — degree color map, quiz/root overrides
        ├── scales.js            # FORMS (7 hardcoded major scale form patterns), getPositionLabel(),
        │                        # getPositionFret(), getScalePositionNotes(),
        │                        # isInScalePosition(), getRootNoteForPosition(),
        │                        # computeKeyNotes(), PENTATONIC_DEGREES,
        │                        # getDiagonalPentatonicSets() — lookup-based, zero React dependencies
        ├── caged.js             # CAGED_ORDER, getCAGEDShapes(), getCAGEDInfo()
        │                        # Shapes use rootString anchoring + root-relative offsets
        │                        # Imports STRING_TUNING from music.js
        ├── intervals.js         # INTERVAL_LABELS, INTERVAL_NAMES, getIntervalLabel(),
        │                        # getIntervalDegree(), generateIntervalQuiz()
        ├── triads.js            # TRIAD_SHAPES, INVERSIONS, QUALITIES, STRING_SETS,
        │                        # getTriadInfo(), getTriadLabel() — 48 movable shapes
        └── harmonies.js         # HARMONIZATION_PATTERN, MAJOR_KEY_SPELLINGS, KEY_SIGNATURES,
                                 # getHarmonizedChords(), getKeySignatureDisplay()
                                 # — correct enharmonic spellings for all 12 keys
```

## Key Data Flow

1. `FretboardTrainer` holds all state and defines `isNoteVisible()`, `getNoteDisplayData()`, `toggleReveal()`, quiz generators
2. State flows down: `FretboardTrainer` → `Fretboard` → `StringRow` → `FretCell` → `NoteDot`/`ScalePositionDot`/`CAGEDDot`/`QuizTarget`
3. Events flow up via callbacks: `onToggleReveal`, `onAnswer`, `onModeChange`, etc.
4. `lib/` modules are pure functions — imported by both components and the orchestrator
5. New modes use `getNoteDisplayData()` to determine which dot component to render and with what props

## Commands

```bash
npm run dev    # Start dev server (localhost:3000)
npm run build  # Production build
npm run start  # Serve production build
```

## Embedded Demo Mode

`FretboardTrainer` accepts an optional `embedded` prop for a restricted landing page demo. All restrictions gated behind `if (embedded)` checks — `/app` passes no props, so none activate. Each control component accepts `embedded`; locked buttons have `onClick` gated and visual disabled styling. `DemoSection.jsx` lazy-loads via `next/dynamic` with `ssr: false`.

## Diagonal Pentatonic

A sub-mode of Scale Positions activated by the "Diagonal" toggle. Shows the major pentatonic scale (degrees 1,2,3,5,6) played diagonally across the fretboard as a staircase pattern, with non-pentatonic degrees (4, 7) shown faded.

**Algorithm (`getDiagonalPentatonicSets()` in `lib/scales.js`):**

Pre-computes exact `(string, fret)` coordinates for two diagonal paths (Pattern A and B). Returns `{ sets: [{ notes: [...] }] }` where each note has `{ stringIndex, fret, degree, finger, positionGroupIndex, isPentatonic }`.

**Per-string degree assignment:** Each pattern alternates between two degree groups across strings:
- **Pattern A:** strings 5,3,1 (low E, D, B) get degrees {5,6} (2 notes); strings 4,2,0 (A, G, high E) get degrees {1,2,3} (3 notes)
- **Pattern B:** inverted — strings 5,3,1 get {1,2,3}; strings 4,2,0 get {5,6}

**Note selection per string:** Process strings from low E (si=5) to high E (si=0), maintaining a `floorFret` that advances upward:
1. Find all frets matching the assigned degrees at ≥ `floorFret`
2. Group into contiguous clusters (gap ≤ 5 frets), select first complete cluster
3. **Fretboard edge fallback:** If no complete cluster, accept partial (≥ 2 notes); if still insufficient, broaden to any pentatonic degree at ≥ `floorFret`
4. Only advance `floorFret` on complete matches — keeps flexibility for subsequent strings near the fretboard edge

**Extension:** On high E (si=0), if only 2 pentatonic notes selected, try adding the next pentatonic degree within 3 frets above the last note.

**Non-pentatonic notes:** After computing pentatonic notes, degrees 4 and 7 within ±2 frets of each string's pentatonic range are added with `isPentatonic: false`.

**Fingers:** Computed per string pair (5+4, 3+2, 1+0) — `baseFret` = min fret across both strings, `finger = clamp(fret - baseFret + 1, 1, 4)`.

**Set ordering:** Set 1 = whichever pattern has lower min fret, Set 2 = the other.

**State:** `scalePositionState.diagonalPentatonic` (bool) and `scalePositionState.diagonalSet` (0 or 1).

**Rendering:** `FretboardTrainer` builds a `diagonalNoteMap` (Map keyed by `"stringIndex-fret"`) for O(1) lookups. `getNoteDisplayData()` does a single Map lookup — each match returns `colorOverride: { positionGroupIndex, isPentatonic }` that `ScalePositionDot` passes to `getDiagonalPositionColor()`. Non-pentatonic notes (`isPentatonic: false`) get `isChordTone: false` for faded/dashed treatment. Position buttons are disabled when diagonal is active; arrow keys toggle between sets.

**Colors:** `DIAGONAL_POSITION_COLORS` in `lib/colors.js` — Purple (pos 0, strings 5+4), Teal (pos 1, strings 3+2), Amber (pos 2, strings 1+0). Root notes always red diamond. Non-pentatonic notes gray.

