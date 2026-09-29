import React, { useState, useEffect, useRef } from "react";
import daliMaskImg from "@/assets/images/dali_mask.jpg";
import {
  User,
  RotateCw,
  Download,
  Share2,
  Check,
  Lock,
  ArrowRight,
  Crosshair,
  Target,
  Shield,
  HelpCircle,
} from "lucide-react";

const CODENAMES = [
  "Tokyo",
  "Berlin",
  "Nairobi",
  "Rio",
  "Denver",
  "Helsinki",
  "Oslo",
  "Moscow",
  "Lisbon",
  "Palermo",
  "Bogota",
  "Manila",
  "Stockholm",
  "Marseille",
];

export function CrewIdGenerator() {
  const [inputName, setInputName] = useState("");
  // Default name is "?" as requested
  const [displayName, setDisplayName] = useState("?");
  const [codename, setCodename] = useState("TOKYO");
  const [crewId, setCrewId] = useState("CV2-1009-7K2P");
  const [copied, setCopied] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  // Synchronized Registration Countdown
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 32, seconds: 17 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) totalSeconds = 4 * 3600 + 32 * 60 + 17;
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRandomHex = () =>
    Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputName.trim();
    // If empty, display "?", else display entered name
    setDisplayName(trimmed || "?");

    setIsRolling(true);
    setTimeout(() => {
      const pool = CODENAMES.filter((c) => c.toUpperCase() !== codename);
      const chosen = pool[Math.floor(Math.random() * pool.length)].toUpperCase();
      setCodename(chosen);
      setCrewId(`CV2-1009-${getRandomHex()}`);
      setIsRolling(false);
    }, 250);
  };

  const handleRollAgain = () => {
    setIsRolling(true);
    setTimeout(() => {
      const pool = CODENAMES.filter((c) => c.toUpperCase() !== codename);
      const chosen = pool[Math.floor(Math.random() * pool.length)].toUpperCase();
      setCodename(chosen);
      setCrewId(`CV2-1009-${getRandomHex()}`);
      setIsRolling(false);
    }, 250);
  };

  // Client-side HTML5 canvas image export of the tactical ID card
  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 650;
    const ctx = canvas.getContext("2d");

    // Pure black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Card boundary
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.strokeStyle = "#262626";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Red top edge accent
    ctx.fillStyle = "#E50914";
    ctx.fillRect(40, 40, canvas.width - 80, 8);

    // Header text
    ctx.fillStyle = "#E50914";
    ctx.font = "bold 20px monospace";
    ctx.fillText("CREW FILE", 80, 95);

    ctx.fillStyle = "#666666";
    ctx.font = "14px monospace";
    ctx.fillText("OPERATION CODEVERSE", 80, 120);

    ctx.fillStyle = "#E50914";
    ctx.font = "bold 16px monospace";
    ctx.fillText("09.10 ⌖", canvas.width - 150, 95);

    // Photo Box with Question Mark "?"
    ctx.fillStyle = "#030303";
    ctx.fillRect(80, 160, 220, 290);
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 160, 220, 290);

    // Question Mark in Photo Box
    ctx.fillStyle = "#E50914";
    ctx.font = "bold 110px 'Black Ops One', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("?", 190, 335);

    ctx.fillStyle = "#666666";
    ctx.font = "bold 13px monospace";
    ctx.fillText("[ UNIDENTIFIED ]", 190, 410);
    ctx.textAlign = "left";

    // Fields
    ctx.fillStyle = "#666666";
    ctx.font = "13px monospace";
    ctx.fillText("NAME", 340, 195);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(displayName.toUpperCase(), 340, 235);

    ctx.fillStyle = "#666666";
    ctx.font = "13px monospace";
    ctx.fillText("ID", 340, 285);
    ctx.fillStyle = "#C9A227";
    ctx.font = "bold 20px monospace";
    ctx.fillText(crewId, 340, 315);

    ctx.fillStyle = "#666666";
    ctx.font = "13px monospace";
    ctx.fillText("CODENAME", 340, 365);

    // Rubber stamp for codename
    ctx.save();
    ctx.translate(340, 385);
    ctx.rotate(-0.06);
    ctx.strokeStyle = "#E50914";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 240, 60);
    ctx.fillStyle = "#E50914";
    ctx.font = "bold 36px 'Black Ops One', sans-serif";
    ctx.fillText(codename, 20, 44);
    ctx.restore();

    ctx.fillStyle = "#666666";
    ctx.font = "13px monospace";
    ctx.fillText("STATUS", 340, 490);
    ctx.fillStyle = "#E50914";
    ctx.font = "bold 16px monospace";
    ctx.fillText("CLASSIFIED", 340, 515);

    // Card Footer
    ctx.strokeStyle = "#222222";
    ctx.beginPath();
    ctx.moveTo(80, 560);
    ctx.lineTo(canvas.width - 80, 560);
    ctx.stroke();

    ctx.fillStyle = "#666666";
    ctx.font = "13px monospace";
    ctx.fillText("DJSCE - MUMBAI · 09.10.2026 · @DJSCODEAI", 80, 595);

    const link = document.createElement("a");
    link.download = `CODEVERSE-ID-${codename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleShare = async () => {
    const shareText = `Agent ${codename}, reporting for duty. Join our crew for CodeVerse 2.0, a Money Heist themed event on 9 October at DJSCE. Teams of 2-3 members. ₹149 per team.`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "CodeVerse 2.0 · Crew ID",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const padNumber = (n) => String(n).padStart(2, "0");

  return (
    <section
      id="crew-id"
      className="relative w-full bg-[#080808]/75 backdrop-blur-[1px] text-[#f3f4f6] py-16 sm:py-24 px-4 sm:px-6 lg:px-12 border-t border-[#1a1a1a]/80 overflow-hidden select-none"
    >
      {/* Background Subtle Red Tactical Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(229, 9, 20, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 9, 20, 0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Ambient Crimson Vignettes */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Right Live Countdown Badge */}
      <div className="max-w-7xl mx-auto flex justify-end mb-6">
        <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#090909] border border-[#262626] font-mono text-xs tracking-[0.2em] text-[#E50914] shadow-[0_0_20px_rgba(0,0,0,0.9)]">
          <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping shrink-0" />
          <span className="font-bold text-white tracking-widest">REGISTRATION OPEN</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400 font-light">CLOSES IN</span>
          <span className="font-bold text-[#E50914] tracking-widest font-mono">
            {padNumber(countdown.hours)}:{padNumber(countdown.minutes)}:{padNumber(countdown.seconds)}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* ================= LEFT COLUMN: TITLE & INPUT ================= */}
        <div className="lg:col-span-6 space-y-7">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-2">
              <span>PERSONNEL FILE</span>
              <span className="text-neutral-600">·</span>
              <span>RECRUITMENT</span>
            </div>

            <h2 className="font-heist text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-widest text-[#F5F2ED] uppercase leading-none my-2 drop-shadow-[0_4px_25px_rgba(255,255,255,0.18)]">
              GET YOUR<br />CREW ID
            </h2>

            <p className="font-sans text-sm sm:text-base text-neutral-400 max-w-lg mt-4 font-light leading-relaxed">
              Every member of the crew gets a codename. Type your name, see who you are on the job, and send it to your team.
            </p>
          </div>

          {/* Name Input Form */}
          <form onSubmit={handleGenerate} className="max-w-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-neutral-400" />
                </span>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="ENTER YOUR NAME"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#262626] focus:border-[#E50914] text-white font-mono text-xs sm:text-sm tracking-wider outline-none placeholder:text-neutral-600 transition-all uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#E50914] hover:bg-[#ff1a26] text-white font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_20px_rgba(229,9,20,0.45)] hover:shadow-[0_0_30px_rgba(229,9,20,0.7)] shrink-0 cursor-pointer flex items-center justify-center gap-2 border border-red-500"
              >
                <span>ASSIGN CODENAME</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>

          {/* Example Codenames */}
          <div className="space-y-2 pt-2 border-t border-[#1a1a1a] max-w-lg">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
              EXAMPLE CODENAMES
            </div>
            <div className="font-mono text-xs tracking-[0.2em] uppercase text-neutral-400">
              TOKYO · RIO · DENVER · NAIROBI · HELSINKI
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-[#E50914] pt-2">
              <Shield className="w-3.5 h-3.5 text-[#E50914]" />
              <span>EACH CODE. A NEW IDENTITY.</span>
            </div>
          </div>

          {/* Bottom Left Coordinate Reticle */}
          <div className="font-mono text-[10px] tracking-[0.25em] text-neutral-600 flex items-center gap-2 pt-6">
            <Crosshair className="w-3.5 h-3.5 text-[#E50914]" />
            <span>19.1075° N 72.8372° E</span>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: THE CLASSIFIED ID CARD & DALI MASK ================= */}
        <div className="lg:col-span-6 relative flex flex-col items-center">
          
          {/* Card Wrapper with Pin Tape */}
          <div className="relative w-full max-w-md sm:max-w-lg">

            {/* Realistic Masking Tape on Top Center */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 w-24 h-6 bg-neutral-200/20 backdrop-blur-xs border-y border-white/10 -rotate-1 shadow-md pointer-events-none" />

            {/* Tactical Dossier Card (Pure Black #000000 background) */}
            <div className="relative bg-[#060606] border border-[#292929] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden">
              
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-600/40 pointer-events-none" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-red-600/40 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-red-600/40 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-red-600/40 pointer-events-none" />

              {/* Top Red Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#E50914]" />

              {/* Card Header */}
              <div className="flex items-start justify-between pb-4 mb-6 border-b border-[#1f1f1f]">
                <div>
                  <span className="font-mono text-xs text-[#E50914] font-bold tracking-[0.25em] uppercase block">
                    CREW FILE
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400 tracking-[0.2em] uppercase">
                    OPERATION CODEVERSE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#E50914] font-bold">
                  <span>09.10</span>
                  <Target className="w-3.5 h-3.5 text-[#E50914]" />
                </div>
              </div>

              {/* Main Card Body: Left Photo Box with "?" + Right Info with Name "?" */}
              <div className="grid grid-cols-12 gap-5 items-center mb-6">
                
                {/* Photo Box: Shows Classified Question Mark "?" instead of a person's photo */}
                <div className="col-span-5 flex flex-col items-center">
                  <div className="relative w-full aspect-[3/4] bg-[#020202] border border-[#2e2e2e] flex flex-col items-center justify-center p-3 shadow-inner group overflow-hidden">
                    
                    {/* Corner photo brackets */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-neutral-600" />
                    <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-neutral-600" />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-neutral-600" />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-neutral-600" />

                    {/* Scanline CRT overlay in photo box */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
                        backgroundSize: "100% 3px",
                      }}
                    />

                    {/* Large Classified Question Mark "?" */}
                    <span className="font-heist text-6xl sm:text-7xl text-neutral-200 select-none drop-shadow-[0_0_20px_rgba(229,9,20,0.6)] group-hover:scale-110 transition-transform">
                      ?
                    </span>

                    {/* Classified badge below "?" */}
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#E50914] font-bold mt-2 uppercase bg-red-950/40 px-1.5 py-0.5 border border-red-600/40">
                      CLASSIFIED
                    </span>
                  </div>
                </div>

                {/* Right Info: NAME shows "?" as requested */}
                <div className="col-span-7 space-y-4">
                  
                  {/* Name Field: Shows "?" by default or entered name */}
                  <div>
                    <span className="font-mono text-[10px] text-neutral-500 tracking-[0.22em] uppercase block mb-0.5">
                      NAME
                    </span>
                    <span className="font-mono text-2xl sm:text-3xl text-white font-bold tracking-widest block drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                      {displayName}
                    </span>
                  </div>

                  {/* ID Field */}
                  <div>
                    <span className="font-mono text-[10px] text-neutral-500 tracking-[0.22em] uppercase block mb-0.5">
                      ID
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-[#C9A227] tracking-widest font-semibold block">
                      {crewId}
                    </span>
                  </div>

                  {/* Codename Stamped Box */}
                  <div>
                    <span className="font-mono text-[10px] text-neutral-500 tracking-[0.22em] uppercase block mb-1">
                      CODENAME
                    </span>
                    <div
                      className={`inline-block px-3 py-1 border-2 border-[#E50914] bg-red-950/30 transform -rotate-3 transition-all duration-300 shadow-[0_0_15px_rgba(229,9,20,0.35)] ${
                        isRolling ? "scale-95 opacity-50" : "scale-100 opacity-100"
                      }`}
                    >
                      <span className="font-heist text-2xl sm:text-3xl text-[#E50914] tracking-widest uppercase font-black block">
                        {codename}
                      </span>
                    </div>
                  </div>

                  {/* Status Field */}
                  <div>
                    <span className="font-mono text-[10px] text-neutral-500 tracking-[0.22em] uppercase block mb-0.5">
                      STATUS
                    </span>
                    <span className="font-mono text-xs text-[#E50914] font-bold tracking-widest uppercase block animate-pulse">
                      CLASSIFIED
                    </span>
                  </div>

                </div>

              </div>

              {/* Bottom Card Bar: Location & Barcode */}
              <div className="pt-4 border-t border-[#1f1f1f] flex items-center justify-between font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                <div>
                  <p className="text-neutral-300 font-semibold">DJSCE - MUMBAI</p>
                  <p className="text-neutral-500 text-[9px]">09.10.2026 · @DJSCODEAI</p>
                </div>

                {/* Simulated SVG Barcode */}
                <div className="flex items-center gap-0.5 h-7 px-2 bg-black/60 border border-[#222222]">
                  <div className="w-[1.5px] h-full bg-neutral-300" />
                  <div className="w-[1px] h-full bg-neutral-300" />
                  <div className="w-[3px] h-full bg-neutral-300" />
                  <div className="w-[1px] h-full bg-neutral-300" />
                  <div className="w-[2px] h-full bg-neutral-300" />
                  <div className="w-[1px] h-full bg-neutral-300" />
                  <div className="w-[3px] h-full bg-neutral-300" />
                  <div className="w-[2px] h-full bg-neutral-300" />
                  <div className="w-[1px] h-full bg-neutral-300" />
                  <div className="w-[2px] h-full bg-neutral-300" />
                  <div className="w-[3px] h-full bg-neutral-300" />
                  <div className="w-[1px] h-full bg-neutral-300" />
                  <div className="w-[2px] h-full bg-neutral-300" />
                  <div className="w-[1.5px] h-full bg-neutral-300" />
                </div>
              </div>

            </div>

          </div>

          {/* Action Buttons Below the Card */}
          <div className="w-full max-w-md sm:max-w-lg flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={handleRollAgain}
              className="flex-1 min-w-[120px] px-4 py-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#292929] hover:border-red-600/60 font-mono text-[11px] tracking-widest uppercase text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRolling ? "animate-spin text-[#E50914]" : "text-neutral-400 group-hover:text-white"}`} />
              <span>ROLL AGAIN</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 min-w-[120px] px-4 py-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#292929] hover:border-red-600/60 font-mono text-[11px] tracking-widest uppercase text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
              <span>DOWNLOAD</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex-1 min-w-[120px] px-4 py-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#292929] hover:border-red-600/60 font-mono text-[11px] tracking-widest uppercase text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">COPIED!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                  <span>SHARE</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center font-mono text-[10px] text-neutral-600 tracking-wider mt-3 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-neutral-500" />
            <span>Made in your browser. Nothing is uploaded.</span>
          </p>

        </div>

      </div>

      {/* Decorative Dali Mask in Corner with Quote (Matching Screenshot) */}
      <div className="hidden xl:flex absolute bottom-0 right-0 z-0 items-end pointer-events-none opacity-40 hover:opacity-75 transition-opacity">
        <div className="relative w-64 h-64 overflow-hidden">
          <img
            src={daliMaskImg}
            alt="Money Heist Mask"
            className="w-full h-full object-cover object-top mask-image-gradient"
            style={{
              maskImage: "radial-gradient(circle at 70% 70%, black 40%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(circle at 70% 70%, black 40%, transparent 80%)",
            }}
          />
        </div>
        <div className="font-serif italic text-xs text-neutral-500 mb-8 -ml-6 select-none leading-relaxed tracking-wider">
          <p>Same team.</p>
          <p>New mission.</p>
          <p>Different you.</p>
        </div>
      </div>

    </section>
  );
}

export default CrewIdGenerator;
