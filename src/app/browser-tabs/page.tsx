import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import BrowserTabs from "./BrowserTabs";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/browser-tabs");
}

export default function BrowserTabsPage() {
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/browser-tabs" />
      <div className={styles.content}>
        <BrowserTabs />
      </div>
    </CoastalPageShell>
  );
}
