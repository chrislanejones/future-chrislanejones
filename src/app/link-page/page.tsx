import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import LinkGrid from "./LinkGrid";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  const metadata = await getPageSEO("/link-page");
  return metadata;
}

export default function LinksPage() {
  return (
    <CoastalPageShell>
      <div className={styles.content}>
        <LinkGrid />
      </div>
    </CoastalPageShell>
  );
}
