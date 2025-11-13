// src/app/blog/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import BlogPage from "./BlogPage";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO("/blog");
}

export default function Page() {
  return (
    <>
      <Header />
      <Banner
        title="Blog"
        breadcrumbPage="Blog"
        description="Thoughts on web development, React, WordPress, and building things on the internet."
      />
      <main>
        <BlogPage />
      </main>
      <Footer />
    </>
  );
}
