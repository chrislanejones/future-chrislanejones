// src/app/blog/page.tsx
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import BlogPage from "./BlogPage";
import { getPageSEO } from "@/lib/seo";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const revalidate = 60;

export async function generateMetadata() {
  return await getPageSEO("/blog");
}

export default async function Page() {
  const posts = await convex.query(api.blogPosts.getAllPosts, {});

  return (
    <>
      <Header />
      <ConvexBanner path="/blog" />
      <main id="main-content">
        <BlogPage posts={posts} />
      </main>
      <Footer />
    </>
  );
}
