import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ConferenceSliderContent from "@/components/main/conference-slider-content";
import { aboutSections } from "@/data/about-data";
import { Reveal } from "@/components/coastal/reveal";
import styles from "@/components/coastal/coastal.module.css";

function renderDescriptionWithLinks(description: string) {
  return description
    .replace(/[\u2013\u2014]/g, "-")
    .split(/(\[.*?\]\(.*?\))/g)
    .map((part, index) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      return match ? (
        <a
          key={index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[1]}
        </a>
      ) : (
        <span key={index}>{part}</span>
      );
    });
}

export default function AboutPage() {
  return (
    <>
      <div className={styles.aboutStories}>
        {aboutSections.map((section, index) => (
          <Reveal
            key={section.title}
            className={index === 0 ? styles.featuredStory : undefined}
          >
            <article className={styles.aboutStory}>
              <div className={styles.aboutPhoto}>
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  fill
                  sizes="(max-width: 767px) 90vw, 50vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  className={index === 1 ? styles.aboutGraphic : undefined}
                />
              </div>
              <div className={styles.aboutCopy}>
                <h2>{section.title}</h2>
                {section.description.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{renderDescriptionWithLinks(paragraph)}</p>
                ))}
                {index === 0 && (
                  <Link href="/career-and-resume" className={styles.textLink}>
                    Career & Resume{" "}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <section
        className={styles.aboutConferences}
        aria-label="Tech Conferences Attended"
      >
        <ConferenceSliderContent />
      </section>
    </>
  );
}
