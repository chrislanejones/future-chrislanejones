"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import type { Doc } from "../../../../convex/_generated/dataModel";

type Conference = Doc<"conferences">;

interface ConferenceYearPageProps {
  conferences: Conference[];
  year: string;
}

export default function ConferenceYearPage({
  conferences,
  year,
}: ConferenceYearPageProps) {
  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-16">
        <h1 className="mb-4">Conferences in {year}</h1>
        <div className="flex items-center gap-2 text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/conferences" className="hover:text-foreground">Conferences</Link>
          <span>/</span>
          <span className="text-foreground">{year}</span>
        </div>
      </div>

      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-label="Conferences grid"
      >
        {conferences.map((c, i) => (
          <Card
            key={c._id}
            size="small"
            height="large"
            delay={0.05 + i * 0.05}
            className="overflow-hidden"
          >
            <div className="group flex h-full flex-col">
              <div className="relative w-full aspect-[16/9] bg-white/5">
                {c.logo && (
                  <Image
                    src={c.logo}
                    alt={c.logoAlt ?? `${c.name} ${c.year}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={i < 3}
                  />
                )}
              </div>

              <div className="flex-1 p-5 flex flex-col">
                <h2 className="group-hover:text-accent transition-colors">
                  {c.name}
                </h2>
                <p className="text-muted mt-2">
                  {[c.dateStart, c.city, c.venue].filter(Boolean).join(" • ")}
                </p>

                {c.description && (
                  <p className="mt-3 line-clamp-3">{c.description}</p>
                )}

                {c.tags && c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {c.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full border border-(--color-border) px-2 py-0.5 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {c.tags.length > 3 && (
                      <span className="inline-block rounded-full border border-(--color-border) px-2 py-0.5 text-xs text-muted">
                        +{c.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

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

      {conferences.length === 0 && (
        <Card size="full" className="text-center">
          <p className="text-muted">No conferences found for {year}</p>
          <Link href="/conferences" className="mt-4 inline-block text-accent hover:underline">
            View all conferences
          </Link>
        </Card>
      )}
    </main>
  );
}
