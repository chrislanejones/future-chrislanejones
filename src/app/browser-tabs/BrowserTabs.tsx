"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowUpRight, Search } from "lucide-react";
import styles from "@/components/coastal/interior.module.css";
import { Button } from "@/components/ui/button";

export type BrowserLinkItem = {
  href: string;
  label: string;
  domain: string;
  favicon?: string;
};

/**
 * Site icon: the Convex favicon first, then Google's favicon service for the domain,
 * then a lettered tile if both fail.
 */
function Favicon({ src, domain }: { src?: string; domain: string }) {
  const host = domain.replace(/^www\./, "");
  const sources = [src, `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`].filter(
    (s): s is string => Boolean(s),
  );
  const [attempt, setAttempt] = useState(0);
  if (attempt >= sources.length) {
    return (
      <span className={styles.tabFallback} aria-hidden="true">
        {host.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote icons from many hosts; next/image would need every host allowlisted
    <img
      key={sources[attempt]}
      className={styles.tabFavicon}
      src={sources[attempt]}
      alt=""
      width={20}
      height={20}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setAttempt((a) => a + 1)}
    />
  );
}

export default function BrowserTabs() {
  const links = useQuery(api.browserLinks.getAll);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filtered = (links ?? []).filter((link) =>
    [link.label, link.domain, link.category]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
  const categories = [...new Set(filtered.map((link) => link.category))].sort();
  return (
    <>
      <div className={styles.toolbar}>
        <p aria-live="polite">
          {links === undefined
            ? "Loading saved links…"
            : `${filtered.length} saved links`}
        </p>
        <label className={styles.search}>
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search browser tabs</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a tool, site, or category"
          />
        </label>
      </div>
      {links === undefined ? (
        <div
          className={styles.resourceGrid}
          aria-busy="true"
          aria-label="Loading browser tabs"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.panel} style={{ minHeight: 220 }} />
          ))}
        </div>
      ) : categories.length ? (
        <div className={styles.tabsGrid}>
          {categories.map((category) => (
            <section key={category} className={styles.tabsGroup}>
              <h2>{category}</h2>
              <ul>
                {filtered
                  .filter((link) => link.category === category)
                  .sort((a, b) => a.order - b.order)
                  .map((link) => (
                    <li key={link._id}>
                      <a
                        className={styles.tabLink}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Favicon src={link.favicon} domain={link.domain} />
                        <span>
                          {link.label}
                          <small>{link.domain}</small>
                        </span>
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>{search ? "No matching tabs" : "No saved tabs yet"}</h2>
          <p>
            {search
              ? "Try a different site, tool, or category."
              : "Useful links will appear here."}
          </p>
          {search && (
            <Button variant="pill" onClick={() => setSearch("")}>
              Clear search
            </Button>
          )}
        </div>
      )}
    </>
  );
}
