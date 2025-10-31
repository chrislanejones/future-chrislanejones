// app/conferences/[year]/[slug]/ConferenceDetailPage.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Conference } from "@/data/conferences";

interface ConferenceDetailPageProps {
  conference: Conference;
}

export default function ConferenceDetailPage({
  conference: conf,
}: ConferenceDetailPageProps) {
  const dateRange = conf.dates?.end
    ? `${conf.dates.start} → ${conf.dates.end}`
    : conf.dates?.start;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${conf.name} ${conf.year}`,
    startDate: conf.dates?.start,
    endDate: conf.dates?.end,
    location: conf.city
      ? { "@type": "Place", name: conf.venue ?? conf.city, address: conf.city }
      : undefined,
    url: conf.url,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Banner with title, breadcrumb, and metadata pills */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          {/* Left: Title and Breadcrumb */}
          <div className="flex-1">
            <h1 className="mb-4">
              {conf.name}
            </h1>
            <div className="flex items-center gap-2 text-muted">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href="/conferences" className="hover:text-foreground">
                Conferences
              </Link>
              <span>/</span>
              <Link
                href={`/conferences/${conf.year}`}
                className="text-foreground hover:text-accent"
              >
                {conf.year}
              </Link>
            </div>
          </div>

          {/* Right: Metadata Pills (desktop) / Below title (mobile) */}
          <div className="flex flex-col gap-3 md:items-end">
            {dateRange && (
              <Badge variant="blue" className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted uppercase">
                    Dates
                  </span>
                  <span className="">
                    {dateRange}
                  </span>
                </div>
              </Badge>
            )}

            <div className="flex flex-wrap gap-3 md:justify-end">
              {conf.city && (
                <Badge variant="green" className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted uppercase">
                      City
                    </span>
                    <span className="">
                      {conf.city}
                    </span>
                  </div>
                </Badge>
              )}

              {conf.venue && (
                <Badge variant="purple" className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted uppercase">
                      Venue
                    </span>
                    <span className="">
                      {conf.venue}
                    </span>
                  </div>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Single Card with all content */}
      <Card
        size="page-full"
        padding="none"
        border="standard"
        shadow="soft"
        className="overflow-hidden"
      >
        {/* Image */}
        {conf.coverImage && (
          <div className="relative w-full aspect-[16/9] bg-white/5">
            <Image
              src={conf.coverImage}
              alt={`${conf.name} ${conf.year}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Website Link */}
          {conf.url && (
            <div className="mb-6">
              <Button variant="accent" showExternalIcon asChild>
                <a href={conf.url} target="_blank" rel="noopener noreferrer">
                  Visit Official Website
                </a>
              </Button>
            </div>
          )}

          {/* About Section */}
          {conf.summary && (
            <>
              <h2 className="mb-4">About</h2>
              <p className="leading-relaxed whitespace-pre-line mb-6">
                {conf.summary}
              </p>
            </>
          )}

          {/* Topics pills */}
          {conf.topics && conf.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[color:var(--color-border)]">
              {conf.topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-block rounded-full border border-[color:var(--color-border)] px-3 py-1"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Talks & Resources section */}
      {conf.talkLinks && conf.talkLinks.length > 0 && (
        <Card
          size="page-full"
          padding="large"
          border="standard"
          shadow="soft"
          className="mt-6"
        >
          <h2 className="mb-4">Talks & Resources</h2>
          <ul className="space-y-3">
            {conf.talkLinks.map((talk, i) => (
              <li key={i}>
                <Button variant="outline" showExternalIcon asChild>
                  <a href={talk.url} target="_blank" rel="noopener noreferrer">
                    {talk.label}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}
