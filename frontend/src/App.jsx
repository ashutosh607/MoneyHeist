import React, { useState, useEffect } from "react";
import CinematicIntro from "@/components/cinematic/CinematicIntro";
import ThePlan from "@/components/sections/ThePlan";
import TheSchedule from "@/components/sections/TheSchedule";
import TheLoot from "@/components/sections/TheLoot";
import CrewIdGenerator from "@/components/sections/CrewIdGenerator";
import ProfessorsRules from "@/components/sections/ProfessorsRules";
import TheMint from "@/components/sections/TheMint";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";
import GlobalBackgroundAudio from "@/components/cinematic/GlobalBackgroundAudio";
import heistBg from "@/assets/images/heist_bg.png";

function App() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [isPastLanding, setIsPastLanding] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const planEl = document.getElementById("plan");
      if (planEl) {
        const rect = planEl.getBoundingClientRect();
        // Background is active everywhere from The Plan down to the bottom of the page
        setIsPastLanding(rect.top <= window.innerHeight * 1.1);
      } else {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        setIsPastLanding(scrollY > window.innerHeight * 3.8);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-black text-[#F5F2ED] selection:bg-[#E50914] selection:text-white">
      {/* Fixed Heist Board Background - Visible everywhere across the site EXCEPT starting and landing page */}
      <div
        className={`fixed inset-0 z-0 pointer-events-none select-none overflow-hidden transition-opacity duration-500 ease-out ${
          isPastLanding ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <img
          src={heistBg}
          alt=""
          className="w-full h-full object-cover object-center scale-[1.01] opacity-90"
        />
        {/* Subtle dark tint to preserve contrast and legibility */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      </div>

      {/* Global Background Audio Controller - Appears when navbar main page starts */}
      <div className="relative z-50">
        <GlobalBackgroundAudio isVisible={isNavbarVisible} />
      </div>

      {/* 1. Landing Page - Completely isolated with pure black background */}
      <section className="relative z-20 w-full bg-black">
        <CinematicIntro onNavbarVisibilityChange={setIsNavbarVisible} />
      </section>

      {/* 2. All Chapters & Pages - Background shows through everywhere */}
      <div className="relative z-10 w-full">
        <ThePlan />
        <TheSchedule />
        <TheLoot />
        <CrewIdGenerator />
        <ProfessorsRules />
        <TheMint />
        <FinalCta />
        <Footer />
      </div>
    </main>
  );
}

export default App;