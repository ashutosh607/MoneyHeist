import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSharedTypewriterAudio } from "./useSharedTypewriterAudio";

/**
 * Hook to handle scroll-triggered, word-by-word typewriter reveal with Web Audio sync.
 */
export function useScrollTypewriter({
  lines: rawLines = [],
  wordDelay = 120,
  linePause = 400,
  threshold = 0.35,
  triggerId,
  isActive: manualIsActive,
  onComplete,
} = {}) {
  const { playWordClack } = useSharedTypewriterAudio();

  // Normalize lines to stable array
  const linesKey = Array.isArray(rawLines) ? rawLines.join("|||") : String(rawLines ?? "");
  const lines = useMemo(() => {
    if (Array.isArray(rawLines)) return rawLines;
    if (typeof rawLines === "string") return [rawLines];
    return [];
  }, [linesKey]);

  // Pre-split lines into word arrays
  const lineWords = useMemo(() => {
    return lines.map((line) => (line ? line.trim().split(/\s+/) : []));
  }, [lines]);

  const targetRef = useRef(null);
  const timerRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const isTypingRef = useRef(false);
  const isCompleteRef = useRef(false);
  const activeStepRef = useRef({ line: 0, word: 0 });

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const playWordClackRef = useRef(playWordClack);
  playWordClackRef.current = playWordClack;

  const lineWordsRef = useRef(lineWords);
  lineWordsRef.current = lineWords;

  // Reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [revealedWordCounts, setRevealedWordCounts] = useState(() => {
    if (reducedMotion) {
      return lineWords.map((words) => words.length);
    }
    return lineWords.map(() => 0);
  });

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(() => reducedMotion);
  const [hasStarted, setHasStarted] = useState(() => reducedMotion);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  // Word-by-word reveal sequence
  const startWordSequence = useCallback(() => {
    if (reducedMotion) {
      setRevealedWordCounts(lineWordsRef.current.map((w) => w.length));
      setIsComplete(true);
      isCompleteRef.current = true;
      setIsTyping(false);
      setHasStarted(true);
      onCompleteRef.current?.();
      return;
    }

    const wordsData = lineWordsRef.current;
    if (!wordsData || wordsData.length === 0) {
      setIsComplete(true);
      isCompleteRef.current = true;
      setIsTyping(false);
      onCompleteRef.current?.();
      return;
    }

    clearTimer();
    isTypingRef.current = true;
    setIsTyping(true);
    setIsComplete(false);
    isCompleteRef.current = false;
    setHasStarted(true);

    activeStepRef.current = { line: 0, word: 0 };
    setCurrentLineIndex(0);

    // Immediately reveal first word so text starts right away
    setRevealedWordCounts(wordsData.map((_, i) => (i === 0 ? 1 : 0)));
    activeStepRef.current = { line: 0, word: 1 };
    playWordClackRef.current?.();

    const step = () => {
      const currentWords = lineWordsRef.current;
      const { line, word } = activeStepRef.current;

      if (line >= currentWords.length) {
        isTypingRef.current = false;
        setIsTyping(false);
        setIsComplete(true);
        isCompleteRef.current = true;
        onCompleteRef.current?.();
        return;
      }

      const totalWordsInLine = currentWords[line]?.length || 0;

      if (word < totalWordsInLine) {
        const nextWord = word + 1;
        activeStepRef.current = { line, word: nextWord };

        setRevealedWordCounts((prev) => {
          const next = [...prev];
          next[line] = nextWord;
          return next;
        });

        playWordClackRef.current?.();

        const jitter = Math.random() * 30 - 15;
        const delay = Math.max(70, wordDelay + jitter);
        timerRef.current = setTimeout(step, delay);
      } else {
        // Line complete, move to next
        const nextLine = line + 1;
        activeStepRef.current = { line: nextLine, word: 0 };

        if (nextLine < currentWords.length) {
          setCurrentLineIndex(nextLine);
          timerRef.current = setTimeout(step, linePause);
        } else {
          isTypingRef.current = false;
          setIsTyping(false);
          setIsComplete(true);
          isCompleteRef.current = true;
          onCompleteRef.current?.();
        }
      }
    };

    timerRef.current = setTimeout(step, wordDelay);

    // Failsafe: After 4s, ensure all words are revealed
    fallbackTimerRef.current = setTimeout(() => {
      setRevealedWordCounts(lineWordsRef.current.map((w) => w.length));
      setIsComplete(true);
      isCompleteRef.current = true;
      setIsTyping(false);
    }, 4000);
  }, [wordDelay, linePause, reducedMotion, clearTimer]);

  // Synchronize state if user toggles reduced motion preference
  useEffect(() => {
    if (reducedMotion) {
      setRevealedWordCounts(lineWords.map((words) => words.length));
      setIsComplete(true);
      isCompleteRef.current = true;
      setIsTyping(false);
      setHasStarted(true);
    }
  }, [reducedMotion, lineWords]);

  // Manual trigger via manualIsActive (handles React StrictMode mounting and unmounting cleanly)
  useEffect(() => {
    if (reducedMotion) return;

    if (manualIsActive) {
      if (!isCompleteRef.current && !isTypingRef.current) {
        startWordSequence();
      }
    }

    return () => {
      clearTimer();
      isTypingRef.current = false;
    };
  }, [manualIsActive, reducedMotion, startWordSequence, clearTimer]);

  // IntersectionObserver trigger if manualIsActive is undefined
  useEffect(() => {
    if (reducedMotion || manualIsActive !== undefined) return;
    if (isCompleteRef.current) return;

    const observedElement = triggerId
      ? document.getElementById(triggerId)
      : targetRef.current;

    if (!observedElement || typeof IntersectionObserver === "undefined") {
      if (targetRef.current && !isCompleteRef.current) {
        startWordSequence();
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            if (!isCompleteRef.current && !isTypingRef.current) {
              startWordSequence();
              observer.disconnect();
            }
          }
        });
      },
      { threshold: [0, threshold] }
    );

    observer.observe(observedElement);

    return () => {
      observer.disconnect();
    };
  }, [manualIsActive, triggerId, threshold, reducedMotion, startWordSequence]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    targetRef,
    lineWords,
    revealedWordCounts,
    currentLineIndex,
    isTyping,
    isComplete,
    hasStarted,
    reducedMotion,
  };
}

export default useScrollTypewriter;
