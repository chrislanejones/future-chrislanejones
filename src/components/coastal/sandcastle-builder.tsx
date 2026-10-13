"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowUpRight, BrickWall, Castle, Droplets, Eraser, Flag, PaintBucket, RotateCw, Shell, Undo2, Waves } from "lucide-react";
import { castleReducer, initialCastle, type CastleTool } from "./sandcastle-model";
import coastal from "./coastal.module.css";
import styles from "./sandcastle-builder.module.css";

const loadScene = () => import("./sandcastle-scene");
const Scene = dynamic(loadScene, { ssr: false, loading: () => null });
/** The bucket always fills to the brim, even when the scene is already cached. */
const FILL_MS = 2200;

/** Outlined bucket and shovel; the bucket fills from the bottom while the 3D scene downloads. */
function BucketLoader({ running }: { running: boolean }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <svg className={styles.loaderArt} viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <clipPath id="bucket-fill-clip"><polygon points="31,42 89,42 82,104 38,104" /></clipPath>
        </defs>
        <g clipPath="url(#bucket-fill-clip)">
          <rect className={`${styles.loaderFill} ${running ? styles.loaderFilling : ""}`} x="28" y="40" width="64" height="66" />
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="31,42 89,42 82,104 38,104" />
          <rect x="27" y="35" width="66" height="8" rx="3" />
          <path d="M33 35 Q60 4 87 35" />
          <path d="M108 16 L98 88" />
          <path d="M102 12 l12 4" />
          <path d="M90 90 l16 2 l-1 10 q-6 8 -14 2 z" />
        </g>
      </svg>
      <p>Getting the beach ready…</p>
    </div>
  );
}
const tools = [
  { id: "tower", label: "Tower", icon: Castle }, { id: "bucket", label: "Bucket", icon: PaintBucket },
  { id: "wall", label: "Wall", icon: BrickWall }, { id: "moat", label: "Moat", icon: Droplets },
  { id: "flag", label: "Flag", icon: Flag }, { id: "shell", label: "Shell", icon: Shell },
  { id: "erase", label: "Eraser", icon: Eraser },
] as const;

function subscribe(callback: () => void) {
  const theme = new MutationObserver(callback);
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  motion.addEventListener("change", callback);
  document.addEventListener("visibilitychange", callback);
  return () => { theme.disconnect(); motion.removeEventListener("change", callback); document.removeEventListener("visibilitychange", callback); };
}
function environment() {
  return `${document.documentElement.classList.contains("dark")}:${matchMedia("(prefers-reduced-motion: reduce)").matches}:${document.hidden}`;
}
class BeachBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className={styles.loading}>The 3D beach couldn’t start. Try enabling WebGL or refreshing the page.</p> : this.props.children; }
}

export function SandcastleBuilder() {
  const [state, dispatch] = useReducer(castleReducer, initialCastle);
  const [tool, setTool] = useState<CastleTool>("tower");
  const [rotated, setRotated] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, z: 1 });
  const aimedSpot = useRef(cursor);
  const [loaded, setLoaded] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [filled, setFilled] = useState(false);
  // Download early, but only start pouring once the game is actually on screen.
  useEffect(() => {
    if (!loaded) return;
    let live = true;
    loadScene().then(() => { if (live) setSceneReady(true); });
    return () => { live = false; };
  }, [loaded]);
  const [visible, setVisible] = useState(false);
  // Becomes true the first time the game is on screen; the bucket starts pouring then.
  const [seen, setSeen] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const [dark, reduced, hidden] = useSyncExternalStore(subscribe, environment, () => "false:true:false").split(":");
  const pouring = loaded && seen;
  useEffect(() => {
    if (!pouring) return;
    const timer = setTimeout(() => setFilled(true), FILL_MS);
    return () => clearTimeout(timer);
  }, [pouring]);
  useEffect(() => {
    if (!host.current) return;
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setLoaded(true); preload.disconnect(); } }, { rootMargin: "300px" });
    const visibility = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); if (entry.isIntersecting) setSeen(true); });
    preload.observe(host.current); visibility.observe(host.current);
    return () => { preload.disconnect(); visibility.disconnect(); };
  }, []);
  function place(x = aimedSpot.current.x, z = aimedSpot.current.z) {
    aimedSpot.current = { x, z };
    setCursor({ x, z });
    dispatch({ type: "place", tool, x, z, rotated });
  }
  return <section id="mountains-to-beaches" className={`${coastal.container} ${styles.builder}`} aria-labelledby="coast-title">
    <div className={styles.copy}>
      <Waves size={36} strokeWidth={1.3} aria-hidden="true" />
      <h2 id="coast-title">From mountains<br />to beaches.</h2>
      <p>After eight years in Virginia, we hit undo and traded mountains for beaches. We are back in Florida as of 2026.</p>
      <Link href="/about" className={styles.about}>More about me <ArrowUpRight size={16} aria-hidden="true" /></Link>
      <div className={styles.toolHeading}><h3>Leave a little castle.</h3><p>Pick a piece, then tap the sand.</p></div>
      <div className={styles.tools} role="group" aria-label="Sandcastle tools">
        {tools.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={tool === id} onClick={() => setTool(id)}><Icon size={20} aria-hidden="true" />{label}</button>)}
      </div>
      <div className={styles.options}>
        <button type="button" disabled={tool !== "wall"} onClick={() => { setRotated(value => !value); dispatch({ type: "rotate", ...aimedSpot.current }); }} aria-pressed={rotated} aria-label="Rotate wall"><RotateCw size={16} aria-hidden="true" />Rotate wall</button>
        <button type="button" onClick={() => place()}>{tool === "erase" ? "Erase at marker" : "Place at marker"}</button>
      </div>
      <p className={styles.status} role="status" aria-live="polite">{state.message}</p>
    </div>
    <div className={styles.playground}>
      <div ref={host} className={styles.stage} role="group" aria-label="Sandcastle building area" aria-describedby="sandcastle-help" tabIndex={0}
        onKeyDown={event => {
          const offsets: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
          if (offsets[event.key]) {
            event.preventDefault(); const [dx, dz] = offsets[event.key];
            const point = aimedSpot.current;
            const next = { x: Math.max(-3, Math.min(3, point.x + dx)), z: Math.max(-2, Math.min(2, point.z + dz)) };
            aimedSpot.current = next;
            setCursor(next);
          } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); place(); }
          else if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); dispatch({ type: "place", tool: "erase", ...aimedSpot.current, rotated }); }
          else if (event.key.toLowerCase() === "r") { event.preventDefault(); setRotated(value => !value); dispatch({ type: "rotate", ...aimedSpot.current }); }
          else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); dispatch({ type: "undo" }); }
        }}>
        {loaded ? <BeachBoundary><Scene pieces={state.pieces} tool={tool} cursor={cursor} dark={dark === "true"} moving={visible && reduced === "false" && hidden === "false"} onPlace={place} onAim={point => { aimedSpot.current = point; }} /></BeachBoundary> : <p className={styles.loading}>Your patch of beach.</p>}
        {loaded && !(filled && sceneReady) && <BucketLoader running={pouring} />}
      </div>
      <div className={styles.beachFooter}>
        <span aria-label={`${state.pieces.length} castle pieces`}>{state.pieces.length} {state.pieces.length === 1 ? "piece" : "pieces"} on the beach</span>
        <div><button type="button" disabled={!state.history.length} onClick={() => dispatch({ type: "undo" })}><Undo2 size={16} aria-hidden="true" />Undo</button><button type="button" disabled={!state.pieces.length} onClick={() => dispatch({ type: "clear" })}>Clear beach</button></div>
      </div>
      <p id="sandcastle-help" className={styles.help}>Tap to build; the ring shows where a piece will go. Flip a bucket for a molded castle, stack a second bucket on it, and put a tower on top of that. Dig moats side by side and they join into lines, corners, and a ring around a castle. Finish with a flag or a shell on top. Tap a wall again to turn it. With a keyboard: arrow keys move the marker, Enter places a piece, and Delete removes the top piece.</p>
    </div>
  </section>;
}
