// src/app/blog/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Blog | Chris Lane Jones - Web Development Insights",
  description:
    "Articles about React, Next.js, WordPress, web development, and lessons learned from building modern web applications.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-base">
      <Header />
      <main className="max-w-6xl mx-auto px-5 py-12">
        <Banner
          title="Blog"
          breadcrumbPage="Blog"
          description="Thoughts on web development, React, WordPress, and building things on the internet."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <Card
              key={post.slug}
              size="page-third"
              delay={0.1 + index * 0.05}
              className="overflow-hidden"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col"
              >
                {post.coverImage && (
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

                <div className="flex-1 p-6 flex flex-col">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>

                  <div className="flex items-center gap-4 text-xs text-muted mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted-accent"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <Card size="page-full" className="text-center py-12">
            <p className="text-muted">No blog posts yet. Check back soon!</p>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
