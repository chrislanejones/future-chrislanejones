// app/conferences/[year]/page.tsx
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConferenceYearPage from "./ConferenceYearPage";
import { conferences } from "@/data/conferences";

export function generateStaticParams() {
  const years = Array.from(new Set(conferences.map((c) => String(c.year))));
  return years.map((year) => ({ year }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const yearConferences = conferences.filter((c) => String(c.year) === year);
  const count = yearConferences.length;

  return {
    title: `Conferences ${year} | Chris Lane Jones`,
    description: `${count} conference${
      count !== 1 ? "s" : ""
    } attended in ${year} - ${yearConferences.map((c) => c.name).join(", ")}`,
  };
}

export default async function ConferencesByYearRoute({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const items = conferences
    .filter((c) => String(c.year) === year)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Header />
      <ConferenceYearPage conferences={items} year={year} />
      <Footer />
    </>
  );
}
