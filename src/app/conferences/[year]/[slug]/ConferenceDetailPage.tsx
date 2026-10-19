import { BeachBanner } from "@/components/coastal/beach-banner";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Waves } from "lucide-react";
import { conferenceDates, conferenceHref, type Conference } from "@/lib/conferences";
import { conferencePhotos } from "@/data/conference-photos";
import { GalleryPanel } from "@/components/coastal/gallery-panel";
import { ConferenceCard } from "@/components/coastal/conference-card";
import { jsonLd } from "@/lib/structured-data";
import coastal from "@/components/coastal/coastal.module.css";
import styles from "@/components/coastal/conferences.module.css";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/structured-data";

function descriptionLinks(text: string) {
  return text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    return link ? <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a> : part;
  });
}

export default function ConferenceDetailPage({ conference: conf, conferences }: { conference: Conference; conferences: Conference[] }) {
  const photos = conferencePhotos[conf.slug] ?? [];
  const isPersonalPhoto = conf.slug === "echo-conference-2013";
  const photoTitle = isPersonalPhoto ? "Me along the way." : "People along the way.";
  const photoDescription = isPersonalPhoto ? "Camera in hand at Echo Conference 2013." : `A few familiar faces from ${conf.name}.`;
  const related = conferences.filter((item) => item.slug !== conf.slug).sort((a, b) =>
    Number(b.name === conf.name) - Number(a.name === conf.name) || Number(b.year === conf.year) - Number(a.year === conf.year),
  ).slice(0, 2);
  const index = conferences.findIndex((item) => item._id === conf._id);
  const newer = conferences[index - 1];
  const older = conferences[index + 1];
  const schema = {
    "@context": "https://schema.org", "@type": "Event",
    name: `${conf.name} ${conf.year}`, description: conf.description,
    startDate: conf.dateStart, endDate: conf.dateEnd,
    image: conf.logo ? (conf.logo.startsWith("/") ? `${SITE_URL}${conf.logo}` : conf.logo) : undefined,
    location: conf.city ? { "@type": "Place", name: conf.venue ?? conf.city, address: conf.city } : undefined,
    url: conf.url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <header className={coastal.pageIntro}>
        <BeachBanner>
          <nav aria-label="Breadcrumb" className={coastal.breadcrumb}>
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/conferences">Conferences</Link><span aria-hidden="true">/</span>
            <Link href={`/conferences/${conf.year}`}>{conf.year}</Link>
          </nav>
          <h1>{conf.name}.</h1>
          <p>{conferenceDates(conf)}{conf.city ? ` · ${conf.city}` : ""}</p>
        </BeachBanner>
      </header>
      <article className={styles.detail}>
        <div className={styles.detailLogo}>
          {conf.logo ? <Image src={conf.logo} alt={conf.logoAlt ?? `${conf.name} logo`} fill sizes="(max-width: 767px) 90vw, 42vw" className={styles.logo} priority /> : <Waves size={100} strokeWidth={1} aria-hidden="true" />}
        </div>
        <div className={styles.detailCopy}>
          <h2>About the conference</h2>
          {conf.description && <div className={styles.description}>{conf.description.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{descriptionLinks(paragraph)}</p>)}</div>}
          <dl className={styles.facts}>
            <div><dt>{conf.dateStart ? "When" : "Year"}</dt><dd>{conferenceDates(conf)}</dd></div>
            {conf.city && <div><dt>Where</dt><dd>{conf.city}</dd></div>}
            {conf.venue && <div><dt>Venue</dt><dd>{conf.venue}</dd></div>}
          </dl>
          {conf.tags?.length ? <ul className={styles.topics} aria-label="Conference topics">{conf.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> : null}
          {conf.url && <Button asChild variant="pill" size="lg"><a href={conf.url} target="_blank" rel="noopener noreferrer">Conference website <ArrowUpRight size={18} aria-hidden="true" /></a></Button>}
        </div>
      </article>
      {photos.length > 0 && (
        <section className={styles.photoSection} aria-labelledby="conference-photos-title">
          <div className={styles.photoHeading}>
            <div><h2 id="conference-photos-title">{photoTitle}</h2><p>{photoDescription}</p></div>
            <GalleryPanel photos={photos} title={isPersonalPhoto ? photoTitle : "Conference photos"} description={isPersonalPhoto ? photoDescription : "People I’ve met along the way."} label="Open conference photo gallery" />
          </div>
          <div className={styles.photos} data-single={photos.length === 1}>
            {photos.map((photo) => (
              <figure key={photo.src}>
                <div className={styles.photo}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 767px) 90vw, 45vw" /></div>
                <figcaption>{photo.description}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {related.length > 0 && <section className={styles.related} aria-labelledby="related-conferences-title">
        <h2 id="related-conferences-title">More from the conference trail.</h2>
        <div className={styles.grid}>{related.map((item) => <ConferenceCard key={item._id} conference={item} />)}</div>
      </section>}
      <nav className={styles.eventNavigation} aria-label="Browse conferences">
        <div>{newer && <Link href={conferenceHref(newer)}><ArrowLeft size={18} aria-hidden="true" /><span><small>Newer event</small>{newer.name} {newer.year}</span></Link>}</div>
        <div>{older && <Link href={conferenceHref(older)}><span><small>Earlier event</small>{older.name} {older.year}</span><ArrowRight size={18} aria-hidden="true" /></Link>}</div>
      </nav>
    </>
  );
}
