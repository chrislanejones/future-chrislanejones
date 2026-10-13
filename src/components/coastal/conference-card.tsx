import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Waves } from "lucide-react";
import { conferenceDates, conferenceHref, type Conference } from "@/lib/conferences";
import styles from "./conferences.module.css";

export function ConferenceCard({ conference, priority = false }: { conference: Conference; priority?: boolean }) {
  return (
    <article className={styles.card}>
      <Link href={conferenceHref(conference)} className={styles.cardLink}>
        <div className={styles.logoStage}>
          {conference.logo ? (
            <Image src={conference.logo} alt={conference.logoAlt ?? `${conference.name} logo`} fill sizes="(max-width: 767px) 80vw, 40vw" className={styles.logo} priority={priority} />
          ) : <Waves size={60} strokeWidth={1} aria-hidden="true" />}
          <span className={styles.openArrow}><ArrowUpRight size={21} aria-hidden="true" /></span>
        </div>
        <div className={styles.cardCopy}>
          <p className={styles.date}>{conferenceDates(conference)}</p>
          <h2>{conference.name}</h2>
          {conference.city && <p className={styles.location}><MapPin size={15} aria-hidden="true" />{conference.city}</p>}
          {conference.description && <p className={styles.summary}>{conference.description}</p>}
          <span className={styles.detailsLink}>Explore the conference <ArrowUpRight size={16} aria-hidden="true" /></span>
        </div>
      </Link>
    </article>
  );
}
