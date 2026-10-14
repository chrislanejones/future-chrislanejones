"use client";

import { useState } from "react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Search } from "lucide-react";
import { BlogPostCard } from "@/components/coastal/blog-post-card";
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
            <BlogPostCard key={post._id} post={post} />
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
