import React, { useRef, useState } from "react";
import maskedHeistImg from "@/assets/images/masked-heist-nobg.png";
import crewImg from "@/assets/images/crew.png";
import phase1Blueprint from "@/assets/images/phase1_blueprint.png";
import phase2Radio from "@/assets/images/phase2_radio.png";
import VariableProximity from "@/components/ui/VariableProximity";
import { BlurText } from "@/components/ui/BlurText";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export function ThePlan() {
  const planHeaderRef = useRef(null);
  const [activePhase, setActivePhase] = useState(1);

  const PHASES = [
    {
      id: 1,
      phaseNum: "01",
      timing: "PHASE 01 · 10:00 AM – 1:30 PM",
      title: "INSIDE THE MINT",
      description:
        "You've entered the Royal Mint. The Professor briefed you on the tasks. Complete them fast, and complete them right. Only the top 10 crews move on.",
      classified: "TASK DETAILS ARE CLASSIFIED UNTIL THE BRIEFING.",
      image: phase1Blueprint,
      imageAlt: "Royal Mint Security Floor Plan Blueprint",
    },
    {
      id: 2,
      phaseNum: "02",
      timing: "PHASE 02 · 2:30 PM – 4:30 PM",
      title: "THE ESCAPE",
      description:
        "You're out of the mint, but not out of trouble. Every decision matters. You either escape, or you get caught. The first crew to collect every hint wins.",
      classified: "TASK DETAILS ARE CLASSIFIED UNTIL THE BRIEFING.",
      image: phase2Radio,
      imageAlt: "Tactical Escape Two-Way Radio Communicator",
    },
  ];

  return (
    <section
      id="plan"
      className="relative w-full bg-[#080808]/75 backdrop-blur-[1px] text-[#F5F2ED] pt-20 pb-28 md:pt-28 md:pb-36 px-6 lg:px-16 border-t border-[#292929]/80 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top classified document header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-[#292929] text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#A3A3A3]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
            <span className="text-[#E50914] font-semibold">MISSION DIRECTIVE</span>
            <span className="text-[#666666]">/</span>
            <span>OPERATION CODEVERSE 2.0</span>
          </div>
          <div className="flex items-center gap-4 text-[#666666]">
            <span>LOCATION: ROYAL MINT (DJSCE)</span>
            <span className="hidden sm:inline">CLEARANCE: LEVEL <AnimatedCounter from={0} value={5} duration={1} /></span>
          </div>
        </div>

        {/* Section title & Identity declaration */}
        <div ref={planHeaderRef} className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 relative">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
            TACTICAL PROTOCOL · 09.10
          </p>
          <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
            <VariableProximity
              label="THE PLAN"
              className="cursor-default"
              fromFontVariationSettings="'wght' 700, 'opsz' 30"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={planHeaderRef}
              radius={120}
              falloff="linear"
            />
          </h2>
          <div className="mt-4 flex flex-col items-center justify-center gap-1">
            <BlurText
              text="YOU ARE NOT HACKATHON TEAMS."
              className="font-mono text-xs sm:text-sm text-[#A3A3A3] tracking-[0.22em] uppercase"
              delay={0.15}
            />
            <BlurText
              text="YOU ARE THE CREW."
              className="font-heist text-xl sm:text-2xl text-[#E50914] tracking-widest uppercase font-bold drop-shadow-[0_0_20px_rgba(229,9,20,0.5)]"
              delay={0.3}
            />
          </div>
        </div>

        {/* Character leaning over the horizontal box */}
        <div className="relative flex justify-center">
          {/* Masked man leaning forward on his hands */}
          <div className="relative -mb-[2px] z-20 flex justify-center pointer-events-none select-none">
            <img
              src={maskedHeistImg}
              alt="Masked Heist Crew Member"
              className="w-64 sm:w-80 md:w-96 lg:w-[420px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* HORIZONTAL THE PLAN BOX (Directly underneath his hands) */}
        <div className="relative bg-[#111111] border border-[#292929] p-8 sm:p-12 shadow-2xl overflow-hidden">
          {/* Top red laser edge line where his hands rest */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_15px_#E50914]" />

          {/* Box Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#292929]">
            <div>
              <span className="font-mono text-[10px] sm:text-xs text-[#E50914] tracking-[0.28em] uppercase font-bold block mb-1">
                OPERATIONAL BREAKDOWN
              </span>
              <h3 className="font-heist text-2xl sm:text-3xl text-white tracking-wider uppercase">
                TWO STEPS. ZERO COMPROMISES.
              </h3>
            </div>
            <div className="font-mono text-[11px] text-[#A3A3A3] tracking-widest uppercase px-3.5 py-1.5 bg-[#171717] border border-[#292929] shrink-0 self-start sm:self-auto flex items-center gap-1.5">
              <span>CREWS OF</span>
              <AnimatedCounter from={0} value={3} className="text-[#E50914] font-bold" />
              <span>·</span>
              <AnimatedCounter from={0} value={10} className="text-[#E50914] font-bold" />
              <span>HOURS</span>
            </div>
          </div>

          {/* 2 Interactive Accordion Phase Cards */}
          <div className="flex flex-col md:flex-row gap-5 lg:gap-6 items-stretch min-h-[380px] md:min-h-[430px]">
            {PHASES.map((phase) => {
              const isActive = activePhase === phase.id;

              return (
                <div
                  key={phase.id}
                  onMouseEnter={() => setActivePhase(phase.id)}
                  onClick={() => setActivePhase(phase.id)}
                  className={`relative rounded-sm overflow-hidden p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none border ${
                    isActive
                      ? "md:flex-[2.1] lg:flex-[2.3] bg-[#0c100e]/95 border-[#E50914]/80 shadow-[0_0_35px_rgba(229,9,20,0.16)]"
                      : "md:flex-[0.9] lg:flex-1 bg-[#090b0a]/90 border-[#222222] hover:border-[#383838]"
                  }`}
                >
                  {/* Subtle Blueprint Grid Background */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                      opacity: isActive ? 0.08 : 0.03,
                    }}
                  />

                  {/* Corner Target Markers (Tactical styling) */}
                  <div
                    className={`absolute top-2 left-2 w-2 h-2 border-t border-l transition-colors duration-500 ${
                      isActive ? "border-[#E50914]" : "border-[#333333]"
                    }`}
                  />
                  <div
                    className={`absolute top-2 right-2 w-2 h-2 border-t border-r transition-colors duration-500 ${
                      isActive ? "border-[#E50914]" : "border-[#333333]"
                    }`}
                  />
                  <div
                    className={`absolute bottom-2 left-2 w-2 h-2 border-b border-l transition-colors duration-500 ${
                      isActive ? "border-[#E50914]" : "border-[#333333]"
                    }`}
                  />
                  <div
                    className={`absolute bottom-2 right-2 w-2 h-2 border-b border-r transition-colors duration-500 ${
                      isActive ? "border-[#E50914]" : "border-[#333333]"
                    }`}
                  />

                  {/* Top Content: Large Outlined Phase Number */}
                  <div className="relative z-20 max-w-full md:max-w-[66%] lg:max-w-[70%]">
                    <div className="flex items-start justify-between">
                      <span
                        className="font-heist text-5xl sm:text-6xl md:text-7xl font-black tracking-tight select-none transition-all duration-700"
                        style={{
                          WebkitTextStroke: isActive
                            ? "1.5px rgba(255, 255, 255, 0.55)"
                            : "1.5px rgba(255, 255, 255, 0.18)",
                          color: "transparent",
                        }}
                      >
                        {phase.phaseNum}
                      </span>

                      {/* Status indicator dot */}
                      <div className="flex items-center gap-2 pt-2 md:hidden">
                        <span
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            isActive
                              ? "bg-[#E50914] shadow-[0_0_10px_#E50914]"
                              : "bg-[#292929]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Horizontal Divider Line with Phase Timing */}
                    <div className="relative my-4 flex items-center">
                      <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-[#292929] via-[#3d3d3d] to-transparent" />
                      <div className="relative z-10 font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase font-semibold bg-[#0c100e]/85 backdrop-blur-xs pr-3 py-0.5 flex items-center gap-2">
                        <span
                          className={`transition-colors duration-500 ${
                            isActive ? "text-[#E50914]" : "text-[#737373]"
                          }`}
                        >
                          {phase.timing}
                        </span>
                      </div>
                    </div>

                    {/* Main Title */}
                    <h4 className="font-heist text-2xl sm:text-3xl lg:text-4xl text-white tracking-wider uppercase mb-3 transition-colors duration-300">
                      {phase.title}
                    </h4>

                    {/* Description & Hazard Striped Banner (Expanded smoothly when active) */}
                    <div
                      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                        isActive
                          ? "opacity-100 max-h-56 mt-3"
                          : "opacity-0 max-h-0 md:opacity-0 md:max-h-0 mt-0 pointer-events-none"
                      }`}
                    >
                      <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed mb-5 max-w-sm lg:max-w-md">
                        {phase.description}
                      </p>

                      {/* Hazard Hatched Stripes Bar */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-16 h-3 shrink-0 rounded-[1px] border border-[#333333]"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(45deg, #E50914 0, #E50914 4px, #1a1a1a 4px, #1a1a1a 8px)",
                            opacity: 0.85,
                          }}
                        />
                        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-[#737373] uppercase font-medium">
                          {phase.classified}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3D Prop Render on the Right Side (Smooth zoom & float) */}
                  <div
                    className={`absolute z-10 ${
                      phase.id === 1
                        ? "right-0 sm:right-2 md:right-4 w-44 sm:w-60 md:w-72 lg:w-80"
                        : "right-3 sm:right-6 md:right-10 w-28 sm:w-36 md:w-44 lg:w-52"
                    } top-1/2 -translate-y-1/2 pointer-events-none select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "scale-100 opacity-60 sm:opacity-100 translate-x-0"
                        : "scale-85 opacity-25 sm:opacity-40 translate-x-3"
                    }`}
                  >
                    <img
                      src={phase.image}
                      alt={phase.imageAlt}
                      className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                    />
                  </div>

                  {/* Bottom Phase Status Bar */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-[#1e1e1e] flex items-center justify-between font-mono text-[10px] text-[#666666] tracking-widest uppercase">
                    <span className={isActive ? "text-[#E50914] font-bold" : "text-[#555555]"}>
                      {isActive ? "STATUS: ACTIVE FOCUS" : "CLICK / HOVER TO EXPAND"}
                    </span>
                    <span
                      className={`text-xs transition-transform duration-500 ${
                        isActive ? "text-[#E50914] translate-x-1" : "text-[#444444]"
                      }`}
                    >
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Security Directives Banner */}
          <div className="mt-8 pt-6 border-t border-[#292929] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#666666] tracking-widest uppercase">
            <span>NO PHONES · NO NAMES · NO ROOM FOR ERROR</span>
            <span className="text-[#A3A3A3]">THE ROYAL MINT · 09.10.2026</span>
          </div>
        </div>

        {/* THE ODDS — Major Visual Moment (45 → 10 → 1) */}
        <div className="relative mt-12 sm:mt-16 p-8 sm:p-14 bg-[#111111] border border-[#292929] overflow-hidden">
          {/* Subtle Crew image blended on the left side with heavy gradient */}
          <div
            className="absolute -left-10 top-0 bottom-0 w-2/5 opacity-15 pointer-events-none hidden md:block"
            style={{
              backgroundImage: `url(${crewImg})`,
              backgroundSize: "cover",
              backgroundPosition: "left center",
              maskImage: "linear-gradient(to right, black 20%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 20%, transparent 100%)",
            }}
          />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-[#E50914] font-semibold mb-6">
              SURVIVAL PROBABILITY · THE ODDS
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 my-8">
              
              {/* Step 1: 45 Crews Enter */}
              <div className="flex-1 text-center group">
                <AnimatedCounter
                  from={0}
                  value={45}
                  duration={1.8}
                  className="font-heist text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight block"
                />
                <span className="font-mono text-xs sm:text-sm text-[#A3A3A3] tracking-[0.25em] uppercase mt-2 block font-medium">
                  CREWS ENTER
                </span>
              </div>

              {/* Arrow 1 */}
              <div className="text-[#E50914] text-3xl md:text-4xl animate-pulse font-mono rotate-90 md:rotate-0">
                →
              </div>

              {/* Step 2: 10 Reach Phase 2 */}
              <div className="flex-1 text-center group">
                <AnimatedCounter
                  from={0}
                  value={10}
                  duration={1.8}
                  delay={0.25}
                  className="font-heist text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F5F2ED] tracking-tight block"
                />
                <span className="font-mono text-xs sm:text-sm text-[#A3A3A3] tracking-[0.25em] uppercase mt-2 block font-medium">
                  REACH PHASE 2
                </span>
              </div>

              {/* Arrow 2 */}
              <div className="text-[#E50914] text-3xl md:text-4xl animate-pulse font-mono rotate-90 md:rotate-0">
                →
              </div>

              {/* Step 3: 1 Walks Out */}
              <div className="flex-1 text-center group">
                <AnimatedCounter
                  from={0}
                  value={1}
                  duration={1.5}
                  delay={0.5}
                  glowOnComplete={true}
                  className="font-heist text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#E50914] tracking-tight block drop-shadow-[0_0_40px_rgba(229,9,20,0.5)]"
                />
                <span className="font-mono text-xs sm:text-sm text-[#E50914] tracking-[0.25em] uppercase mt-2 block font-bold">
                  WALKS OUT
                </span>
              </div>

            </div>

            <p className="font-mono text-xs text-[#666666] tracking-[0.2em] uppercase mt-8 pt-6 border-t border-[#292929]">
              ONLY THE FIRST CREW TO COLLECT EVERY HINT IN PHASE 2 TAKES THE VAULT.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ThePlan;
