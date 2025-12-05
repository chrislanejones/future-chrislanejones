"use client";
import { motion } from "framer-motion";
import { TwoColumnCard } from "@/components/page/two-column-card";
import { Button } from "@/components/ui/button";
import { siteHistorySections } from "@/data/site-history-data";

export default function SiteHistoryPage() {
  return (
    <div className="space-y-8">
      {/* Dynamic sections from data */}
      {siteHistorySections.map((section, index) => (
        <div key={section.title} className="space-y-4">
          <TwoColumnCard
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
                  {paragraph}
                </p>
              ))}

              {/* Links section if available */}
              {section.links && section.links.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="mt-4 pt-4 border-t border-[color:var(--color-border)]"
                >
                  <h3 className="text-sm font-semibold text-[color:var(--color-ink)] mb-3">
                    Related Links
                  </h3>
                  <div className="space-y-2">
                    {section.links.map((link) => (
                      <Button
                        key={link.url}
                        variant="base"
                        asChild
                        className="w-full"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full gap-2"
                        >
                          <span className="truncate">{link.label}</span>
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </TwoColumnCard>
        </div>
      ))}
    </div>
  );
}
