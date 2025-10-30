// src/app/blog/page.tsx
"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Heart, MessageCircle, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = useQuery(api.blogPosts.getAllPosts);

  if (!posts) {
    return (
      <div className="min-h-screen bg-base">
        <Header />
        <main className="site-container py-12">
          <Banner
            title="Blog"
            breadcrumbPage="Blog"
            description="Thoughts on web development, React, WordPress, and building things on the internet."
          />
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      <Header />
      <main className="site-container py-12">
        <Banner
          title="Blog"
          breadcrumbPage="Blog"
          description="Thoughts on web development, React, WordPress, and building things on the internet."
        />

        {posts.length === 0 ? (
          <Card size="page-full" className="text-center py-12">
            <p className="text-muted">No blog posts yet. Check back soon!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Card
                key={post._id}
                size="page-third"
                delay={0.1 + index * 0.05}
                className="overflow-hidden flex flex-col"
              >
                {post.coverImage && (
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

                <div className="flex-1 p-6 flex flex-col">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    {post.title}
                  </h2>

                  <div className="flex items-center gap-4 text-xs text-muted mb-3">
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

                  <p className="text-sm text-muted mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto">
                    <Button asChild variant="default" size="sm" className="w-full">
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
      </main>
      <Footer />
    </div>
  );
}
