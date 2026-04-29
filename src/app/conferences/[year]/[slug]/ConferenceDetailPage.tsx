"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Doc } from "../../../../../convex/_generated/dataModel";

type Conference = Doc<"conferences">;

interface ConferenceDetailPageProps {
  conference: Conference;
}

export default function ConferenceDetailPage({
  conference: conf,
}: ConferenceDetailPageProps) {
  const dateRange = conf.dateEnd
    ? `${conf.dateStart} → ${conf.dateEnd}`
    : conf.dateStart;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${conf.name} ${conf.year}`,
    startDate: conf.dateStart,
    endDate: conf.dateEnd,
    location: conf.city
      ? { "@type": "Place", name: conf.venue ?? conf.city, address: conf.city }
      : undefined,
    url: conf.url,
  };

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="mb-4">{conf.name}</h1>
            <div className="flex items-center gap-2 text-muted">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/conferences" className="hover:text-foreground">Conferences</Link>
              <span>/</span>
              <Link href={`/conferences/${conf.year}`} className="text-foreground hover:text-accent">
                {conf.year}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            {dateRange && (
              <Badge variant="blue" className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted uppercase">Dates</span>
                  <span>{dateRange}</span>
                </div>
              </Badge>
            )}

            <div className="flex flex-wrap gap-3 md:justify-end">
              {conf.city && (
                <Badge variant="green" className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted uppercase">City</span>
                    <span>{conf.city}</span>
                  </div>
                </Badge>
              )}
              {conf.venue && (
                <Badge variant="purple" className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted uppercase">Venue</span>
                    <span>{conf.venue}</span>
                  </div>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Card size="full" className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 h-full">
          {conf.logo && (
            <div className="relative min-h-[300px] md:min-h-full bg-white/5">
              <Image
                src={conf.logo}
                alt={conf.logoAlt ?? `${conf.name} ${conf.year}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          <div className="flex flex-col justify-center p-6 sm:p-8">
            {conf.description && (
              <>
                <h2 className="mb-4">About</h2>
                <p className="leading-relaxed whitespace-pre-line mb-6">
                  {conf.description}
                </p>
              </>
            )}

            {conf.url && (
              <div className="mb-6">
                <Button variant="accent" showExternalIcon asChild>
                  <a href={conf.url} target="_blank" rel="noopener noreferrer">
                    Visit Official Website
                  </a>
                </Button>
              </div>
            )}

            {conf.tags && conf.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-(--color-border)">
                {conf.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full border border-(--color-border) px-3 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </main>
  );
}
