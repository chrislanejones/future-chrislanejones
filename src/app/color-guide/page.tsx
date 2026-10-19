import type { Metadata } from "next";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import { SITE_URL } from "@/lib/structured-data";
import { ColorGuide } from "./ColorGuide";

const title = "Color & Type Guide";
const description = "The coastal blue palette, accessible color pairings, typography, and mobile design principles for Chris Lane Jones.";
const url = `${SITE_URL}/color-guide`;

// Its own canonical and og:url; without them the page inherited the home page's.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function ColorGuidePage() {
  return <CoastalPageShell><ColorGuide /></CoastalPageShell>;
}
