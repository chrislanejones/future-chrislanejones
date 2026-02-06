// src/app/blog/[slug]/page.tsx
import BlogPostPage from "./BlogPostPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Add this line to await params
  return <BlogPostPage params={{ slug }} />;
}
