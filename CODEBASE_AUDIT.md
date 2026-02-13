# Codebase Audit Report

**Date:** 2026-02-13
**Scope:** Full codebase review of fretboard-trainer

---

## Critical / High Severity

### 1. ~~Stale Closures in Quiz Callbacks~~ ✅ FIXED

**File:** `src/components/FretboardTrainer.jsx`
**Severity:** Critical
**Category:** State/Effects
**Status:** Fixed

**What was wrong:** Multiple `useCallback` and `useEffect` hooks had incomplete dependency arrays, suppressed with `eslint-disable-line`. Quiz logic used stale state values when key or region changed mid-session.

**What was fixed:**
- Split the combined quiz effect into two separate effects with proper deps: `[mode, generateIdentifyQuiz]` and `[mode, generateFindQuiz]` — each re-runs when its generator's closed-over values (`keyNotes`, `region`) change
- Removed the redundant `[selectedKey]` effect (now covered by generator deps)
- Added `generateIntervalQuizNote` to the interval quiz effect deps
- Added `useRef`-based refs (`generateFindQuizRef`, `generateIntervalQuizNoteRef`) so `setTimeout` callbacks always call the latest generator version
- Removed `eslint-disable` suppressions on fixed effects

---

### 2. ~~Infinite Recursion Risk in `generateFindQuiz`~~ ✅ FIXED

**File:** `src/components/FretboardTrainer.jsx` (line ~293)
**Severity:** Critical
**Category:** Logic
**Status:** Fixed

**What was wrong:** `generateFindQuiz` picked a random string, checked for valid frets in the region, and recursively called itself if none were found — with no base case or depth limit, risking a stack overflow.

**What was fixed:** Replaced the single-string-then-recurse approach with upfront collection of all valid (string, fret) positions across all 6 strings. Picks randomly from the full set. If no valid positions exist (impossible in practice but guarded), returns early instead of recursing.

---

### 3. ~~Negative Fret Positions from `getPositionFret()`~~ ✅ FIXED

**File:** `src/components/lib/scales.js` (line ~142)
**Severity:** Critical
**Category:** Logic
**Status:** Fixed

**What was wrong:** `getPositionFret()` computed `rootFret - (rootFinger - 1)` which could go negative for forms 6(4) and 5(4) where `rootFinger = 4` (e.g., `1 - 3 = -2`), producing incorrect position fret values used for display and auto-scrolling.

**What was fixed:** Moved the fix into `getRootFret()` so all callers benefit: if any note in the form would land at a negative fret (`rootFret + minOffset < 0`), the root is shifted up one octave (+12 frets). This ensures the full position renders at the first valid octave — e.g., key of F with form 6(4) now displays with root at fret 13. `getPositionFret` retains a safety-net wrap for defensive coverage.

---

### 4. ~~Quiz Double-Click Race Condition~~ ✅ FIXED

**File:** `src/components/FretboardTrainer.jsx` (lines ~308-327)
**Severity:** High
**Category:** State
**Status:** Fixed

**What was wrong:** `handleFindAnswer` and `handleIntervalAnswer` used state-based guards (`selectedAnswer !== null`) that two rapid clicks could both pass before `setState` flushed, causing double quiz generation.

**What was fixed:** Replaced state-based guards with synchronous ref-based locks (`findAnswerLockRef`, `intervalAnswerLockRef`). Lock is set to `true` immediately on answer, reset to `false` when the next quiz question generates. Refs update synchronously so concurrent clicks are properly blocked.

---

### 5. ~~Timeout Accumulation on Mode Switch~~ ✅ FIXED

**File:** `src/components/FretboardTrainer.jsx` (lines ~320, 325, 357, 365)
**Severity:** High
**Category:** Memory/State
**Status:** Fixed

**What was wrong:** Four `setTimeout` calls in `handleFindAnswer` and `handleIntervalAnswer` were created for quiz transitions but their IDs were never stored. If the user switched modes while a timeout was pending, the callback fired against the wrong mode's state.

**What was fixed:** Added a `quizTimeoutsRef` to track all pending timeout IDs. Replaced bare `setTimeout` calls with a `scheduleQuizTimeout` helper that pushes each ID into the ref. Added a `useEffect` with `[mode]` dependency whose cleanup clears all pending timeouts on mode change.

---

## Medium Severity

### 6. ~~No Bounds Check on `FORMS[]` Access~~ ✅ FIXED

**File:** `src/components/lib/scales.js` (lines ~122, 140, 150, 174)
**Severity:** Medium
**Category:** Safety
**Status:** Fixed

**What was wrong:** Five exported functions (`getPositionLabel`, `getPositionFret`, `getScalePositionNotes`, `isInScalePosition`, `getRootNoteForPosition`) indexed into `FORMS[positionIndex]` without validating the index was in range, crashing with `Cannot read property of undefined` on out-of-range values.

**What was fixed:** Added early-return bounds guards to all five functions. Functions return `null` (or `[]` for `getScalePositionNotes`) when the index is out of range.

---

### 7. ~~Identify Quiz Results Phase Visibility Bug~~ ✅ FIXED

**File:** `src/components/FretboardTrainer.jsx` (lines ~589-594)
**Severity:** Medium
**Category:** Logic
**Status:** Fixed

**What was wrong:** In quiz identify mode's "results" phase, `isNoteVisible` and FretCell's rendering gate both filtered by the current region. If the user changed the region selector after finishing a quiz, result dots (correct/incorrect/missed) would disappear.

**What was fixed:** Bypassed the region filter during the results phase in both places: `isNoteVisible` (FretboardTrainer.jsx) skips region filtering when `identifyState.phase === "results"`, and FretCell.jsx allows results-phase dots to render outside the current region via `(isInRegion || identifyState?.phase === "results")`.

---

### 8. ~~Harmonies Panel State Desynchronization~~ ✅ BY DESIGN

**File:** `src/components/FretboardTrainer.jsx` (lines ~104-108, 636-648)
**Severity:** Medium
**Category:** State
**Status:** By design — not a bug

**Why this is intentional:** `harmoniesState.keyRoot` deliberately stays independent of `triadState.rootNote` after chord taps. When the user taps a chord in the HarmoniesPanel (e.g., "Em" in C Major), the fretboard navigates to that triad shape (`rootNote` → E) while the panel keeps showing C Major chords (`keyRoot` → C). This lets users browse multiple chords from the same key without the panel resetting each time. The root picker (`handleTriadRootChange`) correctly syncs both values when the user explicitly changes the key. See CLAUDE.md: "Panel maintains its own `keyRoot` separate from `triadState.rootNote` so chord taps don't shift the displayed key."

---

### 9. Direct DOM Style Mutation

**File:** `src/components/HarmoniesPanel.jsx` (lines ~104-105, 188-199)
**Severity:** Medium
**Category:** React Patterns

Multiple `onMouseEnter`/`onMouseLeave` handlers directly mutate `e.currentTarget.style`. This bypasses React's reconciliation and can cause style inconsistencies if React re-renders between event and read.

**Fix:** Use React state or CSS `:hover` pseudo-classes instead of direct DOM manipulation.

---

### 10. Clickable Divs Instead of Buttons

**File:** `src/components/fretboard/FretCell.jsx` (lines ~150, 167)
**Severity:** Medium
**Category:** Accessibility

Fret cells with click handlers use `<div onClick={...}>` instead of `<button>`. These are invisible to keyboard navigation (Tab, Enter/Space) and screen readers. This affects Explore mode's reveal/hide functionality.

**Fix:** Replace clickable `<div>` elements with `<button>` elements styled to look the same, or add `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers.

---

### 11. ~~Missing Null Check in `handleFinishIdentify`~~ ✅ FIXED

**File:** `src/components/FretboardTrainer.jsx` (lines ~369-398)
**Severity:** Medium
**Category:** Safety
**Status:** Fixed

**What was wrong:** `handleFinishIdentify` accessed `quizTarget.name` without verifying `quizTarget` exists. Rapidly clicking "Finish" before quiz generation completed would throw.

**What was fixed:** Added early return guard: `if (!quizTarget) return;`

---

## Low Severity

### 12. Missing ARIA Labels on Navigation Buttons

**Files:** `src/components/controls/ScalePositionControls.jsx`, `src/components/controls/TriadControls.jsx`, `src/components/TriadExplainer.jsx`
**Severity:** Low
**Category:** Accessibility

Prev/next buttons, stepper buttons, and collapsible panel toggles lack `aria-label` attributes, making them opaque to screen readers.

**Fix:** Add descriptive `aria-label` props (e.g., `aria-label="Previous scale position"`).

---

### 13. Array Index as React Key

**File:** `src/components/fretboard/Fretboard.jsx`
**Severity:** Low
**Category:** React Patterns

`STRING_TUNING.map((string, si) => <StringRow key={si} ...>)` uses array index as key. Since strings are never reordered this is safe in practice, but `key={string.note}` would be more robust.

---

### 14. No Font Fallback Stack

**File:** `src/app/globals.css`
**Severity:** Low
**Category:** CSS

Google Fonts (`JetBrains Mono`, `Outfit`) are imported without system font fallbacks. If the CDN is slow or blocked, text renders in the browser default until fonts load.

**Fix:** Add fallback fonts: `font-family: 'JetBrains Mono', 'Courier New', monospace;`

---

### 15. No Error Boundary

**Severity:** Low
**Category:** Resilience

No React error boundary wraps `FretboardTrainer`. An uncaught error in any child component will crash the entire app with a white screen rather than showing a fallback UI.

**Fix:** Add an error boundary component wrapping `<FretboardTrainer />` in `page.js`.

---

### 16. Undocumented Overlapping Fret Regions

**File:** `src/components/lib/fretboard.js` (lines ~16-24)
**Severity:** Low
**Category:** Documentation

Adjacent `FRET_REGIONS` share frets (e.g., frets 7-8 appear in both `mid_low` and `mid`). This appears intentional for smooth practice transitions but is undocumented.

**Fix:** Add a comment explaining the intentional overlap.

---

## Recommended Fix Order

| Priority | Issues | Rationale |
|----------|--------|-----------|
| 1 | #1 (Stale closures) | Most impactful bug — causes wrong quiz behavior |
| 2 | #2 (Infinite recursion) | One-line fix to prevent potential crash |
| 3 | #3 (Negative fret positions) | Clamp values to valid range |
| 4 | #4, #5 (Race conditions & timeouts) | Use refs for quiz answer locking and timeout cleanup |
| 5 | #11 (Null check) | One-line guard to prevent crash |
| 6 | #6 (Bounds checks) | Defensive guards on `FORMS[]` access |
| 7 | #7, #8 (Quiz visibility, state sync) | Logic corrections for edge cases |
| 8 | #9, #10 (DOM mutation, a11y) | React pattern and accessibility improvements |
| 9 | #15 (Error boundary) | Production resilience |
| 10 | #12, #13, #14, #16 (Low items) | Polish and documentation |
