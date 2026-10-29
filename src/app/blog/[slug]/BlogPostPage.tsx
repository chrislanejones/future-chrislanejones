// src/app/blog/[slug]/BlogPostPage.tsx
"use client";

import {
  useState,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { createRoot, type Root } from "react-dom/client";
import { STEPPER_CONFIGS } from "@/components/blog/stepper-configs";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import styles from "@/components/coastal/interior.module.css";
import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Heart,
  MessageCircle,
  ArrowLeft,
  User,
  Mail,
} from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

// Simple function to generate user identifier (could be improved with actual user system)
function getUserIdentifier() {
  if (typeof window === "undefined") return "anonymous";

  let identifier = localStorage.getItem("blog-user-id");
  if (!identifier) {
    identifier = `user-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
    localStorage.setItem("blog-user-id", identifier);
  }
  return identifier;
}

// The id never changes once written, so the store never notifies.
const subscribeToNothing = () => () => {};
const getServerUserIdentifier = () => "";

function useUserIdentifier(): string {
  return useSyncExternalStore(
    subscribeToNothing,
    getUserIdentifier,
    getServerUserIdentifier,
  );
}

// The server fetches the post and renders its body (see page.tsx), passing
// both in. The page paints complete on first load, crawlers get the full
// text, and the live Convex query takes over once it connects.
export default function BlogPostPage({
  params,
  initialPost,
  children,
}: {
  params: { slug: string };
  initialPost: Doc<"blogPosts">;
  children: React.ReactNode;
}) {
  const userIdentifier = useUserIdentifier();
  const [commentForm, setCommentForm] = useState({
    authorName: "",
    authorEmail: "",
    content: "",
  });
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [likeError, setLikeError] = useState<string | null>(null);

  const livePost = useQuery(
    api.blogPosts.getPostBySlug,
    params.slug ? { slug: params.slug } : "skip",
  );
  // undefined = still connecting (use the server copy); null = unpublished.
  const post = livePost === undefined ? initialPost : livePost;
  const userLikeStatus = useQuery(
    api.blogPosts.getUserLikeStatus,
    userIdentifier && post?._id ? { postId: post._id, userIdentifier } : "skip",
  );
  const comments = useQuery(
    api.blogPosts.getComments,
    post?._id ? { postId: post._id } : "skip",
  );

  const toggleLike = useMutation(api.blogPosts.toggleLike);
  const addComment = useMutation(api.blogPosts.addComment);

  // The sanitized article comes from the server (children); the browser never
  // re-renders it, so it doesn't ship the sanitizer. A content change only
  // re-runs the widget mounting below.
  const postContent = post?.content;

  const articleRef = useRef<HTMLDivElement>(null);
  const stepperRootsRef = useRef<Root[]>([]);

  // The article HTML is server-rendered (children), and React never touches
  // it again. This effect only mounts BlogStepper widgets into their
  // <div data-stepper="id"> markers. Only IDs registered in STEPPER_CONFIGS
  // mount; post content can never run its own scripts.
  useEffect(() => {
    const article = articleRef.current;
    if (!article || !postContent) return;

    const markers = [...article.querySelectorAll<HTMLElement>("[data-stepper]")].filter(
      (el) => el.dataset.stepper && STEPPER_CONFIGS[el.dataset.stepper],
    );
    // Loaded on demand: a static import put the stepper's CSS in every blog
    // post's prefetch, and Chrome flagged it as an unused preload on the home page.
    let canceled = false;
    if (markers.length) {
      import("@/components/blog/BlogStepper").then(({ BlogStepper }) => {
        if (canceled) return;
        markers.forEach((el) => {
          const config = STEPPER_CONFIGS[el.dataset.stepper!];
          // Fresh node per mount, so a re-run (Strict Mode, content edit) never
          // calls createRoot on a container an old root still owns.
          const fresh = el.cloneNode(false) as HTMLElement;
          el.replaceWith(fresh);
          const root = createRoot(fresh);
          root.render(<BlogStepper config={config} />);
          stepperRootsRef.current.push(root);
        });
      });
    }

    return () => {
      canceled = true;
      const roots = stepperRootsRef.current;
      stepperRootsRef.current = [];
      // Defer so we never unmount synchronously during the parent's commit.
      setTimeout(() => roots.forEach((r) => r.unmount()), 0);
    };
  }, [postContent]);

  if (post === null) {
    return (
      <CoastalPageShell>
        <div className={styles.article}>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-ink mb-4">Post Not Found</h1>
            <p className="text-muted mb-8">
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild variant="secondary" size="sm">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </CoastalPageShell>
    );
  }

  if (!post) {
    return (
      <CoastalPageShell>
        <div className={styles.article}>
          <Spinner label="Loading article…" />
        </div>
      </CoastalPageShell>
    );
  }

  const handleLike = async () => {
    if (!post?._id || !userIdentifier) return;
    setLikeError(null);
    try {
      await toggleLike({ postId: post._id, userIdentifier });
    } catch (err) {
      setLikeError(
        err instanceof ConvexError && typeof err.data === "string"
          ? err.data
          : "Couldn't save your like. Please try again.",
      );
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !post?._id ||
      !commentForm.authorName ||
      !commentForm.authorEmail ||
      !commentForm.content
    )
      return;

    setCommentError(null);
    try {
      await addComment({
        postId: post._id,
        authorName: commentForm.authorName,
        authorEmail: commentForm.authorEmail,
        content: commentForm.content,
      });
    } catch (err) {
      setCommentError(
        err instanceof ConvexError && typeof err.data === "string"
          ? err.data
          : "Couldn't post your comment. Please try again.",
      );
      return;
    }

    setCommentForm({ authorName: "", authorEmail: "", content: "" });
    setShowCommentForm(false);
  };

  return (
    <CoastalPageShell>
      <div className={`${styles.content} ${styles.article}`}>
        {/* Back to Blog */}
        <div className="mb-8">
          <Button asChild variant="secondary" size="sm">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <h1 className={styles.articleTitle}>{post.title}</h1>

        <div className={styles.articleBody}>
          {post.coverImage && (
            <div className={styles.articleCover}>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain"
                priority
                fetchPriority="high"
              />
            </div>
          )}

          <div>
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-muted mb-8 pb-6 border-b border-(--color-border)">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={new Date(post.createdAt).toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Heart
                  className={`w-4 h-4 ${userLikeStatus?.liked ? "fill-current text-(--color-accent)" : ""}`}
                />
                <span>{post.likesCount || 0} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{comments?.length || 0} comments</span>
              </div>
            </div>

            {/* Content: server-rendered <article> passed in as children. */}
            <div ref={articleRef}>{children}</div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8 pb-6 border-b border-(--color-border)">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Like Button */}
            <div className="mb-8">
              <Button
                onClick={handleLike}
                variant={userLikeStatus?.liked ? "neutral" : "secondary"}
                size="lg"
                className="gap-2"
              >
                <Heart
                  className={`w-5 h-5 ${userLikeStatus?.liked ? "fill-current" : ""}`}
                />
                {userLikeStatus?.liked ? "Liked" : "Like this post"}
              </Button>
              {likeError && (
                <p role="alert" className="mt-2 text-(--color-danger)">
                  {likeError}
                </p>
              )}
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">Comments ({comments?.length || 0})</h2>
                <Button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  variant="secondary"
                  size="sm"
                >
                  Add Comment
                </Button>
              </div>

              {/* Comment Form */}
              {showCommentForm && (
                <Card className="p-6">
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block mb-2">
                          Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                          <input
                            type="text"
                            id="name"
                            required
                            value={commentForm.authorName}
                            onChange={(e) =>
                              setCommentForm((prev) => ({
                                ...prev,
                                authorName: e.target.value,
                              }))
                            }
                            className="w-full pl-10 pr-4 py-2 border border-(--color-border) rounded-lg bg-(--color-panel) focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Your name"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                          <input
                            type="email"
                            id="email"
                            required
                            value={commentForm.authorEmail}
                            onChange={(e) =>
                              setCommentForm((prev) => ({
                                ...prev,
                                authorEmail: e.target.value,
                              }))
                            }
                            className="w-full pl-10 pr-4 py-2 border border-(--color-border) rounded-lg bg-(--color-panel) focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block mb-2">
                        Comment *
                      </label>
                      <textarea
                        id="comment"
                        required
                        rows={4}
                        value={commentForm.content}
                        onChange={(e) =>
                          setCommentForm((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-(--color-border) rounded-lg bg-(--color-panel) focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                        placeholder="Share your thoughts..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        Post Comment
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowCommentForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                    {commentError && (
                      <p role="alert" className="text-(--color-danger)">
                        {commentError}
                      </p>
                    )}
                    <p className="text-muted">
                      Comments are moderated and will appear after approval.
                    </p>
                  </form>
                </Card>
              )}

              {/* Comments List */}
              {comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment._id} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="">{comment.authorName}</span>
                            <span className="text-muted">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </CoastalPageShell>
  );
}
