import React, { useState, useEffect, useRef, useId, useMemo, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useScrambleText } from "./useScrambleText";
import { DecryptText } from "./DecryptText";
import { useSharedTypewriterAudio } from "@/hooks/useSharedTypewriterAudio";
import "./Faq.css";

// Register GSAP plugins safely once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Preserve existing FAQ data structure exactly
const DEFAULT_FAQS = [
  {
    q: "How do I register?",
    a: "Registration runs on Unstop from 29 September to 6 October. Hit Join the crew, form your team of 2-3 members there and you're in.",
  },
  {
    q: "How many crews can enter?",
    a: "Forty-five. Once the seats are gone, the door closes.",
  },
  {
    q: "Is there a registration fee?",
    a: "Yes. The registration fee is ₹149 per team.",
  },
  {
    q: "Where does the heist happen?",
    a: "Dwarkadas J. Sanghvi College of Engineering, Mumbai, on 9 October.",
  },
  {
    q: "Can beginners join?",
    a: "Yes. The event is open to everyone, whatever your college, branch or experience.",
  },
];

/**
 * HeadingScramble Component
 * Types in "CLARIFICATIONS" with vault cryptographic scramble on scroll reveal.
 */
function ClarificationsHeader({ triggerRef }) {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(Boolean(shouldReduceMotion));
  const { displayText } = useScrambleText("CLARIFICATIONS", active, {
    duration: 650,
  });

  useEffect(() => {
    if (shouldReduceMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top 88%",
      once: true,
      onEnter: () => setActive(true),
    });

    return () => trigger.kill();
  }, [triggerRef, shouldReduceMotion]);

  return (
    <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#E50914] font-semibold block mb-2 select-none">
      {shouldReduceMotion ? "CLARIFICATIONS" : displayText}
    </span>
  );
}

/**
 * QuestionTitle Component
 * Displays question text with fast 300ms hover scramble and RGB split glitch.
 */
function QuestionTitle({ text, isHovered }) {
  const shouldReduceMotion = useReducedMotion();
  const { displayText } = useScrambleText(text, isHovered, { duration: 300 });

  return (
    <span
      className={`font-mono text-sm sm:text-base text-[#F5F2ED] group-hover:text-[#E50914] transition-colors tracking-wide select-none ${
        !shouldReduceMotion && isHovered ? "faq-glitch-hover" : ""
      }`}
    >
      {shouldReduceMotion ? text : isHovered ? displayText : text}
    </span>
  );
}

/**
 * SafeDialIcon Component
 * SVG combination dial with radial tick marks.
 * Rotates with ratcheting steps on open and morphs into a glowing red "×".
 * Magnetic pull toward cursor on desktop.
 */
function SafeDialIcon({ isOpen, rowRef }) {
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Magnetic spring physics (~60px range)
  const springX = useSpring(mouseX, { stiffness: 240, damping: 16 });
  const springY = useSpring(mouseY, { stiffness: 240, damping: 16 });

  const handleMouseMove = useCallback(
    (e) => {
      if (shouldReduceMotion || !rowRef.current) return;
      const rect = rowRef.current.getBoundingClientRect();
      const dialCenterX = rect.right - 28;
      const dialCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - dialCenterX;
      const dy = e.clientY - dialCenterY;
      const distance = Math.hypot(dx, dy);

      if (distance < 65) {
        mouseX.set(dx * 0.4);
        mouseY.set(dy * 0.4);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }
    },
    [shouldReduceMotion, rowRef, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [rowRef, handleMouseMove, handleMouseLeave]);

  return (
    <motion.div
      style={{
        x: shouldReduceMotion ? 0 : springX,
        y: shouldReduceMotion ? 0 : springY,
      }}
      className="faq-safe-dial-wrap"
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="faq-safe-dial-svg"
        animate={
          shouldReduceMotion
            ? {}
            : isOpen
            ? {
                rotate: [0, 45, 90, 180, 225],
                scale: [1, 1.1, 1.05],
              }
            : {
                rotate: 0,
                scale: 1,
              }
        }
        transition={{
          duration: 0.48,
          ease: [0.16, 1, 0.3, 1],
          times: [0, 0.2, 0.4, 0.8, 1],
        }}
      >
        {/* Outer Combination Bezel */}
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke={isOpen ? "#E50914" : "#404040"}
          strokeWidth="1.2"
          strokeDasharray="2 3"
          className="transition-colors duration-300"
        />

        {/* 12 Vault Dial Radial Tick Marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          const rad = (angle * Math.PI) / 180;
          const x1 = 20 + 13 * Math.cos(rad);
          const y1 = 20 + 13 * Math.sin(rad);
          const x2 = 20 + 15.5 * Math.cos(rad);
          const y2 = 20 + 15.5 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isOpen ? "#E50914" : "#525252"}
              strokeWidth={i % 3 === 0 ? "1.4" : "0.8"}
              strokeOpacity={isOpen ? 0.9 : 0.6}
            />
          );
        })}

        {/* Inner Dial Wheel */}
        <circle
          cx="20"
          cy="20"
          r="9.5"
          fill="#111111"
          stroke={isOpen ? "#E50914" : "#E50914"}
          strokeWidth="1.2"
          className="transition-colors duration-300"
        />

        {/* Center Cross / Plus that morphs into Red Glowing "X" */}
        <motion.g
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ originX: "20px", originY: "20px" }}
        >
          <line
            x1="20"
            y1="14"
            x2="20"
            y2="26"
            stroke="#E50914"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="14"
            y1="20"
            x2="26"
            y2="20"
            stroke="#E50914"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}

/**
 * CctvOverlay Component
 * Renders faint scanlines, blinking REC dot, running timestamp (HH:MM:SS:FF),
 * and light film grain. Paused when off-screen.
 */
function CctvOverlay({ isVisible = true }) {
  const shouldReduceMotion = useReducedMotion();
  const [timestamp, setTimestamp] = useState("00:00:00:00");

  useEffect(() => {
    if (shouldReduceMotion || !isVisible) return;

    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % 30;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const ff = String(frame).padStart(2, "0");
      setTimestamp(`${hh}:${mm}:${ss}:${ff}`);
    }, 33);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, isVisible]);

  if (shouldReduceMotion) return null;

  return (
    <div className="faq-cctv-overlay" aria-hidden="true">
      <div className="faq-cctv-scanlines" />
      <div className="faq-cctv-grain" />
      <div className="faq-cctv-hud">
        <span className="faq-rec-dot" />
        <span className="font-mono text-[9px] tracking-widest text-[#E50914]">
          REC [CAM-04]
        </span>
        <span className="font-mono text-[9px] tracking-wider text-neutral-400">
          {timestamp}
        </span>
      </div>
    </div>
  );
}

/**
 * ShredderExitOverlay Component
 * Splits the closing answer into ~12 vertical strips dropping and fading like paper through a shredder.
 */
function ShredderExitOverlay({ text, onDone }) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const STRIP_COUNT = 12;

  useGSAP(
    () => {
      if (shouldReduceMotion) {
        if (onDone) onDone();
        return;
      }

      const strips = containerRef.current?.querySelectorAll(".faq-shredder-strip");
      if (!strips || strips.length === 0) {
        if (onDone) onDone();
        return;
      }

      gsap.fromTo(
        strips,
        { y: 0, opacity: 1, rotateZ: 0 },
        {
          y: () => gsap.utils.random(30, 55),
          opacity: 0,
          rotateZ: () => gsap.utils.random(-8, 8),
          duration: 0.35,
          stagger: 0.015,
          ease: "power2.in",
          onComplete: () => {
            if (onDone) onDone();
          },
        }
      );
    },
    { scope: containerRef }
  );

  if (shouldReduceMotion) return null;

  return (
    <div ref={containerRef} className="faq-shredder-overlay" aria-hidden="true">
      {Array.from({ length: STRIP_COUNT }).map((_, i) => (
        <div key={i} className="faq-shredder-strip">
          <div
            style={{
              width: `${STRIP_COUNT * 100}%`,
              transform: `translateX(-${i * (100 / STRIP_COUNT)}%)`,
            }}
            className="font-mono sm:font-sans text-sm sm:text-base text-[#A3A3A3] select-none"
          >
            {text}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * FaqRow Component
 * Encapsulates an individual FAQ row with scoped hover events, safe dial,
 * shutters, decryption text, and shredder exit.
 */
function FaqRow({
  faq,
  idx,
  isOpen,
  isOtherOpen,
  isClosing,
  onToggle,
  onShredderDone,
  isSectionVisible,
  registerRowRef,
}) {
  const rowRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const uniqueId = useId();

  useEffect(() => {
    registerRowRef(idx, rowRef.current);
    return () => registerRowRef(idx, null);
  }, [idx, registerRowRef]);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const mx = `${e.clientX - rect.left}px`;
    const my = `${e.clientY - rect.top}px`;
    rowRef.current.style.setProperty("--mx", mx);
    rowRef.current.style.setProperty("--my", my);
  };

  const contentId = `${uniqueId}-faq-content-${idx}`;
  const triggerId = `${uniqueId}-faq-trigger-${idx}`;

  return (
    <motion.div
      ref={rowRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={
        shouldReduceMotion
          ? { opacity: 1, filter: "none" }
          : isOtherOpen
          ? { opacity: 0.55, filter: "blur(0.5px)" }
          : { opacity: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="faq-row-item group relative"
    >
      {/* Row Divider Laser Scan Line (entrance effect) */}
      <div className="faq-divider-laser" aria-hidden="true" />

      {/* Cursor Spotlight Hover Effect */}
      <div className="faq-row-spotlight" aria-hidden="true" />

      {/* Laser Underline sweeping on hover */}
      <div className="faq-laser-underline" aria-hidden="true" />

      {/* Question Row Trigger Button */}
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left gap-4 cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E50914] px-2 rounded-sm"
      >
        <QuestionTitle text={faq.q} isHovered={isHovered} />

        {/* Vault Safe Dial Icon */}
        <SafeDialIcon isOpen={isOpen} rowRef={rowRef} />
      </button>

      {/* Accordion Answer Container with Vault Shutters & Hero Decrypt */}
      <AnimatePresence initial={false}>
        {(isOpen || isClosing) && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            initial={
              shouldReduceMotion
                ? { opacity: 1, height: "auto" }
                : { opacity: 0, height: 0 }
            }
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                duration: shouldReduceMotion ? 0.2 : 0.42,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            exit={{
              opacity: shouldReduceMotion ? 0 : 0.8,
              height: 0,
              transition: {
                duration: shouldReduceMotion ? 0.15 : 0.38,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            className="faq-shutter-container overflow-hidden relative"
          >
            {/* Vault Steel Plate Shutters */}
            {!shouldReduceMotion && (
              <>
                <motion.div
                  initial={{ y: "0%" }}
                  animate={{ y: "-100%" }}
                  exit={{
                    y: "0%",
                    transition: {
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                    },
                  }}
                  transition={{
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="faq-shutter-plate faq-shutter-plate-top"
                />
                <motion.div
                  initial={{ y: "0%" }}
                  animate={{ y: "100%" }}
                  exit={{
                    y: "0%",
                    transition: {
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                    },
                  }}
                  transition={{
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="faq-shutter-plate faq-shutter-plate-bottom"
                />
                {/* Center Glowing Laser Seam */}
                <motion.div
                  initial={{ opacity: 1, scaleX: 1 }}
                  animate={{ opacity: 0, scaleX: 0 }}
                  exit={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.25 }}
                  className="faq-shutter-laser-seam"
                />
              </>
            )}

            {/* CCTV Overlay on the open answer */}
            <CctvOverlay isVisible={isSectionVisible && isOpen} />

            {/* Shredder Close vertical strips overlay */}
            {isClosing && (
              <ShredderExitOverlay
                text={faq.a}
                onDone={() => onShredderDone(idx)}
              />
            )}

            {/* Answer content body */}
            <motion.div
              initial={
                shouldReduceMotion ? { y: 0, opacity: 1 } : { y: 6, opacity: 0 }
              }
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -4, opacity: 0 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="pb-6 px-2 relative z-10"
            >
              {/* Subtle red security scanning line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="h-[1px] w-full bg-gradient-to-r from-[#E50914] via-[#E50914]/60 to-transparent origin-left mb-3.5"
              />

              {/* DecryptText: Left to right resolution with frontier cursor block */}
              <DecryptText
                text={faq.a}
                active={isOpen && !isClosing}
                duration={900}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Faq Main Component
 * Upgrades ONLY the FAQ section into a cinematic vault cracking experience.
 */
export function Faq({ faqs = DEFAULT_FAQS }) {
  const faqContainerRef = useRef(null);
  const headingCharsRef = useRef([]);
  const rowsMapRef = useRef(new Map());
  const vignetteRef = useRef(null);
  const progressFillRef = useRef(null);
  const laserGridRef = useRef(null);

  const [openFaq, setOpenFaq] = useState(null);
  const [shreddingIdx, setShreddingIdx] = useState(null);
  const [isSectionVisible, setIsSectionVisible] = useState(true);

  const shouldReduceMotion = useReducedMotion();
  const { isMuted, playWordClack } = useSharedTypewriterAudio();

  const registerRowRef = useCallback((idx, el) => {
    if (el) {
      rowsMapRef.current.set(idx, el);
    } else {
      rowsMapRef.current.delete(idx);
    }
  }, []);

  // Visibility observer to pause ambient animations when off-screen
  useEffect(() => {
    const el = faqContainerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split "FREQUENTLY ASKED QUESTIONS" into characters
  const headingText = "FREQUENTLY ASKED QUESTIONS";
  const headingLetters = useMemo(() => headingText.split(""), [headingText]);

  // GSAP Animations: Heading Entrance, Row Entrance, Scroll-linked Progress, Laser Grid
  useGSAP(
    () => {
      if (!faqContainerRef.current) return;

      // 1. Heading Entrance: slam in from random offsets with glitch flicker + RGB split
      if (headingCharsRef.current.length > 0 && !shouldReduceMotion) {
        gsap.fromTo(
          headingCharsRef.current,
          {
            opacity: 0,
            y: () => gsap.utils.random(-35, 35),
            x: () => gsap.utils.random(-25, 25),
            rotateZ: () => gsap.utils.random(-15, 15),
            textShadow: "-3px 0 #E50914, 3px 0 #00E5FF",
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            rotateZ: 0,
            textShadow: "0px 0px 0px rgba(0,0,0,0)",
            duration: 0.65,
            stagger: 0.02,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: faqContainerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 2. Row Entrance: drop in one by one like vault drawers with clip-path inset reveal & divider laser
      if (!shouldReduceMotion) {
        const rows = Array.from(rowsMapRef.current.values());
        const dividers = faqContainerRef.current.querySelectorAll(".faq-divider-laser");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: faqContainerRef.current,
            start: "top 82%",
            once: true,
          },
        });

        if (rows.length > 0) {
          tl.fromTo(
            rows,
            {
              opacity: 0,
              y: -18,
              clipPath: "inset(0% 0% 100% 0%)",
            },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.55,
              stagger: 0.08,
              ease: "power3.out",
            },
            0
          );
        }

        if (dividers.length > 0) {
          tl.fromTo(
            dividers,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.45,
              stagger: 0.08,
              ease: "power2.out",
            },
            0.05
          );
        }
      }

      // 3. Scroll-linked Progress Line scrubbing along left edge
      if (progressFillRef.current && !shouldReduceMotion) {
        gsap.fromTo(
          progressFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: faqContainerRef.current,
              start: "top 75%",
              end: "bottom 75%",
              scrub: 0.4,
            },
          }
        );
      }

      // 4. Laser Grid: 2-3 thin red beams sweeping slowly across the section
      if (laserGridRef.current && !shouldReduceMotion) {
        const beams = laserGridRef.current.querySelectorAll(".faq-laser-beam");
        beams.forEach((beam, idx) => {
          gsap.fromTo(
            beam,
            { x: "-100%", top: `${25 + idx * 30}%` },
            {
              x: "100%",
              duration: 8 + idx * 3.5,
              repeat: -1,
              ease: "none",
              delay: idx * 2.2,
            }
          );
        });
      }
    },
    { scope: faqContainerRef, dependencies: [shouldReduceMotion] }
  );

  // Trigger alarm pulse: 350ms red vignette flash on container edges + 2-3px micro shake
  const triggerAlarmPulse = useCallback(
    (rowIndex) => {
      if (shouldReduceMotion) return;

      // Vignette flash
      if (vignetteRef.current) {
        gsap.fromTo(
          vignetteRef.current,
          { opacity: 0.8 },
          { opacity: 0, duration: 0.35, ease: "power2.out" }
        );
      }

      // Micro shake on the opened row
      const targetRow = rowsMapRef.current.get(rowIndex);
      if (targetRow) {
        gsap.fromTo(
          targetRow,
          { x: 0 },
          {
            x: -2.5,
            duration: 0.05,
            repeat: 5,
            yoyo: true,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.set(targetRow, { x: 0 });
            },
          }
        );
      }
    },
    [shouldReduceMotion]
  );

  // Row Toggle Handler (Only one row open at a time)
  const toggleFaq = (idx) => {
    if (openFaq === idx) {
      if (!shouldReduceMotion) {
        setShreddingIdx(idx);
      } else {
        setOpenFaq(null);
      }
      return;
    }

    // Play subtle mechanical vault ratchet click if unmuted
    if (!isMuted && typeof playWordClack === "function") {
      playWordClack();
    }

    setShreddingIdx(null);
    setOpenFaq(idx);
    triggerAlarmPulse(idx);
  };

  const handleShredderDone = (idx) => {
    if (openFaq === idx) {
      setOpenFaq(null);
    }
    setShreddingIdx(null);
  };

  return (
    <div
      ref={faqContainerRef}
      className="faq-root max-w-3xl mx-auto pt-12 border-t border-[#292929] relative"
    >
      {/* 1. Alarm Red Vignette Flash on container edges */}
      <div ref={vignetteRef} className="faq-vignette-flash" aria-hidden="true" />

      {/* 2. Ambient Laser Grid Background (Paused when off-screen) */}
      {isSectionVisible && !shouldReduceMotion && (
        <div ref={laserGridRef} className="faq-laser-grid" aria-hidden="true">
          <div className="faq-laser-beam" />
          <div className="faq-laser-beam" />
          <div className="faq-laser-beam" />
        </div>
      )}

      {/* 3. Left Edge Scroll-Linked Progress Line */}
      <div className="faq-scroll-progress-line" aria-hidden="true">
        <div ref={progressFillRef} className="faq-scroll-progress-fill">
          <div className="faq-scroll-progress-head" />
        </div>
      </div>

      {/* Header: Preserves exact text & layout */}
      <div className="text-center mb-12">
        <ClarificationsHeader triggerRef={faqContainerRef} />
        <h3 className="font-heist text-3xl sm:text-4xl text-white tracking-wider uppercase select-none">
          {headingLetters.map((char, i) => (
            <span
              key={i}
              ref={(el) => (headingCharsRef.current[i] = el)}
              className="inline-block"
              style={{ display: char === " " ? "inline" : "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h3>
      </div>

      {/* FAQ Row Items Accordion */}
      <div className="divide-y divide-[#292929] border-y border-[#292929] relative z-10">
        {faqs.map((faq, idx) => (
          <FaqRow
            key={faq.q}
            faq={faq}
            idx={idx}
            isOpen={openFaq === idx}
            isOtherOpen={openFaq !== null && openFaq !== idx}
            isClosing={shreddingIdx === idx}
            onToggle={() => toggleFaq(idx)}
            onShredderDone={handleShredderDone}
            isSectionVisible={isSectionVisible}
            registerRowRef={registerRowRef}
          />
        ))}
      </div>
    </div>
  );
}

export default Faq;
