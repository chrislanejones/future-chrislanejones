"use client";

import { useId, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import styles from "./beach-banner.module.css";

const COOLDOWN_MS = 2000;

/** One wave period is 200 units wide, so a -200 drift loops seamlessly. */
function wavePath(y: number, amp: number, from = -400, to = 1800) {
  let d = `M${from} ${y} q50 ${-amp} 100 0`;
  for (let x = from + 100; x < to; x += 100) d += " t100 0";
  return d;
}

/** Same wavy top edge, closed down to the bottom so it can be filled. */
function waveFill(y: number, amp: number) {
  return `${wavePath(y, amp)} V240 H-400 Z`;
}

/** The sea, drifting waves, wet sand and dry sand along the bottom of a banner. */
export function Shoreline({ className }: { className?: string }) {
  // Unique gradient ids, so two shorelines on one page don't share defs.
  const id = useId();
  const sea = `${id}-sea`;
  const sand = `${id}-sand`;
  return (
    <svg className={className} viewBox="0 108 1400 132" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={sea} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={styles.seaFar} />
          <stop offset="1" className={styles.seaNear} />
        </linearGradient>
        <linearGradient id={sand} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={styles.sandTop} />
          <stop offset="1" className={styles.sandLow} />
        </linearGradient>
      </defs>

      <rect y="108" width="1400" height="132" fill={`url(#${sea})`} />
      <path d="M0 108.5 H1400" className={styles.horizon} />

      <g className={styles.driftSlow}>
        <path d={wavePath(124, 2)} className={styles.ripple} />
        <path d={wavePath(140, 3)} className={styles.ripple} />
      </g>
      <g className={styles.driftFast}>
        <path d={wavePath(156, 4)} className={styles.ripple} />
      </g>

      <g className={styles.swash}>
        <path d={waveFill(178, 6)} className={styles.wetSand} />
        <path d={wavePath(178, 6)} className={styles.foam} />
      </g>
      <path d={waveFill(192, 5)} fill={`url(#${sand})`} />

      <g className={styles.shells}>
        <ellipse cx="220" cy="214" rx="5" ry="3" />
        <ellipse cx="640" cy="222" rx="4" ry="2.5" />
        <ellipse cx="1210" cy="210" rx="5" ry="3" />
      </g>
    </svg>
  );
}

/** The shoreline as a standalone strip, e.g. along the top of the photo gallery. */
export function ShoreStrip({ className }: { className?: string }) {
  return (
    <div className={`${styles.shoreStrip} ${className ?? ""}`} aria-hidden="true">
      <Shoreline className={styles.shoreStripArt} />
    </div>
  );
}

/**
 * Illustrated shoreline with drifting waves. Clicking the banner alternates a
 * surfer and a dolphin (one of each at most, a short cooldown between).
 * Children (usually the page title) sit in the sky; the shore is a fixed strip
 * along the bottom, so longer titles grow the sky instead of covering the sea.
 */
export function BeachBanner({ children }: { children?: ReactNode }) {
  type Critter = { key: number; x: number; dist: number };
  const [surfer, setSurfer] = useState<Critter | null>(null);
  const [dolphin, setDolphin] = useState<Critter | null>(null);
  const next = useRef<"surfer" | "dolphin">("surfer");
  const lastSpawn = useRef(-Infinity);

  function spawn(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a, button")) return;
    const now = performance.now();
    if (now - lastSpawn.current < COOLDOWN_MS) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const critter = { key: now, x, dist: bounds.width - x + 80 };
    if (next.current === "surfer") {
      if (surfer) return;
      setSurfer(critter);
      next.current = "dolphin";
    } else {
      if (dolphin) return;
      setDolphin(critter);
      next.current = "surfer";
    }
    lastSpawn.current = now;
  }

  return (
    <div className={`${styles.banner} ${children ? styles.titled : ""}`} onClick={spawn}>
      <div className={styles.sky} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.sun} />
        <svg className={styles.gulls} viewBox="0 0 130 40">
          <path d="M2 30 q8 -7 15 0 q7 -7 15 0" />
          <path d="M44 16 q6 -5 11 0 q5 -5 11 0" />
          <path d="M98 26 q7 -6 13 0 q6 -6 13 0" />
        </svg>
      </div>

      <Shoreline className={styles.shore} />

      <div className={styles.critters} aria-hidden="true">
        {surfer && (
          <div
            key={surfer.key}
            className={styles.surfer}
            style={{ left: surfer.x, "--dist": `${surfer.dist}px`, "--ride": `${Math.max(4, surfer.dist / 110)}s` } as CSSProperties}
            onAnimationEnd={(e) => e.target === e.currentTarget && setSurfer(null)}
          >
            <svg viewBox="0 0 64 56" className={styles.surferArt}>
              <path d="M0 47 C3 41 9 39 15 42 C10 43 7 46 6 50 Z M5 40 a2 2 0 1 0 0.1 0 Z" className={styles.spray} />
              <path d="M5 46 C16 40 40 38 58 42 C62 43 62 47 58 48 C40 51 18 51 5 46 Z" className={styles.board} />
              <path d="M10 45.6 C22 42 40 41 56 43.6 L56 45.4 C40 43.4 22 44 10 47 Z" className={styles.stripe} />
              <path d="M21 44 C20 39 22 35 27 31.5 L31.5 34 C28 37 26.5 40 26.5 44 Z" className={styles.suit} />
              <path d="M41 44 C41 39 39 35.5 34.5 32 L31 35.5 C33.5 37.5 35.5 40.5 35.5 44 Z" className={styles.suit} />
              <path d="M26 33 C25 26 27 20.5 31.5 18.5 C36 19.5 37 26 35.5 33.5 C32 35 29 35 26 33 Z" className={styles.suit} />
              <path d="M27.5 24.5 C30 25.6 33 25.6 36 24.4 L36 27 C33 28.2 30 28.2 27.4 27.2 Z" className={styles.stripe} />
              <path d="M29 20.5 C24.5 20 19.5 20.5 15 22.5 L15.8 25 C20 23.6 24.5 23.4 29 24 Z" className={styles.skin} />
              <path d="M34 20.5 C38.5 19 43 16.5 47 14 L48.4 16.2 C44.6 19 40 22 35 24 Z" className={styles.skin} />
              <circle cx="32.5" cy="12.5" r="5.2" className={styles.skin} />
              <path d="M27.2 12 C27.4 6.6 32 5.2 35.6 6.6 C38 7.6 38.6 10 37.8 12.2 C35.6 9.8 31.6 9.8 27.2 12 Z" className={styles.hair} />
            </svg>
          </div>
        )}
        {dolphin && (
          <div
            key={dolphin.key}
            className={styles.dolphin}
            style={{ left: dolphin.x }}
            onAnimationEnd={(e) => e.target === e.currentTarget && setDolphin(null)}
          >
            <svg viewBox="0 0 120 70" className={styles.dolphinArt}>
              <defs><linearGradient id="dolphin-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" className={styles.skinTop}/><stop offset="1" className={styles.skinLow}/></linearGradient></defs>
              <path d="M58 16 C 60 7, 66 2, 73 1.5 C 69 6, 67 11, 67 17 Z" className={styles.fin}/>
              <path d="M15 52 C 9 49, 4 52, 1 58 C 7 57, 11 57.5, 15 59.5 C 13 63, 13 67, 14.5 70 C 18 64, 21 60, 23 57 Z" className={styles.fin}/>
              <path d="M20 56 C 26 40, 42 25, 62 18 C 74 14, 86 13, 93 16 C 99 18, 102 22, 103 25 C 108 26, 113 27, 116.5 28.5 C 114 30.5, 109 31.5, 104 31 C 98 34, 90 35, 82 34 C 64 33, 44 42, 30 58 C 27 61, 22 61, 20 56 Z" fill="url(#dolphin-skin)"/>
              <path d="M40 48 C 52 40, 66 35.5, 82 35.5 C 90 35.5, 98 34, 104 31 C 100 35, 92 37.5, 82 37.5 C 68 37.5, 54 42, 40 48 Z" className={styles.belly}/>
              <path d="M38 38 C 50 27, 66 20, 86 17.5 C 68 21.5, 52 28.5, 38 38 Z" className={styles.shine}/>
              <path d="M78 35 C 76 41, 71 46, 64 48.5 C 68 44, 71 40, 73 35.5 Z" className={styles.fin}/>
              <path d="M103.5 30.5 C 107.5 30.6, 111.5 30, 116 28.7" className={styles.mouth}/>
              <circle cx="94.5" cy="23" r="1.7" className={styles.eye}/><circle cx="95.1" cy="22.4" r=".55" className={styles.glint}/>
            </svg>
          </div>
        )}
      </div>
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
