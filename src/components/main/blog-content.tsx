"use client";

import MiniCard from "@/components/page/mini-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { Newspaper } from "lucide-react";

export default function BlogContent() {
  const posts = useQuery(api.blogPosts.getAllPosts);
  const recentPosts = posts?.slice(0, 2) || [];

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 min-h-[100px]">
        <div className="absolute inset-0 flex flex-col items-center justify-evenly gap-4 p-3">
          {!posts ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-ink text-center py-8">
              No blog posts yet. Check back soon!
            </p>
          ) : (
            <>
              {recentPosts.map((post) => (
                <MiniCard
                  key={post._id}
                  title={post.title}
                  excerpt={post.excerpt}
                  coverImage={post.coverImage}
                  slug={post.slug}
                  createdAt={post.createdAt}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="p-2 flex items-center justify-between">
        <h3 className="text-ink tracking-tight">Latest Blog Posts</h3>
        <Button
          variant="neutral"
          size="icon"
          round
          aria-label="View all blog posts"
          asChild
        >
          <Link href="/blog">
            <Newspaper size={20} className="text-ink" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
