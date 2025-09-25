// app/conferences/[year]/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { conferences } from "@/data/conferences";

type Params = { year: string; slug: string };

export function generateStaticParams() {
  return conferences.map((c) => ({ year: String(c.year), slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const conf = conferences.find(
    (c) => String(c.year) === params.year && c.slug === params.slug
  );
  if (!conf) return {};
  const title = `${conf.name} ${conf.year} — Notes`;
  const description =
    conf.summary ??
    `Notes and highlights from ${conf.name} ${conf.year}${
      conf.city ? ` in ${conf.city}` : ""
    }.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: conf.coverImage ? [conf.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: conf.coverImage ? [conf.coverImage] : undefined,
    },
  };
}

export default function ConferenceDetailPage({ params }: { params: Params }) {
  const conf = conferences.find(
    (c) => String(c.year) === params.year && c.slug === params.slug
  );
  if (!conf) notFound();

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
    <div className="min-h-screen bg-base">
      <Header />

      <main className="max-w-6xl mx-auto px-5 pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Banner
          title={`${conf.name} ${conf.year}`}
          breadcrumbPage="Conferences"
          description={conf.summary ?? "Conference notes and highlights."}
        />

        {/* Full-width card inside a 6-col grid; Card size='full' spans all 6 */}
        <section className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
          <Card size="full" className="overflow-hidden">
            {/* Media */}
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

            {/* Details */}
            <div className="p-6 sm:p-8">
              <div className="text-sm text-muted">
                {[dateRange, conf.city, conf.venue].filter(Boolean).join(" • ")}
              </div>

              {conf.url && (
                <div className="mt-2">
                  <Link href={conf.url} className="underline" target="_blank">
                    Official site
                  </Link>
                </div>
              )}

              {conf.summary && (
                <p className="mt-4 leading-relaxed text-[color:var(--color-ink)] whitespace-pre-line">
                  {conf.summary}
                </p>
              )}
            </div>
          </Card>
        </section>

        {/* Pills BELOW the card */}
        {conf.topics?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {conf.topics.map((t) => (
              <span key={t} className="rounded-full border px-3 py-1 text-xs">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* Optional: talks/resources */}
        {conf.talkLinks?.length ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Talks & resources</h2>
            <ul className="list-disc ml-6 space-y-1">
              {conf.talkLinks.map((t, i) => (
                <li key={i}>
                  <Link className="underline" href={t.url} target="_blank">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
