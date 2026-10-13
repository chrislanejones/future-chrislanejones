import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siteHistorySections } from "@/data/site-history-data";
import styles from "@/components/coastal/interior.module.css";

export default function SiteHistoryPage() {
  return (
    <div className={styles.history}>
      {siteHistorySections.map((section) => (
        <section key={section.title}>
          <a
            className={styles.historyImage}
            href={section.image}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View full screenshot: ${section.title}`}
          >
            <Image
              src={section.image}
              alt={section.imageAlt}
              fill
              sizes="(max-width: 767px) 90vw, 50vw"
            />
          </a>
          <div>
            <h2>{section.title}</h2>
            {section.description.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {section.links && (
              <div className={styles.actions}>
                {section.links.map((link) => (
                  <a
                    key={link.url}
                    className={styles.textLink}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
