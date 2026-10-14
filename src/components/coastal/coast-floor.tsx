"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import styles from "./coastal.module.css";

const CoastScene = dynamic(() => import("./coast-scene"), { ssr: false });
const BeachCastleScene = dynamic(() => import("./beach-castle-scene"), {
  ssr: false,
});

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** A decorative layer: content and music controls remain ordinary accessible HTML. */
export function CoastFloor({
  variant = "floor",
}: {
  variant?: "floor" | "castle";
}) {
  const host = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const dark = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preload.disconnect();
        // Phones (and Data Saver) keep the plain sand gradient: the 3D floor
        // would pull in three.js just for decoration. Same cutoff as the hero.
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        if (matchMedia("(max-width: 631px)").matches || connection?.saveData) return;
        setLoaded(true);
      },
      { rootMargin: "300px" },
    );
    const visibility = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    preload.observe(element);
    visibility.observe(element);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      preload.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const moving = visible && tabVisible && !reducedMotion;

  return (
    <div
      ref={host}
      className={
        variant === "castle" ? styles.beachVignette : styles.coastFloor
      }
      aria-hidden="true"
      data-coast-motion={moving ? "moving" : "still"}
    >
      {loaded && (
        <SceneBoundary>
          {variant === "castle" ? (
            <BeachCastleScene moving={moving} dark={dark} />
          ) : (
            <CoastScene moving={moving} dark={dark} />
          )}
        </SceneBoundary>
      )}
    </div>
  );
}
