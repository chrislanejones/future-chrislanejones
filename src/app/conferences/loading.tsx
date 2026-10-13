import { CoastalPageShell } from "@/components/coastal/page-shell";
import coastal from "@/components/coastal/coastal.module.css";
import styles from "@/components/coastal/conferences.module.css";

export default function Loading() {
  return <CoastalPageShell>
    <header className={coastal.pageIntro}><h1>Conferences.</h1><p role="status">Loading conference details…</p></header>
    <div className={`${styles.grid} ${styles.loading}`} aria-hidden="true"><div /><div /></div>
  </CoastalPageShell>;
}
