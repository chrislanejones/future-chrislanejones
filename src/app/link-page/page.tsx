import LinkGrid from "./LinkGrid";

export const metadata = {
  title: "Social Link Page | Chris Lane Jones — Dev & Hiker",
  description:
    "Social Links - Explore my professional journey, skills, and experiences in software development and beyond.",
};

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
