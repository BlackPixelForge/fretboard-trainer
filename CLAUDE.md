# Fretboard Navigator

## What This Is

A guitar fretboard note memorization trainer. Users learn diatonic scale note positions across the fretboard through three interactive modes:

- **Explore** — View all notes in a key, toggle naturals/sharps/scale degrees, click to reveal/hide individual notes, use "Hide All" to self-test
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

Dynamic styles (computed colors per scale degree, quiz state indicators) use inline `style` props. Global animations (fadeIn, pulseGlow, rootPulse, slideDown) are defined as `@keyframes` in `globals.css`.

No state management library is needed — 18 `useState` hooks in the orchestrator with max 3-level prop drilling.

## File Structure

```
src/
├── app/
│   ├── globals.css              # Tailwind directives + Google Fonts + @keyframes
│   ├── layout.js                # Root layout with metadata
│   └── page.js                  # Imports <FretboardTrainer />
└── components/
    ├── FretboardTrainer.jsx     # State orchestrator ("use client"), all hooks & handlers
    ├── Legend.jsx               # Scale degree color legend
    ├── Tips.jsx                 # Mode-specific instructions
    ├── controls/
    │   ├── ModeSelector.jsx     # Explore / Find Note / Name Note tabs
    │   ├── KeySelector.jsx      # Dropdown: 8 diatonic keys
    │   ├── RegionSelector.jsx   # Dropdown: fret region filter
    │   ├── ExploreToggles.jsx   # Naturals, Sharps, Degrees, Root Highlight, Hide All
    │   └── StringToggles.jsx    # Per-string circular toggle buttons
    ├── fretboard/
    │   ├── Fretboard.jsx        # Board container (wood background, shadow)
    │   ├── FretNumbers.jsx      # Fret number header row
    │   ├── FretMarkers.jsx      # Dot inlays (single + double at 12th)
    │   ├── StringRow.jsx        # One guitar string (label + fret cells)
    │   ├── FretCell.jsx         # Wire + note at one fret position
    │   ├── NoteDot.jsx          # Normal note circle (explore/identify modes)
    │   └── QuizTarget.jsx       # Pulsing target dot / revealed answer (find mode)
    ├── quiz/
    │   ├── QuizPrompt.jsx       # "Find all C notes" / "What note is on..."
    │   ├── QuizFeedback.jsx     # Correct/wrong message flash
    │   ├── AnswerBubbles.jsx    # Multiple choice note circles
    │   └── ScoreBar.jsx         # Score, accuracy %, streak, best streak
    └── lib/
        ├── music.js             # NOTES, STRING_TUNING, DIATONIC_KEYS, SCALE_DEGREES,
        │                        # getNoteAt(), getNoteName(), isInKey(), getScaleDegree(),
        │                        # getStringLabel() — zero React dependencies
        ├── fretboard.js         # FRET_COUNT (15), FRET_MARKERS, DOUBLE_MARKERS,
        │                        # MODES, FRET_REGIONS — zero React dependencies
        └── colors.js            # getNoteColor() — degree color map, quiz/root overrides
```

## Key Data Flow

1. `FretboardTrainer` holds all state and defines `isNoteVisible()`, `toggleReveal()`, quiz generators
2. State flows down: `FretboardTrainer` → `Fretboard` → `StringRow` → `FretCell` → `NoteDot`/`QuizTarget`
3. Events flow up via callbacks: `onToggleReveal`, `onAnswer`, `onModeChange`, etc.
4. `lib/` modules are pure functions — imported by both components and the orchestrator

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
