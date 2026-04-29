import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import ConferencesPage from "./ConferencesPage";
import { getPageSEO } from "@/lib/seo";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata() {
  return await getPageSEO("/conferences");
}

export default async function ConferencesRoute() {
  const conferences = await convex.query(api.conferences.getAll, {});

  return (
    <>
      <Header />
      <ConvexBanner path="/conferences" />
      <main id="main-content">
        <ConferencesPage conferences={conferences} />
      </main>
      <Footer />
    </>
  );
}
