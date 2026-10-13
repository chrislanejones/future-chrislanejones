import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import CareerPage from "@/app/career-and-resume/CareerPage";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/career-and-resume");
}

export default function Career() {
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/career-and-resume" />
      <div className={styles.content}>
        <CareerPage />
      </div>
    </CoastalPageShell>
  );
}
