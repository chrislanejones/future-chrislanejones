import type { CastleTool } from "./sandcastle-model";
import styles from "./sandcastle-builder.module.css";

// Little beach-toy drawings for the tool buttons, in the loader's style:
// a currentColor outline over sand, teal and coral fills.
const ART: Record<CastleTool, React.ReactNode> = {
  tower: <>
    <path className={styles.artSand} d="M7 21V10h10v11Z" />
    <path className={styles.artSand} d="M6 10V6h2.4v2h2.2V6h2.8v2h2.2V6H18v4Z" />
    <path d="M7 21V10h10v11M6 10V6h2.4v2h2.2V6h2.8v2h2.2V6H18v4H6M11 21v-3.5a1 1 0 0 1 2 0V21M4 21h16" />
  </>,
  bucket: <>
    <path className={styles.artTeal} d="M5.5 8h13l-1.6 12.2a1 1 0 0 1-1 .8H8.1a1 1 0 0 1-1-.8Z" />
    <rect className={styles.artTealDark} x="4.5" y="6" width="15" height="3" rx="1.2" />
    <path d="M5.5 8h13l-1.6 12.2a1 1 0 0 1-1 .8H8.1a1 1 0 0 1-1-.8ZM4.5 7.2a1.2 1.2 0 0 1 1.2-1.2h12.6a1.2 1.2 0 0 1 1.2 1.2v.6a1.2 1.2 0 0 1-1.2 1.2H5.7a1.2 1.2 0 0 1-1.2-1.2ZM18.6 10.5c2.4 0 2.9 3.9.6 4.8" />
  </>,
  wall: <>
    <path className={styles.artSand} d="M3 20v-8h18v8Z" />
    <path className={styles.artSand} d="M3 12V8h3v2h3V8h3v2h3V8h3v2h3V8h0v4" />
    <path d="M3 20v-12h3v2h3V8h3v2h3V8h3v2h3V8v12M2 20h20M7.5 16h3M13.5 16h3" />
  </>,
  moat: <>
    <path className={styles.artTeal} d="M3 17.5c2-1.4 4-1.4 6 0s4 1.4 6 0 4-1.4 6 0V20H3Z" />
    <path className={styles.artCoral} d="m13.5 3.2 1.6.9-3.2 5.6-1.6-.9ZM10.6 8.4l2.8 1.6-1.9 3.6c-.9 1.4-2.6 1.6-3.8.7l-.6-.4c-.3-1.6.3-3.3 1.7-4Z" />
    <path d="M3 17.5c2-1.4 4-1.4 6 0s4 1.4 6 0 4-1.4 6 0M3 20.5h18M13.5 3.2l1.6.9-3.2 5.6-1.6-.9ZM10.6 8.4l2.8 1.6-1.9 3.6c-.9 1.4-2.6 1.6-3.8.7l-.6-.4c-.3-1.6.3-3.3 1.7-4Z" />
  </>,
  pile: <>
    <path className={styles.artSand} d="M2.5 19.5C5 13 8.5 9.5 12 9.5s7 3.5 9.5 10Z" />
    <path d="M2.5 19.5C5 13 8.5 9.5 12 9.5s7 3.5 9.5 10ZM2 19.5h20M9.5 14.5h.01M13.5 13h.01M15 16.5h.01M8 17.5h.01M12 4.5v2.5M9.6 5.6l1 1.7M14.4 5.6l-1 1.7" />
  </>,
  flag: <>
    <path className={styles.artCoral} d="M8 4.5l10 3.2-10 3.3Z" />
    <path className={styles.artSand} d="M2.5 21c1.6-2.6 3.4-3.6 5.5-3.6s3.9 1 5.5 3.6Z" />
    <path d="M8 17.4V3.5M8 4.5l10 3.2-10 3.3M2.5 21c1.6-2.6 3.4-3.6 5.5-3.6s3.9 1 5.5 3.6ZM1.5 21h13" />
  </>,
  shell: <>
    <path className={styles.artShell} d="M12 20.5c-2.2-1.2-6.5-4.7-7.6-9.3C3.7 7.4 7.3 4.5 12 4.5s8.3 2.9 7.6 6.7c-1.1 4.6-5.4 8.1-7.6 9.3Z" />
    <path d="M12 20.5c-2.2-1.2-6.5-4.7-7.6-9.3C3.7 7.4 7.3 4.5 12 4.5s8.3 2.9 7.6 6.7c-1.1 4.6-5.4 8.1-7.6 9.3ZM12 20.5 6.3 8.6M12 20.5 9 5.5M12 20.5V4.5M12 20.5l3-15M12 20.5l5.7-11.9M10 20.5h4l-.4 1.6h-3.2Z" />
  </>,
  erase: <>
    <path className={styles.artCoral} d="m14.2 4.6 5.2 5.2-7.6 7.6-5.2-5.2Z" />
    <path d="m14.2 4.6 5.2 5.2-8 8H6.2l-2.6-2.6a1.4 1.4 0 0 1 0-2ZM6.6 12.2l5.2 5.2M11.4 17.8H20" />
  </>,
};

export function ToolArt({ tool }: { tool: CastleTool }) {
  return (
    <svg className={styles.toolArt} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {ART[tool]}
    </svg>
  );
}
