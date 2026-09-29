import { useState, useEffect, useCallback } from "react";

// Shared singleton Web Audio context and audio buffer across all text blocks
let sharedAudioCtx = null;
let sharedAudioBuffer = null;

const MUTE_STORAGE_KEY = "narrative_typewriter_muted";

// Global mute state and subscribers
let globalMuted = false;
try {
  const saved = localStorage.getItem(MUTE_STORAGE_KEY);
  if (saved !== null) {
    globalMuted = JSON.parse(saved);
  }
} catch {
  globalMuted = false;
}

const muteSubscribers = new Set();

function notifyMuteSubscribers() {
  muteSubscribers.forEach((cb) => cb(globalMuted));
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
  }
  return sharedAudioCtx;
}

/**
 * Procedural mechanical typewriter clack (~45ms)
 * Used as high-quality zero-dependency audio clack
 */
function createSyntheticClackBuffer(ctx) {
  if (sharedAudioBuffer) return sharedAudioBuffer;
  if (!ctx) return null;

  const sampleRate = ctx.sampleRate;
  const duration = 0.048; // 48ms
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    const t = i / sampleRate;
    // Sharp attack and exponential decay
    const env = Math.exp(-t * 110);
    // Metallic impact transient + mechanical band noise
    const noise = Math.random() * 2 - 1;
    const body = Math.sin(2 * Math.PI * 1400 * t) * 0.35 + Math.sin(2 * Math.PI * 2600 * t) * 0.2;
    channelData[i] = (noise * 0.65 + body * 0.35) * env * 0.28;
  }

  sharedAudioBuffer = buffer;
  return buffer;
}

// Global unlock listener attached once to window
if (typeof window !== "undefined") {
  const events = ["click", "pointerdown", "mousedown", "keydown", "touchstart", "wheel", "scroll"];
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    events.forEach((ev) => window.removeEventListener(ev, unlockAudio));
  };

  events.forEach((ev) => window.addEventListener(ev, unlockAudio, { passive: true }));
}

export function useSharedTypewriterAudio() {
  const [isMuted, setIsMuted] = useState(globalMuted);

  useEffect(() => {
    const listener = (muted) => setIsMuted(muted);
    muteSubscribers.add(listener);

    // Preload audio buffer once and try resuming
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      if (!sharedAudioBuffer) {
        createSyntheticClackBuffer(ctx);

        // Attempt to load external keystroke file if present
        fetch("/assets/sounds/keystroke.mp3")
          .then((res) => {
            if (res.ok) return res.arrayBuffer();
            throw new Error("No external sound");
          })
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            sharedAudioBuffer = decoded;
          })
          .catch(() => {
            // Gracefully fallback to procedural buffer
          });
      }
    }

    return () => {
      muteSubscribers.delete(listener);
    };
  }, []);

  const toggleMute = useCallback(() => {
    globalMuted = !globalMuted;
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, JSON.stringify(globalMuted));
    } catch {
      // Ignore storage errors
    }
    notifyMuteSubscribers();
  }, []);

  const setMuted = useCallback((muted) => {
    globalMuted = Boolean(muted);
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, JSON.stringify(globalMuted));
    } catch {
      // Ignore storage errors
    }
    notifyMuteSubscribers();
  }, []);

  /**
   * Plays a subtle typewriter clack on each word reveal.
   */
  const playWordClack = useCallback(() => {
    if (globalMuted) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    const executeClack = () => {
      const buffer = sharedAudioBuffer || createSyntheticClackBuffer(ctx);
      if (!buffer) return;

      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Slight natural playback rate pitch jitter (0.94x - 1.06x)
        const pitchJitter = 0.94 + Math.random() * 0.12;
        source.playbackRate.value = pitchJitter;

        // Gain node for smooth 45ms volume envelope
        const gainNode = ctx.createGain();
        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0.24 + Math.random() * 0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(now);
        source.stop(now + 0.05);
      } catch {
        // Safe catch
      }
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(() => {
        executeClack();
      }).catch(() => {});
    } else {
      executeClack();
    }
  }, []);

  return {
    isMuted,
    toggleMute,
    setMuted,
    playWordClack,
  };
}

export default useSharedTypewriterAudio;
