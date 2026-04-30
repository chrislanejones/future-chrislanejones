// src/app/blog/[slug]/page.tsx
import { type Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import BlogPostPage from "./BlogPostPage";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await convex.query(api.blogPosts.getPostBySlug, { slug });
    if (!post) return {};
    return {
      title: `${post.title} | Chris Lane Jones`,
      description: post.excerpt,
      alternates: {
        canonical: `https://www.chrislanejones.com/blog/${slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `https://www.chrislanejones.com/blog/${slug}`,
        type: "article",
        ...(post.coverImage && { images: [{ url: post.coverImage }] }),
      },
    };
  } catch {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostPage params={{ slug }} />;
}
