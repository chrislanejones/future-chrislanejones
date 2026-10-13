import Link from "next/link";
import { ArrowUpRight, Home, Briefcase, Book, Users } from "lucide-react";
import styles from "@/components/coastal/interior.module.css";

const sitemapSections = [
  {
    title: "Main Pages",
    icon: <Home className="w-5 h-5" />,
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Career", href: "/career-and-resume" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    icon: <Briefcase className="w-5 h-5" />,
    links: [
      { label: "WordPress Maintenance", href: "/wordpress-maintenance" },
      { label: "React Maintenance", href: "/react-maintenance" },
    ],
  },
  {
    title: "Content & Resources",
    icon: <Book className="w-5 h-5" />,
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Admin Showcase", href: "/admin-showcase" },
      { label: "Browser Tabs", href: "/browser-tabs" },
      { label: "Conferences", href: "/conferences" },
      { label: "Site History", href: "/site-history" },
      { label: "About the Logo", href: "/logo-page" },
    ],
  },
  {
    title: "Connect",
    icon: <Users className="w-5 h-5" />,
    links: [
      { label: "Link Page", href: "/link-page" },
      {
        label: "GitHub",
        href: "https://github.com/chrislanejones",
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/chrislanejones/",
        external: true,
      },
      { label: "𝕏 (Twitter)", href: "https://x.com/cljwebdev", external: true },
      {
        label: "BlueSky",
        href: "https://bsky.app/profile/chrislanejones.com",
        external: true,
      },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <>
      <div className={`${styles.split} ${styles.section}`}>
        {sitemapSections.map((section) => (
          <section className={styles.resourceGroup} key={section.title}>
            <h2 className="flex items-center gap-3">
              {section.icon}
              {section.title}
            </h2>
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      className={styles.resourceLink}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link className={styles.resourceLink} href={link.href}>
                      <span>{link.label}</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className={styles.panel}>
        <h2>How this site is built</h2>
        <p>
          Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and React
          Three Fiber, with content managed in Convex and hosting on Vercel.
        </p>
        <div className={styles.actions}>
          <Link className={styles.textLink} href="/site-history">
            Explore the site history{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <a className={styles.textLink} href="/sitemap.xml">
            XML sitemap <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
