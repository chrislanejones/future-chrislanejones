import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import AdminShowcasePage from "./AdminShowcasePage";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/admin-showcase");
}

export default function AdminShowcase() {
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/admin-showcase" />
      <div className={styles.content}>
        <AdminShowcasePage />
      </div>
    </CoastalPageShell>
  );
}
