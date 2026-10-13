import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import ReactMaintenanceContent from "./ReactMaintenanceContent";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/react-maintenance");
}

export default function ReactMaintenancePage() {
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/react-maintenance" />
      <div className={styles.content}>
        <ReactMaintenanceContent />
      </div>
    </CoastalPageShell>
  );
}
