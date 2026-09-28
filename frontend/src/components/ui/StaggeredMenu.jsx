'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

export const StaggeredMenu = ({
  position = 'right',
  colors = ['#141414', '#80060d', '#E50914'],
  items = [],
  socialItems = [
    { label: 'DISCORD', link: 'https://discord.gg' },
    { label: 'GITHUB', link: 'https://github.com' },
    { label: 'INSTAGRAM', link: 'https://instagram.com' },
  ],
  displaySocials = true,
  displayItemNumbering = true,
  className = '',
  menuButtonColor = '#F5F2ED',
  openMenuButtonColor = '#E50914',
  changeMenuColorOnOpen = true,
  accentColor = '#E50914',
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  // Hamburger lines refs
  const lineTopRef = useRef(null);
  const lineMidRef = useRef(null);
  const lineBotRef = useRef(null);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const iconTweenRef = useRef(null);
  const colorTweenRef = useRef(null);

  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const top = lineTopRef.current;
      const mid = lineMidRef.current;
      const bot = lineBotRef.current;

      if (!top || !mid || !bot) return;

      // Initial state: 3 horizontal dashes (hamburger)
      gsap.set(top, { y: 0, rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(mid, { opacity: 1, scaleX: 1, transformOrigin: '50% 50%' });
      gsap.set(bot, { y: 0, rotate: 0, transformOrigin: '50% 50%' });

      if (panel) {
        let preLayers = [];
        if (preContainer) {
          preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
        }
        preLayerElsRef.current = preLayers;

        const offscreen = position === 'left' ? -100 : 100;
        gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
        if (preContainer) {
          gsap.set(preContainer, { xPercent: 0, opacity: 1 });
        }
      }

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [mounted, menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const offscreen = position === 'left' ? -100 : 100;
    const layerStates = layers.map((el) => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 6 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 20, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 0.85, ease: 'power4.out', stagger: { each: 0.08, from: 'start' } },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.55, ease: 'power2.out', ['--sm-num-opacity']: 1, stagger: { each: 0.07, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.45, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
            stagger: { each: 0.07, from: 'start' },
            onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
          },
          socialsStart + 0.05
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.35,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 6 });

        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });

        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 20, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  // Morph Hamburger (3 dashes) to Cross (X)
  const animateIcon = useCallback((opening) => {
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!top || !mid || !bot) return;

    iconTweenRef.current?.kill();

    if (opening) {
      iconTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out', duration: 0.45 } })
        .to(mid, { opacity: 0, scaleX: 0 }, 0)
        .to(top, { y: 6.5, rotate: 45 }, 0)
        .to(bot, { y: -6.5, rotate: -45 }, 0);
    } else {
      iconTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut', duration: 0.35 } })
        .to(mid, { opacity: 1, scaleX: 1 }, 0)
        .to(top, { y: 0, rotate: 0 }, 0)
        .to(bot, { y: 0, rotate: 0 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.1,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
  }, [playOpen, playClose, animateIcon, animateColor, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
    }
  }, [playClose, animateIcon, animateColor, onMenuClose]);

  const handleItemClick = (e, item) => {
    if (item.onClick) {
      item.onClick(e);
    }
    if (item.link && item.link.startsWith('#')) {
      e.preventDefault();
      closeMenu();
      const targetId = item.link.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      closeMenu();
    }
  };

  useEffect(() => {
    if (!open) return;

    // Close on Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    // Prevent body background scrolling when drawer is open on mobile
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <>
      {/* Animated Hamburger (Dashes to Cross) Toggle Button */}
      <button
        ref={toggleBtnRef}
        className={`sm-toggle relative z-[110] inline-flex items-center justify-center p-2 rounded-xs bg-black/40 hover:bg-black/60 border border-white/10 hover:border-[#E50914]/50 cursor-pointer text-[#F5F2ED] transition-colors duration-300 pointer-events-auto group focus:outline-none focus:ring-1 focus:ring-[#E50914] ${className}`}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="staggered-menu-panel"
        onClick={toggleMenu}
        type="button"
      >
        <div
          className="relative w-5 h-4 flex flex-col justify-between items-center pointer-events-none"
          aria-hidden="true"
        >
          <span
            ref={lineTopRef}
            className="w-5 h-[2px] bg-current rounded-full will-change-transform"
          />
          <span
            ref={lineMidRef}
            className="w-5 h-[2px] bg-current rounded-full will-change-transform"
          />
          <span
            ref={lineBotRef}
            className="w-5 h-[2px] bg-current rounded-full will-change-transform"
          />
        </div>
      </button>

      {/* Portal Drawer to Document Body so it is never constrained by navbar height or backdrop-filter */}
      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="sm-portal-wrapper"
            style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
          >
            {/* Backdrop Blur Dimmer */}
            <div
              className={`fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-500 ease-out z-[95] ${
                open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Staggered Underlay Layers */}
            <div
              ref={preLayersRef}
              className="sm-prelayers fixed top-0 right-0 bottom-0 pointer-events-none z-[98]"
              style={{ width: 'clamp(300px, 45vw, 480px)' }}
              aria-hidden="true"
            >
              {(() => {
                const raw = colors && colors.length ? colors.slice(0, 4) : ['#141414', '#80060d', '#E50914'];
                return raw.map((c, i) => (
                  <div
                    key={i}
                    className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                    style={{ background: c }}
                  />
                ));
              })()}
            </div>

            {/* Slide-out Menu Panel */}
            <aside
              id="staggered-menu-panel"
              ref={panelRef}
              className="staggered-menu-panel fixed top-0 right-0 h-full bg-[#0a0a0a]/95 border-l border-[#292929] flex flex-col p-6 sm:p-12 md:p-16 overflow-y-auto z-[100] backdrop-blur-2xl pointer-events-auto shadow-2xl"
              style={{ width: 'clamp(300px, 45vw, 480px)' }}
              aria-hidden={!open}
            >
              {/* Subtle Blueprint Grid Pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Panel Header with Prominent Tactical Cross (X) Close Button */}
              <div className="relative z-10 flex items-center justify-between pb-6 sm:pb-8 mb-6 border-b border-[#222222]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                  <span className="font-mono text-[10px] sm:text-xs text-[#A3A3A3] tracking-[0.28em] uppercase font-semibold">
                    TACTICAL NAVIGATION
                  </span>
                </div>

                {/* Close / Back Cross Button */}
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-[#171717] hover:bg-[#E50914] border border-[#333333] hover:border-[#E50914] text-[#F5F2ED] hover:text-white transition-all duration-300 cursor-pointer group select-none shadow-md"
                >
                  <span className="font-mono text-[10px] tracking-widest uppercase hidden xs:inline text-[#A3A3A3] group-hover:text-white transition-colors">
                    BACK
                  </span>
                  <span className="font-bold text-sm sm:text-base leading-none text-[#E50914] group-hover:text-white transition-colors">
                    ✕
                  </span>
                </button>
              </div>

              <div className="sm-panel-inner relative z-10 flex-1 flex flex-col justify-between gap-8">
                {/* Menu Items List */}
                <ul
                  className="sm-panel-list list-none m-0 p-0 flex flex-col gap-3 sm:gap-4"
                  role="list"
                  data-numbering={displayItemNumbering || undefined}
                >
                  {items && items.length ? (
                    items.map((it, idx) => (
                      <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                        <a
                          className="sm-panel-item relative text-[#F5F2ED] font-heist text-3xl sm:text-4xl md:text-5xl cursor-pointer leading-none tracking-wider uppercase transition-colors duration-200 inline-block no-underline pr-12 group hover:text-[#E50914]"
                          href={it.link}
                          onClick={(e) => handleItemClick(e, it)}
                          aria-label={it.ariaLabel}
                          data-index={idx + 1}
                        >
                          <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform group-hover:translate-x-1.5 transition-transform duration-300">
                            {it.label}
                          </span>
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                      <span className="sm-panel-item relative text-[#A3A3A3] font-heist text-2xl uppercase">
                        No items
                      </span>
                    </li>
                  )}
                </ul>

                {/* Socials / Footer Section */}
                {displaySocials && socialItems && socialItems.length > 0 && (
                  <div
                    className="sm-socials mt-auto pt-6 border-t border-[#1e1e1e] flex flex-col gap-3"
                    aria-label="Social links"
                  >
                    <span className="sm-socials-title font-mono text-[11px] font-semibold text-[#E50914] tracking-[0.25em] uppercase">
                      CREW COMMS
                    </span>
                    <ul
                      className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap font-mono text-xs tracking-widest uppercase"
                      role="list"
                    >
                      {socialItems.map((s, i) => (
                        <li key={s.label + i} className="sm-socials-item">
                          <a
                            href={s.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sm-socials-link text-[#A3A3A3] hover:text-white transition-colors duration-200 inline-block py-1"
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>,
          document.body
        )}

      <style>{`
.sm-prelayers .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1.1; }
.sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-panel-list[data-numbering] .sm-panel-item::after {
  counter-increment: smItem;
  content: counter(smItem, decimal-leading-zero);
  position: absolute;
  top: 0.15em;
  right: 0;
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
  color: #E50914;
  letter-spacing: 0.1em;
  pointer-events: none;
  user-select: none;
  opacity: var(--sm-num-opacity, 0);
  transition: opacity 0.3s ease;
}
@media (max-width: 640px) {
  .sm-portal-wrapper .staggered-menu-panel { width: 100vw !important; left: 0; right: 0; }
  .sm-portal-wrapper .sm-prelayers { width: 100vw !important; left: 0; right: 0; }
}
      `}</style>
    </>
  );
};

export default StaggeredMenu;
