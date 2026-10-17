import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Doc } from "../../../convex/_generated/dataModel";
import styles from "./interior.module.css";

// The one blog post card: /blog's list and the home page's latest writing.
export function BlogPostCard({
  post,
  heading: Heading = "h2",
  showImage = true,
}: {
  post: Doc<"blogPosts">;
  heading?: "h2" | "h3";
  showImage?: boolean;
}) {
  return (
    <article className={styles.post}>
      {showImage && post.coverImage && (
        <Link
          href={`/blog/${post.slug}`}
          className={styles.postMedia}
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(max-width: 767px) 90vw, 50vw"
          />
        </Link>
      )}
      <div className={styles.meta}>
        <time dateTime={new Date(post.createdAt).toISOString()}>
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
        </time>
        <span>{post.likesCount ?? 0} likes</span>
      </div>
      <Heading className={styles.postTitle}>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </Heading>
      <p>{post.excerpt}</p>
      {!!post.tags?.length && (
        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
      <Link
        className={styles.textLink}
        href={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
      >
        Read article <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </article>
  );
}
