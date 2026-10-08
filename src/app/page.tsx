import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Waves } from "lucide-react";
import { CoastalHeader, CoastalFooter } from "@/components/coastal/navigation";
import {
  CoastalClients,
  CoastalProjects,
  CoastalJournal,
  CoastalGallery,
  CoastalRamblings,
} from "@/components/coastal/live-content";
import { CoastalMusic } from "@/components/coastal/music-player";
import { CoastalTech } from "@/components/coastal/tech-stack";
import { Reveal } from "@/components/coastal/reveal";
import styles from "@/components/coastal/coastal.module.css";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;
export async function generateMetadata() {
  return await getPageSEO("/");
}

export default function Home() {
  return (
    <div className={styles.coastalPage}>
      <CoastalHeader />
      <main id="main-content" tabIndex={-1}>
        <section
          className={`${styles.container} ${styles.hero}`}
          aria-labelledby="hero-title"
        >
          <Image
            src="/gallery/Florida-Coast-Aerial.webp"
            alt="An aerial view of the Florida coast, with a sandy beach beside the Atlantic Ocean"
            fill
            sizes="(max-width: 1440px) 100vw, 1400px"
            loading="eager"
            fetchPriority="high"
            className={styles.heroImage}
          />
          <div className={styles.heroShade} />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>
              React, TypeScript & Rust/WebAssembly
            </p>
            <h1 id="hero-title">
              Senior web
              <br />
              <span>engineer.</span>
            </h1>
            <p className={styles.heroDescription}>
              I consult, design, and develop web interfaces for businesses and
              government agencies.
            </p>
            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.primaryButton}>
                Contact Me <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <a href="#selected-work" className={styles.heroWorkLink}>
                Explore my work <ArrowDownRight size={19} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        <div className={styles.container}>
          <CoastalClients />
        </div>
        <section
          id="selected-work"
          className={`${styles.container} ${styles.workSection}`}
          aria-labelledby="work-title"
        >
          <Reveal className={styles.sectionHeading}>
            <h2 id="work-title">A few things I’ve built.</h2>
            <p className={styles.sectionDescription}>
              Image editing, web crawling, and tools for developers.
            </p>
            <Link href="/projects" className={styles.textLink}>
              View All Projects <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
          <CoastalProjects />
        </section>
        <section
          className={`${styles.container} ${styles.offlineSection}`}
          aria-labelledby="offline-title"
        >
          <Reveal className={styles.sectionHeading}>
            <h2 id="offline-title">Beyond the browser.</h2>
            <p className={styles.sectionDescription}>
              My ramblings, latest blog posts, music, and conference fan shots.
            </p>
          </Reveal>
          <div className={styles.personalGrid}>
            <Reveal className={styles.ramblingsSlot}>
              <CoastalRamblings />
            </Reveal>
            <Reveal className={styles.musicSlot} delay={0.05}>
              <CoastalMusic />
            </Reveal>
            <Reveal className={styles.journalSlot} delay={0.1}>
              <CoastalJournal />
            </Reveal>
            <Reveal className={styles.gallerySlot} delay={0.15}>
              <CoastalGallery />
            </Reveal>
          </div>
        </section>
        <CoastalTech />
        <section
          className={`${styles.container} ${styles.contactSection}`}
          aria-labelledby="coast-title"
        >
          <Reveal>
            <Waves size={44} strokeWidth={1.3} aria-hidden="true" />
            <h2 id="coast-title">
              From mountains
              <br />
              to beaches.
            </h2>
            <p>
              After eight years in Virginia, we hit undo and traded mountains
              for beaches. We are back in Florida as of 2026.
            </p>
            <Link href="/about" className={styles.primaryButton}>
              More about me <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </Reveal>
        </section>
      </main>
      <CoastalFooter />
    </div>
  );
}
