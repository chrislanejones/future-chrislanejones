"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import styles from "./coastal.module.css";
import { HeroOceanLite } from "./hero-ocean-lite";

const HeroCoastScene = dynamic(() => import("./hero-coast-scene"), { ssr: false });

function subscribe(callback: () => void) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const theme = new MutationObserver(callback);
  theme.observe(document.documentElement, { attributes:true, attributeFilter:["class"] });
  motion.addEventListener("change", callback);
  return () => { theme.disconnect(); motion.removeEventListener("change", callback); };
}
function environment() {
  return `${matchMedia("(prefers-reduced-motion: reduce)").matches}:${document.documentElement.classList.contains("dark")}`;
}
class SceneFallback extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed:false };
  static getDerivedStateFromError() { return { failed:true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** A still of the 3D coast shows while the live scene loads, or if WebGL fails. */
export function HeroPhoto() {
  const host = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [reduced, dark] = useSyncExternalStore(subscribe, environment, () => "true:false").split(":");
  const [handedOff, setHandedOff] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  // Keep the light ocean under the 3D until its fade-in has finished.
  useEffect(() => {
    if (!ready || unavailable) return;
    const timer = window.setTimeout(() => setHandedOff(true), 1400);
    return () => clearTimeout(timer);
  }, [ready, unavailable]);
  const onUnavailable = useCallback(() => setUnavailable(true), []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    // The still and the light ocean carry the hero while the page loads. The
    // 3D town (three.js plus a large model build) waits for the load event and
    // an idle moment, so it never competes with text, links and images.
    let idle = 0, seen = false, settled = document.readyState === "complete";
    const start = () => {
      // ?hero=lite holds the page at the still-plus-ocean stage, for checking it.
      if (!seen || !settled || idle || location.search.includes("hero=lite")) return;
      idle = "requestIdleCallback" in window
        ? requestIdleCallback(() => setLoaded(true), { timeout:2000 })
        : setTimeout(() => setLoaded(true), 300) as unknown as number;
    };
    const onLoad = () => { settled = true; start(); };
    window.addEventListener("load", onLoad, { once:true });
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) { seen = true; start(); }
    });
    observer.observe(element);
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", onVisibility);
      if ("cancelIdleCallback" in window) cancelIdleCallback(idle); else clearTimeout(idle);
    };
  }, []);

  const moving = visible && tabVisible && reduced === "false" && !unavailable;
  return (
    <div ref={host} className={styles.heroVisual}
      data-hero-motion={moving ? "moving" : "still"}
      data-hero-renderer={ready && !unavailable ? "3d" : "photo"}>
      {/* Stills captured from the 3D scene itself, so the fade into the live
          canvas looks like the picture starting to move. CSS shows one per theme. */}
      <Image
        src="/hero/coast-light.webp"
        alt="A 3D model of the St. Augustine Beach coast, with pastel houses, hotels, dunes and the Atlantic Ocean"
        fill quality={75} sizes="(max-width: 1440px) 100vw, 1400px"
        loading="eager" fetchPriority="high" className={`${styles.heroPoster} ${styles.heroPosterLight}`}
      />
      <Image
        src="/hero/coast-dark.webp"
        alt="A 3D model of the St. Augustine Beach coast at dusk, with pastel houses, hotels, dunes and the Atlantic Ocean"
        fill quality={75} sizes="(max-width: 1440px) 100vw, 1400px"
        loading="eager" fetchPriority="high" className={`${styles.heroPoster} ${styles.heroPosterDark}`}
      />
      {!handedOff && <HeroOceanLite moving={moving} dark={dark === "true"} className={styles.heroOcean} />}
      {loaded && !unavailable && (
        <div className={styles.heroScene} data-ready={ready} aria-hidden="true">
          <SceneFallback onUnavailable={onUnavailable}>
            <HeroCoastScene moving={moving} dark={dark === "true"} onReady={onReady} onUnavailable={onUnavailable} />
          </SceneFallback>
        </div>
      )}
    </div>
  );
}
