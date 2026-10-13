import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import SiteMapPage from "./SiteMapPage";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/site-map");
}

export default function SiteMap() {
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/site-map" />
      <div className={styles.content}>
        <SiteMapPage />
      </div>
    </CoastalPageShell>
  );
}
