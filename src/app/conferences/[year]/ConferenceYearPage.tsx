// app/conferences/[year]/ConferenceYearPage.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import type { Conference } from "@/data/conferences";

interface ConferenceYearPageProps {
  conferences: Conference[];
  year: string;
}

export default function ConferenceYearPage({
  conferences,
  year,
}: ConferenceYearPageProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Banner */}
      <div className="mb-16">
        <h1 className="mb-4">
          Conferences in {year}
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
          <span className="text-foreground">{year}</span>
        </div>
      </div>

      {/* Conference Grid - Responsive 1/2/3 columns */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-label="Conferences grid"
      >
        {conferences.map((c, i) => (
          <Card
            key={`${c.year}-${c.slug}`}
            size="page-third"
            padding="none"
            hover="lift"
            border="standard"
            shadow="soft"
            height="full"
            delay={0.05 + i * 0.05}
            className="overflow-hidden"
          >
            <div className="group flex h-full flex-col">
              {/* Conference Logo */}
              <div className="relative w-full aspect-[16/9] bg-white/5">
                {c.coverImage && (
                  <Image
                    src={c.coverImage}
                    alt={`${c.name} ${c.year}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={i < 3}
                  />
                )}
              </div>

              {/* Conference Info */}
              <div className="flex-1 p-5 flex flex-col">
                <h2 className="group-hover:text-accent transition-colors">
                  {c.name}
                </h2>
                <p className="text-muted mt-2">
                  {[c.dates?.start, c.city, c.venue]
                    .filter(Boolean)
                    .join(" • ")}
                </p>

                {c.summary && (
                  <p className="mt-3 line-clamp-3">
                    {c.summary}
                  </p>
                )}

                {/* Topics */}
                {c.topics && c.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {c.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="inline-block rounded-full border border-[color:var(--color-border)] px-2 py-0.5"
                      >
                        {topic}
                      </span>
                    ))}
                    {c.topics.length > 3 && (
                      <span className="inline-block rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-muted">
                        +{c.topics.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Button at bottom */}
                <div className="mt-auto pt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/conferences/${c.year}/${c.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Empty State */}
      {conferences.length === 0 && (
        <Card size="page-full" padding="large" className="text-center">
          <p className="text-muted">No conferences found for {year}</p>
          <Link
            href="/conferences"
            className="mt-4 inline-block text-accent hover:underline"
          >
            View all conferences
          </Link>
        </Card>
      )}
    </main>
  );
}
