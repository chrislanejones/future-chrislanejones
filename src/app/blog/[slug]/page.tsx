// src/app/blog/[slug]/page.tsx
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import BlogPostPage from "./BlogPostPage";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const SITE_URL = "https://www.chrislanejones.com";

// OG/Twitter cards require ABSOLUTE URLs — social crawlers don't follow
// site-relative paths. Prefix the domain when coverImage is a /path.
function absoluteImage(coverImage?: string): string | null {
  if (!coverImage) return null;
  if (coverImage.startsWith("http")) return coverImage;
  return `${SITE_URL}${coverImage.startsWith("/") ? "" : "/"}${coverImage}`;
}

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
    const ogImage = absoluteImage(post.coverImage);
    const images = ogImage ? [{ url: ogImage, alt: post.title }] : undefined;
    return {
      title: post.title,
      description: post.excerpt,
      alternates: { canonical },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: canonical,
        type: "article",
        publishedTime: new Date(post.createdAt).toISOString(),
        modifiedTime: new Date(post.updatedAt).toISOString(),
        authors: ["Chris Lane Jones"],
        ...(post.tags && { tags: post.tags }),
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
  // getPostBySlug only returns published posts, so this 404s unpublished/missing
  // slugs with a real 404 status instead of a soft-404 (HTTP 200 "Not Found").
  const post = await convex.query(api.blogPosts.getPostBySlug, { slug });
  if (!post) notFound();

  const ogImage = absoluteImage(post.coverImage);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    ...(ogImage && { image: ogImage }),
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: "Chris Lane Jones",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Chris Lane Jones",
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    ...(post.tags && post.tags.length > 0 && { keywords: post.tags.join(", ") }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostPage params={{ slug }} />
    </>
  );
}
