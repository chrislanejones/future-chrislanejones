// src/app/blog/[slug]/page.tsx
import BlogPostPage from "./BlogPostPage";

export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  return <BlogPostPage params={params} />;
}