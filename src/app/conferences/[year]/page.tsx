import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import { getConferences } from "@/lib/conferences-server";
import { conferenceYears } from "@/lib/conferences";
import ConferenceYearPage from "./ConferenceYearPage";

export const revalidate = 60;
export async function generateStaticParams() {
  return conferenceYears(await getConferences()).map((year) => ({ year: String(year) }));
}
export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const conferences = (await getConferences()).filter((conference) => String(conference.year) === year);
  if (!conferences.length) notFound();
  return {
    title: `Conferences ${year}`,
    alternates: { canonical: `https://www.chrislanejones.com/conferences/${year}` },
    description: `${conferences.length} conferences attended in ${year}: ${conferences.map((conference) => conference.name).join(", ")}.`,
  };
}
export default async function ConferencesByYearRoute({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const conferences = await getConferences();
  if (!conferences.some((conference) => String(conference.year) === year)) notFound();
  return <CoastalPageShell><ConferenceYearPage conferences={conferences} year={year} /></CoastalPageShell>;
}
