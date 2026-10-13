import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import LogoPage from "./LogoPage";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/logo-page");
}

export default function Logo() {
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/logo-page" />
      <div className={styles.content}>
        <LogoPage />
      </div>
    </CoastalPageShell>
  );
}
