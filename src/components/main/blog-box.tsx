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
  const recentPosts = posts?.slice(0, 2) || [];

  return (
    <Card
      size={size}
      padding="none"
      shadow="soft"
      border="thin"
      delay={delay}
      className="overflow-hidden flex flex-col"
    >
      <div className="relative flex-1 min-h-[200px]">
        {/* Top center: Blog posts */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {!posts ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-ink text-center py-8">
              No blog posts yet. Check back soon!
            </p>
          ) : (
            <div className="flex flex-col gap-3 items-stretch w-full max-w-2xl">
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
            </div>
          )}
        </div>

        {/* Bottom row: Title left, Button right */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <h3 className="text-ink tracking-tight">Latest Blog Posts</h3>
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
      </div>
    </Card>
  );
}
