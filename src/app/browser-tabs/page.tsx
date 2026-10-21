import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import BrowserTabs from "./BrowserTabs";
import { getPageSEO } from "@/lib/seo";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/browser-tabs");
}

export default async function BrowserTabsPage() {
  // Include the collection in the HTML, then subscribe to live updates on hydration.
  const preloadedLinks = await preloadQuery(api.browserLinks.getAll, {});

  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/browser-tabs" />
      <div className={styles.content}>
        <BrowserTabs preloadedLinks={preloadedLinks} />
      </div>
    </CoastalPageShell>
  );
}
