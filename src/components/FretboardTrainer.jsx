"use client";

import { useState, useCallback, useEffect } from "react";
import {
  NOTES, NATURAL_NOTES, SHARP_NOTES, DIATONIC_KEYS,
  getNoteAt, getNoteName, isInKey, getStringLabel,
} from "./lib/music";
import { MODES, FRET_REGIONS } from "./lib/fretboard";
import ModeSelector from "./controls/ModeSelector";
import KeySelector from "./controls/KeySelector";
import RegionSelector from "./controls/RegionSelector";
import ExploreToggles from "./controls/ExploreToggles";
import StringToggles from "./controls/StringToggles";
import QuizPrompt from "./quiz/QuizPrompt";
import QuizFeedback from "./quiz/QuizFeedback";
import AnswerBubbles from "./quiz/AnswerBubbles";
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

  const keyNotes = DIATONIC_KEYS[selectedKey];
  const rootNote = keyNotes[0];
  const region = FRET_REGIONS[selectedRegion];

  const getNoteId = (s, f) => `${s}-${f}`;

  const toggleReveal = (s, f) => {
    if (mode === MODES.QUIZ_IDENTIFY) {
      const noteIndex = getNoteAt(s, f);
      const noteName = getNoteName(noteIndex);
      if (noteName === quizTarget?.name) {
        setQuizFeedback({ correct: true, message: `\u2713 Correct! That's ${noteName}` });
        setScore(p => ({ correct: p.correct + 1, total: p.total + 1 }));
        setStreak(p => {
          const next = p + 1;
          setBestStreak(b => Math.max(b, next));
          return next;
        });
        setTimeout(() => generateIdentifyQuiz(), 800);
      } else {
        setQuizFeedback({ correct: false, message: `\u2717 That's ${noteName}, not ${quizTarget?.name}` });
        setScore(p => ({ ...p, total: p.total + 1 }));
        setStreak(0);
      }
      return;
    }
    if (mode === MODES.QUIZ_FIND) return;

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

  useEffect(() => {
    if (mode === MODES.QUIZ_IDENTIFY) generateIdentifyQuiz();
    else if (mode === MODES.QUIZ_FIND) generateFindQuiz();
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetScore = () => {
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setBestStreak(0);
  };

  const isNoteVisible = (s, f) => {
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
          <KeySelector selectedKey={selectedKey} onKeyChange={handleKeyChange} />
          <RegionSelector selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
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
          <StringToggles selectedStrings={selectedStrings} onToggleString={handleToggleString} />
        </div>

        {/* Quiz Prompt & Score */}
        {mode !== MODES.EXPLORE && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
            alignItems: "center",
            animation: "slideDown 0.3s ease",
          }}>
            <QuizPrompt mode={mode} quizTarget={quizTarget} quizNote={quizNote} />
            <QuizFeedback feedback={quizFeedback} />
            {mode === MODES.QUIZ_FIND && (
              <AnswerBubbles
                quizNote={quizNote}
                findChoices={findChoices}
                selectedAnswer={selectedAnswer}
                onAnswer={handleFindAnswer}
              />
            )}
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
          quizNote={quizNote}
          selectedAnswer={selectedAnswer}
          isNoteVisible={isNoteVisible}
          onToggleReveal={toggleReveal}
          hideAll={hideAll}
        />

        {/* Legend */}
        <Legend
          keyNotes={keyNotes}
          rootNote={rootNote}
          highlightRoot={highlightRoot}
          mode={mode}
          quizNote={quizNote}
        />

        {/* Tips */}
        <Tips mode={mode} />
      </div>
    </div>
  );
}
