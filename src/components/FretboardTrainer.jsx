"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  NOTES, NATURAL_NOTES, SHARP_NOTES, DIATONIC_KEYS,
  getNoteAt, getNoteName, isInKey, getStringLabel, getScaleDegree,
} from "./lib/music";
import { MODES, FRET_REGIONS, FRET_COUNT } from "./lib/fretboard";
import { getIntervalLabel, getIntervalDegree, generateIntervalQuiz, INTERVAL_LABELS } from "./lib/intervals";
import { isInScalePosition, FORMS, getRootNoteForPosition, computeKeyNotes, getPositionFret, getDiagonalPentatonicSets, PENTATONIC_DEGREES } from "./lib/scales";
import { getCAGEDInfo, getCAGEDShapes } from "./lib/caged";
import { getTriadInfo, INVERSIONS, TRIAD_SHAPES } from "./lib/triads";
import ModeSelector from "./controls/ModeSelector";
import KeySelector from "./controls/KeySelector";
import RegionSelector from "./controls/RegionSelector";
import ExploreToggles from "./controls/ExploreToggles";
import KeyButtons from "./controls/KeyButtons";
import IntervalControls from "./controls/IntervalControls";
import ScalePositionControls from "./controls/ScalePositionControls";
import CAGEDControls from "./controls/CAGEDControls";
import OneFretRuleControls from "./controls/OneFretRuleControls";
import TriadControls from "./controls/TriadControls";
import QuizPrompt from "./quiz/QuizPrompt";
import QuizFeedback from "./quiz/QuizFeedback";
import AnswerBubbles from "./quiz/AnswerBubbles";
import IntervalQuizPrompt from "./quiz/IntervalQuizPrompt";
import ScoreBar from "./quiz/ScoreBar";
import Fretboard from "./fretboard/Fretboard";
import Legend from "./Legend";
import Tips from "./Tips";
import TriadExplainer from "./TriadExplainer";
import HarmoniesPanel from "./HarmoniesPanel";

export default function FretboardTrainer({ embedded } = {}) {
  const [selectedKey, setSelectedKey] = useState("C Major / A Minor");
  const [mode, setMode] = useState(MODES.EXPLORE);
  const [showNaturals, setShowNaturals] = useState(true);
  const [showSharps, setShowSharps] = useState(true);
  const [showDegrees, setShowDegrees] = useState(false);
  const [highlightRoot, setHighlightRoot] = useState(true);
  const [revealedNotes, setRevealedNotes] = useState(new Set());
  const [hideAll, setHideAll] = useState(false);
  const [quizNote, setQuizNote] = useState(null);
  const [quizTarget, setQuizTarget] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [findChoices, setFindChoices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("all");

  // New mode states
  const [scalePositionState, setScalePositionState] = useState({
    positionIndex: 0,
    showFingering: false,
    showNoteNames: false,
    diagonalPentatonic: false,
    diagonalSet: 0,
  });

  const [cagedState, setCagedState] = useState({
    selectedShape: embedded ? "C" : "all",
    showScaleTones: true,
    rootNote: 0,
  });

  const [intervalState, setIntervalState] = useState({
    showIntervals: true,
    intervalFilter: embedded ? new Set([1, 5]) : new Set([1, 2, 3, 4, 5, 6, 7]),
    quizMode: false,
    quizNote: null,
    quizFeedback: null,
    selectedAnswer: null,
    correctInterval: null,
  });

  const [oneFretRuleState, setOneFretRuleState] = useState({
    positionFret: 5,
    selectedFormIndex: 0,
    showFingering: false,
    showNoteNames: false,
    showChordTones: false,
  });

  const [identifyState, setIdentifyState] = useState({
    phase: "selecting",
    selections: new Set(),
    results: null,
  });

  const [triadState, setTriadState] = useState({
    rootNote: 0,           // 0-11 (C=0), chromatic
    inversionIndex: 0,     // 0=root, 1=first, 2=second
    shapeIndex: 0,         // 0-15 (4 string sets x 4 qualities)
    showFingering: false,
    showNoteNames: false,
    autoPlay: false,
    autoPlaySpeed: 2000,   // ms between steps (500–5000)
  });
  const updateTriad = (updates) => setTriadState(prev => ({ ...prev, ...updates }));

  const fretboardScrollRef = useRef(null);
  const findAnswerLockRef = useRef(false);
  const intervalAnswerLockRef = useRef(false);
  const quizTimeoutsRef = useRef([]);
  const controlsZoneRef = useRef(null);
  const maxZoneHeight = useRef(0);

  const [harmoniesState, setHarmoniesState] = useState({
    expanded: false,
    keyRoot: 0,
    activeDegree: null,
  });

  // Base key from dropdown
  const baseKeyNotes = DIATONIC_KEYS[selectedKey];
  const baseRootNote = baseKeyNotes[0];

  // Compute key override for One Fret Rule mode
  // Root fret ascending pattern: 0, +2, +4 within each root-string group
  const oneFretRuleInfo = FORMS.map((form, i) => {
    const rootFretOffset = (i % 3) * 2;
    const rootFret = oneFretRuleState.positionFret + rootFretOffset;
    const effectivePositionFret = rootFret - (form.rootFinger - 1);
    const rootNoteIdx = getRootNoteForPosition(effectivePositionFret, i);
    const rootGuitarString = form.rootStringIndex + 1; // stringIndex 0=high E(str 1), 5=low E(str 6)
    return {
      formName: form.name,
      rootNote: rootNoteIdx,
      rootNoteName: getNoteName(rootNoteIdx),
      rootFret,
      rootGuitarString,
    };
  });

  const isOneFretRule = mode === MODES.ONE_FRET_RULE;
  const isTriads = mode === MODES.TRIADS;
  const triadInversionKey = INVERSIONS[triadState.inversionIndex];
  const keyNotes = isOneFretRule
    ? computeKeyNotes(oneFretRuleInfo[oneFretRuleState.selectedFormIndex].rootNote)
    : mode === MODES.CAGED ? computeKeyNotes(cagedState.rootNote)
    : baseKeyNotes;
  const rootNote = isOneFretRule
    ? oneFretRuleInfo[oneFretRuleState.selectedFormIndex].rootNote
    : mode === MODES.CAGED ? cagedState.rootNote
    : baseRootNote;
  const region = FRET_REGIONS[selectedRegion];

  const getNoteId = (s, f) => `${s}-${f}`;

  // Updater helpers for new modes
  const updateScalePosition = (updates) => {
    setScalePositionState(prev => ({ ...prev, ...updates }));
  };

  const updateCAGED = (updates) => {
    setCagedState(prev => ({ ...prev, ...updates }));
  };

  const updateInterval = (updates) => {
    setIntervalState(prev => ({ ...prev, ...updates }));
  };

  const updateOneFretRule = (updates) => {
    setOneFretRuleState(prev => ({ ...prev, ...updates }));
  };

  // Diagonal pentatonic sets (computed when toggle is active)
  const diagonalSets = scalePositionState.diagonalPentatonic
    ? getDiagonalPentatonicSets(rootNote, keyNotes) : null;
  const activeDiagonalSet = diagonalSets?.sets[scalePositionState.diagonalSet] ?? null;

  // --- getNoteDisplayData: returns mode-specific rendering metadata ---
  const getNoteDisplayData = (s, f) => {
    const noteIndex = getNoteAt(s, f);

    if (mode === MODES.SCALE_POSITIONS) {
      // Diagonal pentatonic: show multiple positions with position-based colors
      if (activeDiagonalSet) {
        // Check extension first (single specific note)
        if (activeDiagonalSet.extension) {
          const ext = activeDiagonalSet.extension;
          if (s === ext.stringIndex && f === ext.fret) {
            return {
              type: "scalePosition",
              degree: ext.degree,
              finger: ext.finger,
              isRoot: false,
              showFingering: scalePositionState.showFingering,
              showNoteNames: scalePositionState.showNoteNames,
              noteName: getNoteName(getNoteAt(s, f)),
              colorOverride: { positionGroupIndex: ext.positionGroupIndex, isPentatonic: true },
            };
          }
        }
        // Check each position in the set
        for (const pos of activeDiagonalSet.positions) {
          const match = isInScalePosition(s, f, rootNote, keyNotes, pos.formIndex);
          if (match) {
            const isPentatonic = PENTATONIC_DEGREES.has(match.degree);
            return {
              type: "scalePosition",
              degree: match.degree,
              finger: match.finger,
              isRoot: match.degree === 1,
              showFingering: scalePositionState.showFingering,
              showNoteNames: scalePositionState.showNoteNames,
              noteName: getNoteName(noteIndex),
              colorOverride: { positionGroupIndex: pos.positionGroupIndex, isPentatonic },
              isChordTone: isPentatonic ? undefined : false,
            };
          }
        }
        return null;
      }

      // Single position mode (default)
      const match = isInScalePosition(s, f, rootNote, keyNotes, scalePositionState.positionIndex);
      if (!match) return null;
      return {
        type: "scalePosition",
        degree: match.degree,
        finger: match.finger,
        isRoot: match.degree === 1,
        showFingering: scalePositionState.showFingering,
        showNoteNames: scalePositionState.showNoteNames,
        noteName: getNoteName(noteIndex),
      };
    }

    if (mode === MODES.ONE_FRET_RULE) {
      const match = isInScalePosition(s, f, rootNote, keyNotes, oneFretRuleState.selectedFormIndex);
      if (!match) return null;
      // When chord toggle is on, check if this note is a chord tone in the mapped CAGED shape
      const FORM_TO_CAGED = ["E", "E", "G", "A", "A", "C", "D"];
      let isChordTone = null;
      if (oneFretRuleState.showChordTones) {
        const shapeLetter = FORM_TO_CAGED[oneFretRuleState.selectedFormIndex];
        const cagedInfo = getCAGEDInfo(s, f, rootNote, shapeLetter);
        isChordTone = cagedInfo ? cagedInfo.isChordTone : false;
      }
      return {
        type: "scalePosition",
        degree: match.degree,
        finger: match.finger,
        isRoot: match.degree === 1,
        showFingering: oneFretRuleState.showFingering,
        showNoteNames: oneFretRuleState.showNoteNames,
        noteName: getNoteName(noteIndex),
        isChordTone,
      };
    }

    if (mode === MODES.CAGED) {
      const info = getCAGEDInfo(s, f, rootNote, cagedState.selectedShape);
      if (!info) return null;
      return {
        type: "caged",
        letter: info.letter,
        isChordTone: info.isChordTone,
        chordType: info.type,
        degree: info.degree,
      };
    }

    if (mode === MODES.INTERVALS) {
      if (!isInKey(noteIndex, keyNotes)) return null;
      const degree = getIntervalDegree(noteIndex, keyNotes);
      if (!degree || !intervalState.intervalFilter.has(degree)) return null;
      const label = intervalState.showIntervals ? INTERVAL_LABELS[degree] : getNoteName(noteIndex);
      return {
        type: "interval",
        intervalLabel: label,
        degree,
        isRoot: degree === 1,
      };
    }

    if (mode === MODES.TRIADS) {
      const info = getTriadInfo(s, f, triadState.rootNote, triadInversionKey, triadState.shapeIndex);
      if (!info) return null;
      return {
        type: "triad",
        interval: info.interval,
        finger: info.finger,
        noteName: info.noteName,
        isRoot: info.isRoot,
        showFingering: triadState.showFingering,
        showNoteNames: triadState.showNoteNames,
      };
    }

    return null;
  };

  const toggleReveal = (s, f) => {
    if (mode === MODES.QUIZ_IDENTIFY) {
      if (identifyState.phase !== "selecting") return;
      const noteIndex = getNoteAt(s, f);
      if (!isInKey(noteIndex, keyNotes)) return;
      if (selectedRegion !== "all" && (f < region.start || f > region.end)) return;
      const id = getNoteId(s, f);
      setIdentifyState(prev => {
        const next = new Set(prev.selections);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return { ...prev, selections: next };
      });
      return;
    }
    if (mode === MODES.QUIZ_FIND) return;
    if (mode === MODES.SCALE_POSITIONS || mode === MODES.CAGED || mode === MODES.INTERVALS || mode === MODES.ONE_FRET_RULE || mode === MODES.TRIADS) return;

    // Explore mode
    const id = getNoteId(s, f);
    setRevealedNotes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const generateIdentifyQuiz = useCallback(() => {
    const naturals = NATURAL_NOTES.filter(n => keyNotes.includes(NOTES.indexOf(n)));
    const name = naturals[Math.floor(Math.random() * naturals.length)];
    setQuizTarget({ name });
    setQuizFeedback(null);
    setIdentifyState({ phase: "selecting", selections: new Set(), results: null });
  }, [keyNotes]);

  const generateFindQuiz = useCallback(() => {
    const minF = region.start;
    const maxF = region.end;
    const validPositions = [];
    for (let s = 0; s < 6; s++) {
      for (let f = minF; f <= maxF; f++) {
        if (isInKey(getNoteAt(s, f), keyNotes)) {
          validPositions.push({ s, f });
        }
      }
    }
    if (validPositions.length === 0) return;
    const { s, f } = validPositions[Math.floor(Math.random() * validPositions.length)];
    const correctNote = getNoteName(getNoteAt(s, f));

    const keyNoteNames = keyNotes.map(n => getNoteName(n));
    const distractors = keyNoteNames.filter(n => n !== correctNote);
    const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [correctNote, ...shuffled].sort(() => Math.random() - 0.5);

    setQuizNote({ string: s, fret: f });
    setFindChoices(choices);
    setSelectedAnswer(null);
    setQuizFeedback(null);
    findAnswerLockRef.current = false;
  }, [keyNotes, region]);

  const handleFindAnswer = (chosenNote) => {
    if (findAnswerLockRef.current) return;
    findAnswerLockRef.current = true;
    const correctNote = getNoteName(getNoteAt(quizNote.string, quizNote.fret));
    setSelectedAnswer(chosenNote);
    if (chosenNote === correctNote) {
      setQuizFeedback({ correct: true, message: `\u2713 Correct! That's ${correctNote} on the ${getStringLabel(quizNote.string)} string, fret ${quizNote.fret}` });
      setScore(p => ({ correct: p.correct + 1, total: p.total + 1 }));
      setStreak(p => {
        const next = p + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
      scheduleQuizTimeout(() => generateFindQuizRef.current(), 1000);
    } else {
      setQuizFeedback({ correct: false, message: `\u2717 That's ${correctNote}, not ${chosenNote}` });
      setScore(p => ({ ...p, total: p.total + 1 }));
      setStreak(0);
      scheduleQuizTimeout(() => generateFindQuizRef.current(), 1500);
    }
  };

  // --- Interval quiz ---
  const generateIntervalQuizNote = useCallback(() => {
    const result = generateIntervalQuiz(keyNotes, region);
    if (result) {
      updateInterval({
        quizNote: { string: result.stringIndex, fret: result.fret },
        correctInterval: result.correctInterval,
        selectedAnswer: null,
        quizFeedback: null,
      });
      intervalAnswerLockRef.current = false;
    }
  }, [keyNotes, region]);

  // Refs to ensure timeouts always call the latest quiz generators
  const generateFindQuizRef = useRef(generateFindQuiz);
  generateFindQuizRef.current = generateFindQuiz;
  const generateIntervalQuizNoteRef = useRef(generateIntervalQuizNote);
  generateIntervalQuizNoteRef.current = generateIntervalQuizNote;

  // Schedule a quiz timeout and track its ID for cleanup
  const scheduleQuizTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    quizTimeoutsRef.current.push(id);
  };

  const handleIntervalAnswer = (chosenDegree) => {
    if (intervalAnswerLockRef.current) return;
    intervalAnswerLockRef.current = true;
    const correct = chosenDegree === intervalState.correctInterval;
    const label = INTERVAL_LABELS[intervalState.correctInterval];
    if (correct) {
      updateInterval({
        selectedAnswer: chosenDegree,
        quizFeedback: { correct: true, message: `\u2713 Correct! That's the ${label}` },
      });
      setScore(p => ({ correct: p.correct + 1, total: p.total + 1 }));
      setStreak(p => {
        const next = p + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
      scheduleQuizTimeout(() => generateIntervalQuizNoteRef.current(), 1000);
    } else {
      updateInterval({
        selectedAnswer: chosenDegree,
        quizFeedback: { correct: false, message: `\u2717 That's the ${label}, not ${INTERVAL_LABELS[chosenDegree]}` },
      });
      setScore(p => ({ ...p, total: p.total + 1 }));
      setStreak(0);
      scheduleQuizTimeout(() => generateIntervalQuizNoteRef.current(), 1500);
    }
  };

  const handleFinishIdentify = () => {
    if (!quizTarget) return;
    const positionMap = new Map();
    let correct = 0, incorrect = 0, missed = 0;
    const fretStart = selectedRegion === "all" ? 0 : region.start;
    const fretEnd = selectedRegion === "all" ? FRET_COUNT : region.end;
    for (let s = 0; s <= 5; s++) {
      for (let f = fretStart; f <= fretEnd; f++) {
        const noteIndex = getNoteAt(s, f);
        if (!isInKey(noteIndex, keyNotes)) continue;
        const isTarget = getNoteName(noteIndex) === quizTarget.name;
        const isSelected = identifyState.selections.has(`${s}-${f}`);
        if (isTarget && isSelected) {
          correct++;
          positionMap.set(`${s}-${f}`, "correct");
        } else if (!isTarget && isSelected) {
          incorrect++;
          positionMap.set(`${s}-${f}`, "incorrect");
        } else if (isTarget && !isSelected) {
          missed++;
          positionMap.set(`${s}-${f}`, "missed");
        }
      }
    }
    const percentage = (correct + incorrect) > 0 ? Math.round(correct / (correct + incorrect) * 100) : 0;
    setIdentifyState({
      phase: "results",
      selections: identifyState.selections,
      results: { correct, incorrect, missed, total: correct + incorrect + missed, percentage, positionMap },
    });
  };

  const handleNewIdentifyRound = () => {
    generateIdentifyQuiz();
  };

  // Clear pending quiz timeouts on mode change to prevent stale callbacks
  useEffect(() => {
    return () => {
      quizTimeoutsRef.current.forEach(clearTimeout);
      quizTimeoutsRef.current = [];
    };
  }, [mode]);

  // Reset min-height when mode changes, then ratchet within that mode
  useEffect(() => {
    const el = controlsZoneRef.current;
    if (!el) return;
    // Reset for the new mode
    maxZoneHeight.current = 0;
    el.style.minHeight = "";
    // After a frame, start ratcheting for this mode's controls
    const ro = new ResizeObserver(() => {
      const h = el.scrollHeight;
      if (h > maxZoneHeight.current) {
        maxZoneHeight.current = h;
        el.style.minHeight = `${h}px`;
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  // Generate identify quiz on mode enter or when keyNotes changes while active
  useEffect(() => {
    if (mode === MODES.QUIZ_IDENTIFY) generateIdentifyQuiz();
  }, [mode, generateIdentifyQuiz]);

  // Generate find quiz on mode enter or when keyNotes/region changes while active
  useEffect(() => {
    if (mode === MODES.QUIZ_FIND) generateFindQuiz();
  }, [mode, generateFindQuiz]);

  // Interval quiz mode effect — regenerate on mode/quiz toggle or keyNotes/region change
  useEffect(() => {
    if (mode === MODES.INTERVALS && intervalState.quizMode) {
      generateIntervalQuizNote();
      resetScore();
    } else {
      updateInterval({ quizNote: null, selectedAnswer: null, quizFeedback: null, correctInterval: null });
    }
  }, [intervalState.quizMode, mode, generateIntervalQuizNote]); // eslint-disable-line react-hooks/exhaustive-deps -- resetScore/updateInterval are stable

  // Arrow key navigation for Scale Positions
  useEffect(() => {
    if (embedded || mode !== MODES.SCALE_POSITIONS) return;
    const total = FORMS.length;
    const keyNames = Object.keys(DIATONIC_KEYS);
    const handler = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setScalePositionState(prev => {
          if (prev.diagonalPentatonic) {
            return { ...prev, diagonalSet: prev.diagonalSet === 0 ? 1 : 0 };
          }
          return { ...prev, positionIndex: prev.positionIndex < total - 1 ? prev.positionIndex + 1 : 0 };
        });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setScalePositionState(prev => {
          if (prev.diagonalPentatonic) {
            return { ...prev, diagonalSet: prev.diagonalSet === 0 ? 1 : 0 };
          }
          return { ...prev, positionIndex: prev.positionIndex > 0 ? prev.positionIndex - 1 : total - 1 };
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedKey(prev => {
          const idx = keyNames.indexOf(prev);
          return keyNames[idx > 0 ? idx - 1 : keyNames.length - 1];
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedKey(prev => {
          const idx = keyNames.indexOf(prev);
          return keyNames[idx < keyNames.length - 1 ? idx + 1 : 0];
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode]);

  // Arrow key navigation for One Fret Rule form stepping
  useEffect(() => {
    if (embedded || mode !== MODES.ONE_FRET_RULE) return;
    const total = FORMS.length;
    const handler = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setOneFretRuleState(prev => ({
          ...prev,
          selectedFormIndex: prev.selectedFormIndex < total - 1 ? prev.selectedFormIndex + 1 : 0,
        }));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setOneFretRuleState(prev => ({
          ...prev,
          selectedFormIndex: prev.selectedFormIndex > 0 ? prev.selectedFormIndex - 1 : total - 1,
        }));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode]);

  // Auto-cycle for Triads mode
  useEffect(() => {
    if (mode !== MODES.TRIADS || !triadState.autoPlay) return;
    const id = setInterval(() => {
      setTriadState(prev => {
        const total = TRIAD_SHAPES[INVERSIONS[prev.inversionIndex]].length;
        if (prev.shapeIndex < total - 1) {
          return { ...prev, shapeIndex: prev.shapeIndex + 1 };
        } else {
          const nextInversion = (prev.inversionIndex + 1) % 3;
          return { ...prev, inversionIndex: nextInversion, shapeIndex: 0 };
        }
      });
    }, triadState.autoPlaySpeed);
    return () => clearInterval(id);
  }, [mode, triadState.autoPlay, triadState.autoPlaySpeed]);

  // Arrow key navigation for Triads shape stepping
  useEffect(() => {
    if (embedded || mode !== MODES.TRIADS) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setTriadState(prev => {
          const total = TRIAD_SHAPES[INVERSIONS[prev.inversionIndex]].length;
          return { ...prev, shapeIndex: (prev.shapeIndex + 1) % total };
        });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setTriadState(prev => {
          const total = TRIAD_SHAPES[INVERSIONS[prev.inversionIndex]].length;
          return { ...prev, shapeIndex: (prev.shapeIndex + total - 1) % total };
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode]);

  // Auto-scroll fretboard to center on active position/shape
  useEffect(() => {
    const container = fretboardScrollRef.current;
    if (!container) return;

    let centerFret = null;

    if (mode === MODES.ONE_FRET_RULE) {
      centerFret = oneFretRuleInfo[oneFretRuleState.selectedFormIndex]?.rootFret;
    } else if (mode === MODES.TRIADS) {
      // Find average fret of lit notes
      const invKey = INVERSIONS[triadState.inversionIndex];
      const shapes = TRIAD_SHAPES[invKey];
      if (shapes && shapes[triadState.shapeIndex]) {
        const shape = shapes[triadState.shapeIndex];
        let sum = 0, count = 0;
        for (const note of shape.notes) {
          const fret = (triadState.rootNote + note.offset + 120) % 24;
          if (fret >= 0 && fret <= 19) { sum += fret; count++; }
        }
        if (count > 0) centerFret = sum / count;
      }
    } else if (mode === MODES.SCALE_POSITIONS) {
      if (scalePositionState.diagonalPentatonic && diagonalSets) {
        const set = diagonalSets.sets[scalePositionState.diagonalSet];
        const frets = set.positions.map(p => getPositionFret(rootNote, p.formIndex));
        const minFret = Math.min(...frets);
        const maxFret = Math.max(...frets) + 4;
        centerFret = (minFret + maxFret) / 2;
      } else {
        const posFret = getPositionFret(rootNote, scalePositionState.positionIndex);
        centerFret = posFret + 2; // center of 4-fret span
      }
    } else if (mode === MODES.CAGED) {
      if (cagedState.selectedShape !== "all") {
        const shapes = getCAGEDShapes(rootNote);
        const shape = shapes.find(s => s.letter === cagedState.selectedShape);
        if (shape) {
          const allFrets = [...shape.chordTones.map(t => t.fret), ...shape.scaleTones.map(t => t.fret)];
          // Use the lowest occurrence cluster (first octave)
          const low = allFrets.filter(f => f <= 14);
          if (low.length > 0) {
            centerFret = low.reduce((a, b) => a + b, 0) / low.length;
          }
        }
      }
    }

    if (centerFret == null || centerFret < 1) return;

    const contentWidth = container.scrollWidth;
    const fretWidth = (contentWidth - 48 - 40) / 19; // label + nut + 19 frets
    const targetX = 48 + 40 + (centerFret - 1) * fretWidth + fretWidth / 2;

    container.scrollTo({
      left: Math.max(0, targetX - container.clientWidth / 2),
      behavior: "smooth",
    });
  }, [mode, scalePositionState.positionIndex, scalePositionState.diagonalPentatonic,
      scalePositionState.diagonalSet, oneFretRuleState.selectedFormIndex,
      oneFretRuleState.positionFret, triadState.rootNote, triadState.inversionIndex,
      triadState.shapeIndex, cagedState.selectedShape, cagedState.rootNote]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetScore = () => {
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setBestStreak(0);
  };

  const isNoteVisible = (s, f) => {
    // New modes define their own note sets
    if (mode === MODES.SCALE_POSITIONS) {
      // Diagonal pentatonic: visible if in any position of the active set, or the extension
      if (activeDiagonalSet) {
        for (const pos of activeDiagonalSet.positions) {
          if (isInScalePosition(s, f, rootNote, keyNotes, pos.formIndex)) return true;
        }
        if (activeDiagonalSet.extension) {
          const ext = activeDiagonalSet.extension;
          if (s === ext.stringIndex && f === ext.fret) return true;
        }
        return false;
      }
      // Single position mode
      const match = isInScalePosition(s, f, rootNote, keyNotes, scalePositionState.positionIndex);
      return match !== null;
    }

    if (mode === MODES.ONE_FRET_RULE) {
      const match = isInScalePosition(s, f, rootNote, keyNotes, oneFretRuleState.selectedFormIndex);
      return match !== null;
    }

    if (mode === MODES.CAGED) {
      const info = getCAGEDInfo(s, f, rootNote, cagedState.selectedShape);
      if (!info) return false;
      if (!info.isChordTone && !cagedState.showScaleTones) return false;
      return true;
    }

    if (mode === MODES.INTERVALS) {
      const noteIndex = getNoteAt(s, f);
      if (!isInKey(noteIndex, keyNotes)) return false;
      if (selectedRegion !== "all") {
        if (f < region.start || f > region.end) return false;
      }
      const degree = getIntervalDegree(noteIndex, keyNotes);
      if (!degree || !intervalState.intervalFilter.has(degree)) return false;
      // In quiz mode, only show the quiz target
      if (intervalState.quizMode) {
        if (intervalState.selectedAnswer !== null && intervalState.quizNote &&
            s === intervalState.quizNote.string && f === intervalState.quizNote.fret) {
          return true;
        }
        return false;
      }
      return true;
    }

    if (mode === MODES.TRIADS) {
      const info = getTriadInfo(s, f, triadState.rootNote, triadInversionKey, triadState.shapeIndex);
      return info !== null;
    }

    // Batch identify mode: show dots at all in-key positions in active region
    // During results phase, bypass region filter so all quiz results stay visible
    if (mode === MODES.QUIZ_IDENTIFY) {
      if (identifyState.phase !== "results" && selectedRegion !== "all" && (f < region.start || f > region.end)) return false;
      const noteIndex = getNoteAt(s, f);
      return isInKey(noteIndex, keyNotes);
    }

    // Original logic for explore/quiz modes
    const noteIndex = getNoteAt(s, f);
    if (!isInKey(noteIndex, keyNotes)) return false;
    if (selectedRegion !== "all") {
      if (f < region.start || f > region.end) return false;
    }
    if (mode === MODES.QUIZ_FIND) {
      if (selectedAnswer !== null && quizNote && s === quizNote.string && f === quizNote.fret) {
        return true;
      }
      return false;
    }
    if (hideAll) {
      return revealedNotes.has(getNoteId(s, f));
    }
    const noteName = getNoteName(noteIndex);
    if (NATURAL_NOTES.includes(noteName) && !showNaturals) return false;
    if (SHARP_NOTES.includes(noteName) && !showSharps) return false;
    return true;
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetScore();
    // Reset interval quiz when switching away
    if (newMode !== MODES.INTERVALS) {
      updateInterval({ quizMode: false, quizNote: null, selectedAnswer: null, quizFeedback: null });
    }
    // Stop triad auto-play when switching away
    if (newMode !== MODES.TRIADS) {
      updateTriad({ autoPlay: false });
    }
  };

  const handleKeyChange = (key) => {
    setSelectedKey(key);
    setRevealedNotes(new Set());
  };

  // Harmonies panel handlers
  const handleHarmonyChordTap = (chordObj) => {
    // Preserve current string set, switch to matching quality
    const currentStringSet = Math.floor(triadState.shapeIndex / 4);
    const qualityIndex = ["major", "minor", "diminished", "augmented"].indexOf(chordObj.quality);
    const newShapeIndex = (currentStringSet * 4) + (qualityIndex >= 0 ? qualityIndex : 0);
    updateTriad({ rootNote: chordObj.rootNoteIndex, shapeIndex: newShapeIndex });
    setHarmoniesState(prev => ({ ...prev, activeDegree: chordObj.degree }));
  };

  const handleTriadRootChange = (rootNoteValue) => {
    updateTriad({ rootNote: rootNoteValue });
    setHarmoniesState(prev => ({ ...prev, keyRoot: rootNoteValue, activeDegree: null }));
  };

  const handleToggleHarmonies = () => {
    setHarmoniesState(prev => ({ ...prev, expanded: !prev.expanded }));
  };

  const isQuizActive = mode === MODES.QUIZ_IDENTIFY || mode === MODES.QUIZ_FIND ||
    (mode === MODES.INTERVALS && intervalState.quizMode);

  return (
    <div
      className={embedded ? "p-3 sm:p-5" : "p-3 sm:p-5 app-grain app-glow"}
      style={{
        minHeight: embedded ? "auto" : "100vh",
        maxWidth: "100vw",
        overflowX: "hidden",
        ...(!embedded && { background: "linear-gradient(170deg, #0a0a0f 0%, #12121c 40%, #0d1117 100%)" }),
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
        boxSizing: "border-box",
      }}
    >
      <div className="stagger-children" style={{ maxWidth: 1200, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
        {/* Header — title + tabs, no interactive controls */}
        <div className="mb-3 sm:mb-4 header-bar">
          {/* Title row — hidden when embedded */}
          {!embedded && (
          <div className="text-center sm:text-left" style={{ marginBottom: 8, position: "relative" }}>
            {/* Decorative glow behind title */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "clamp(60px, 15%, 140px)",
              width: 120,
              height: 40,
              background: "radial-gradient(ellipse, rgba(232,78,60,0.15) 0%, rgba(240,200,50,0.08) 50%, transparent 100%)",
              filter: "blur(20px)",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              zIndex: 0,
            }} />
            <h1 style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 800,
              background: "linear-gradient(135deg, #e84e3c 0%, #f0c832 50%, #3ca0dc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 4px",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              position: "relative",
              zIndex: 1,
            }}>
              Fretboard Navigator
            </h1>
            <p className="hidden sm:block" style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              color: "var(--text-dim)",
              fontWeight: 400,
              margin: 0,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              position: "relative",
              zIndex: 1,
            }}>
              Diatonic Note Memorization Trainer
            </p>
          </div>
          )}

          {/* Mode tabs — full width, horizontally scrollable on mobile */}
          <div style={{ display: "flex", justifyContent: "center", maxWidth: "100%", overflow: "hidden" }}>
            <ModeSelector mode={mode} onModeChange={handleModeChange} embedded={embedded} />
          </div>
        </div>

        {/* Sub Controls + Quiz Prompts — stable height zone */}
        <div ref={controlsZoneRef} className="controls-zone">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            {/* Key & Region selectors — shown for modes that use them, hidden when embedded */}
            {!embedded && !isOneFretRule && !isTriads && mode !== MODES.CAGED && (
              <KeySelector selectedKey={selectedKey} onKeyChange={handleKeyChange} />
            )}
            {!embedded && (mode === MODES.EXPLORE || mode === MODES.QUIZ_FIND || mode === MODES.QUIZ_IDENTIFY || mode === MODES.INTERVALS) && (
              <RegionSelector selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
            )}
            {/* Divider after selectors when both selectors and mode controls present */}
            {!embedded && (mode === MODES.EXPLORE || mode === MODES.INTERVALS || mode === MODES.SCALE_POSITIONS) && (
              <span style={{ width: 1, height: 20, background: "#1e1e2e", margin: "0 4px" }} />
            )}
            {mode === MODES.EXPLORE && (
              <ExploreToggles
                showNaturals={showNaturals} setShowNaturals={setShowNaturals}
                showSharps={showSharps} setShowSharps={setShowSharps}
                showDegrees={showDegrees} setShowDegrees={setShowDegrees}
                highlightRoot={highlightRoot} setHighlightRoot={setHighlightRoot}
                hideAll={hideAll} setHideAll={setHideAll}
                onResetRevealed={() => setRevealedNotes(new Set())}
              />
            )}
            {mode === MODES.INTERVALS && (
              <IntervalControls intervalState={intervalState} updateInterval={updateInterval} embedded={embedded} />
            )}
            {mode === MODES.SCALE_POSITIONS && (
              <ScalePositionControls scalePositionState={scalePositionState} updateScalePosition={updateScalePosition} embedded={embedded} />
            )}
            {mode === MODES.CAGED && (
              <CAGEDControls cagedState={cagedState} updateCAGED={updateCAGED} embedded={embedded} />
            )}
            {mode === MODES.ONE_FRET_RULE && (
              <OneFretRuleControls
                oneFretRuleState={oneFretRuleState}
                updateOneFretRule={updateOneFretRule}
                oneFretRuleInfo={oneFretRuleInfo}
                rootNote={rootNote}
                embedded={embedded}
              />
            )}
            {mode === MODES.TRIADS && (
              <TriadControls triadState={triadState} updateTriad={updateTriad} onRootChange={handleTriadRootChange} embedded={embedded} />
            )}
            {mode === MODES.CAGED && (
              <KeyButtons rootNote={cagedState.rootNote} onRootChange={(r) => updateCAGED({ rootNote: r })} />
            )}
        </div>

        {/* Quiz Prompt — Find Note batch mode */}
        {mode === MODES.QUIZ_IDENTIFY && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
            alignItems: "center",
            animation: "fadeInQuiz 0.2s ease",
          }}>
            <QuizPrompt
              mode={mode}
              quizTarget={quizTarget}
              identifyState={identifyState}
              onFinish={handleFinishIdentify}
              onNewRound={handleNewIdentifyRound}
            />
          </div>
        )}

        {/* Quiz Prompt & Score — Name Note mode */}
        {mode === MODES.QUIZ_FIND && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
            alignItems: "center",
            animation: "fadeInQuiz 0.2s ease",
          }}>
            <QuizPrompt mode={mode} quizNote={quizNote} />
            <QuizFeedback feedback={quizFeedback} />
            <AnswerBubbles
              quizNote={quizNote}
              findChoices={findChoices}
              selectedAnswer={selectedAnswer}
              onAnswer={handleFindAnswer}
            />
            <ScoreBar score={score} streak={streak} bestStreak={bestStreak} />
          </div>
        )}

        {/* Interval Quiz Prompt */}
        {mode === MODES.INTERVALS && intervalState.quizMode && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
            alignItems: "center",
            animation: "fadeInQuiz 0.2s ease",
          }}>
            <div style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, rgba(255,200,50,0.08), rgba(255,200,50,0.02))",
              border: "1px solid rgba(255,200,50,0.2)",
              borderRadius: 10,
              fontFamily: "var(--font-sans)",
            }}>
              {intervalState.quizNote && (
                <span style={{ fontSize: "0.85rem", color: "#ffc832" }}>
                  What interval is on the <strong>{getStringLabel(intervalState.quizNote.string)}</strong> string, <strong>fret {intervalState.quizNote.fret}</strong>?
                </span>
              )}
            </div>
            <QuizFeedback feedback={intervalState.quizFeedback} />
            <IntervalQuizPrompt
              quizNote={intervalState.quizNote}
              onAnswer={handleIntervalAnswer}
              selectedAnswer={intervalState.selectedAnswer}
              correctInterval={intervalState.correctInterval}
            />
            <ScoreBar score={score} streak={streak} bestStreak={bestStreak} />
          </div>
        )}
        </div>

        {/* Fretboard */}
        <Fretboard
          keyNotes={keyNotes}
          rootNote={rootNote}
          mode={mode}
          selectedRegion={selectedRegion}
          region={region}
          highlightRoot={highlightRoot}
          showDegrees={showDegrees}
          quizNote={mode === MODES.INTERVALS ? intervalState.quizNote : quizNote}
          selectedAnswer={mode === MODES.INTERVALS ? intervalState.selectedAnswer : selectedAnswer}
          isNoteVisible={isNoteVisible}
          onToggleReveal={toggleReveal}
          hideAll={hideAll}
          getNoteDisplayData={getNoteDisplayData}
          scalePositionState={scalePositionState}
          cagedState={cagedState}
          intervalState={intervalState}
          identifyState={identifyState}
          scrollRef={fretboardScrollRef}
        />

        {/* Legend */}
        <Legend
          keyNotes={keyNotes}
          rootNote={rootNote}
          highlightRoot={highlightRoot}
          mode={mode}
          quizNote={quizNote}
          scalePositionState={scalePositionState}
          cagedState={cagedState}
          intervalState={intervalState}
          oneFretRuleState={oneFretRuleState}
          oneFretRuleInfo={oneFretRuleInfo}
          triadState={triadState}
        />

        {/* Tips */}
        <Tips mode={mode} />

        {/* Harmonies Panel — visible on Triads and CAGED modes only */}
        {(isTriads || mode === MODES.CAGED) && (
          <HarmoniesPanel
            mode={mode}
            triadState={triadState}
            harmoniesState={harmoniesState}
            onToggleExpanded={handleToggleHarmonies}
            onChordTap={handleHarmonyChordTap}
          />
        )}

        {/* Triad Explainer */}
        {mode === MODES.TRIADS && (
          <TriadExplainer triadState={triadState} />
        )}
      </div>
    </div>
  );
}
