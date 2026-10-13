import { BeachBanner } from "@/components/coastal/beach-banner";
import Link from "next/link";
import ConferencesPage from "../ConferencesPage";
import type { Conference } from "@/lib/conferences";
import coastal from "@/components/coastal/coastal.module.css";

export default function ConferenceYearPage({ conferences, year }: { conferences: Conference[]; year: string }) {
  return (
    <>
      <header className={coastal.pageIntro}>
        <BeachBanner>
          <nav aria-label="Breadcrumb" className={coastal.breadcrumb}>
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/conferences">Conferences</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{year}</span>
          </nav>
          <h1>Conferences in {year}.</h1>
          <p>The events, places, and communities that brought me away from the keyboard.</p>
        </BeachBanner>
      </header>
      <ConferencesPage conferences={conferences} year={Number(year)} />
    </>
  );
}
