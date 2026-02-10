# Fretboard Navigator

## What This Is

A guitar fretboard note memorization trainer. Users learn diatonic scale note positions across the fretboard through six interactive modes:

**Learn modes:**
- **Explore** — View all notes in a key, toggle naturals/sharps/scale degrees, click to reveal/hide individual notes, use "Hide All" to self-test
- **Scale Positions** — Navigate 5 major scale form patterns: 6(1), 6(4), 5(1), 5(4), 4(1) (e.g. 6(4) = root on string 6, finger 4). Forms are hardcoded note-for-note from standard guitar pedagogy. Dots show scale degrees by default; toggles switch to note names or fingering
- **CAGED** — See how 5 open chord shapes (C, A, G, E, D) tile across the fretboard, with chord tone (R, 3, 5) vs scale tone distinction. Each shape is anchored to a root string with fret offsets relative to the root note, and maps to a scale position: C→5(4), A→5(1), G→6(4), E→6(1), D→4(1). Colors: C=purple, A=orange, G=blue, E=red, D=green
- **Intervals** — View notes as interval labels (R, 2, 3...) with filtering, includes interval quiz sub-mode

**Quiz modes:**
- **Find Note** — A fret position is highlighted with a pulsing dot; pick the correct note name from multiple-choice bubbles
- **Name Note** — Given a note name, click every occurrence of that note on the fretboard

Supports 8 diatonic keys, 6 fret regions, per-string filtering, streak tracking, and score/accuracy stats.

## Tech Stack

- **Next.js 16** (App Router) with JavaScript (not TypeScript)
- **React 19** — no state management library, plain `useState` hooks
- **Tailwind CSS v4** — CSS-based config via `@import "tailwindcss"` in globals.css (no tailwind.config file)
- **Vercel** — zero-config deployment target

## Architecture

One `"use client"` boundary at `FretboardTrainer.jsx` — the entire app is interactive. No server components below `page.js`.

Dynamic styles (computed colors per scale degree, quiz state indicators) use inline `style` props. Global animations (fadeIn, pulseGlow, rootPulse, slideDown, positionTransition, shapePulse) are defined as `@keyframes` in `globals.css`.

The orchestrator uses `getNoteDisplayData(s, f)` to return mode-specific metadata for each fret position, which FretCell uses to dispatch to the correct dot component (NoteDot, ScalePositionDot, CAGEDDot).

## File Structure

```
src/
├── app/
│   ├── globals.css              # Tailwind directives + Google Fonts + @keyframes
│   ├── layout.js                # Root layout with metadata
│   └── page.js                  # Imports <FretboardTrainer />
└── components/
    ├── FretboardTrainer.jsx     # State orchestrator ("use client"), all hooks & handlers
    ├── Legend.jsx               # Mode-specific color/shape legends
    ├── Tips.jsx                 # Mode-specific instructions
    ├── controls/
    │   ├── ModeSelector.jsx     # Grouped two-row mode tabs (Learn + Quiz)
    │   ├── KeySelector.jsx      # Dropdown: 8 diatonic keys
    │   ├── RegionSelector.jsx   # Dropdown: fret region filter
    │   ├── ExploreToggles.jsx   # Naturals, Sharps, Degrees, Root Highlight, Hide All
    │   ├── StringToggles.jsx    # Per-string circular toggle buttons
    │   ├── ScalePositionControls.jsx  # 5 form buttons (6(1)..4(1)), prev/next, notes/fingering toggles
    │   ├── CAGEDControls.jsx    # Shape picker (C/A/G/E/D + All) with position labels, scale tones toggle
    │   └── IntervalControls.jsx # Interval/note toggle, degree filter, quiz toggle
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
        ├── fretboard.js         # FRET_COUNT (15), FRET_MARKERS, DOUBLE_MARKERS,
        │                        # MODES (6 modes), FRET_REGIONS — zero React dependencies
        ├── colors.js            # getNoteColor(), CAGED_SHAPE_COLORS, getScalePositionColor(),
        │                        # getCAGEDColor() — degree color map, quiz/root overrides
        ├── scales.js            # FORMS (5 hardcoded major scale form patterns), getPositionLabel(),
        │                        # getPositionFret(), getScalePositionNotes(),
        │                        # isInScalePosition() — lookup-based, zero React dependencies
        ├── caged.js             # CAGED_ORDER, getCAGEDShapes(), getCAGEDInfo()
        │                        # Shapes use rootString anchoring + root-relative offsets
        │                        # Imports STRING_TUNING from music.js
        └── intervals.js         # INTERVAL_LABELS, INTERVAL_NAMES, getIntervalLabel(),
                                 # getIntervalDegree(), generateIntervalQuiz()
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

## Extension Points (no architectural changes needed)

- **New quiz modes:** Add to `MODES` in `lib/fretboard.js`, add generator in orchestrator, add quiz component
- **Alternative tunings:** Parameterize `STRING_TUNING` in `lib/music.js`
- **Audio feedback:** Add utility module in `lib/`, call from handlers
- **localStorage persistence:** Swap `useState` with a `useLocalStorage` hook
- **Additional scales:** Extend `DIATONIC_KEYS` in `lib/music.js`
- **Mobile layout:** Tailwind responsive utilities on existing components
- **Other scales/modes:** Add new form pattern arrays to `FORMS` in `lib/scales.js` with `{ stringIndex, offset, degree }` entries — the runtime maps offsets to actual frets based on the selected key
