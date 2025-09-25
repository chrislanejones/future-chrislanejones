import LinkGrid from "./LinkGrid";

export default function LinksPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-base)" }}
    >
      <div className="py-8 px-4">
        <div className="max-w-md mx-auto">
          <LinkGrid />
        </div>
      </div>
    </div>
  );
}
