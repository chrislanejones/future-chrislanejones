import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import Link from "next/link";
import { conferences } from "@/data/conferences";

export function generateStaticParams() {
  const years = Array.from(new Set(conferences.map((c) => String(c.year))));
  return years.map((year) => ({ year }));
}

export default function ConferencesByYear({
  params,
}: {
  params: { year: string };
}) {
  const items = conferences
    .filter((c) => String(c.year) === params.year)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-base">
      <Header />

      <main className="max-w-6xl mx-auto px-5 py-12">
        <Banner
          title={`Conferences — ${params.year}`}
          breadcrumbPage="Conferences"
          description={`Events attended in ${params.year}.`}
        />
        <section className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {items.map((c) => (
            <Card key={c.slug} size="large" className="overflow-hidden">
              <Link
                href={`/conferences/${c.year}/${c.slug}`}
                className="group block p-5"
              >
                <h2 className="text-lg font-semibold">
                  {c.name} {c.year}
                </h2>
                <p className="text-sm text-muted">
                  {[c.city, c.venue].filter(Boolean).join(" • ")}
                </p>
              </Link>
            </Card>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
