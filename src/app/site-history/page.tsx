// src/app/site-history/page.tsx
import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import SiteHistoryPage from "@/app/site-history/SiteHistoryPage";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/site-history");
}

export default function SiteHistory() {
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/site-history" />
      <div className={styles.content}>
        <SiteHistoryPage />
      </div>
    </CoastalPageShell>
  );
}
