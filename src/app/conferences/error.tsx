"use client";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import coastal from "@/components/coastal/coastal.module.css";

export default function ConferenceError({ reset }: { reset: () => void }) {
  return <CoastalPageShell><header className={coastal.pageIntro}>
    <h1>Couldn’t load conferences.</h1>
    <p>The conference archive is temporarily unavailable. Please try again.</p>
    <button type="button" onClick={reset} className={coastal.primaryButton}>Try again</button>
  </header></CoastalPageShell>;
}
