// app/conferences/[year]/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConferenceDetailPage from "./ConferenceDetailPage";
import { conferences } from "@/data/conferences";

export function generateStaticParams() {
  return conferences.map((c) => ({ year: String(c.year), slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}): Promise<Metadata> {
  const { year, slug } = await params;
  const conf = conferences.find(
    (c) => String(c.year) === year && c.slug === slug
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

export default async function ConferenceDetailRoute({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const conf = conferences.find(
    (c) => String(c.year) === year && c.slug === slug
  );
  if (!conf) notFound();

  return (
    <>
      <Header />
      <ConferenceDetailPage conference={conf} />
      <Footer />
    </>
  );
}
