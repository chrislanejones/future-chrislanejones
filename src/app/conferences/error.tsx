"use client";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import coastal from "@/components/coastal/coastal.module.css";
import { Button } from "@/components/ui/button";

export default function ConferenceError({ reset }: { reset: () => void }) {
  return <CoastalPageShell><header className={coastal.pageIntro}>
    <h1>Couldn’t load conferences.</h1>
    <p>The conference archive is temporarily unavailable. Please try again.</p>
    <Button variant="pill" size="lg" onClick={reset}>Try again</Button>
  </header></CoastalPageShell>;
}
