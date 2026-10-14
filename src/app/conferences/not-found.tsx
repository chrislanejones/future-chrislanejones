import Link from "next/link";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import coastal from "@/components/coastal/coastal.module.css";
import { Button } from "@/components/ui/button";

export default function ConferenceNotFound() {
  return <CoastalPageShell><header className={coastal.pageIntro}>
    <h1>Conference not found.</h1>
    <p>That event or year isn’t in the archive. Browse the full collection below.</p>
    <Button asChild variant="pill" size="lg"><Link href="/conferences">All conferences</Link></Button>
  </header></CoastalPageShell>;
}
