import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Layout,
  Search,
  Navigation,
  Settings,
  Images,
  Files,
} from "lucide-react";
import styles from "@/components/coastal/interior.module.css";

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

const icons = [Layout, Search, Navigation, Settings, Images, Files];
// Screenshots are optional: a section shows its image once the file exists in
// public/admin-showcase/ (checked on the server at build/ISR time).
const hasScreenshot = (src: string) => existsSync(path.join(process.cwd(), "public", src));

export default function AdminShowcasePage() {
  return (
    <>
      <section className={`${styles.panel} ${styles.section}`}>
        <h2>A Convex-backed admin for this site</h2>
        <p>
          This portfolio runs on Next.js and Vercel, with a custom Convex admin
          and Clerk authentication. Projects, articles, conferences, navigation,
          and page metadata can be edited from one dashboard.
        </p>
        <div className={styles.actions}>
          <Link
            className={styles.textLink}
            href="/blog/convex-setup-building-the-perfect-backend-for-your-portfolio"
          >
            Read about the backend <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <div className={styles.serviceGrid}>
        {sections.map((section, i) => {
          const Icon = icons[i];
          return (
            <section key={section.title} className={styles.serviceItem}>
              {hasScreenshot(section.image) ? (
                <div className="relative aspect-video mb-4 overflow-hidden rounded-(--radius-media) border border-(--color-border)">
                  <Image src={section.image} alt={`${section.title} in the admin`} fill
                    sizes="(max-width: 767px) 92vw, 45vw" className="object-cover object-top" />
                </div>
              ) : null}
              <Icon size={28} aria-hidden="true" />
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </section>
          );
        })}
      </div>
    </>
  );
}
