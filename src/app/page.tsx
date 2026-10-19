import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { CoastalHeader, CoastalFooter } from "@/components/coastal/navigation";
import {
  CoastalClients,
  CoastalProjects,
  CoastalLatestPosts,
  CoastalGallery,
  CoastalRamblings,
} from "@/components/coastal/live-content";
import { CoastalMusic } from "@/components/coastal/music-player";
import { CoastalTech } from "@/components/coastal/tech-stack";
import { Reveal } from "@/components/coastal/reveal";
import { CoastFloor } from "@/components/coastal/coast-floor";
import { SandcastleBuilder } from "@/components/coastal/sandcastle-builder";
import { HeroPhoto } from "@/components/coastal/hero-photo";
import styles from "@/components/coastal/coastal.module.css";
import { getPageSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const revalidate = 60;
export async function generateMetadata() {
  return await getPageSEO("/");
}

export default function Home() {
  return (
    <div className={styles.coastalPage} data-coastal-theme data-coastal-page>
      <CoastalHeader />
      <main id="main-content" tabIndex={-1}>
        <section
          className={`${styles.container} ${styles.hero}`}
          aria-labelledby="hero-title"
        >
          <HeroPhoto />
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
              <Button asChild variant="pill" size="lg">
                <Link href="/contact">
                  Contact Me <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              </Button>
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
          id="beyond-the-browser"
          className={`${styles.container} ${styles.offlineSection}`}
          aria-labelledby="offline-title"
        >
          <CoastFloor />
          <div className={styles.offlineContent}>
            <Reveal className={styles.sectionHeading}>
              <h2 id="offline-title">Beyond the browser.</h2>
              <p className={styles.sectionDescription}>
                Music, my ramblings, and conference photos.
              </p>
            </Reveal>
            <div className={styles.personalGrid}>
              <Reveal className={styles.musicSlot}>
                <CoastalMusic />
              </Reveal>
              <Reveal className={styles.ramblingsSlot} delay={0.05}>
                <CoastalRamblings />
              </Reveal>
              <Reveal className={styles.gallerySlot} delay={0.1}>
                <CoastalGallery />
              </Reveal>
            </div>
          </div>
        </section>
        <section
          id="latest-writing"
          className={`${styles.container} ${styles.writingSection}`}
          aria-labelledby="writing-title"
        >
          <Reveal className={styles.sectionHeading}>
            <h2 id="writing-title">Latest writing.</h2>
            <p className={styles.sectionDescription}>
              Things I learn, build, and occasionally break.
            </p>
            <Link href="/blog" className={styles.textLink}>
              Read the blog <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
          <CoastalLatestPosts />
        </section>
        <CoastalTech />
        <SandcastleBuilder />
      </main>
      <CoastalFooter />
    </div>
  );
}
