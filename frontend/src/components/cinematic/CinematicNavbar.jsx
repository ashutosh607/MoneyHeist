import React, { useState, useEffect } from "react";
import StaggeredMenu from "@/components/ui/StaggeredMenu";

/**
 * CinematicNavbar
 *
 * Glassmorphic top navigation with:
 * - Left branding: red pulsing beacon + CODEVERSE 2.0
 * - Desktop links: The Plan, Schedule, The Loot, Rules, The Mint
 * - Right CTA: Join the crew
 * - Integrated React Bits StaggeredMenu with tactical Money Heist theme & animated hamburger
 */
export function CinematicNavbar({ progress = 0, visible, isIntroCompleted = false }) {
  const [activeSection, setActiveSection] = useState("hero");

  const scrollTo = (id) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const MENU_ITEMS = [
    { label: "The Plan", ariaLabel: "Go to The Plan section", link: "#plan" },
    { label: "Schedule", ariaLabel: "Go to Schedule section", link: "#schedule" },
    { label: "The Loot", ariaLabel: "Go to The Loot section", link: "#loot" },
    { label: "Rules", ariaLabel: "Go to Professor's Rules section", link: "#rules" },
    { label: "The Mint", ariaLabel: "Go to The Mint section", link: "#mint" },
    { label: "Join The Crew", ariaLabel: "Join the crew registration", link: "#enter" },
  ];

  const SOCIAL_ITEMS = [
    { label: "Discord", link: "https://discord.gg" },
    { label: "Instagram", link: "https://instagram.com" },
    { label: "GitHub", link: "https://github.com" },
  ];

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["plan", "schedule", "loot", "rules", "mint", "enter"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      setActiveSection("hero");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keep navbar visible across the entire website for navigation
  const isNavbarVisible = true;

  return (
    <nav
      aria-label="Cinematic Navigation"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10 transition-all duration-500 ease-out opacity-100 translate-y-0 pointer-events-auto"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between select-none">
        
        {/* Left minimal branding - click to scroll top */}
        <button
          type="button"
          onClick={() => scrollTo("top")}
          className="flex items-center gap-2.5 cursor-pointer group text-left"
        >
          <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse shrink-0" />
          <span className="font-heist text-xs sm:text-sm tracking-[0.18em] text-white font-bold uppercase whitespace-nowrap group-hover:text-[#E50914] transition-colors">
            CODEVERSE 2.0
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-mono text-[11px] tracking-[0.2em] uppercase">
          <button
            type="button"
            onClick={() => scrollTo("plan")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "plan"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            THE PLAN
            {activeSection === "plan" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("schedule")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "schedule"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            SCHEDULE
            {activeSection === "schedule" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("loot")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "loot"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            THE LOOT
            {activeSection === "loot" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("rules")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "rules"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            RULES
            {activeSection === "rules" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("mint")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "mint"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            THE MINT
            {activeSection === "mint" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>
        </div>

        {/* Right CTA Button & Animated Staggered Menu Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => scrollTo("enter")}
            className="px-3.5 sm:px-4 py-1.5 bg-[#E50914] hover:bg-[#FF1A1A] text-white font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] cursor-pointer whitespace-nowrap"
          >
            JOIN THE CREW →
          </button>

          {/* StaggeredMenu Hamburger Trigger & Panel */}
          <div className="flex items-center">
            <StaggeredMenu
              position="right"
              items={MENU_ITEMS}
              socialItems={SOCIAL_ITEMS}
              displaySocials={true}
              displayItemNumbering={true}
              colors={["#141414", "#80060d", "#E50914"]}
              accentColor="#E50914"
              menuButtonColor="#F5F2ED"
              openMenuButtonColor="#E50914"
              changeMenuColorOnOpen={true}
            />
          </div>
        </div>

      </div>
    </nav>
  );
}

export default CinematicNavbar;
