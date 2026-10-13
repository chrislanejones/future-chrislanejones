import { CoastalPageShell } from "./page-shell";
import coastal from "./coastal.module.css";
import styles from "./interior.module.css";

export function CoastalPageLoading() {
  return (
    <CoastalPageShell>
      <header className={coastal.pageIntro}>
        <h1>One moment.</h1>
        <p role="status">Loading page…</p>
      </header>
      <div className={`${styles.split} ${styles.content}`} aria-hidden="true">
        <div className={styles.panel} style={{ minHeight: 280 }} />
        <div className={styles.panel} style={{ minHeight: 280 }} />
      </div>
    </CoastalPageShell>
  );
}
