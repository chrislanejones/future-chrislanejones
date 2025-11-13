import LinkGrid from "./LinkGrid";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  const metadata = await getPageSEO("/link-page");
  console.log("Link page metadata:", metadata);
  return metadata;
}

export default function LinksPage() {
  return (
    <main>
      <LinkGrid />
    </main>
  );
}
