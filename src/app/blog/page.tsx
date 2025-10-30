// src/app/blog/page.tsx
import BlogPage from "./BlogPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/blog");
}

export default function Page() {
  return <BlogPage />;
}
