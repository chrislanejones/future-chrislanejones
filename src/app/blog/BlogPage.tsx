"use client";

import { useState } from "react";
import type { Doc } from "../../../convex/_generated/dataModel";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import styles from "@/components/coastal/interior.module.css";
import { Button } from "@/components/ui/button";

// Initial posts and article links stay server-rendered; search enhances the list.
export default function BlogPage({ posts }: { posts: Doc<"blogPosts">[] }) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filtered = posts.filter((post) =>
    [post.title, post.excerpt, ...(post.tags ?? [])]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
  return (
    <>
      <div className={styles.toolbar}>
        <p aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        </p>
        <label className={styles.search}>
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search articles</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search articles or topics"
          />
        </label>
      </div>
      {filtered.length ? (
        <div className={styles.postGrid}>
          {filtered.map((post) => (
            <article key={post._id} className={styles.post}>
              {post.coverImage && (
                <Link
                  href={`/blog/${post.slug}`}
                  className={styles.postMedia}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 90vw, 50vw"
                  />
                </Link>
              )}
              <div className={styles.meta}>
                <time dateTime={new Date(post.createdAt).toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
                <span>{post.likesCount ?? 0} likes</span>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              {!!post.tags?.length && (
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
              <Link
                className={styles.textLink}
                href={`/blog/${post.slug}`}
                aria-label={`Read ${post.title}`}
              >
                Read article <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>{posts.length ? "No matching articles" : "No articles yet"}</h2>
          <p>
            {posts.length
              ? "Try another title or topic."
              : "New writing will appear here."}
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
