"use client";

import Card from "../page/card";
import MiniCard from "../page/mini-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { StickyNote } from "lucide-react";

interface BlogboxProps {
  size?:
    | "small"
    | "medium"
    | "large"
    | "wide"
    | "hero"
    | "full"
    | "page-full"
    | "page-half"
    | "page-third";
  delay?: number;
}

export default function Blogbox({ size = "large", delay = 0.3 }: BlogboxProps) {
  const posts = useQuery(api.blogPosts.getAllPosts);

  // Get the last 3 posts
  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <Card
      size={size}
      padding="none"
      shadow="soft"
      border="thin"
      delay={delay}
      className="overflow-hidden flex flex-col"
    >
      <div className="relative flex-1 min-h-[200px] p-6">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="neutral"
            size="icon"
            round
            aria-label="View all blog posts"
            asChild
          >
            <Link href="/blog">
              <StickyNote size={20} className="text-ink" />
            </Link>
          </Button>
        </div>

        <h3 className="text-ink tracking-tight mb-4">Latest Blog Posts</h3>

        <div className="space-y-3">
          {!posts ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-ink text-center py-8">
              No blog posts yet. Check back soon!
            </p>
          ) : (
            recentPosts.map((post) => (
              <MiniCard
                key={post._id}
                title={post.title}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                slug={post.slug}
                createdAt={post.createdAt}
              />
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
