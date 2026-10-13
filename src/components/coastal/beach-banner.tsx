"use client";

import { useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
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

      <svg className={styles.shore} viewBox="0 108 1400 132" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="beach-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className={styles.seaFar} />
            <stop offset="1" className={styles.seaNear} />
          </linearGradient>
          <linearGradient id="beach-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className={styles.sandTop} />
            <stop offset="1" className={styles.sandLow} />
          </linearGradient>
        </defs>

        <rect y="108" width="1400" height="132" fill="url(#beach-sea)" />
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
        <path d={waveFill(192, 5)} fill="url(#beach-sand)" />

        <g className={styles.shells}>
          <ellipse cx="220" cy="214" rx="5" ry="3" />
          <ellipse cx="640" cy="222" rx="4" ry="2.5" />
          <ellipse cx="1210" cy="210" rx="5" ry="3" />
        </g>
      </svg>

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
            <svg viewBox="0 0 120 44" className={styles.dolphinArt}>
              <defs>
                <linearGradient id="dolphin-skin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" className={styles.skinTop} />
                  <stop offset="1" className={styles.skinLow} />
                </linearGradient>
              </defs>
              <path d="M77 12.5 C74 6 68 2 60 0.8 C63 4.5 63.5 9 61 13.8 Z" className={styles.fin} />
              <path d="M18 25.5 C12 22 8 17 3 14 C6 19 8 23 11 27 C8 31 6 35 4 40 C10 36 14 32 18 29.5 Z" className={styles.fin} />
              <path d="M118 30 C116 28.5 113 27.6 110 27 C108 22 104 19 98 17.5 C86 13 70 11.5 56 13 C42 14.5 30 19 20 24.5 L16 26 L16 29 C26 30.5 38 34 52 37 C68 40 86 38.5 98 35.5 C104 34 110 32 118 30 Z" fill="url(#dolphin-skin)" />
              <path d="M100 30 C90 27 74 27 58 30 C46 32 34 31 24 28 C36 33 48 36.4 60 36.2 C78 36 92 33 100 30 Z" className={styles.flank} />
              <path d="M117 30.6 C110 32 104 33.6 98 34.6 C86 36.6 70 37.6 56 35.6 C66 34 78 32.6 88 31.4 C96 30.4 104 30.6 110 29.8 Z" className={styles.belly} />
              <path d="M94 33.5 C90 38 85 41 79 42.5 C82 39 84 36 86 33.5 Z" className={styles.fin} />
              <path d="M60 15.4 C74 13.2 88 14 98 18.4 C88 16.2 74 15.8 60 15.4 Z" className={styles.shine} />
              <path d="M117.5 30.2 C114 31.1 110.5 31.1 107.5 30" className={styles.mouth} />
              <ellipse cx="91" cy="15.6" rx="1.1" ry=".55" className={styles.eye} />
              <circle cx="104" cy="26" r="1.5" className={styles.eye} />
              <circle cx="104.5" cy="25.5" r=".5" className={styles.glint} />
            </svg>
          </div>
        )}
      </div>
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
