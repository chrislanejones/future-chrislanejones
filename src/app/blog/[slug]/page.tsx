// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { Calendar, Clock, User, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { compileMDX } from "next-mdx-remote/rsc";
import { MDXComponents } from "@/components/mdx/MDXComponents";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Chris Lane Jones Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Compile MDX content
  const { content } = await compileMDX({
    source: post.content!,
    components: MDXComponents,
    options: {
      parseFrontmatter: false,
    },
  });

  return (
    <div className="min-h-screen bg-base">
      <Header />
      <main className="max-w-4xl mx-auto px-5 py-12">
        <Banner title={post.title} breadcrumbPage="Blog" />

        <Card size="page-full" className="overflow-hidden">
          {post.coverImage && (
            <div className="relative w-full aspect-[21/9]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime}</span>
                </div>
              )}
            </div>

            {/* MDX Content */}
            <article className="prose prose-lg max-w-none">{content}</article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${tag}`}
                      className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-muted-accent hover:bg-accent hover:text-on-accent transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Back to Blog */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="text-accent hover:text-accent-alt transition-colors"
          >
            ← Back to all posts
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
