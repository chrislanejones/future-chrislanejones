// src/app/blog/[slug]/page.tsx
import { type Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import BlogPostPage from "./BlogPostPage";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const SITE_URL = "https://www.chrislanejones.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await convex.query(api.blogPosts.getPostBySlug, { slug });
    if (!post) return {};
    const canonical = `${SITE_URL}/blog/${slug}`;
    // OG/Twitter cards require ABSOLUTE URLs — social crawlers don't follow
    // site-relative paths. Prefix the domain when coverImage is a /path.
    const ogImage = post.coverImage
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : `${SITE_URL}${post.coverImage.startsWith("/") ? "" : "/"}${post.coverImage}`
      : null;
    const images = ogImage ? [{ url: ogImage, alt: post.title }] : undefined;
    return {
      title: `${post.title} | Chris Lane Jones`,
      description: post.excerpt,
      alternates: { canonical },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: canonical,
        type: "article",
        ...(images && { images }),
      },
      twitter: {
        card: images ? "summary_large_image" : "summary",
        title: post.title,
        description: post.excerpt,
        ...(images && { images }),
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
