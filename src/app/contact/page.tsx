import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import ContactForm from "./ContactForm";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/contact");
}

export default function ContactPage() {
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/contact" />
      <div className={styles.content}>
        <ContactForm />
      </div>
    </CoastalPageShell>
  );
}
