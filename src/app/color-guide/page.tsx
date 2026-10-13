import type { Metadata } from "next";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import { ColorGuide } from "./ColorGuide";

export const metadata: Metadata = {
  title: "Color & Type Guide",
  description: "The coastal blue palette, accessible color pairings, typography, and mobile design principles for Chris Lane Jones.",
};

export default function ColorGuidePage() {
  return <CoastalPageShell><ColorGuide /></CoastalPageShell>;
}
