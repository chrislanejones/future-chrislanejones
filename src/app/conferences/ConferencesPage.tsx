"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { conferences, type Conference } from "@/data/conferences";

export default function ConferencesPage() {
  // Get unique years and sort them (newest first)
  const availableYears = [...new Set(conferences.map((c) => c.year))].sort(
    (a, b) => b - a
  );

  return (
    <>
      {/* Year Filter Tabs */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList variant="pills">
          <TabsTrigger variant="pills" value="all">
            All
          </TabsTrigger>
          {availableYears.map((year) => (
            <TabsTrigger key={year} variant="pills" value={String(year)}>
              {year}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Years Tab */}
        <TabsContent value="all" className="mt-8">
          <ConferenceGrid
            conferences={conferences.sort((a, b) => b.year - a.year)}
          />
        </TabsContent>

        {/* Individual Year Tabs */}
        {availableYears.map((year) => (
          <TabsContent key={year} value={String(year)} className="mt-8">
            <ConferenceGrid
              conferences={conferences
                .filter((c) => c.year === year)
                .sort((a, b) => a.name.localeCompare(b.name))}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

// Separate component for the conference grid with proper typing
function ConferenceGrid({ conferences }: { conferences: Conference[] }) {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Conferences grid"
    >
      {conferences.map((c, i) => (
        <Card
          key={`${c.year}-${c.slug}`}
          size="small"
          hover="lift"
          border="standard"
          shadow="soft"
          height="large"
          delay={0.05 + i * 0.05}
          className="overflow-hidden"
        >
          <div className="group flex h-full flex-col">
            {/* Conference Logo */}
            <div className="relative w-full aspect-[16/9] bg-white/5">
              {c.coverImage && (
                <Link
                  href={`/conferences/${c.year}/${c.slug}`}
                  className="block"
                >
                  <div className="relative w-full aspect-[16/9] bg-white/5">
                    <Image
                      src={c.coverImage}
                      alt={`${c.name} ${c.year}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={i < 3}
                    />
                  </div>
                </Link>
              )}
            </div>

            {/* Conference Info */}
            <div className="flex-1 p-5 flex flex-col">
              {/* Title with bottom margin */}
              <Link
                href={`/conferences/${c.year}/${c.slug}`}
                className="nav-link inline-block mb-2"
              >
                <h2 className="text-ink tracking-tight text-left">
                  {c.name} {c.year}
                </h2>
              </Link>

              {/* Location with increased top margin */}
              <p className="text-ink mt-2">
                {[c.city, c.venue].filter(Boolean).join(" • ")}
              </p>

              {/* Description with more top margin */}
              {c.summary && (
                <p className="text-ink mt-4 line-clamp-3">{c.summary}</p>
              )}

              {/* Button at bottom */}
              <div className="mt-auto pt-6">
                <Button variant="base" asChild className="w-full">
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
  );
}
