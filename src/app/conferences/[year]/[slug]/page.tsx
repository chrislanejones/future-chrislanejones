import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConferenceDetailPage from "./ConferenceDetailPage";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}): Promise<Metadata> {
  const { year, slug } = await params;
  const all = await convex.query(api.conferences.getAll, {});
  const conf = all.find((c) => String(c.year) === year && c.slug === slug);
  if (!conf) return {};
  const title = `${conf.name} ${conf.year} — Notes`;
  const description =
    conf.description ??
    `Notes and highlights from ${conf.name} ${conf.year}${conf.city ? ` in ${conf.city}` : ""}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: conf.logo ? [conf.logo] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: conf.logo ? [conf.logo] : undefined,
    },
  };
}

export default async function ConferenceDetailRoute({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const all = await convex.query(api.conferences.getAll, {});
  const conf = all.find((c) => String(c.year) === year && c.slug === slug);
  if (!conf) notFound();

  return (
    <>
      <Header />
      <ConferenceDetailPage conference={conf} />
      <Footer />
    </>
  );
}
