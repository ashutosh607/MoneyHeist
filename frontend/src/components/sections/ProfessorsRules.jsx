import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Faq } from "./faq/Faq";
import "./ProfessorsRules.css";

const RULES_DATA = [
  {
    num: "01",
    title: "THREE TO A CREW.",
    desc: "Nobody goes in alone, and nobody brings a fourth.",
    numDelay: "1.70s",
    titleDelay: "1.82s",
    descDelay: "1.94s",
  },
  {
    num: "02",
    title: "FORTY-FIVE CREWS GET IN.",
    desc: "Registration runs 29 September to 6 October on Unstop.",
    numDelay: "2.02s",
    titleDelay: "2.14s",
    descDelay: "2.26s",
  },
  {
    num: "03",
    title: "NO ONE GETS HURT.",
    desc: "Original work only. No plagiarism.",
    numDelay: "2.34s",
    titleDelay: "2.46s",
    descDelay: "2.58s",
  },
  {
    num: "04",
    title: "BRING YOUR OWN TOOLS.",
    desc: "Laptop, laptop charger, college ID.",
    numDelay: "2.66s",
    titleDelay: "2.78s",
    descDelay: "2.90s",
  },
  {
    num: "05",
    title: "OPEN TO EVERYONE.",
    desc: "Any college, any branch, any level.",
    numDelay: "2.98s",
    titleDelay: "3.10s",
    descDelay: "3.22s",
  },
];

const LORE_RULES_DATA = [
  {
    num: "06",
    title: "No names. No pasts.",
    desc: "Just a knock on the door, and a man who called himself The Professor.",
    numDelay: "1.85s",
    titleDelay: "1.95s",
    descDelay: "2.05s",
  },
  {
    num: "07",
    title: "He trained you. No phones. No families.",
    desc: "No room for error.",
    numDelay: "2.20s",
    titleDelay: "2.30s",
    descDelay: "2.40s",
  },
];

const FAQS_DATA = [
  {
    q: "How do I register?",
    a: "Registration runs on Unstop from 29 September to 6 October. Hit Join the crew, form your team of three there and you're in.",
  },
  {
    q: "How many crews can enter?",
    a: "Forty-five. Once the seats are gone, the door closes.",
  },
  {
    q: "Is there a registration fee?",
    a: "Yes. The registration fee is ₹99.",
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

// Ornate aged brass corner bracket
function BrassCorner({ className }) {
  return (
    <svg
      className={`brass-corner ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB841" />
          <stop offset="45%" stopColor="#C9A227" />
          <stop offset="80%" stopColor="#8C6D15" />
          <stop offset="100%" stopColor="#4A3807" />
        </linearGradient>
      </defs>
      <path
        d="M2 2 H30 V8 H8 V30 H2 Z"
        fill="url(#brassGrad)"
        stroke="#2A1E02"
        strokeWidth="0.8"
      />
      <circle cx="5" cy="5" r="1.5" fill="#1C1402" stroke="#DFB841" strokeWidth="0.5" />
      <circle cx="22" cy="5" r="1.2" fill="#1C1402" stroke="#DFB841" strokeWidth="0.5" />
      <circle cx="5" cy="22" r="1.2" fill="#1C1402" stroke="#DFB841" strokeWidth="0.5" />
    </svg>
  );
}

// Stylized Crosshair Icon
function CrosshairIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" opacity="0.8" />
      <circle cx="12" cy="12" r="3" opacity="0.6" />
      <line x1="12" y1="1" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="23" />
      <line x1="1" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="23" y2="12" />
    </svg>
  );
}

// Stylized Money Heist Dalí Mask & Concentric Circles
function DaliMaskEmblem() {
  return (
    <svg
      className="cover__emblem-svg"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer subtle star geometric lines */}
      <line x1="80" y1="6" x2="80" y2="154" stroke="#E50914" strokeWidth="0.6" opacity="0.35" />
      <line x1="6" y1="80" x2="154" y2="80" stroke="#E50914" strokeWidth="0.6" opacity="0.35" />
      <line x1="28" y1="28" x2="132" y2="132" stroke="#E50914" strokeWidth="0.5" opacity="0.25" strokeDasharray="3 3" />
      <line x1="132" y1="28" x2="28" y2="132" stroke="#E50914" strokeWidth="0.5" opacity="0.25" strokeDasharray="3 3" />
      
      {/* Concentric red circles */}
      <circle cx="80" cy="80" r="72" stroke="#E50914" strokeWidth="0.8" opacity="0.45" />
      <circle cx="80" cy="80" r="64" stroke="#E50914" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 4" />
      <circle cx="80" cy="80" r="54" stroke="#E50914" strokeWidth="0.8" opacity="0.6" />
      <circle cx="80" cy="80" r="46" stroke="#E50914" strokeWidth="0.6" opacity="0.4" />

      {/* Stylized Salvador Dalí Mask Silhouette & Features in Money Heist Red */}
      <g stroke="#E50914" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Forehead and Temple Contour */}
        <path d="M60 48 C66 40, 94 40, 100 48 C108 58, 110 74, 106 90 C101 106, 90 120, 80 126 C70 120, 59 106, 54 90 C50 74, 52 58, 60 48 Z" strokeWidth="1.4" opacity="0.85" />
        
        {/* Arched Distinct Eyebrows */}
        <path d="M58 64 C64 56, 73 58, 77 65" strokeWidth="1.8" />
        <path d="M102 64 C96 56, 87 58, 83 65" strokeWidth="1.8" />

        {/* Almond Eyes with Intense Gaze */}
        <path d="M61 69 C67 66, 73 66, 77 71 C73 74, 67 74, 61 69 Z" fill="#E50914" fillOpacity="0.2" />
        <circle cx="69" cy="70" r="1.8" fill="#E50914" />
        <path d="M99 69 C93 66, 87 66, 83 71 C87 74, 93 74, 99 69 Z" fill="#E50914" fillOpacity="0.2" />
        <circle cx="91" cy="70" r="1.8" fill="#E50914" />

        {/* Angular Nose */}
        <path d="M80 64 L78 84 L84 84" strokeWidth="1.2" />

        {/* Iconic Upturned Salvador Dalí Mustache */}
        <path d="M80 91 C74 91, 62 90, 53 80 C50 76, 48 70, 49 68 C50 71, 56 82, 70 87 C75 89, 79 90, 80 91 Z" fill="#E50914" fillOpacity="0.9" strokeWidth="0.8" />
        <path d="M80 91 C86 91, 98 90, 107 80 C110 76, 112 70, 111 68 C110 71, 104 82, 90 87 C85 89, 81 90, 80 91 Z" fill="#E50914" fillOpacity="0.9" strokeWidth="0.8" />

        {/* Lower Lip and Chin Contour */}
        <path d="M74 99 C77 101, 83 101, 86 99" strokeWidth="1.2" />
        <path d="M76 109 C78 111, 82 111, 84 109" strokeWidth="1.4" opacity="0.7" />
      </g>
    </svg>
  );
}

export function ProfessorsRules() {
  // Start with "open" as server/no-JS default fallback
  const [bookState, setBookState] = useState("open");
  const sectionRef = useRef(null);
  const bookStageRef = useRef(null);
  const tiltRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  // Parallax ref values for desktop lerping
  const parallaxRef = useRef({
    targetX: 0,
    targetY: 0,
    currX: 0,
    currY: 0,
    rafId: null,
  });

  // Switch to "closed" on mount before first paint (ensures initial animation state)
  useLayoutEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const forcedState = urlParams.get("rules_state");
    if (forcedState === "open" || forcedState === "closed") {
      setBookState(forcedState);
      return;
    }
    setBookState("closed");
  }, []);

  // IntersectionObserver to trigger "open" once on scroll
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("rules_state")) return; // skip auto-trigger if forced

    const targetEl = bookStageRef.current || sectionRef.current;
    if (!targetEl) return;

    const isMobile = window.innerWidth < 768;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setBookState("open");
          observer.disconnect();
        }
      },
      { threshold: isMobile ? 0.25 : 0.35 }
    );

    observer.observe(targetEl);

    return () => observer.disconnect();
  }, []);

  // Parallax mouse movement handler (active only after book is open and on desktop)
  useEffect(() => {
    if (bookState !== "open") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1024) return;

    const tiltEl = tiltRef.current;
    if (!tiltEl) return;

    const p = parallaxRef.current;
    let startTime = performance.now();

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;

      p.targetX = -ny * 3;
      p.targetY = nx * 3;
    };

    const updateLoop = (now) => {
      const elapsed = (now - startTime) * 0.001;
      const idleX = Math.sin(elapsed * 1.2) * 0.4;
      const idleY = Math.cos(elapsed * 0.9) * 0.4;

      p.currX += (p.targetX + idleX - p.currX) * 0.05;
      p.currY += (p.targetY + idleY - p.currY) * 0.05;

      if (tiltEl) {
        tiltEl.style.setProperty("--prx", `${p.currX.toFixed(2)}deg`);
        tiltEl.style.setProperty("--pry", `${p.currY.toFixed(2)}deg`);
      }

      p.rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    p.rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (p.rafId) cancelAnimationFrame(p.rafId);
    };
  }, [bookState]);

  const handleBookTap = () => {
    if (bookState === "closed") {
      hasTriggeredRef.current = true;
      setBookState("open");
    }
  };

  return (
    <section
      id="rules"
      className="rules"
      data-state={bookState}
      ref={sectionRef}
    >
      <div className="rules__inner">
        {/* Top Row: Intro + 3D Book */}
        <div className="rules__top-row">
          {/* Intro block */}
          <div className="rules__intro">
            <div className="rules__kicker-wrap">
              <p className="rules__kicker">READ BEFORE YOU ENTER · PROTOCOLS</p>
              <span className="rules__kicker-line" aria-hidden="true" />
            </div>
            <h2 className="rules__heading">THE PROFESSOR'S RULES</h2>
            <div className="rules__divider" aria-hidden="true" />
            <p className="rules__subtext">
              In any operation, discipline is the difference between freedom and capture.
            </p>
            <div className="rules__protocol-badge" aria-hidden="true">
              <CrosshairIcon className="w-3.5 h-3.5 text-[#E50914] flex-shrink-0" />
              <p className="rules__protocol-badge-text">
                READ BEFORE YOU ENTER • PROTOCOLS
              </p>
            </div>
            <p className="rules__small-text">CODEVERSE 2.0 / OPERATION MANUAL</p>
          </div>

          {/* Book Stage with 3D Scene */}
          <div
            className="book-stage"
            ref={bookStageRef}
            onClick={handleBookTap}
          >
            {/* Soft floor shadow */}
            <div className="book-floor" aria-hidden="true" />

            {/* 3D Scene Container */}
            <div className="book-scene">
              {/* Tilt Carrier for initial tilt and pointer parallax */}
              <div className="book-tilt" ref={tiltRef}>
                {/* The Book Spread */}
                <div className="book">
                  {/* Paper Thickness Under-Layers */}
                  <div className="page-under page-under--left" aria-hidden="true" />
                  <div className="page-under page-under--right" aria-hidden="true" />

                  {/* LEFT PAGE: RULES 01 TO 05 */}
                  <article className="page page--rules" aria-label="The Rules Page 1">
                    <div className="page__grain" aria-hidden="true" />
                    <BrassCorner className="brass-corner--tl" />
                    <BrassCorner className="brass-corner--bl" />

                    {/* Header */}
                    <div className="page__header reveal" style={{ "--d": "1.6s" }}>
                      <div className="page__header-title-wrap">
                        <span className="page__header-tag">RULES ▬</span>
                        <CrosshairIcon className="page__header-icon" />
                      </div>
                      <span className="page__header-sub">CODEVERSE 2.0</span>
                      <div className="page__header-line reveal-line" style={{ "--d": "1.6s" }} aria-hidden="true" />
                    </div>

                    {/* 5 Rules List */}
                    <div className="rules-list">
                      {RULES_DATA.map((rule) => (
                        <div key={rule.num} className="rule-row">
                          <div className="rule-row__content">
                            <span
                              className="rule-row__num reveal"
                              style={{ "--d": rule.numDelay }}
                            >
                              {rule.num}.
                            </span>
                            <div className="rule-row__body">
                              <h3
                                className="rule-row__title reveal"
                                style={{ "--d": rule.titleDelay }}
                              >
                                {rule.title}
                              </h3>
                              <p
                                className="rule-row__desc reveal"
                                style={{ "--d": rule.descDelay }}
                              >
                                {rule.desc}
                              </p>
                            </div>
                          </div>
                          <div
                            className="rule-row__divider reveal-line"
                            style={{ "--d": rule.numDelay }}
                            aria-hidden="true"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="page__footer reveal" style={{ "--d": "3.3s" }}>
                      <span>PAGE 01</span>
                      <span>09.10.2026</span>
                    </div>
                  </article>

                  {/* RIGHT PAGE: LORE, PROTOCOLS & CLASSIFIED STAMP (Desktop/Tablet Image 2) */}
                  <article className="page page--right" aria-label="The Rules Page 2">
                    <div className="page__grain" aria-hidden="true" />
                    <BrassCorner className="brass-corner--tr" />
                    <BrassCorner className="brass-corner--br" />

                    {/* Header */}
                    <div className="page__header reveal" style={{ "--d": "1.7s" }}>
                      <div className="page__header-title-wrap">
                        <CrosshairIcon className="page__header-icon" />
                        <span className="page__header-tag">RULES</span>
                      </div>
                      <span className="page__header-sub">CODEVERSE 2.0</span>
                      <div className="page__header-line reveal-line" style={{ "--d": "1.7s" }} aria-hidden="true" />
                    </div>

                    {/* Right Page Body */}
                    <div className="page-right__body">
                      {/* Rules 06 & 07 */}
                      <div className="lore-rules-list">
                        {LORE_RULES_DATA.map((rule) => (
                          <div key={rule.num} className="rule-row">
                            <div className="rule-row__content">
                              <span
                                className="rule-row__num reveal"
                                style={{ "--d": rule.numDelay }}
                              >
                                {rule.num}.
                              </span>
                              <div className="rule-row__body">
                                <h3
                                  className="rule-row__title reveal"
                                  style={{ "--d": rule.titleDelay }}
                                >
                                  {rule.title}
                                </h3>
                                <p
                                  className="rule-row__desc reveal"
                                  style={{ "--d": rule.descDelay }}
                                >
                                  {rule.desc}
                                </p>
                              </div>
                            </div>
                            <div
                              className="rule-row__divider reveal-line"
                              style={{ "--d": rule.numDelay }}
                              aria-hidden="true"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Narrative Callout */}
                      <div className="narrative-callout reveal" style={{ "--d": "2.8s" }}>
                        <p className="narrative-callout__text">
                          Today, the training ends.{" "}
                          <span className="narrative-callout__highlight">
                            Today, you go in.
                          </span>
                        </p>
                      </div>

                      {/* Classified Stamp */}
                      <div className="page__stamp-wrap">
                        <div
                          className="classified-stamp reveal-stamp"
                          style={{ "--d": "3.2s" }}
                        >
                          CLASSIFIED
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="page__footer reveal" style={{ "--d": "3.3s" }}>
                      <span>PAGE 02</span>
                      <span>09.10.2026</span>
                    </div>
                  </article>

                  {/* HINGED 3D COVER */}
                  <div className="cover">
                    {/* Front Leather Cover Face */}
                    <div className="cover__face cover__front">
                      {/* Grain & Noise Texture */}
                      <div className="cover__leather-texture" aria-hidden="true" />
                      <svg className="cover__noise-canvas" aria-hidden="true">
                        <filter id="leatherNoise">
                          <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.8"
                            numOctaves="4"
                            stitchTiles="stitch"
                          />
                          <feColorMatrix type="saturate" values="0" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#leatherNoise)" />
                      </svg>

                      {/* Left Spine Texture Strip */}
                      <div className="cover__spine" aria-hidden="true">
                        <div className="cover__spine-band" />
                        <div className="cover__spine-band" />
                        <div className="cover__spine-band" />
                        <div className="cover__spine-band" />
                        <div className="cover__spine-band" />
                      </div>

                      {/* Thin Inset Red Frame */}
                      <div className="cover__frame-line" aria-hidden="true" />

                      {/* 4 Brass Corners */}
                      <BrassCorner className="brass-corner--tl" />
                      <BrassCorner className="brass-corner--tr" />
                      <BrassCorner className="brass-corner--bl" />
                      <BrassCorner className="brass-corner--br" />

                      {/* Top Text Header */}
                      <div className="cover__header">
                        <p className="cover__codeverse">CODEVERSE 2.0</p>
                        <p className="cover__manual">OPERATION MANUAL</p>
                      </div>

                      {/* Centered Dalí Mask Emblem in Concentric Circles */}
                      <div className="cover__emblem-wrap">
                        <DaliMaskEmblem />
                      </div>

                      {/* Stenciled "THE RULES" Title */}
                      <div className="cover__title-wrap">
                        <span className="cover__accent-line" aria-hidden="true" />
                        <h3 className="cover__title">THE RULES</h3>
                        <span className="cover__accent-line" aria-hidden="true" />
                      </div>

                      {/* Classified Stamp Box */}
                      <div className="cover__stamp">CLASSIFIED</div>

                      {/* Red Ribbon Bookmark */}
                      <div className="cover__ribbon" aria-hidden="true">
                        <CrosshairIcon className="cover__ribbon-mark" />
                      </div>

                      {/* Animated Darkening Overlay during rotation */}
                      <div className="cover__darken-overlay" aria-hidden="true" />
                    </div>

                    {/* Inner Back Face of the Cover */}
                    <div className="cover__face cover__back" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Scroll or Tap Hint */}
            <div className="book__tap-hint" aria-hidden="true">
              SCROLL OR TAP TO OPEN
            </div>
          </div>
        </div>

        {/* Standalone FAQ Section below the book with original vault-cracking animations (on both mobile & desktop) */}
        <div className="rules__faq-wrap">
          <Faq faqs={FAQS_DATA} />
        </div>
      </div>

      {/* Dark gradient fade into The Mint */}
      <div className="rules__exit" aria-hidden="true" />
    </section>
  );
}

export default ProfessorsRules;
