// app/conferences/[year]/[slug]/ConferenceDetailPage.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import Card from "@/components/page/card";
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
    <main className="max-w-6xl mx-auto px-5 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Banner with two-column layout */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          {/* Left: Title and Breadcrumb */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {conf.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted">
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

          {/* Right: Metadata */}
          <div className="grid grid-cols-3 gap-6 md:min-w-[500px]">
            {dateRange && (
              <div>
                <div className="text-sm font-semibold text-muted mb-1">
                  Dates
                </div>
                <div className="text-[color:var(--color-ink)] text-sm">
                  {dateRange}
                </div>
              </div>
            )}

            {conf.city && (
              <div>
                <div className="text-sm font-semibold text-muted mb-1">
                  City
                </div>
                <div className="text-[color:var(--color-ink)] text-sm">
                  {conf.city}
                </div>
              </div>
            )}

            {conf.venue && (
              <div>
                <div className="text-sm font-semibold text-muted mb-1">
                  Venue
                </div>
                <div className="text-[color:var(--color-ink)] text-sm">
                  {conf.venue}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Single Card with all content */}
      <Card size="page-full" className="overflow-hidden">
        {/* Image */}
        {conf.coverImage && (
          <div className="relative w-full aspect-[16/9] bg-white">
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
              <Link
                href={conf.url}
                className="text-accent underline hover:no-underline inline-flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Official Website
                <svg
                  className="w-4 h-4"
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
              </Link>
            </div>
          )}

          {/* About Section */}
          {conf.summary && (
            <>
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="leading-relaxed text-[color:var(--color-ink)] whitespace-pre-line mb-6">
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
                  className="inline-block rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs"
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
        <Card size="page-full" className="mt-6">
          <h2 className="text-xl font-bold mb-4">Talks & Resources</h2>
          <ul className="space-y-2">
            {conf.talkLinks.map((talk, i) => (
              <li key={i}>
                <Link
                  className="text-accent underline hover:no-underline inline-flex items-center gap-2"
                  href={talk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {talk.label}
                  <svg
                    className="w-4 h-4"
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
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}
