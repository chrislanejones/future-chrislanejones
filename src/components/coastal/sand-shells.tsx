import styles from "./coastal.module.css";

// A few shells on the project-card sand, the same kinds and tints as the 3D
// shells in "Beyond the browser". They sit in the margin around the browser
// window and tuck under its edges. Plain SVG: no script, no extra requests.

type Kind = "scallop" | "spiral" | "clam";
const KINDS: Record<Kind, { light: string; dark: string; shape: (fill: string) => React.ReactNode }> = {
  scallop: {
    light: "#ecc9b8",
    dark: "#cf9f8b",
    shape: fill => (
      <>
        <path d="M20 34C13 30 5 22 4 14 3 7 11 3 20 3s17 4 16 11c-1 8-9 16-16 20Z" fill={fill} />
        <path d="M20 33 6 12M20 33 11 6M20 33 17 4M20 33 23 4M20 33 29 6M20 33 34 12" />
        <path d="M15 33h10l-1 3h-8Z" fill={fill} />
      </>
    ),
  },
  spiral: {
    light: "#f1e2cb",
    dark: "#c4a27c",
    shape: fill => (
      <>
        <circle cx="19" cy="19" r="15" fill={fill} />
        <path d="M19 19c2 0 3 2 2 3-2 2-5 0-5-2 0-4 5-5 8-3 4 3 3 9-1 11-6 3-12-1-12-7 0-7 7-11 13-9" fill="none" />
      </>
    ),
  },
  clam: {
    light: "#efe3d6",
    dark: "#c9b49b",
    shape: fill => (
      <>
        <path d="M5 22C5 11 12 4 20 4s15 7 15 18c0 6-7 10-15 10S5 28 5 22Z" fill={fill} />
        <path d="M9 23c2-9 6-14 11-14s9 5 11 14M13 25c1-6 4-10 7-10s6 4 7 10" fill="none" />
      </>
    ),
  },
};

// Spots in the card's margins, as percentages of the card.
const LAYOUTS: { kind: Kind; x: number; y: number; size: number; turn: number }[][] = [
  [
    { kind: "scallop", x: 1, y: 2, size: 10, turn: -24 },
    { kind: "spiral", x: 91, y: 80, size: 8, turn: 40 },
    { kind: "clam", x: 2, y: 82, size: 7, turn: 15 },
    { kind: "clam", x: 70, y: 1, size: 5.5, turn: -40 },
    { kind: "spiral", x: 93.5, y: 30, size: 5, turn: 110 },
  ],
  [
    { kind: "clam", x: 90, y: 1, size: 8.5, turn: 30 },
    { kind: "scallop", x: 1.5, y: 78, size: 10.5, turn: 12 },
    { kind: "spiral", x: 94, y: 52, size: 6, turn: -60 },
    { kind: "scallop", x: 24, y: 90, size: 6, turn: 170 },
    { kind: "clam", x: 1, y: 14, size: 5.5, turn: -12 },
  ],
  [
    { kind: "spiral", x: 1.5, y: 3, size: 7.5, turn: 80 },
    { kind: "scallop", x: 90, y: 76, size: 11, turn: -16 },
    { kind: "clam", x: 52, y: 90, size: 6.5, turn: -8 },
    { kind: "scallop", x: 93, y: 4, size: 6, turn: 36 },
    { kind: "clam", x: 1, y: 60, size: 6, turn: 64 },
  ],
];

const pick = (seed: string) => [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % LAYOUTS.length;

export function SandShells({ seed }: { seed: string }) {
  return (
    <span className={styles.sandShells} aria-hidden="true">
      {LAYOUTS[pick(seed)].map(({ kind, x, y, size, turn }, index) => {
        // Gradient ids are page-global, so each shell gets its own.
        const id = `shell-${seed.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`;
        return <svg
          key={index}
          viewBox="0 0 40 38"
          className={styles.sandShell}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `clamp(18px, ${size}%, 58px)`,
            transform: `rotate(${turn}deg)`,
          }}
        >
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={KINDS[kind].light} />
              <stop offset="1" stopColor={KINDS[kind].dark} />
            </linearGradient>
          </defs>
          <g stroke="rgba(122, 88, 62, 0.4)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            {KINDS[kind].shape(`url(#${id})`)}
          </g>
        </svg>;
      })}
    </span>
  );
}
