"use client";

import Image from "next/image";
import Card from "@/components/page/card";

type Showcase = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

const sections: Showcase[] = [
  {
    title: "Dashboard Overview",
    description:
      "A 12-tab admin built on Convex for live, type-safe edits. Sidebar navigation, sticky sub-sections, and toast notifications throughout. Auth gated by Clerk.",
    image: "/admin-showcase/dashboard.webp",
    alt: "Admin dashboard overview showing the sidebar of 12 tabs",
  },
  {
    title: "SEO & Title Manager",
    description:
      "Edit per-page meta titles, descriptions, canonical URLs, and OG images. Live SEO score with validation feedback. Powers the metadata returned by every Next.js generateMetadata call.",
    image: "/admin-showcase/seo-manager.webp",
    alt: "SEO and Title Manager tab editing a page's metadata",
  },
  {
    title: "Pages & Menu",
    description:
      "Reorder header and footer navigation, edit page banners, and update breadcrumb labels — all reflected on the public site within seconds via Convex live queries.",
    image: "/admin-showcase/pages-menu.webp",
    alt: "Pages and Menu tab with drag-to-reorder navigation",
  },
  {
    title: "Settings — Profile, Data, Redirects, Site Health",
    description:
      "Bio and avatar editing, a reseed runner for every Convex table (Profile / SEO / Page Headers / Projects / Clients / Blog Posts / Navigation / Conferences / Browser Links / Career Timeline), a CRUD UI for runtime redirects served by middleware, and a quick-view of sitemap + robots.txt.",
    image: "/admin-showcase/settings.webp",
    alt: "Settings tab showing the Profile, Data Management, Redirects, and Site Health sections",
  },
  {
    title: "Media Manager",
    description:
      "UploadThing-backed asset library. Drag-and-drop uploads, preview, copy URL, and delete. Used by Projects, Conferences, and Blog Posts tabs.",
    image: "/admin-showcase/media-manager.webp",
    alt: "Media Manager tab with thumbnail grid of uploaded assets",
  },
  {
    title: "Content Tabs — Projects, Clients, Career, Conferences",
    description:
      "Headless-CMS-style editors for everything that's not a static page: app projects, website portfolio, client logos, career timeline entries, and conference notes by year.",
    image: "/admin-showcase/content-tabs.webp",
    alt: "Projects tab showing the card-based editor for app and website projects",
  },
];

export default function AdminShowcasePage() {
  return (
    <div className="site-container py-12 space-y-12">
      <Card size="full" delay={0.05}>
        <div className="p-2 max-w-3xl space-y-4">
          <h2 className="text-ink">A Convex-backed admin for this site</h2>
          <p className="text-muted leading-relaxed">
            This portfolio is a Next.js app on Vercel with a custom admin
            powered by Convex for the database and Clerk for auth.
            Everything content-shaped — page headers, SEO metadata, projects,
            clients, blog posts, conferences, navigation, redirects — is
            editable from the dashboard and reflected live without a redeploy.
            The admin route itself is gated and hidden from the public footer.
          </p>
          <p className="text-muted leading-relaxed">
            Screenshots below show each major area.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8">
        {sections.map((section, index) => (
          <Card key={section.title} size="full" delay={0.1 + index * 0.05}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-2">
              <div className="relative w-full aspect-video bg-white/5 rounded-xl overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center space-y-3">
                <h3 className="text-ink">{section.title}</h3>
                <p className="text-muted leading-relaxed">
                  {section.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
