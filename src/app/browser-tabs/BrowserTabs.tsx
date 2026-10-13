"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowUpRight, Search } from "lucide-react";
import styles from "@/components/coastal/interior.module.css";

export type BrowserLinkItem = {
  href: string;
  label: string;
  domain: string;
  favicon?: string;
};

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
        <div className={styles.resourceGrid}>
          {categories.map((category) => (
            <section key={category} className={styles.resourceGroup}>
              <h2>{category}</h2>
              <ul>
                {filtered
                  .filter((link) => link.category === category)
                  .sort((a, b) => a.order - b.order)
                  .map((link) => (
                    <li key={link._id}>
                      <a
                        className={styles.resourceLink}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
            <button className={styles.action} onClick={() => setSearch("")}>
              Clear search
            </button>
          )}
        </div>
      )}
    </>
  );
}
