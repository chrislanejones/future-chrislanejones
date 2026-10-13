import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import { getConferences } from "@/lib/conferences-server";
import { conferenceHref } from "@/lib/conferences";
import ConferenceDetailPage from "./ConferenceDetailPage";

type Params = Promise<{ year: string; slug: string }>;
export const revalidate = 60;
export async function generateStaticParams() {
  return (await getConferences()).map((conf) => ({ year: String(conf.year), slug: conf.slug }));
}
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { year, slug } = await params;
  const conf = (await getConferences()).find((item) => String(item.year) === year && item.slug === slug);
  if (!conf) notFound();
  const title = `${conf.name} ${conf.year}`;
  const description = conf.description ?? `${conf.name} ${conf.year}${conf.city ? ` in ${conf.city}` : ""}.`;
  const url = `https://www.chrislanejones.com${conferenceHref(conf)}`;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, images: conf.logo ? [conf.logo] : undefined },
    twitter: { card: "summary_large_image", title, description, images: conf.logo ? [conf.logo] : undefined },
  };
}
export default async function ConferenceDetailRoute({ params }: { params: Params }) {
  const { year, slug } = await params;
  const conferences = await getConferences();
  const conf = conferences.find((item) => String(item.year) === year && item.slug === slug);
  if (!conf) notFound();
  return <CoastalPageShell><ConferenceDetailPage conference={conf} conferences={conferences} /></CoastalPageShell>;
}
