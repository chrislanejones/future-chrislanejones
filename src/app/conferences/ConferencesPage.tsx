"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { ConferenceCard } from "@/components/coastal/conference-card";
import { conferenceYears, sortConferences, type Conference } from "@/lib/conferences";
import styles from "@/components/coastal/conferences.module.css";
import { Button } from "@/components/ui/button";

export default function ConferencesPage({ conferences, year }: { conferences: Conference[]; year?: number }) {
  const [search, setSearch] = useState("");
  const years = conferenceYears(conferences);
  const query = search.trim().toLowerCase();
  const visible = sortConferences(conferences).filter((conference) =>
    (!year || conference.year === year) &&
    (!query || [conference.name, conference.city, conference.venue, conference.year, ...(conference.tags ?? [])].join(" ").toLowerCase().includes(query)),
  );

  return (
    <section className={styles.archive} aria-label="Conference archive">
      <nav className={styles.yearNav} aria-label="Conference years">
        <Link href="/conferences" aria-current={!year ? "page" : undefined}>All years</Link>
        {years.map((item) => <Link key={item} href={`/conferences/${item}`} aria-current={year === item ? "page" : undefined}>{item}</Link>)}
      </nav>
      <div className={styles.searchRow}>
        <p role="status" aria-live="polite">{visible.length} conference{visible.length === 1 ? "" : "s"}{year ? ` in ${year}` : " through the years"}</p>
        <div className={styles.search}>
          <Search size={18} aria-hidden="true" />
          <input aria-label="Search conferences" placeholder="Search events, cities, or topics" value={search} onChange={(event) => setSearch(event.target.value)} type="search" />
          {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear conference search"><X size={17} aria-hidden="true" /></button>}
        </div>
      </div>
      {visible.length ? (
        <div className={styles.grid}>
          {visible.map((conference, index) => <ConferenceCard key={conference._id} conference={conference} priority={index < 2} />)}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>{query ? "No matching conferences" : "No conferences yet"}</h2>
          <p>{query ? "Try another event, city, or topic." : "Conference details will appear here as they are added."}</p>
          {query && <Button variant="pill" className="mt-[22px]" onClick={() => setSearch("")}>Clear search</Button>}
        </div>
      )}
    </section>
  );
}
