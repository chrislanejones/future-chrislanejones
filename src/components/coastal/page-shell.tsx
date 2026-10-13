import type { ReactNode } from "react";
import { CoastalHeader, CoastalFooter } from "./navigation";
import styles from "./coastal.module.css";

export function CoastalPageShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.coastalPage} data-coastal-theme data-coastal-page>
      <CoastalHeader />
      <main id="main-content" tabIndex={-1} className={styles.container}>
        {children}
      </main>
      <CoastalFooter />
    </div>
  );
}
