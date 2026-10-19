import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import { getConferences } from "@/lib/conferences-server";
import { conferenceYears } from "@/lib/conferences";
import { DEFAULT_OG_IMAGE, metaDescription } from "@/lib/seo";
import ConferenceYearPage from "./ConferenceYearPage";
import { SITE_URL } from "@/lib/structured-data";

export const revalidate = 60;
export async function generateStaticParams() {
  return conferenceYears(await getConferences()).map((year) => ({ year: String(year) }));
}
export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const conferences = (await getConferences()).filter((conference) => String(conference.year) === year);
  if (!conferences.length) notFound();
  const title = `Conferences ${year}`;
  const url = `${SITE_URL}/conferences/${year}`;
  const description = metaDescription(`${conferences.length} conferences I attended in ${year}: ${conferences.map((conference) => conference.name).join(", ")}. Notes, photos, and what I took home from each.`);
  const images = [DEFAULT_OG_IMAGE];
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
export default async function ConferencesByYearRoute({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const conferences = await getConferences();
  if (!conferences.some((conference) => String(conference.year) === year)) notFound();
  return <CoastalPageShell><ConferenceYearPage conferences={conferences} year={year} /></CoastalPageShell>;
}
