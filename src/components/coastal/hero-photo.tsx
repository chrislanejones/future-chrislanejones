"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import styles from "./coastal.module.css";

const HeroSea = dynamic(() => import("./hero-sea"), { ssr: false });

function subscribeToMotion(callback: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function subscribeToMobile(callback: () => void) {
  const query = matchMedia("(max-width: 767px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

class PhotoFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** The original photo stays server-rendered; only its water gains motion. */
export function HeroPhoto() {
  const host = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState("");
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const reduced = useSyncExternalStore(subscribeToMotion,
    () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const mobile = useSyncExternalStore(subscribeToMobile,
    () => matchMedia("(max-width: 767px)").matches, () => false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const moving = visible && tabVisible && !reduced;
  return (
    <div ref={host} className={styles.heroVisual} data-hero-motion={moving ? "moving" : "still"}>
      <Image
        src="/gallery/Florida-Coast-Aerial.webp"
        alt="An aerial view of the Florida coast, with a sandy beach beside the Atlantic Ocean"
        fill
        sizes="(max-width: 1440px) 100vw, 1400px"
        loading="eager"
        fetchPriority="high"
        className={styles.heroImage}
        onLoad={(event) => setSource(event.currentTarget.currentSrc)}
      />
      {source && !reduced && (
        <div className={styles.heroSea} aria-hidden="true">
          <PhotoFallback>
            <HeroSea source={source} moving={moving} mobile={mobile} />
          </PhotoFallback>
        </div>
      )}
    </div>
  );
}
