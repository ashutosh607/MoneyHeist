import React from "react";
import { useSharedTypewriterAudio } from "@/hooks/useSharedTypewriterAudio";

export function Footer() {
  const { isMuted, toggleMute } = useSharedTypewriterAudio();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#080808]/75 backdrop-blur-[1px] text-[#A3A3A3] pt-24 pb-16 px-6 lg:px-16 border-t border-[#292929]/80">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Massive BELLA CIAO declaration */}
        <div className="text-center sm:text-left border-b border-[#292929] pb-12">
          <h2 className="font-heist text-6xl sm:text-8xl md:text-9xl tracking-wider text-white uppercase select-none opacity-90">
            BELLA CIAO.
          </h2>
        </div>

        {/* Links & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Col 1: Navigation links */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-mono text-xs text-[#E50914] tracking-[0.25em] uppercase font-bold block mb-4">
              INDEX
            </span>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs tracking-widest uppercase">
              <button
                type="button"
                onClick={() => scrollTo("plan")}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                THE PLAN
              </button>
              <button
                type="button"
                onClick={() => scrollTo("schedule")}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                SCHEDULE
              </button>
              <button
                type="button"
                onClick={() => scrollTo("loot")}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                THE LOOT
              </button>
              <button
                type="button"
                onClick={() => scrollTo("rules")}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                RULES
              </button>
              <a
                href="https://instagram.com/djscodeai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-left text-[#E50914] hover:text-[#FF1A1A] transition-colors"
              >
                INSTAGRAM ↗
              </a>
            </div>
          </div>

          {/* Col 2: Questions / Contact Details */}
          <div className="md:col-span-4 space-y-3 font-mono text-xs tracking-wide">
            <span className="text-[#E50914] tracking-[0.25em] uppercase font-bold block mb-4">
              QUESTIONS?
            </span>
            <p className="text-white font-medium">Adish Shah</p>
            <p className="text-[#A3A3A3]">+91 98194 86535</p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://wa.me/919819486535"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F2ED] hover:text-[#E50914] transition-colors underline underline-offset-4"
              >
                WhatsApp
              </a>
              <span className="text-[#292929]">/</span>
              <a
                href="https://instagram.com/djscodeai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F2ED] hover:text-[#E50914] transition-colors underline underline-offset-4"
              >
                @djscodeai
              </a>
            </div>
          </div>

          {/* Col 3: Sound Control */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end">
            <span className="font-mono text-xs text-[#E50914] tracking-[0.25em] uppercase font-bold block mb-4">
              AUDIO CHANNEL
            </span>
            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#111111] hover:bg-[#1a1a1a] border border-[#292929] hover:border-[#A3A3A3] text-xs font-mono tracking-widest uppercase text-white transition-all cursor-pointer"
            >
              <span>{isMuted ? "♪ SOUND: OFF" : "♪ SOUND: ON"}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isMuted ? "bg-neutral-600" : "bg-[#E50914] animate-pulse"}`} />
            </button>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-12 border-t border-[#292929] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-mono text-[#666666] tracking-wide">
          <p>© 2026 CodeVerse. All rights reserved.</p>
          <p>A fan-inspired event theme, not affiliated with Netflix.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
