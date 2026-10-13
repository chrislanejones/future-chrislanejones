import { CoastalPageShell } from "@/components/coastal/page-shell";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
import ConferencesPage from "./ConferencesPage";
import { getPageSEO } from "@/lib/seo";
import { getConferences } from "@/lib/conferences-server";

export const revalidate = 60;
export async function generateMetadata() { return getPageSEO("/conferences"); }

export default async function ConferencesRoute() {
  const conferences = await getConferences();
  return (
    <CoastalPageShell>
      <CoastalPageIntro path="/conferences" />
      <ConferencesPage conferences={conferences} />
    </CoastalPageShell>
  );
}
