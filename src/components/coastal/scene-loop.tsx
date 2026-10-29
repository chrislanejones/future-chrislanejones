"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./scene-loop.module.css";

export type SceneTheme = { still: string; video?: string; alt: string; blur?: string };
export type LoopScene = { day: SceneTheme; night: SceneTheme };

function subscribe(callback: () => void) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const theme = new MutationObserver(callback);
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  motion.addEventListener("change", callback);
  document.addEventListener("visibilitychange", callback);
  return () => {
    theme.disconnect();
    motion.removeEventListener("change", callback);
    document.removeEventListener("visibilitychange", callback);
  };
}
// Packed into one string so the snapshot stays referentially stable.
function environment() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return `${document.documentElement.classList.contains("dark")}:${reduced}:${document.hidden}`;
}

/**
 * A still of a 3D-world scene, then a seamless video loop of the same shot.
 * Light mode shows the day version and dark mode the night one; CSS picks the
 * still, so it is right before hydration. The loop's first frame is the still,
 * so the fade-in shows no jump. The video waits for the load event and an idle
 * moment. Phones, Data Saver and reduced motion keep the still.
 * preloadBoth: once the current theme's loop is playing, fetch the other theme's
 * loop in the background so switching light/dark plays at once (the home hero).
 */
export function SceneLoop({ scene, sizes, className = "", preloadBoth = false }: { scene: LoopScene; sizes: string; className?: string; preloadBoth?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const [dark, reduced, hidden] = useSyncExternalStore(subscribe, environment, () => "false:true:false").split(":").map(v => v === "true");
  const current = dark ? scene.night : scene.day;

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let idle = 0, seen = false, settled = document.readyState === "complete";
    const start = () => {
      if (!seen || !settled || idle) return;
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (matchMedia("(max-width: 631px)").matches || connection?.saveData) return;
      idle = "requestIdleCallback" in window
        ? requestIdleCallback(() => setAllowed(true), { timeout: 2000 })
        : setTimeout(() => setAllowed(true), 300) as unknown as number;
    };
    const onLoad = () => { settled = true; start(); };
    window.addEventListener("load", onLoad, { once: true });
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) { seen = true; start(); }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", onLoad);
      if ("cancelIdleCallback" in window) cancelIdleCallback(idle); else clearTimeout(idle);
    };
  }, []);

  const playing = allowed && !reduced && Boolean(current.video);
  const other = (dark ? scene.day : scene.night).video;
  useEffect(() => {
    if (!preloadBoth || !playing || !other || readySrc !== current.video) return;
    const controller = new AbortController();
    const wait = setTimeout(() => {
      fetch(other, { signal: controller.signal, priority: "low" } as RequestInit).then(r => r.blob()).catch(() => undefined);
    }, 1500);
    return () => { clearTimeout(wait); controller.abort(); };
  }, [preloadBoth, playing, other, readySrc, current.video]);
  // Offscreen or a hidden tab pauses the loop; it resumes where it stopped.
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (visible && !hidden) element.play().catch(() => undefined);
    else element.pause();
  }, [visible, hidden, playing, current.video]);

  return (
    <div ref={host} className={styles.scene} data-scene-motion={playing && readySrc === current.video ? "moving" : "still"}>
      {/* Lazy (the default) so only the visible theme's still downloads: eager made
          React preload both, and Chrome flagged the hidden one as an unused preload. */}
      {(["day", "night"] as const).map(theme => (
        <Image key={theme} src={scene[theme].still} alt={scene[theme].alt} fill quality={75} sizes={sizes}
          fetchPriority="high" placeholder={scene[theme].blur ? "blur" : "empty"}
          blurDataURL={scene[theme].blur} className={`${className} ${styles[theme]}`} />
      ))}
      {playing && (
        <video key={current.video} ref={video} className={`${className} ${styles.video}`} src={current.video}
          muted loop playsInline autoPlay preload="auto" aria-hidden="true" tabIndex={-1}
          data-ready={readySrc === current.video} onPlaying={() => setReadySrc(current.video ?? null)} />
      )}
    </div>
  );
}
