# Codebase Audit Report

**Date:** 2026-02-13
**Scope:** Full codebase review of fretboard-trainer

---

## Critical / High Severity

### 1. Stale Closures in Quiz Callbacks

**File:** `src/components/FretboardTrainer.jsx`
**Severity:** Critical
**Category:** State/Effects

Multiple `useCallback` and `useEffect` hooks have incomplete dependency arrays, suppressed with `eslint-disable-line`. This causes quiz logic to use stale state values.

- **Lines ~407-422**: Effects that trigger quiz generation on mode change list only `[mode]` or `[selectedKey]` as dependencies but call `generateIdentifyQuiz`, `generateFindQuiz`, and `generateIntervalQuizNote` — all of which close over `keyNotes` and `region`. If the user changes key or region while in a quiz mode, the next question uses outdated values.
- **Line ~282-306**: `generateFindQuiz` is memoized with `[keyNotes, region]`, but the `handleFindAnswer` function that calls it via `setTimeout` is not memoized at all. The timeout captures a stale reference to the callback.
- **Line ~330-340**: `generateIntervalQuizNote` has incomplete dependencies, so interval quizzes can use stale key/region data.

**Impact:** Incorrect quiz questions after changing key or region mid-session.

**Fix:** Properly list all dependencies in `useCallback`/`useEffect` hooks and remove `eslint-disable` suppressions. Consider using refs for values that should always be current without triggering re-memoization.

---

### 2. Infinite Recursion Risk in `generateFindQuiz`

**File:** `src/components/FretboardTrainer.jsx` (line ~293)
**Severity:** Critical
**Category:** Logic

```javascript
if (validFrets.length === 0) return generateFindQuiz();
```

If the selected region contains no notes in the current key (an edge case but possible), this recursion has no base case or depth limit. It will cause a stack overflow crash.

**Fix:** Add a fallback (e.g., expand to full fretboard) or a recursion counter that bails out after a few attempts.

---

### 3. Negative Fret Positions from `getPositionFret()`

**File:** `src/components/lib/scales.js` (line ~142)
**Severity:** Critical
**Category:** Logic

```javascript
return rootFret - (form.rootFinger - 1);
```

For forms 6(4) and 5(4) where `rootFinger = 4`, the result can go negative (e.g., `1 - 3 = -2`). The upstream `getRootFret()` function at line ~132 explicitly avoids returning fret 0, but `getPositionFret` can still produce 0 or negative values.

**Impact:** Negative fret positions produce incorrect scale position displays for certain key/form combinations. Notes may be rendered off-board or at wrong positions.

**Fix:** Clamp the return value to `[0, FRET_COUNT]` or wrap around using modular arithmetic (add 12 when result is negative).

---

### 4. Quiz Double-Click Race Condition

**File:** `src/components/FretboardTrainer.jsx` (lines ~308-327)
**Severity:** High
**Category:** State

`handleFindAnswer` guards against duplicate answers with `if (selectedAnswer !== null) return`, but two rapid clicks can both pass this check before `setSelectedAnswer` has flushed. Each queues its own `setTimeout(() => generateFindQuiz(), ...)`, causing double quiz generation — the user sees a question flash by instantly.

**Fix:** Use a ref-based guard (`useRef`) instead of state for the lock, since refs update synchronously.

---

### 5. Timeout Accumulation on Mode Switch

**File:** `src/components/FretboardTrainer.jsx` (lines ~320, 325, 357, 365)
**Severity:** High
**Category:** Memory/State

Multiple `setTimeout` calls are created for quiz transitions but their IDs are never stored. If the user switches modes while a timeout is pending, the callback fires against the wrong mode's state, potentially causing UI glitches or errors.

**Fix:** Store timeout IDs in a ref and clear them in `useEffect` cleanup functions on mode change.

---

## Medium Severity

### 6. No Bounds Check on `FORMS[]` Access

**File:** `src/components/lib/scales.js` (lines ~122, 140, 150, 174)
**Severity:** Medium
**Category:** Safety

Four exported functions (`getPositionLabel`, `getPositionFret`, `getScalePositionNotes`, `isInScalePosition`) index into `FORMS[positionIndex]` without validating that `positionIndex` is in range `[0, 6]`. An out-of-range index crashes with `Cannot read property of undefined`.

**Fix:** Add early-return guard: `if (positionIndex < 0 || positionIndex >= FORMS.length) return null;`

---

### 7. Identify Quiz Results Phase Visibility Bug

**File:** `src/components/FretboardTrainer.jsx` (lines ~589-594)
**Severity:** Medium
**Category:** Logic

In quiz identify mode's "results" phase, `isNoteVisible` still filters by region and key membership. Notes outside the region that were part of the quiz won't display during review, making the results incomplete.

**Fix:** In the results phase, show all notes that were part of the quiz regardless of region filtering.

---

### 8. Harmonies Panel State Desynchronization

**File:** `src/components/FretboardTrainer.jsx` (lines ~104-108, 636-648)
**Severity:** Medium
**Category:** State

`harmoniesState.keyRoot` and `triadState.rootNote` are synced via `handleTriadRootChange`, but when the user taps a chord in the HarmoniesPanel, only `triadState.rootNote` updates — `harmoniesState.keyRoot` becomes stale. On subsequent renders, the harmonies panel may show chords for the wrong key.

**Fix:** Either derive `keyRoot` from `triadState.rootNote` (single source of truth) or ensure all code paths that update `triadState.rootNote` also update `harmoniesState.keyRoot`.

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

### 11. Missing Null Check in `handleFinishIdentify`

**File:** `src/components/FretboardTrainer.jsx` (lines ~369-398)
**Severity:** Medium
**Category:** Safety

Accesses `quizTarget.name` without verifying `quizTarget` exists. If the user rapidly clicks "Finish" before quiz generation completes, this throws.

**Fix:** Add early return: `if (!quizTarget) return;`

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
