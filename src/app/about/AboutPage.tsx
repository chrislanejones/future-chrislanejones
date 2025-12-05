"use client";
import { motion } from "framer-motion";
import { TwoColumnCard } from "@/components/page/two-column-card";
import ConferenceSliderContent from "@/components/main/conference-slider-content";
import Card from "@/components/page/card";
import { aboutSections } from "@/data/about-data";

function renderDescriptionWithLinks(description: string) {
  // Parse markdown links [text](url) and convert to HTML links
  const parts = description.split(/(\[.*?\]\(.*?\))/g);

  return parts.map((part, index) => {
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const [, text, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-ink hover:text-accent transition-colors underline underline-offset-2"
        >
          {text}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Dynamic sections from data */}
      {aboutSections.map((section, index) => (
        <TwoColumnCard
          key={section.title}
          imagePosition={section.imagePosition}
          image={{
            src: section.image,
            alt: section.imageAlt,
          }}
          size="full"
          height="medium"
          delay={0.1 + index * 0.05}
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-ink tracking-tight">{section.title}</h2>
            {section.description.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-ink leading-relaxed">
                {renderDescriptionWithLinks(paragraph)}
              </p>
            ))}
          </div>
        </TwoColumnCard>
      ))}

      {/* Tech Conferences Attended */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Card size="full">
          <ConferenceSliderContent />
        </Card>
      </motion.div>
    </div>
  );
}
