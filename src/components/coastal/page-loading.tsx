import { CoastalPageShell } from "./page-shell";
import coastal from "./coastal.module.css";
import styles from "./interior.module.css";

export function CoastalPageLoading() {
  return (
    <CoastalPageShell>
      <header className={coastal.pageIntro}>
        {/* Not an h1: Next streams this fallback into the HTML ahead of the
            real page, so an h1 here gave every page two. */}
        <p className={coastal.loadingTitle}>One moment.</p>
        <p role="status">Loading page…</p>
      </header>
      <div className={`${styles.split} ${styles.content}`} aria-hidden="true">
        <div className={styles.panel} style={{ minHeight: 280 }} />
        <div className={styles.panel} style={{ minHeight: 280 }} />
      </div>
    </CoastalPageShell>
  );
}
