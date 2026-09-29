import React, { useState, useEffect, useRef } from "react";
import { MapPin, IndianRupee, Users, ArrowRight, Target } from "lucide-react";
import VariableProximity from "@/components/ui/VariableProximity";
import { BlurText, BlurFade } from "@/components/ui/BlurText";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export function FinalCta() {
  const ctaHeaderRef = useRef(null);
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 21,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let total = prev.days * 86400 + prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (total <= 0) total = 2 * 86400 + 14 * 3600 + 36 * 60 + 21;
        const d = Math.floor(total / 86400);
        const h = Math.floor((total % 86400) / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        return { days: d, hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section
      id="enter"
      className="relative w-full bg-[#080808]/75 backdrop-blur-[1px] text-[#F5F2ED] py-28 md:py-44 px-4 sm:px-6 lg:px-12 border-t border-[#292929]/80 overflow-hidden text-center select-none"
    >
      {/* Background ambient lighting matching all chapters */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-[#E50914]/[0.035] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* ================= LEFT & RIGHT AMBIENT HUD LABELS ================= */}
      <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 flex-col items-start gap-1 font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-600 pointer-events-none select-none">
        <span className="w-3 h-[2px] bg-[#E50914] mb-2" />
        <span>IDEAS</span>
        <span>PEOPLE</span>
        <span>IMPACT</span>
      </div>

      <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 flex-col items-end gap-1 font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-600 pointer-events-none select-none">
        <span className="w-3 h-[2px] bg-[#E50914] mb-2" />
        <span>BIGGER</span>
        <span>BOLDER</span>
        <span>TOGETHER</span>
      </div>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">

        {/* Top Registration Countdown HUD Badge */}
        <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2 mb-10 bg-[#060606]/90 border border-[#292929] rounded-none font-mono text-xs shadow-[0_0_25px_rgba(0,0,0,0.9)] relative">
          
          {/* Tactical Corner Notches on Badge */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#E50914]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#E50914]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-[#E50914]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#E50914]" />

          <div className="flex items-center gap-2 text-white font-bold tracking-[0.2em] uppercase text-[11px] sm:text-xs">
            <Target className="w-3.5 h-3.5 text-[#E50914] animate-pulse" />
            <span>REGISTRATION OPENS <AnimatedCounter value={29} /> SEP</span>
          </div>

          <div className="w-[1px] h-4 bg-[#262626]" />

          <div className="flex items-center gap-2 sm:gap-3 text-center">
            <div>
              <span className="text-[#E50914] font-bold text-xs sm:text-sm">{pad(countdown.days)}</span>
              <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">DAYS</span>
            </div>
            <div>
              <span className="text-[#E50914] font-bold text-xs sm:text-sm">{pad(countdown.hours)}</span>
              <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">HRS</span>
            </div>
            <div>
              <span className="text-[#E50914] font-bold text-xs sm:text-sm">{pad(countdown.minutes)}</span>
              <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">MINS</span>
            </div>
            <div>
              <span className="text-[#E50914] font-bold text-xs sm:text-sm">{pad(countdown.seconds)}</span>
              <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">SECS</span>
            </div>
          </div>

        </div>

        {/* Major Stencil Headline with Crosshairs */}
        <div ref={ctaHeaderRef} className="relative inline-block my-2">
          {/* Left and right tactical red tick marks */}
          <div className="absolute -left-6 sm:-left-12 top-[60%] -translate-y-1/2 w-4 sm:w-8 h-[2px] bg-[#E50914]" />
          <div className="absolute -right-6 sm:-right-12 top-[60%] -translate-y-1/2 w-4 sm:w-8 h-[2px] bg-[#E50914]" />

          <h2 className="font-heist text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white uppercase leading-none select-none drop-shadow-[0_4px_30px_rgba(255,255,255,0.22)]">
            <VariableProximity
              label="ENTER THE MINT"
              className="cursor-default block"
              fromFontVariationSettings="'wght' 700, 'opsz' 30"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={ctaHeaderRef}
              radius={140}
              falloff="linear"
            />
          </h2>
        </div>

        {/* Narrative Subtitle */}
        <div className="text-lg sm:text-xl md:text-2xl text-neutral-300 font-light mt-6 mb-8 space-y-1 max-w-xl">
          <BlurText
            text="The Professor has a plan."
            className="block"
            delay={0.15}
          />
          <BlurText
            text="All he needs is your crew."
            className="text-[#E50914] font-semibold tracking-wide block"
            delay={0.3}
          />
        </div>

        {/* Main CTA Button: JOIN THE CREW */}
        <BlurFade delay={0.2} className="mb-14">
          <a
            href="https://unstop.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-4.5 bg-[#E50914] hover:bg-[#ff1a26] text-white font-mono text-xs sm:text-sm tracking-[0.25em] uppercase font-bold transition-all duration-300 shadow-[0_0_30px_rgba(229,9,20,0.5)] hover:shadow-[0_0_50px_rgba(229,9,20,0.85)] cursor-pointer border border-red-500 group"
          >
            {/* Tactical chamfered corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/70 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/70 pointer-events-none" />
            
            <span>JOIN THE CREW</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
          </a>
        </BlurFade>

        {/* ================= BOTTOM TACTICAL CREDENTIALS BAR ================= */}
        <div className="w-full max-w-4xl relative p-5 sm:p-7 bg-[#050505]/85 backdrop-blur-md border border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
          
          {/* Tactical Corner Red Brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#E50914] pointer-events-none" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#E50914] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#E50914] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#E50914] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-4 items-center font-mono">
            
            {/* Column 1: Venue */}
            <div className="flex items-center gap-4 justify-center md:justify-start px-3">
              <div className="w-10 h-10 border border-red-900/60 bg-red-950/40 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#E50914]" />
              </div>
              <div className="text-left">
                <span className="text-neutral-500 text-[10px] tracking-[0.2em] uppercase block mb-0.5">
                  VENUE
                </span>
                <span className="text-white text-xs sm:text-sm font-bold tracking-wider">
                  DJSCE MUMBAI
                </span>
              </div>
            </div>

            {/* Column 2: Registration Fee */}
            <div className="flex items-center gap-4 justify-center px-3 md:border-x md:border-[#1c1c1c]">
              <div className="w-10 h-10 border border-amber-900/60 bg-amber-950/40 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="text-left">
                <span className="text-neutral-500 text-[10px] tracking-[0.2em] uppercase block mb-0.5">
                  REGISTRATION
                </span>
                <span className="text-[#F59E0B] text-xs sm:text-sm font-bold tracking-wider flex items-center gap-1">
                  <AnimatedCounter value={149} prefix="₹" />
                  <span>PER TEAM</span>
                </span>
              </div>
            </div>

            {/* Column 3: Crew Size */}
            <div className="flex items-center gap-4 justify-center md:justify-end px-3">
              <div className="w-10 h-10 border border-red-900/60 bg-red-950/40 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#E50914]" />
              </div>
              <div className="text-left">
                <span className="text-neutral-500 text-[10px] tracking-[0.2em] uppercase block mb-0.5">
                  CREW SIZE
                </span>
                <span className="text-white text-xs sm:text-sm font-bold tracking-wider flex items-center gap-1">
                  <span>2 - 3 MEMBERS</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default FinalCta;
