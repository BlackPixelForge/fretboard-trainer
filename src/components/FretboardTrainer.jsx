"use client";

import { useState, useCallback, useEffect } from "react";
import {
  NOTES, NATURAL_NOTES, SHARP_NOTES, DIATONIC_KEYS,
  getNoteAt, getNoteName, isInKey, getStringLabel, getScaleDegree,
} from "./lib/music";
import { MODES, FRET_REGIONS, FRET_COUNT } from "./lib/fretboard";
import { getIntervalLabel, getIntervalDegree, generateIntervalQuiz, INTERVAL_LABELS } from "./lib/intervals";
import { isInScalePosition, FORMS, getRootNoteForPosition, computeKeyNotes } from "./lib/scales";
import { getCAGEDInfo } from "./lib/caged";
import ModeSelector from "./controls/ModeSelector";
import KeySelector from "./controls/KeySelector";
import RegionSelector from "./controls/RegionSelector";
import ExploreToggles from "./controls/ExploreToggles";
import StringToggles from "./controls/StringToggles";
import IntervalControls from "./controls/IntervalControls";
import ScalePositionControls from "./controls/ScalePositionControls";
import CAGEDControls from "./controls/CAGEDControls";
import OneFretRuleControls from "./controls/OneFretRuleControls";
import QuizPrompt from "./quiz/QuizPrompt";
import QuizFeedback from "./quiz/QuizFeedback";
import AnswerBubbles from "./quiz/AnswerBubbles";
import IntervalQuizPrompt from "./quiz/IntervalQuizPrompt";
import ScoreBar from "./quiz/ScoreBar";
import Fretboard from "./fretboard/Fretboard";
import Legend from "./Legend";
import Tips from "./Tips";

export default function FretboardTrainer() {
  const [selectedKey, setSelectedKey] = useState("C Major / A Minor");
  const [mode, setMode] = useState(MODES.EXPLORE);
  const [showNaturals, setShowNaturals] = useState(true);
  const [showSharps, setShowSharps] = useState(true);
  const [showDegrees, setShowDegrees] = useState(false);
  const [highlightRoot, setHighlightRoot] = useState(true);
  const [revealedNotes, setRevealedNotes] = useState(new Set());
  const [hideAll, setHideAll] = useState(false);
  const [selectedStrings, setSelectedStrings] = useState(new Set([0, 1, 2, 3, 4, 5]));
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
  });

  const [cagedState, setCagedState] = useState({
    selectedShape: "all",
    showScaleTones: true,
  });

  const [intervalState, setIntervalState] = useState({
    showIntervals: true,
    intervalFilter: new Set([1, 2, 3, 4, 5, 6, 7]),
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
  const keyNotes = isOneFretRule
    ? computeKeyNotes(oneFretRuleInfo[oneFretRuleState.selectedFormIndex].rootNote)
    : baseKeyNotes;
  const rootNote = isOneFretRule
    ? oneFretRuleInfo[oneFretRuleState.selectedFormIndex].rootNote
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

  // --- getNoteDisplayData: returns mode-specific rendering metadata ---
  const getNoteDisplayData = (s, f) => {
    const noteIndex = getNoteAt(s, f);

    if (mode === MODES.SCALE_POSITIONS) {
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

    return null;
  };

  const toggleReveal = (s, f) => {
    if (mode === MODES.QUIZ_IDENTIFY) {
      if (identifyState.phase !== "selecting") return;
      const noteIndex = getNoteAt(s, f);
      if (!isInKey(noteIndex, keyNotes)) return;
      if (!selectedStrings.has(s)) return;
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
    if (mode === MODES.SCALE_POSITIONS || mode === MODES.CAGED || mode === MODES.INTERVALS || mode === MODES.ONE_FRET_RULE) return;

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
    const strings = Array.from(selectedStrings);
    if (strings.length === 0) return;
    const s = strings[Math.floor(Math.random() * strings.length)];
    const minF = region.start;
    const maxF = region.end;
    const validFrets = [];
    for (let f = minF; f <= maxF; f++) {
      const noteIndex = getNoteAt(s, f);
      if (isInKey(noteIndex, keyNotes)) {
        validFrets.push(f);
      }
    }
    if (validFrets.length === 0) return generateFindQuiz();
    const f = validFrets[Math.floor(Math.random() * validFrets.length)];
    const correctNote = getNoteName(getNoteAt(s, f));

    const keyNoteNames = keyNotes.map(n => getNoteName(n));
    const distractors = keyNoteNames.filter(n => n !== correctNote);
    const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [correctNote, ...shuffled].sort(() => Math.random() - 0.5);

    setQuizNote({ string: s, fret: f });
    setFindChoices(choices);
    setSelectedAnswer(null);
    setQuizFeedback(null);
  }, [selectedStrings, keyNotes, region]);

  const handleFindAnswer = (chosenNote) => {
    if (selectedAnswer !== null) return;
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
      setTimeout(() => generateFindQuiz(), 1000);
    } else {
      setQuizFeedback({ correct: false, message: `\u2717 That's ${correctNote}, not ${chosenNote}` });
      setScore(p => ({ ...p, total: p.total + 1 }));
      setStreak(0);
      setTimeout(() => generateFindQuiz(), 1500);
    }
  };

  // --- Interval quiz ---
  const generateIntervalQuizNote = useCallback(() => {
    const result = generateIntervalQuiz(keyNotes, selectedStrings, region);
    if (result) {
      updateInterval({
        quizNote: { string: result.stringIndex, fret: result.fret },
        correctInterval: result.correctInterval,
        selectedAnswer: null,
        quizFeedback: null,
      });
    }
  }, [keyNotes, selectedStrings, region]);

  const handleIntervalAnswer = (chosenDegree) => {
    if (intervalState.selectedAnswer !== null) return;
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
      setTimeout(() => generateIntervalQuizNote(), 1000);
    } else {
      updateInterval({
        selectedAnswer: chosenDegree,
        quizFeedback: { correct: false, message: `\u2717 That's the ${label}, not ${INTERVAL_LABELS[chosenDegree]}` },
      });
      setScore(p => ({ ...p, total: p.total + 1 }));
      setStreak(0);
      setTimeout(() => generateIntervalQuizNote(), 1500);
    }
  };

  const handleFinishIdentify = () => {
    const positionMap = new Map();
    let correct = 0, incorrect = 0, missed = 0;
    const fretStart = selectedRegion === "all" ? 0 : region.start;
    const fretEnd = selectedRegion === "all" ? FRET_COUNT : region.end;
    for (let s = 0; s <= 5; s++) {
      if (!selectedStrings.has(s)) continue;
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

  useEffect(() => {
    if (mode === MODES.QUIZ_IDENTIFY) generateIdentifyQuiz();
    else if (mode === MODES.QUIZ_FIND) generateFindQuiz();
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset identify quiz when key changes
  useEffect(() => {
    if (mode === MODES.QUIZ_IDENTIFY) generateIdentifyQuiz();
  }, [selectedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Interval quiz mode effect
  useEffect(() => {
    if (mode === MODES.INTERVALS && intervalState.quizMode) {
      generateIntervalQuizNote();
      resetScore();
    } else {
      updateInterval({ quizNote: null, selectedAnswer: null, quizFeedback: null, correctInterval: null });
    }
  }, [intervalState.quizMode, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Arrow key navigation for One Fret Rule form stepping
  useEffect(() => {
    if (mode !== MODES.ONE_FRET_RULE) return;
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

  const resetScore = () => {
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setBestStreak(0);
  };

  const isNoteVisible = (s, f) => {
    // New modes define their own note sets
    if (mode === MODES.SCALE_POSITIONS) {
      if (!selectedStrings.has(s)) return false;
      const match = isInScalePosition(s, f, rootNote, keyNotes, scalePositionState.positionIndex);
      return match !== null;
    }

    if (mode === MODES.ONE_FRET_RULE) {
      if (!selectedStrings.has(s)) return false;
      const match = isInScalePosition(s, f, rootNote, keyNotes, oneFretRuleState.selectedFormIndex);
      return match !== null;
    }

    if (mode === MODES.CAGED) {
      if (!selectedStrings.has(s)) return false;
      const info = getCAGEDInfo(s, f, rootNote, cagedState.selectedShape);
      if (!info) return false;
      if (!info.isChordTone && !cagedState.showScaleTones) return false;
      return true;
    }

    if (mode === MODES.INTERVALS) {
      if (!selectedStrings.has(s)) return false;
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

    // Batch identify mode: show dots at all in-key positions in active region
    if (mode === MODES.QUIZ_IDENTIFY) {
      if (!selectedStrings.has(s)) return false;
      if (selectedRegion !== "all" && (f < region.start || f > region.end)) return false;
      const noteIndex = getNoteAt(s, f);
      return isInKey(noteIndex, keyNotes);
    }

    // Original logic for explore/quiz modes
    const noteIndex = getNoteAt(s, f);
    if (!isInKey(noteIndex, keyNotes)) return false;
    if (!selectedStrings.has(s)) return false;
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
  };

  const handleKeyChange = (key) => {
    setSelectedKey(key);
    setRevealedNotes(new Set());
  };

  const handleToggleString = (i) => {
    setSelectedStrings(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const isQuizActive = mode === MODES.QUIZ_IDENTIFY || mode === MODES.QUIZ_FIND ||
    (mode === MODES.INTERVALS && intervalState.quizMode);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #0a0a0f 0%, #12121c 40%, #0d1117 100%)",
      color: "#c8ccd4",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      padding: "20px",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto 24px", textAlign: "center" }}>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          fontWeight: 800,
          background: "linear-gradient(135deg, #e84e3c 0%, #f0c832 50%, #3ca0dc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 4px",
          letterSpacing: "-0.02em",
        }}>
          Fretboard Navigator
        </h1>
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.8rem",
          color: "#555a68",
          fontWeight: 400,
          margin: 0,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          Diatonic Note Memorization Trainer
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Controls Bar */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "16px",
          alignItems: "center",
        }}>
          <ModeSelector mode={mode} onModeChange={handleModeChange} />
          {!isOneFretRule && (
            <KeySelector selectedKey={selectedKey} onKeyChange={handleKeyChange} />
          )}
          {isOneFretRule && (
            <span style={{
              padding: "7px 14px",
              background: "rgba(212,160,23,0.12)",
              border: "1px solid rgba(212,160,23,0.3)",
              borderRadius: 8,
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#f0d060",
            }}>
              {getNoteName(rootNote)} Major
            </span>
          )}
          {(mode === MODES.EXPLORE || mode === MODES.QUIZ_FIND || mode === MODES.QUIZ_IDENTIFY || mode === MODES.INTERVALS) && (
            <RegionSelector selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
          )}
        </div>

        {/* Sub Controls */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "18px",
          alignItems: "center",
        }}>
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
            <IntervalControls intervalState={intervalState} updateInterval={updateInterval} />
          )}
          {mode === MODES.SCALE_POSITIONS && (
            <ScalePositionControls scalePositionState={scalePositionState} updateScalePosition={updateScalePosition} />
          )}
          {mode === MODES.CAGED && (
            <CAGEDControls cagedState={cagedState} updateCAGED={updateCAGED} />
          )}
          {mode === MODES.ONE_FRET_RULE && (
            <OneFretRuleControls
              oneFretRuleState={oneFretRuleState}
              updateOneFretRule={updateOneFretRule}
              oneFretRuleInfo={oneFretRuleInfo}
            />
          )}
          <StringToggles selectedStrings={selectedStrings} onToggleString={handleToggleString} />
        </div>

        {/* Quiz Prompt — Name Note batch mode */}
        {mode === MODES.QUIZ_IDENTIFY && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
            alignItems: "center",
            animation: "slideDown 0.3s ease",
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

        {/* Quiz Prompt & Score — Find Note mode */}
        {mode === MODES.QUIZ_FIND && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
            alignItems: "center",
            animation: "slideDown 0.3s ease",
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
            animation: "slideDown 0.3s ease",
          }}>
            <div style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, rgba(255,200,50,0.08), rgba(255,200,50,0.02))",
              border: "1px solid rgba(255,200,50,0.2)",
              borderRadius: 10,
              fontFamily: "'Outfit', sans-serif",
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

        {/* Fretboard */}
        <Fretboard
          keyNotes={keyNotes}
          rootNote={rootNote}
          mode={mode}
          selectedStrings={selectedStrings}
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
        />

        {/* Tips */}
        <Tips mode={mode} />
      </div>
    </div>
  );
}
