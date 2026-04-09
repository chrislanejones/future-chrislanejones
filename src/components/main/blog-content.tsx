// src/components/main/blog-content.tsx
"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogContent() {
  const posts = useQuery(api.blogPosts.getAllPosts);
  const sortedPosts = [...(posts || [])].sort((a, b) => b.createdAt - a.createdAt);
  const recentPosts = sortedPosts.slice(0, 2);

  const getDaysAgo = (timestamp: number): string => {
    const now = Date.now();
    const diffInMs = now - timestamp;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Blog Posts Container */}
      <div className="flex-1 flex flex-col justify-between gap-4 p-3">
          {recentPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col items-center justify-center flex-1 transition-all duration-300 opacity-90 hover:opacity-100 bg-(--color-inner-card) rounded-lg p-4 border border-transparent hover:border-(--color-accent) hover:shadow-glow w-full min-h-0"
            >
              <div className="flex-1 flex items-center justify-center text-center">
                <h4 className="text-ink group-hover:text-accent transition-colors">
                  {post.title}
                </h4>
              </div>
              <p className="text-muted mt-2 text-sm">
                created {getDaysAgo(post.createdAt)}
              </p>
            </Link>
          ))}
        </div>

      {/* Footer */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <h3 className="text-ink tracking-tight">Latest Blog Posts</h3>
        <Button
          variant="neutral"
          size="icon"
          round
          aria-label="View all blog posts"
          asChild
        >
          <Link href="/blog">
            <Newspaper className="w-5 h-5 text-ink" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
