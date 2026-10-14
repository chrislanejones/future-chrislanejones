"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import styles from "./coastal.module.css";

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

/** The photo remains available while the original 3D coast loads, or if WebGL fails. */
export function HeroPhoto() {
  const host = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [reduced, dark] = useSyncExternalStore(subscribe, environment, () => "true:false").split(":");
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setUnavailable(true), []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setLoaded(true);
    });
    observer.observe(element);
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  const moving = visible && tabVisible && reduced === "false" && !unavailable;
  return (
    <div ref={host} className={styles.heroVisual}
      data-hero-motion={moving ? "moving" : "still"}
      data-hero-renderer={ready && !unavailable ? "3d" : "photo"}>
      <Image
        src="/gallery/Florida-Coast-Aerial.webp"
        alt="A coastal neighborhood in St. Augustine Beach, with pastel houses, hotels, dunes and the Atlantic Ocean"
        fill quality={75} sizes="(max-width: 1440px) 100vw, 1400px"
        loading="eager" fetchPriority="high" className={styles.heroImage}
      />
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
