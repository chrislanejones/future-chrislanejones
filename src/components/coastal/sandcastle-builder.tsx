"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowUpRight, RotateCw, Undo2, Waves } from "lucide-react";
import { castleReducer, HALF_X, HALF_Z, initialCastle, type CastleTool } from "./sandcastle-model";
import { ToolArt } from "./sandcastle-tool-art";
import coastal from "./coastal.module.css";
import styles from "./sandcastle-builder.module.css";

const loadScene = () => import("./sandcastle-scene");
const Scene = dynamic(loadScene, { ssr: false, loading: () => null });
/** The bucket always fills to the brim, even when the scene is already cached. */
const FILL_MS = 2200;

// Bucket and shovel drawn once, used twice: as the colored fill and as the outline.
const BUCKET_BODY = "M26 42 L34 99 Q35 105 41 105 L79 105 Q85 105 86 99 L94 42 Z";
const BUCKET_HANDLE = "M89 50 C109 49 113 70 100 79 C95 82 89 81 86 78";
const SAND = "M27 31 Q31 20 44 21 Q51 12 62 17 Q73 12 82 19 Q93 21 93 31";
// The shovel is drawn upright around x = 0, then leaned against the bucket.
const SHOVEL_LEAN = "translate(47 49) rotate(28) scale(.82)";
const SHOVEL_GRIP = "M-8 3Q-8 0-5 0H5Q8 0 8 3V11Q8 14 5 14H-5Q-8 14-8 11ZM-4 4H4V10H-4Z";
const SHOVEL_SHAFT = "M-3 14H3V51H-3Z";
const SHOVEL_BLADE = "M-4 50H4Q13 54 13 66Q13 80 0 84Q-13 80-13 66Q-13 54-4 50Z";

/** Outlined bucket and shovel that fill with color from the bottom while the 3D scene downloads. */
function BucketLoader({ running }: { running: boolean }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <svg className={styles.loaderArt} viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          {/* The shovel stands in front: hide the bucket's outline behind it. */}
          <mask id="bucket-behind-shovel" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
            <rect width="120" height="120" fill="white" />
            <g transform={SHOVEL_LEAN} fill="black" stroke="black" strokeWidth="3.2">
              <path d={SHOVEL_GRIP} />
              <path d={SHOVEL_SHAFT} />
              <path d={SHOVEL_BLADE} />
            </g>
          </mask>
          <clipPath id="bucket-fill-clip">
            <rect className={`${styles.loaderFill} ${running ? styles.loaderFilling : ""}`} x="0" y="0" width="120" height="120" />
          </clipPath>
        </defs>
        <g clipPath="url(#bucket-fill-clip)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path className={styles.loaderSand} d={`${SAND}Z`} stroke="currentColor" />
          <path className={styles.loaderHandle} d={BUCKET_HANDLE} fill="none" strokeWidth="5" />
          <path className={styles.loaderBucket} d={BUCKET_BODY} />
          <rect className={styles.loaderRim} x="21" y="30" width="78" height="13" rx="5" />
          <path className={styles.loaderShine} d="M33 50 L38 92" fill="none" strokeWidth="4" />
          <g className={styles.loaderShovel} transform={SHOVEL_LEAN} fillRule="evenodd">
            <path d={SHOVEL_GRIP} />
            <path d={SHOVEL_SHAFT} />
            <path d={SHOVEL_BLADE} />
          </g>
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <g mask="url(#bucket-behind-shovel)">
            <path d={BUCKET_BODY} />
            <rect x="21" y="30" width="78" height="13" rx="5" />
            <path d={BUCKET_HANDLE} />
            <circle cx="88" cy="50" r="3" />
          </g>
          {/* 3.2 at the shovel's .82 scale draws the same 2.6 line as the bucket. */}
          <g transform={SHOVEL_LEAN} strokeWidth="3.2">
            <path d={SHOVEL_GRIP} />
            <path d="M-3 14V50M3 14V50" />
            <path d={SHOVEL_BLADE} />
          </g>
        </g>
      </svg>
      <p>Getting the beach ready…</p>
    </div>
  );
}
const tools = [
  { id: "tower", label: "Tower" }, { id: "bucket", label: "Bucket" },
  { id: "wall", label: "Wall" }, { id: "moat", label: "Dig moat" },
  { id: "pile", label: "Pile sand" }, { id: "flag", label: "Flag" },
  { id: "shell", label: "Shell" }, { id: "erase", label: "Eraser" },
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
  // Settled = the scene code finished downloading, or failed to. On failure the
  // lazy Scene throws and BeachBoundary shows its message, so the bucket must
  // step aside either way instead of pouring forever.
  const [sceneSettled, setSceneSettled] = useState(false);
  const [filled, setFilled] = useState(false);
  // Download early, but only start pouring once the game is actually on screen.
  useEffect(() => {
    if (!loaded) return;
    let live = true;
    const settle = () => { if (live) setSceneSettled(true); };
    loadScene().then(settle, settle);
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
        {tools.map(({ id, label }) => <button key={id} type="button" aria-pressed={tool === id} onClick={() => setTool(id)}><ToolArt tool={id} />{label}</button>)}
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
            const next = { x: Math.max(-HALF_X, Math.min(HALF_X, point.x + dx)), z: Math.max(-HALF_Z, Math.min(HALF_Z, point.z + dz)) };
            aimedSpot.current = next;
            setCursor(next);
          } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); place(); }
          else if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); dispatch({ type: "place", tool: "erase", ...aimedSpot.current, rotated }); }
          else if (event.key.toLowerCase() === "r") { event.preventDefault(); setRotated(value => !value); dispatch({ type: "rotate", ...aimedSpot.current }); }
          else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); dispatch({ type: "undo" }); }
        }}>
        {loaded ? <BeachBoundary><Scene pieces={state.pieces} tool={tool} cursor={cursor} dark={dark === "true"} moving={visible && reduced === "false" && hidden === "false"} onPlace={place} onAim={point => { aimedSpot.current = point; }} /></BeachBoundary> : <p className={styles.loading}>Your patch of beach.</p>}
        {loaded && !(filled && sceneSettled) && <BucketLoader running={pouring} />}
      </div>
      <div className={styles.beachFooter}>
        <span aria-label={`${state.pieces.length} castle pieces`}>{state.pieces.length} {state.pieces.length === 1 ? "piece" : "pieces"} on the beach</span>
        <div><button type="button" disabled={!state.history.length} onClick={() => dispatch({ type: "undo" })}><Undo2 size={16} aria-hidden="true" />Undo</button><button type="button" disabled={!state.pieces.length} onClick={() => dispatch({ type: "clear" })}>Clear beach</button></div>
      </div>
      <p id="sandcastle-help" className={styles.help}>Tap to build; the ring shows where a piece will go. Flip a bucket for a molded castle, stack a second bucket on it, and put a tower on top of that. Pile sand to raise a dune (twice for a tall one) and build on top of it. Dig moats side by side and they join into lines, corners, and a ring around a castle; digging a dune lowers it, and piling sand on a moat fills it in. Finish with a flag or a shell on top. Tap a wall again to turn it. With a keyboard: arrow keys move the marker, Enter places a piece, and Delete removes the top piece.</p>
    </div>
  </section>;
}
