# Codebase Review — Fretboard Navigator

**Date:** 2026-02-13
**Scope:** Full codebase review across architecture, security, and maintainability
**Codebase:** Next.js 16 / React 19 guitar fretboard trainer (~30 components, 8 lib modules)

---

## Summary

The codebase is well-structured for its origin (decomposed from a single 850-line file) with a clean separation between pure logic (`lib/`) and React components. The architecture is sound for a small-to-medium frontend app. The issues below are ordered by severity within each category and focus on practical improvements for scalability, correctness, and long-term maintainability.

---

## Critical Severity

### 1. No Test Suite
**Pass:** Maintainability | **Files:** entire project

Zero test files exist. No testing framework is configured (no jest, vitest, or @testing-library in `package.json`). The pure function modules in `lib/` — scale position calculations, CAGED shape tiling, triad positioning, interval logic, and quiz generators — are complex, highly testable, and the foundation the entire UI renders from. A bug in `isInScalePosition()` or `getCAGEDShapes()` silently produces wrong notes on the fretboard with no safety net.

**Recommendation:** Add vitest + @testing-library/react. Prioritize unit tests for `lib/scales.js`, `lib/caged.js`, `lib/triads.js`, and `lib/harmonies.js` first since they are pure functions with deterministic outputs.

---

## High Severity

### 2. Monolithic Orchestrator Component (~980 lines, 20+ useState hooks)
**Pass:** Architecture | **File:** `FretboardTrainer.jsx`

`FretboardTrainer.jsx` holds all application state, all mode-specific business logic, all quiz generators, all keyboard handlers, and all auto-scroll logic in a single component. This is a classic "god component":

- 20+ `useState` calls (lines 36-113)
- 7 `useEffect` hooks for mode-specific behaviors (lines 427-587)
- Mode-specific logic branches duplicated across `isNoteVisible()`, `getNoteDisplayData()`, `toggleReveal()`, and `FretCell.jsx`
- Adding a new mode requires changes in 4+ separate functions within this file

**Recommendation:** Extract mode-specific logic into custom hooks (e.g., `useTriadMode()`, `useQuizMode()`, `useOneFretRule()`). Each hook owns its state and exposes only the interface the orchestrator needs. This preserves the single `"use client"` boundary while reducing the orchestrator to ~200 lines of composition.

### 3. Pervasive Inline Style Objects Instead of Tailwind
**Pass:** Maintainability | **Files:** all component files

Nearly every component uses 10-30 line inline `style` props for what is mostly static CSS. Examples:

- `FretboardTrainer.jsx:710-718` — root container styles
- `NoteDot.jsx:6-36` — entire dot rendering
- `Legend.jsx` — dozens of inline style blocks
- `HarmoniesPanel.jsx` — every element has a style prop

The project imports Tailwind CSS v4 but barely uses it beyond a handful of utility classes (`p-3`, `mb-3`, `text-center`). This makes it difficult to maintain visual consistency, apply theme changes, or find where specific visual properties are set.

**Recommendation:** Migrate static inline styles to Tailwind utility classes. Reserve inline styles only for truly dynamic values (computed colors per scale degree, conditional transforms). This would dramatically reduce component verbosity and improve consistency.

### 4. Excessive Prop Drilling (4 levels, 15+ props)
**Pass:** Architecture | **Files:** `Fretboard.jsx`, `StringRow.jsx`, `FretCell.jsx`

Props are threaded 4 levels deep: `FretboardTrainer` → `Fretboard` → `StringRow` → `FretCell` → Dot components. Each intermediate component accepts and forwards 15+ props it doesn't use itself:

```
// StringRow.jsx — accepts 17 props, uses only `string` and `si` directly
export default function StringRow({
  string, si, keyNotes, rootNote, mode, selectedRegion, region,
  highlightRoot, showDegrees, quizNote, selectedAnswer, isNoteVisible,
  onToggleReveal, hideAll, getNoteDisplayData, scalePositionState,
  cagedState, intervalState, identifyState,
}) {
```

This creates fragile coupling where adding a prop for a new feature requires changes in 3 passthrough files.

**Recommendation:** Use React Context for the fretboard rendering context (mode, keyNotes, rootNote, display callbacks). The context provider wraps `<Fretboard>` and consumers are the leaf dot components and `FretCell`. This eliminates the passthrough entirely.

---

## Medium Severity

### 5. No Memoization on Hot Rendering Path
**Pass:** Architecture | **Files:** `FretboardTrainer.jsx`, `FretCell.jsx`

`isNoteVisible()` and `getNoteDisplayData()` are plain functions (not wrapped in `useCallback`) that are called 120 times per render (6 strings × 20 frets). Any state change — even toggling an unrelated UI control — triggers a full re-render of all 120 `FretCell` components, each re-calling both functions and their downstream lib lookups.

Additionally, `getCAGEDShapes()` in `caged.js:159` is called inside `getCAGEDInfo()`, which is called per-cell. This means all 5 CAGED shapes are regenerated 120 times per render instead of once.

**Recommendation:** Wrap `isNoteVisible` and `getNoteDisplayData` in `useCallback`. Memoize `FretCell` with `React.memo`. Cache `getCAGEDShapes()` results at the render level (compute once per rootNote, pass to cells).

### 6. Biased Quiz Shuffle Algorithm
**Pass:** Security/Reliability | **File:** `FretboardTrainer.jsx:304-305`

```js
const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
const choices = [correctNote, ...shuffled].sort(() => Math.random() - 0.5);
```

Using `Array.sort()` with a random comparator is a well-documented anti-pattern that produces non-uniform distributions. Some answer positions will appear more frequently than others, which subtly biases the quiz experience.

**Recommendation:** Use a Fisher-Yates shuffle:
```js
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```

### 7. Duplicated Fingering Legend (3 copy-paste instances)
**Pass:** Maintainability | **File:** `Legend.jsx:53-71, 86-104, 178-196`

The fingering legend (1=Index, 2=Middle, 3=Ring, 4=Pinky) with identical data and near-identical markup is copy-pasted three times for Scale Positions, One Fret Rule, and Triads modes.

**Recommendation:** Extract a `<FingeringLegend />` component.

### 8. Magic Numbers and Hardcoded Colors Without Design Tokens
**Pass:** Maintainability | **Files:** all component files

Hardcoded values are scattered across every component:

- **Colors:** `#1a1a28`, `#0e0e16`, `#8a8fa6`, `#78c8f0` appear in multiple files without named constants
- **Dimensions:** `width: 28`, `height: 36`, `borderRadius: 12`, `gap: 6`, `minWidth: 1076`
- **Font sizes:** `0.62rem`, `0.68rem`, `0.72rem`, `0.82rem` with no scale system

If you need to change the dark theme background or the standard dot size, you'd need to find-and-replace across 15+ files.

**Recommendation:** Define CSS custom properties in `globals.css` for the color palette, spacing scale, and font sizes. Reference them via `var(--color-surface)`, `var(--dot-size)`, etc.

### 9. No Linting or Formatting Configuration
**Pass:** Maintainability | **Files:** project root

No ESLint, no Prettier, no editorconfig. The project relies entirely on developer discipline for code consistency. Minor inconsistencies already exist (arrow functions vs. function declarations, inconsistent trailing commas, mixed single/double quotes in different files).

**Recommendation:** Add `eslint` with `eslint-config-next` and `prettier`. This is a one-time setup that prevents style drift and catches common React mistakes (missing deps in hooks, etc.).

### 10. Confusing Mode Name Inversion
**Pass:** Maintainability | **Files:** `FretboardTrainer.jsx`, `fretboard.js`

The internal mode constant names are swapped relative to their UI labels:

- `MODES.QUIZ_FIND` = "quiz_find" → UI label is **"Name Note"** (user names a highlighted note)
- `MODES.QUIZ_IDENTIFY` = "quiz_identify" → UI label is **"Find Note"** (user finds all instances)

This makes the code confusing for any developer reading mode-specific logic — `QUIZ_FIND` doesn't mean "find" in the UI sense.

**Recommendation:** Rename to match UI semantics: `QUIZ_NAME_NOTE` and `QUIZ_FIND_NOTE`.

---

## Low Severity

### 11. No Input Validation on State Updater Helpers
**Pass:** Security/Reliability | **File:** `FretboardTrainer.jsx:100, 152-166`

```js
const updateTriad = (updates) => setTriadState(prev => ({ ...prev, ...updates }));
```

All five `update*` helpers blindly spread arbitrary objects into state. While callers are controlled (internal components), there's no guard against invalid values like `shapeIndex: -1` or `positionFret: 999`.

**Recommendation:** Add bounds checking in the updaters, or validate at the call sites that pass user-derived values (dropdown onChange handlers).

### 12. Uncleaned setTimeout in HarmoniesPanel
**Pass:** Security/Reliability | **File:** `HarmoniesPanel.jsx:78`

```js
setTimeout(() => setTooltip(null), 2000);
```

This timeout is not tracked or cleaned up on unmount. If the component unmounts within 2 seconds (e.g., mode switch), React may warn about setting state on an unmounted component.

**Recommendation:** Use a `useRef` to track the timeout ID and clear it in a cleanup function.

### 13. Unbounded Quiz Timeout Array
**Pass:** Security/Reliability | **File:** `FretboardTrainer.jsx:357-360`

```js
const scheduleQuizTimeout = (fn, delay) => {
  const id = setTimeout(fn, delay);
  quizTimeoutsRef.current.push(id);
};
```

Timeout IDs are pushed onto `quizTimeoutsRef.current` but never removed after they fire. Over a long quiz session, this array grows without bound. The cleanup effect (line 428-431) clears all on mode change, but within a single mode session the array accumulates.

**Recommendation:** Remove IDs from the array when their callbacks execute, or use a Set and delete on completion.

### 14. Import Order in intervals.js
**Pass:** Maintainability | **File:** `lib/intervals.js:1-28`

Exports appear at lines 1-25 before imports on lines 27-28. While this works due to JavaScript hoisting, it's unconventional and could confuse developers scanning the file.

```js
// Lines 1-25: exports of INTERVAL_LABELS, INTERVAL_NAMES, getIntervalLabel, getIntervalDegree
// Lines 27-28: import { getNoteAt, isInKey } from "./music";
```

**Recommendation:** Move imports to the top of the file.

### 15. No Security Headers in Next.js Config
**Pass:** Security | **File:** `next.config.mjs`

The Next.js config is empty — no Content-Security-Policy, X-Frame-Options, or other security headers. While Vercel provides some defaults, explicitly setting headers (especially CSP to restrict script sources) is a best practice for any deployed web app.

**Recommendation:** Add a `headers()` function in `next.config.mjs` with at minimum `X-Frame-Options: DENY` and a basic CSP.

### 16. External Font Loading Without Subresource Integrity
**Pass:** Security | **File:** `globals.css:1-2`

Google Fonts are loaded via `@import url(...)` from `fonts.googleapis.com`. If the CDN were compromised, arbitrary CSS could be injected. This is a low-probability risk but worth noting.

**Recommendation:** Consider using `next/font` which self-hosts fonts at build time, eliminating the external dependency entirely. This also improves performance (no extra DNS lookup / connection).

### 17. FretCell Uses IIFE Pattern for Conditional Rendering
**Pass:** Maintainability | **File:** `FretCell.jsx:49-244`

Multiple mode rendering blocks use immediately-invoked function expressions:

```jsx
{mode === MODES.CAGED && visible && (() => {
  const data = getNoteDisplayData(si, f);
  if (!data) return null;
  return <CAGEDDot ... />;
})()}
```

This pattern prevents React from optimizing child component rendering and is harder to read than extracting the logic into a helper function or a sub-component.

**Recommendation:** Extract each mode's rendering block into a named function or small component.

### 18. Redundant `"use client"` Directive in ControlsDrawer
**Pass:** Architecture | **File:** `ControlsDrawer.jsx:1`

`ControlsDrawer.jsx` has `"use client"` but it's rendered inside `FretboardTrainer.jsx` which already has the client boundary. The directive is harmless but adds confusion about where the actual boundary is.

**Recommendation:** Remove the redundant directive.

### 19. No TypeScript
**Pass:** Maintainability | **Files:** entire project

For a project with 8 modes, complex music theory data structures, and 30+ components, TypeScript would provide significant value:

- `getNoteDisplayData()` returns differently-shaped objects depending on mode — a discriminated union type would catch misuse at compile time
- State objects like `triadState`, `intervalState`, `identifyState` have specific shape contracts that are currently only documented in comments
- The `update*` helpers accept `Partial<State>` objects that TypeScript could validate

**Recommendation:** Consider incremental TypeScript migration starting with `lib/` modules (rename to `.ts`, add type exports) since they have no React dependencies and are the most impactful to type-check.

---

## Positive Observations

These aspects of the codebase are well done and worth preserving:

1. **Pure logic modules** — `lib/` files have zero React dependencies, making them portable and testable
2. **Single client boundary** — One `"use client"` at the root keeps the architecture simple
3. **ErrorBoundary** — Production crash protection is in place from day one
4. **Ref pattern for stale closures** — `generateFindQuizRef.current` pattern correctly avoids stale closure bugs in quiz timeouts
5. **Intentional fret region overlaps** — Documented design decision for smooth practice transitions
6. **Clean quiz answer locking** — `findAnswerLockRef` and `intervalAnswerLockRef` prevent double-submission race conditions
7. **Keyboard navigation** — Arrow key support for form/shape stepping with proper cleanup
8. **Minimal dependencies** — Only React and Next.js, no bloated dependency tree
