// src/app/site-history/page.tsx
import Header from "@/components/layout/Header";
import SiteHistoryPage from "@/app/site-history/SiteHistoryPage";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Site History | Chris Lane Jones — Dev & Hiker",
  description:
    "The evolution of chrislanejones.com - from early WordPress experiments to modern React frameworks, documenting the technical journey and design iterations.",
};

export default function SiteHistory() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <SiteHistoryPage />
      <Footer />
    </div>
  );
}
