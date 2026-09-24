// Display name for a site path in the admin (Pages & Menu, SEO panel).
// Title-casing the slug gets most right; these are the ones it gets wrong.
const NAMES: Record<string, string> = {
  "/": "Home",
  "/career-and-resume": "Career & Resume",
  "/wordpress-maintenance": "WordPress Maintenance",
  "/logo-page": "About the Logo",
};

export function getPageName(path: string): string {
  return (
    NAMES[path] ??
    path
      .replace(/^\//, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
