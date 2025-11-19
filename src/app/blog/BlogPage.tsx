// src/app/blog/BlogPage.tsx
"use client";

import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { Calendar, Heart, ArrowRight } from "lucide-react";
import { FoldedImage } from "@/components/page/folded-image";

// Helper function to get badge color variant based on index
const getBadgeVariant = (index: number) => {
  const variants = [
    "blue",
    "green",
    "purple",
    "orange",
    "pink",
    "cyan",
    "yellow",
    "red",
  ] as const;
  return variants[index % variants.length];
};

export default function BlogPage() {
  const posts = useQuery(api.blogPosts.getAllPosts);

  if (!posts) {
    return (
      <div className="site-container py-12">
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="site-container py-12">
      {posts.length === 0 ? (
        <Card size="page-full" className="text-center">
          <p className="p text-ink">No blog posts yet. Check back soon!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <Card
              size="page-third"
              delay={0.1 + index * 0.05}
              className="overflow-hidden flex flex-col"
            >
              {post.coverImage && (
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative w-full aspect-[16/9] bg-white/5">
                    <FoldedImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      showHorizontalFold={true}
                    />
                  </div>
                </Link>
              )}

              <div className="flex-1 p-6 flex flex-col">
                <Link
                  href={`/blog/${post.slug}`}
                  className="nav-link inline-block mb-2"
                >
                  <h3 className="text-ink tracking-tight line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-4 text-ink mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={new Date(post.createdAt).toISOString()}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.likesCount || 0}</span>
                  </div>
                </div>

                <p className="text-ink mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={tag} variant={getBadgeVariant(index)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-auto">
                  <Button
                    asChild
                    variant="neutral"
                    size="sm"
                    className="w-full"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
