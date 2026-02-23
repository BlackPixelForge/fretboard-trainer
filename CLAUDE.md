# Fretboard Navigator

## What This Is

A guitar fretboard note memorization trainer. Users learn diatonic scale note positions across the fretboard through eight interactive modes:

**Learn modes:**
- **Explore** — View all notes in a key, toggle naturals/sharps/scale degrees, click to reveal/hide individual notes, use "Hide All" to self-test
- **Scale Positions** — Navigate 7 major scale position forms that tile seamlessly across the fretboard. Named by root string + fretting finger: 6(1), 6(2), 6(4), 5(1), 5(2), 5(4), 4(1) (e.g. 6(4) = root on string 6, finger 4). These 7 positions provide complete fretboard coverage — ascending in pitch they cycle: 6(1)→6(2)→6(4)→5(1)→5(2)→5(4)→4(1)→[repeat]. 5 of the 7 map directly to CAGED shapes; the remaining 2 — 6(2) and 5(2) — are connecting positions that fill the gaps between CAGED shapes. Forms are hardcoded note-for-note from standard guitar pedagogy. Dots show scale degrees by default; toggles switch to note names or fingering. **Diagonal Pentatonic** sub-mode shows the major pentatonic (degrees 1,2,3,5,6) played diagonally across 2–3 adjacent positions. Two fixed sets cover the fretboard — toggle Set 1 / Set 2 or use arrow keys. Non-pentatonic degrees (4,7) shown faded/dashed. Each position gets a distinct color (purple/teal/amber). See "Diagonal Pentatonic" section below for algorithm details
- **CAGED** — See how 5 open chord shapes (C, A, G, E, D) tile across the fretboard, with chord tone (R, 3, 5) vs scale tone distinction. Each shape is anchored to a root string with fret offsets relative to the root note, and maps to one of the 7 scale positions: E→6(1), G→6(4), A→5(1), C→5(4), D→4(1). The two positions without CAGED equivalents — 6(2) and 5(2) — bridge the gaps between shapes. Colors: C=purple, A=orange, G=blue, E=red, D=green
- **Intervals** — View notes as interval labels (R, 2, 3...) with filtering, includes interval quiz sub-mode
- **1-Fret Rule** — Inverts Scale Positions: pick a fret position and see which 7 keys the 7 forms produce at that position. At any fret, each form yields a different key; shift ±1 fret to cover all 12 chromatic keys. Key is computed (not selected from dropdown) via `getRootNoteForPosition()` + `computeKeyNotes()`, supporting all 12 keys. Arrow keys step through forms with ascending root fret offsets (0, +2, +4) per root-string group. Chord toggle filters to R/3/5 chord tones only. Reuses `ScalePositionDot` — no new dot component needed.
- **Triads** — Browse 48 movable triad shapes (4 string sets × 4 qualities × 3 inversions) for any chromatic root. Shapes defined in `lib/triads.js` with `TRIAD_SHAPES[inversionKey][shapeIndex]`, each containing `{ stringSetIndex, quality, rootSi, notes[] }`. Shape index pattern: `(stringSetIndex * 4) + qualityOffset` where major=0, minor=1, diminished=2, augmented=3. Includes auto-cycle play/pause with speed slider, arrow key stepping, notes/fingering toggles. Collapsible `TriadExplainer` panel teaches triad theory with context-aware content. Collapsible `HarmoniesPanel` shows harmonized chords (I-ii-iii-IV-V-vi-vii°) for the current key — tapping a chord navigates to that quality's triad shape on the current string set. Panel maintains its own `keyRoot` separate from `triadState.rootNote` so chord taps don't shift the displayed key.

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

## Origin

Decomposed from a single 850-line `fretboard.jsx` React component. The original file is preserved at `../Fretboard/fretboard.jsx` for reference.

## Repo

https://github.com/BlackPixelForge/fretboard-trainer

## Commands

```bash
npm run dev    # Start dev server (localhost:3000)
npm run build  # Production build
npm run start  # Serve production build
```

## Embedded Demo Mode

`FretboardTrainer` accepts an optional `embedded` prop. When truthy, the component runs in a restricted demo mode designed for the landing page. All restrictions are gated behind `if (embedded)` checks — the `/app` route renders `<FretboardTrainer />` with no props, so none of these conditions activate.

**Layout changes (when `embedded`):**
- Outer wrapper skips `app-grain` / `app-glow` classes and `minHeight: 100vh` (landing page provides its own)
- Title row hidden (mode tabs remain)
- Keyboard listeners disabled (Scale Positions, One Fret Rule, Triads arrow keys)
- `KeySelector`, `RegionSelector`, and their divider hidden — key locked to C major

**Per-mode control restrictions (when `embedded`):**
| Mode | Allowed | Locked (35% opacity, `cursor: not-allowed`) |
|------|---------|----------------------------------------------|
| Scale Positions | 6(1) only | All other positions; prev/next arrows hidden; diagonal toggle hidden |
| CAGED | C and A shapes | "All" button hidden; G, E, D dimmed |
| Intervals | R and 5 filters | All other degree filters; quiz toggle hidden |
| 1-Fret Rule | 6(1) and 6(2) on fret 5 | All other forms; fret selector hidden; prev/next hidden |
| Triads | Root position, root C | Root dropdown disabled; 1st/2nd inversions dimmed; shape stepping works |
| Name Note / Find Note | — | Hidden from ModeSelector entirely |

**Implementation pattern:** Each control component accepts an `embedded` prop. Locked buttons have their `onClick` gated (`!locked && handler()`), plus visual disabled styling. Initial state overrides (e.g. `cagedState.selectedShape: "C"`, `intervalFilter: {1, 5}`) are set in `useState` calls.

`DemoSection.jsx` lazy-loads `FretboardTrainer` via `next/dynamic` with `ssr: false` to keep the landing page bundle small.

## Diagonal Pentatonic

A sub-mode of Scale Positions activated by the "Diagonal" toggle. Shows the major pentatonic scale (degrees 1,2,3,5,6) played diagonally across 2–3 adjacent scale positions, creating a path up or down the neck.

**Algorithm (`getDiagonalPentatonicSets()` in `lib/scales.js`):**

Two fixed groups of form indices (same for all keys):
- **Group A:** form indices 4 `5(2)`, 2 `6(4)`, and optionally 1 `6(2)`
- **Group B:** form indices 0 `6(1)` and 6 `4(1)`

**6(2) inclusion:** 6(2) joins Group A when `posFret(6(4)) < posFret(6(2)) < posFret(6(1))` — true for C, D, A, E, Bb, Eb; false for G, F where frets wrap past 12.

**Set assignment:** Set 1 = group with lower min position fret, Set 2 = the other.

**Extensions:** 2-position sets get one extra degree-3 note on a boundary string to fill the diagonal gap:
- Group B → degree 3 on B string (stringIndex 1)
- Group A (when only 2 positions) → degree 3 on G string (stringIndex 2)
- Extension fret = nearest occurrence of that note within frets 0–19 closest to the set's fret range midpoint

**State:** `scalePositionState.diagonalPentatonic` (bool) and `scalePositionState.diagonalSet` (0 or 1).

**Rendering:** `getNoteDisplayData()` loops through `activeDiagonalSet.positions`, calling `isInScalePosition()` per position. Each match returns a `colorOverride: { positionGroupIndex, isPentatonic }` that `ScalePositionDot` passes to `getDiagonalPositionColor()`. Non-pentatonic notes get `isChordTone: false` for faded/dashed treatment. Position buttons are disabled when diagonal is active; arrow keys toggle between sets.

**Colors:** `DIAGONAL_POSITION_COLORS` in `lib/colors.js` — Purple (pos 0), Teal (pos 1), Amber (pos 2). Root notes always red diamond. Non-pentatonic notes gray.

## Extension Points (no architectural changes needed)

- **New quiz modes:** Add to `MODES` in `lib/fretboard.js`, add generator in orchestrator, add quiz component
- **Alternative tunings:** Parameterize `STRING_TUNING` in `lib/music.js`
- **Audio feedback:** Add utility module in `lib/`, call from handlers
- **localStorage persistence:** Swap `useState` with a `useLocalStorage` hook
- **Additional scales:** Extend `DIATONIC_KEYS` in `lib/music.js`
- **Mobile layout:** Tailwind responsive utilities on existing components
- **Other scales/modes:** Add new form pattern arrays to `FORMS` in `lib/scales.js` with `{ stringIndex, offset, degree }` entries — the runtime maps offsets to actual frets based on the selected key
