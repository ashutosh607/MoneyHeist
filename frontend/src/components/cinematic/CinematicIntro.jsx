import React, { useState, useEffect, useRef } from "react";
import PixelCanvas from "./PixelCanvas";
import ScrollTypewriterBlock from "./ScrollTypewriterBlock";
import CinematicNavbar from "./CinematicNavbar";
import GlitchText from "./GlitchText";
import { useSharedTypewriterAudio } from "@/hooks/useSharedTypewriterAudio";
import moneyHeistVideo from "@/assets/videos/moneyheistvd.mp4";

const SCENE_1_LINES = [
  "It’s been five months since he found you.",
  "No names. No pasts. Just a knock on the door… and a man who called himself The Professor.",
];

const SCENE_2_LINES = [
  "He’d been watching. Waiting. Planning.",
  "Today, the training ends.",
];

const SCENE_3_LINES = ["Today… you go in."];

export function CinematicIntro({ onNavbarVisibilityChange }) {
  const initialRatio = useRef(
    typeof window !== "undefined" && window.innerHeight > 0
      ? Math.max(0, Math.min(1, (window.pageYOffset || document.documentElement.scrollTop || 0) / (window.innerHeight * 4.5)))
      : 0
  );
  const [smoothProgress, setSmoothProgress] = useState(initialRatio.current);
  const [isIntroCompleted, setIsIntroCompleted] = useState(initialRatio.current >= 0.86);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { isMuted, toggleMute } = useSharedTypewriterAudio();

  const videoRef = useRef(null);
  const targetProgress = useRef(initialRatio.current);
  const maxProgress = useRef(initialRatio.current);
  const rafId = useRef(null);
  const completedRef = useRef(initialRatio.current >= 0.86);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Multi-input scroll & silky progress controller calibrated to the intro hero track
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const getScrollRatio = () => {
      // 4.5 * innerHeight corresponds to the 550vh track pinning duration
      const trackHeight = window.innerHeight * 4.5;
      if (trackHeight <= 0) return 0;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      return Math.max(0, Math.min(1, scrollY / trackHeight));
    };

    const handleScroll = () => {
      const ratio = getScrollRatio();
      if (ratio > maxProgress.current) {
        maxProgress.current = ratio;
      }
      targetProgress.current = maxProgress.current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Silky smooth dampening lerp
    let current = initialRatio.current;
    const lerpLoop = () => {
      current += (targetProgress.current - current) * 0.075;
      if (Math.abs(targetProgress.current - current) < 0.0003) {
        current = targetProgress.current;
      }
      setSmoothProgress(current);

      if (current >= 0.90 && !completedRef.current) {
        completedRef.current = true;
        setIsIntroCompleted(true);
      }

      rafId.current = requestAnimationFrame(lerpLoop);
    };
    rafId.current = requestAnimationFrame(lerpLoop);

    // Keyboard support: smooth arrow navigation
    const handleKeyDown = (e) => {
      if (window.scrollY < window.innerHeight * 4.5) {
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          e.preventDefault();
          window.scrollBy({ top: window.innerHeight * 0.65, behavior: "smooth" });
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Video playback management for Scene 4
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (smoothProgress >= 0.86 || isIntroCompleted) {
      if (video.paused && !video.ended) {
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [smoothProgress, isIntroCompleted]);

  // Scene timings
  // Scene 1: Professor & Subtitles (Active from start 0.00 to 0.22)
  const isScene1Active = smoothProgress < 0.22;
  const scene1Opacity = smoothProgress < 0.18 ? 1 : Math.max(0, 1 - (smoothProgress - 0.18) / 0.035);

  // Scene 2: Three Crew Members & Subtitles (0.44 to 0.65)
  const isScene2Active = smoothProgress >= 0.42 && smoothProgress < 0.65;
  const scene2Opacity =
    smoothProgress < 0.42
      ? 0
      : smoothProgress < 0.60
      ? 1
      : Math.max(0, 1 - (smoothProgress - 0.60) / 0.04);

  // Scene 3: Pure Black (0.75 to 0.86)
  const isScene3Active = smoothProgress >= 0.74 && smoothProgress < 0.86;
  const scene3Opacity =
    smoothProgress < 0.74
      ? 0
      : smoothProgress < 0.84
      ? 1
      : Math.max(0, 1 - (smoothProgress - 0.84) / 0.02);

  // Scene 4: Video Reveal (0.86 to 1.00)
  const isScene4Active = isIntroCompleted || smoothProgress >= 0.86;
  const videoOpacity = isIntroCompleted
    ? 1
    : smoothProgress < 0.86
    ? 0
    : Math.min(1, (smoothProgress - 0.86) / 0.03);

  // Navbar is visible when the video is revealed or intro completed
  const isNavbarVisible = isIntroCompleted || smoothProgress >= 0.86;

  // Inform parent when navbar and main page become visible
  useEffect(() => {
    onNavbarVisibilityChange?.(isNavbarVisible);
  }, [isNavbarVisible, onNavbarVisibilityChange]);

  // Big Glitch Title: visible when the video is revealed or intro completed
  const isVideoTitleActive = isIntroCompleted || smoothProgress >= 0.86;
  const videoTitleOpacity = isIntroCompleted
    ? 1
    : smoothProgress < 0.86
    ? 0
    : Math.min(1, (smoothProgress - 0.86) / 0.04);

  const scrollToNext = () => {
    let nextTarget = 0.35;
    if (smoothProgress < 0.2) nextTarget = 0.52;
    else if (smoothProgress < 0.5) nextTarget = 0.80;
    else if (smoothProgress < 0.8) nextTarget = 1.0;
    const trackHeight = window.innerHeight * 4.5;
    window.scrollTo({ top: nextTarget * trackHeight, behavior: "smooth" });
  };

  return (
    <div id="intro-hero" className="relative w-full bg-black text-[#f3f4f6]" style={{ height: "550vh" }}>
      {/* Top Glassmorphism Navigation */}
      <CinematicNavbar
        progress={isIntroCompleted ? 1 : smoothProgress}
        visible={isNavbarVisible}
        isIntroCompleted={isIntroCompleted}
      />

      {/* Narrative triggers along the track */}
      <div id="narrative-trigger-scene-1" className="absolute top-[20vh] h-[50vh] w-full pointer-events-none" />
      <div id="narrative-trigger-scene-2" className="absolute top-[210vh] h-[60vh] w-full pointer-events-none" />
      <div id="narrative-trigger-scene-3" className="absolute top-[380vh] h-[60vh] w-full pointer-events-none" />

      {/* Pinned Sticky Cinematic Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center select-none pt-14 md:pt-16">
        
        {/* Layer 1: Pixel Canvas */}
        {smoothProgress < 0.88 && (
          <PixelCanvas
            progress={smoothProgress}
            reducedMotion={reducedMotion}
          />
        )}

        {/* Layer 2: Subtle Film Vignette Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.98) 100%)",
          }}
        />

        {/* Layer 3: Narrative Subtitles (Scenes 1-3) */}
        {smoothProgress < 0.88 && (
          <>
            {/* SCENE 1 SUBTITLES (The Professor) */}
            <div
              className={`absolute bottom-28 sm:bottom-24 md:bottom-20 left-0 right-0 z-20 px-6 max-w-4xl mx-auto text-center pointer-events-none transition-all duration-700 ease-out ${
                isScene1Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
              }`}
              style={{ opacity: isScene1Active ? scene1Opacity : 0 }}
            >
              {/* Small mute toggle */}
              <div className="flex justify-center mb-3">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-black/60 border border-neutral-700/60 text-neutral-400 hover:text-white hover:border-neutral-500 transition-all backdrop-blur-sm select-none"
                  aria-label={isMuted ? "Unmute narrative typewriter audio" : "Mute narrative typewriter audio"}
                >
                  <span>{isMuted ? "🔇" : "🔊"}</span>
                  <span className="text-[10px] tracking-wider uppercase">
                    {isMuted ? "Audio Muted" : "Typewriter Sound"}
                  </span>
                </button>
              </div>

              <div className="text-sm sm:text-base md:text-lg text-neutral-300 font-light tracking-wide space-y-3">
                <ScrollTypewriterBlock
                  triggerId="narrative-trigger-scene-1"
                  isActive={isScene1Active}
                  lines={SCENE_1_LINES}
                  wordDelay={140}
                  linePause={450}
                  className="text-neutral-200"
                  lineClassName="text-neutral-200"
                  cursorClassName="bg-red-600"
                />
              </div>
            </div>

            {/* SCENE 2 SUBTITLES (Three Crew Members) */}
            <div
              className={`absolute bottom-28 sm:bottom-24 md:bottom-20 left-0 right-0 z-20 px-6 max-w-4xl mx-auto text-center pointer-events-none transition-all duration-700 ease-out ${
                isScene2Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
              }`}
              style={{ opacity: isScene2Active ? scene2Opacity : 0 }}
            >
              <div className="text-sm sm:text-base md:text-lg text-neutral-300 font-light tracking-wide space-y-3">
                <ScrollTypewriterBlock
                  triggerId="narrative-trigger-scene-2"
                  isActive={isScene2Active}
                  lines={SCENE_2_LINES}
                  wordDelay={140}
                  linePause={450}
                  className="text-neutral-200"
                  lineClassName="text-neutral-200"
                  cursorClassName="bg-red-600"
                />
              </div>
            </div>

            {/* SCENE 3 SUBTITLES (Pure Black Void) */}
            <div
              className={`absolute inset-0 z-20 flex items-center justify-center px-6 text-center pointer-events-none transition-all duration-700 ease-out ${
                isScene3Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
              }`}
              style={{ opacity: isScene3Active ? scene3Opacity : 0 }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl text-neutral-200 font-normal tracking-widest">
                <ScrollTypewriterBlock
                  triggerId="narrative-trigger-scene-3"
                  isActive={isScene3Active}
                  lines={SCENE_3_LINES}
                  wordDelay={150}
                  className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                  cursorClassName="bg-white"
                />
              </div>
            </div>
          </>
        )}

        {/* SCENE 4: FINAL VIDEO REVEAL */}
        <div
          className={`absolute inset-0 z-30 flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${
            isScene4Active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{
            opacity: videoOpacity,
            visibility: videoOpacity > 0 ? "visible" : "hidden",
          }}
        >
          <div className="relative w-full h-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="w-full h-full min-h-screen object-cover"
              playsInline
              muted
              autoPlay
              loop
              preload="auto"
              src={moneyHeistVideo}
              style={{
                outline: "none",
                border: "none",
              }}
            >
              <source src={moneyHeistVideo} type="video/mp4" />
              <source src="/videos/moneyheistvd.mp4" type="video/mp4" />
              <source src="/videos/Money Heist video.mp4" type="video/mp4" />
            </video>

            {/* Seamless edge vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 100px 50px #000000",
              }}
            />

            {/* Dark tint overlay */}
            <div className="absolute inset-0 bg-black/25 pointer-events-none" />

            {/* Big Glitch Logo */}
            <div
              className={`absolute top-[22vh] sm:top-20 md:top-24 lg:top-28 left-0 right-0 z-30 px-4 sm:px-6 text-center pointer-events-none transition-all duration-700 ease-out ${
                isVideoTitleActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
              style={{ opacity: videoTitleOpacity }}
            >
              <div className="inline-block pointer-events-auto">
                <GlitchText
                  speed={0.8}
                  enableShadows={true}
                  enableOnHover={false}
                  className="font-heist text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white whitespace-nowrap drop-shadow-[0_0_50px_rgba(200,16,46,0.8)]"
                >
                  CODEVERSE 2.0
                </GlitchText>
              </div>
            </div>

            {/* Scroll down into plan indicator */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-center cursor-pointer group pointer-events-auto"
              onClick={() => {
                document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="flex flex-col items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#E50914] font-mono font-bold">
                  SCROLL FOR THE PLAN ↓
                </span>
                <div className="w-[1.5px] h-4 bg-[#E50914] animate-bounce" />
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator during prologue */}
        {!isIntroCompleted && smoothProgress < 0.85 && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-500 text-center cursor-pointer group"
            onClick={scrollToNext}
          >
            <div className="flex flex-col items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-mono">
                Scroll to proceed
              </span>
              <div className="w-[1.5px] h-3.5 bg-red-600/80 animate-pulse" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CinematicIntro;
