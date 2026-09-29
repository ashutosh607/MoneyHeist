import React from "react";
import { useScrollTypewriter } from "@/hooks/useScrollTypewriter";

/**
 * ScrollTypewriterBlock
 *
 * Renders a narrative story text block with:
 * - Independent IntersectionObserver scroll triggering (~30-40% visible)
 * - Word-by-word reveal with synchronized Web Audio typing clack
 * - Zero layout shift by pre-reserving full text geometry
 * - Scoped Google Font "Special Elite"
 * - Inter-line pause (~500ms) for multi-line blocks
 * - Blinking cursor at end of active line that disappears once typing finishes
 * - Full prefers-reduced-motion compliance
 *
 * @param {Object} props
 * @param {string[]|string} [props.lines] Array of lines or single line string
 * @param {string} [props.text] Alternative single text line
 * @param {string} [props.triggerId] DOM id of the scroll track marker to observe
 * @param {number} [props.wordDelay=150] Delay between words (ms)
 * @param {number} [props.linePause=500] Delay between lines (ms)
 * @param {number} [props.threshold=0.35] IntersectionObserver threshold (~35%)
 * @param {boolean} [props.isActive] Optional manual activation override
 * @param {string} [props.className=""] Container CSS classes
 * @param {string} [props.lineClassName=""] Individual line CSS classes
 * @param {string} [props.cursorClassName=""] Custom cursor styling
 * @param {Function} [props.onComplete] Callback when typing finishes
 */
export function ScrollTypewriterBlock({
  lines: rawLines,
  text,
  triggerId,
  wordDelay = 150,
  linePause = 500,
  threshold = 0.35,
  isActive,
  className = "",
  lineClassName = "",
  cursorClassName = "",
  onComplete,
}) {
  const lines = rawLines ?? (text ? [text] : []);

  const {
    targetRef,
    lineWords,
    revealedWordCounts,
    currentLineIndex,
    isTyping,
    isComplete,
    hasStarted,
    reducedMotion,
  } = useScrollTypewriter({
    lines,
    wordDelay,
    linePause,
    threshold,
    triggerId,
    isActive,
    onComplete,
  });

  // Cursor is visible only while typing is active, and hidden once that block's text finishes
  const showCursor = isTyping && !isComplete && !reducedMotion && hasStarted;

  return (
    <div
      ref={targetRef}
      className={`tracking-wide select-none ${className}`}
      style={{ fontFamily: "'Special Elite', monospace, Courier, sans-serif" }}
      aria-label={Array.isArray(lines) ? lines.join(" ") : String(lines)}
    >
      <div className="space-y-3">
        {lineWords.map((words, lineIdx) => {
          const revealedCount = revealedWordCounts[lineIdx] ?? 0;
          const isCurrentTypingLine = lineIdx === currentLineIndex;
          const isLineActiveForCursor = showCursor && isCurrentTypingLine;

          return (
            <div key={lineIdx} className={`leading-relaxed relative ${lineClassName}`}>
              {/* Render all words: visible if revealed, invisible if not yet revealed */}
              {words.map((word, wordIdx) => {
                const isRevealed = wordIdx < revealedCount;
                const isLastRevealedWord = wordIdx === revealedCount - 1;

                return (
                  <React.Fragment key={wordIdx}>
                    <span
                      className={
                        isRevealed
                          ? "inline text-neutral-100 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                          : "invisible select-none pointer-events-none opacity-0"
                      }
                      aria-hidden={!isRevealed}
                    >
                      {word}
                    </span>

                    {/* Blinking cursor at the end of the currently-typing word */}
                    {isLineActiveForCursor && isLastRevealedWord && (
                      <span
                        aria-hidden="true"
                        className={`inline-block w-[2px] h-[1.1em] ml-1 bg-red-600 align-middle animate-[typewriterBlink_0.8s_step-start_infinite] ${cursorClassName}`}
                      />
                    )}

                    {/* Space between words */}
                    {wordIdx < words.length - 1 && (
                      <span
                        className={
                          isRevealed
                            ? "inline"
                            : "invisible select-none pointer-events-none opacity-0"
                        }
                        aria-hidden={!isRevealed}
                      >
                        {" "}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Cursor at start of line before first word appears if line is currently active */}
              {isLineActiveForCursor && revealedCount === 0 && (
                <span
                  aria-hidden="true"
                  className={`inline-block w-[2px] h-[1.1em] bg-red-600 align-middle animate-[typewriterBlink_0.8s_step-start_infinite] ${cursorClassName}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScrollTypewriterBlock;
