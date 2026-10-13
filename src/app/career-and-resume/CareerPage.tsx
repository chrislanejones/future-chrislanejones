"use client";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Briefcase, Download, MapPin } from "lucide-react";
import GalleryDrawer, {
  type GalleryPhoto,
} from "@/components/page/gallery-drawer";
import { timelineEvents } from "@/data/career-timeline";
import styles from "@/components/coastal/interior.module.css";

const photos: GalleryPhoto[] = [
  {
    src: "/setups/Samsung-49-inch-Odyssey-G9.webp",
    alt: "Samsung 49-inch Odyssey G9 monitor setup",
    description: "Samsung 49-inch Odyssey G9 Gaming Monitor Setup",
  },
  {
    src: "/gallery/FCC-2017-Bold-Bean.webp",
    alt: "Coding at Bold Bean Jacksonville 2017",
    description: "Coding with Friends in Bold Bean Jax 2017",
  },
  {
    src: "/setups/Post-Pandemic-Dual-Monitor-Setup.webp",
    alt: "Post-pandemic dual monitor workstation",
    description: "Post-Pandemic Dual Monitor Setup",
  },
  {
    src: "/setups/Pandemic-Office-Setup-2021.webp",
    alt: "Home office setup during pandemic",
    description: "Pandemic Office Setup 2021",
  },
  {
    src: "/setups/Parents-House-Setup.webp",
    alt: "Temporary setup at parents house",
    description: "Parents House Setup During Transition",
  },
];

export default function CareerPage() {
  const liveEvents = useQuery(api.careerTimeline.getAllEvents);
  const events = liveEvents ?? timelineEvents;
  return (
    <>
      <section
        className={`${styles.split} ${styles.section}`}
        aria-label="Resume and workspaces"
      >
        <div className={styles.gallery}>
          <Image
            src="/setups/Samsung-49-inch-Odyssey-G9.webp"
            alt="My desk with a Samsung Odyssey G9 monitor"
            fill
            sizes="(max-width: 767px) 90vw, 50vw"
            priority
          />
          <div className={styles.galleryCaption}>
            <h2>Behind the screen</h2>
            <GalleryDrawer
              photos={photos}
              title="Setup Photo Gallery"
              description="Workspaces and coding with friends over the years."
            />
          </div>
        </div>
        <div className={styles.panel}>
          <h2>Resume</h2>
          <p>
            October 2026 · Senior Web Engineer, AI Automation & CMS Architect.
            Download my latest experience, technical skills, and projects.
          </p>
          <div className={styles.actions}>
            <a
              className={styles.action}
              href="/career-and-resume/download/pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download aria-hidden="true" /> Resume (PDF)
            </a>
            <a
              className={styles.action}
              href="/career-and-resume/download/docx"
              download
            >
              <Download aria-hidden="true" /> Resume (Word)
            </a>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Career journey</h2>
        <ol className={styles.timeline}>
          {events.map((event, index) => (
            <li key={`${event.year}-${index}`}>
              <time>{event.year}</time>
              <div className={styles.timelineIcon}>
                <Briefcase size={20} aria-hidden="true" />
              </div>
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                {event.location && (
                  <small>
                    <MapPin size={15} aria-hidden="true" />
                    {event.location}
                  </small>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
