import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConferenceYearPage from "./ConferenceYearPage";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const revalidate = 60;

// Prerender every known year at build time; new ones still render on
// demand (dynamicParams defaults to true) and then cache via ISR.
export async function generateStaticParams() {
  const all = await convex.query(api.conferences.getAll, {});
  return [...new Set(all.map((c) => String(c.year)))].map((year) => ({ year }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const all = await convex.query(api.conferences.getAll, {});
  const yearConfs = all.filter((c) => String(c.year) === year);
  const count = yearConfs.length;
  return {
    title: `Conferences ${year}`,
    alternates: { canonical: `https://www.chrislanejones.com/conferences/${year}` },
    description: `${count} conference${count !== 1 ? "s" : ""} attended in ${year}${count > 0 ? ` — ${yearConfs.map((c) => c.name).join(", ")}` : ""}`,
  };
}

export default async function ConferencesByYearRoute({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const all = await convex.query(api.conferences.getAll, {});
  const items = all
    .filter((c) => String(c.year) === year)
    .sort((a, b) => a.name.localeCompare(b.name));
  // A year with no conferences isn't a page. Real 404, not an empty list.
  if (items.length === 0) notFound();

  return (
    <>
      <Header />
      <ConferenceYearPage conferences={items} year={year} />
      <Footer />
    </>
  );
}
