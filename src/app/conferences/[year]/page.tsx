import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConferenceYearPage from "./ConferenceYearPage";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
    title: `Conferences ${year} | Chris Lane Jones`,
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

  return (
    <>
      <Header />
      <ConferenceYearPage conferences={items} year={year} />
      <Footer />
    </>
  );
}
