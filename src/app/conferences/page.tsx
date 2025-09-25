import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConferencesPage from "./ConferencesPage";

export const metadata: Metadata = {
  title: "Conferences Attended | Chris Lane Jones",
  description:
    "A curated log of conferences I’ve attended—dates, cities, summaries, and key takeaways from events like All Things Open, RenderATL, WordCamp, RVAJS, THAT Conference, and Tech Coast Conference.",
};

export default function ConferencesRoute() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <ConferencesPage />
      <Footer />
    </div>
  );
}
