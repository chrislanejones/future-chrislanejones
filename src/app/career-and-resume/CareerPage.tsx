"use client";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Briefcase, Download, MapPin } from "lucide-react";
import { timelineEvents } from "@/data/career-timeline";
import styles from "@/components/coastal/interior.module.css";

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
            src="/gallery/FCC-2017-Bold-Bean.webp"
            alt="Coding with friends at Bold Bean in Jacksonville, 2017"
            fill
            sizes="(max-width: 767px) 90vw, 50vw"
            priority
          />
          <div className={styles.galleryCaption}>
            <h2>Coding at Bold Bean</h2>
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
