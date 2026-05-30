// src/app/blog/[slug]/page.tsx
import { type Metadata } from "next";
import { notFound } from "next/navigation";
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
    if (!post) {
      // Unpublished or missing posts must not be indexed.
      return {
        title: "Post Not Found | Chris Lane Jones",
        robots: { index: false, follow: false },
      };
    }
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
  // Fetch on the server so the post content is in the initial HTML (crawlable)
  // and missing/unpublished posts return a real 404 instead of a soft 404.
  const post = await convex.query(api.blogPosts.getPostBySlug, { slug });
  if (!post) notFound();

  const url = `https://www.chrislanejones.com/blog/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.createdAt).toISOString(),
    ...(post.coverImage && { image: post.coverImage }),
    ...(post.tags && post.tags.length > 0 && { keywords: post.tags.join(", ") }),
    author: {
      "@type": "Person",
      name: "Chris Lane Jones",
      url: "https://www.chrislanejones.com",
    },
    publisher: {
      "@type": "Person",
      name: "Chris Lane Jones",
      url: "https://www.chrislanejones.com",
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.chrislanejones.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.chrislanejones.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostPage params={{ slug }} initialPost={post} />
    </>
  );
}
