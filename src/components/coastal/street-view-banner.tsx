"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Reveal } from "./reveal";
import styles from "./street-view-banner.module.css";

const StreetScene = dynamic(() => import("./hero-coast-scene"), { ssr: false });
function subscribe(callback: () => void) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  document.addEventListener("visibilitychange", callback);
  return () => { media.removeEventListener("change", callback); document.removeEventListener("visibilitychange", callback); };
}
function canAnimate() { return !document.hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches; }
class StreetBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function StreetViewBanner({ children }: { children?: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const animate = useSyncExternalStore(subscribe, canAnimate, () => false);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setUnavailable(true), []);
  useEffect(() => {
    if (!host.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setSeen(true);
    });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const moving = animate && visible && !unavailable;
  return <div ref={host} className={`${styles.view} ${children ? styles.titled : ""}`} data-street-ready={ready && !unavailable}
    data-street-renderer={ready && !unavailable ? "3d" : "still"} data-street-motion={moving ? "moving" : "still"}>
    <Image src="/hero/ninth-street.webp" fill sizes="(max-width: 1400px) 94vw, 1360px" loading="eager"
      alt="A walking view east along 9th Street toward St. Augustine Beach, past the fictional El Castillo resort, street signs and planted palm-lined curbs"
      className={styles.poster} />
    {seen && !unavailable && <div className={styles.scene} data-ready={ready} aria-hidden="true">
      <StreetBoundary onUnavailable={onUnavailable}>
        <StreetScene streetView timeOfDay={17.5} weather="scattered" moving={moving} dark={false}
          onReady={onReady} onUnavailable={onUnavailable} />
      </StreetBoundary>
    </div>}
    {children && <><div className={styles.shade} aria-hidden="true" /><Reveal className={styles.content}>{children}</Reveal></>}
  </div>;
}
