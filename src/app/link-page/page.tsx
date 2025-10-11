import LinkGrid from "./LinkGrid";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  const metadata = await getPageSEO("/link-page");
  console.log("Link page metadata:", metadata);
  return metadata;
}

export default function LinksPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-base)" }}
    >
      <div className="py-8 px-4">
        <main className="max-w-md mx-auto bg-base">
          <LinkGrid />
        </main>
      </div>
    </div>
  );
}
