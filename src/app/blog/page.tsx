// src/app/blog/page.tsx
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { CoastalPageIntro } from "@/components/coastal/page-intro";
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
    <CoastalPageShell>
      <CoastalPageIntro path="/blog" />
      <div className={styles.content}>
        <BlogPage posts={posts} />
      </div>
    </CoastalPageShell>
  );
}
