// src/app/blog/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConvexBanner from "@/components/page/ConvexBanner";
import BlogPage from "./BlogPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/blog");
}

export default function Page() {
  return (
    <>
      <Header />
      <ConvexBanner path="/blog" />
      <main>
        <BlogPage />
      </main>
      <Footer />
    </>
  );
}
