import { CoastalPageShell } from "@/components/coastal/page-shell";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import AboutPage from "@/app/about/AboutPage";
import { getPageSEO } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/about");
}

export default function About() {
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/about" />
      <AboutPage />
    </CoastalPageShell>
  );
}
