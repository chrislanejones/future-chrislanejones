import Link from "next/link";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { conferences } from "@/data/conferences";

export default function ConferencesPage() {
  const byYear = [...conferences].sort((a, b) => b.year - a.year);

  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="Conferences"
        breadcrumbPage="Conferences"
        description="Highlights and notes from events I’ve attended—open source, web, and community conferences across the years."
      />

      {/* 3 cards per row: md:grid-cols-6 + Card size='large' (md:col-span-2) */}
      <section
        className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[1fr]"
        aria-label="Conferences grid"
      >
        {byYear.map((c, i) => (
          <Card
            key={`${c.year}-${c.slug}`}
            size="large"
            className="overflow-hidden"
          >
            <Link
              href={`/conferences/${c.year}/${c.slug}`}
              className="group flex h-full flex-col"
            >
              <div className="relative w-full aspect-[16/9]">
                {c.coverImage && (
                  <Image
                    src={c.coverImage}
                    alt={`${c.name} ${c.year}`}
                    fill
                    className="object-contain bg-white/5"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={i < 3}
                  />
                )}
              </div>

              <div className="flex-1 p-5 flex flex-col">
                <h2 className="text-xl font-semibold">
                  {c.name} {c.year}
                </h2>
                <p className="text-sm text-muted mt-1">
                  {[c.city, c.venue].filter(Boolean).join(" • ")}
                </p>
                {c.summary && (
                  <p className="mt-3 text-[color:var(--color-ink)] line-clamp-4">
                    {c.summary}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline-offset-2 group-hover:underline">
                  View notes
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </section>
    </main>
  );
}
