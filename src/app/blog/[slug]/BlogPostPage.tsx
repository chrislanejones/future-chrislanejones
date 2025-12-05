// src/app/blog/[slug]/BlogPostPage.tsx
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import { Card } from "@/components/page/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "convex/react";
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
import type { Id } from "../../../../convex/_generated/dataModel";

// Helper function to get badge color variant based on index
const getBadgeVariant = (index: number) => {
  const variants = [
    "blue",
    "green",
    "purple",
    "orange",
    "pink",
    "cyan",
    "yellow",
    "red",
  ] as const;
  return variants[index % variants.length];
};

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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [userIdentifier, setUserIdentifier] = useState<string>("");
  const [commentForm, setCommentForm] = useState({
    authorName: "",
    authorEmail: "",
    content: "",
  });
  const [showCommentForm, setShowCommentForm] = useState(false);

  const post = useQuery(api.blogPosts.getPostBySlug, { slug: params.slug });
  const userLikeStatus = useQuery(
    api.blogPosts.getUserLikeStatus,
    userIdentifier && post?._id ? { postId: post._id, userIdentifier } : "skip"
  );
  const comments = useQuery(
    api.blogPosts.getComments,
    post?._id ? { postId: post._id } : "skip"
  );

  const toggleLike = useMutation(api.blogPosts.toggleLike);
  const addComment = useMutation(api.blogPosts.addComment);

  useEffect(() => {
    setUserIdentifier(getUserIdentifier());
  }, []);

  if (post === null) {
    notFound();
  }

  if (!post || !userIdentifier) {
    return (
      <>
        <Header />
        <main className="site-container py-12">
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleLike = async () => {
    if (!post?._id) return;
    await toggleLike({ postId: post._id, userIdentifier });
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

    await addComment({
      postId: post._id,
      authorName: commentForm.authorName,
      authorEmail: commentForm.authorEmail,
      content: commentForm.content,
    });

    setCommentForm({ authorName: "", authorEmail: "", content: "" });
    setShowCommentForm(false);
  };

  // Simple markdown-like content rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="mb-4 mt-8">
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="mb-3 mt-6">
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="mb-2 mt-4">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <>
      <Header />
      <main className="site-container py-12">
        {/* Back to Blog */}
        <div className="mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <Banner title={post.title} breadcrumbPage="Blog" />

        <Card size="full" className="overflow-hidden">
          {post.coverImage && (
            <div className="relative w-full aspect-[21/9]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-muted mb-8 pb-6 border-b border-[color:var(--color-border)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={new Date(post.createdAt).toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Heart
                  className={`w-4 h-4 ${userLikeStatus?.liked ? "fill-current text-red-500" : ""}`}
                />
                <span>{post.likesCount || 0} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{comments?.length || 0} comments</span>
              </div>
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none mb-8">
              {renderContent(post.content)}
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8 pb-6 border-b border-[color:var(--color-border)]">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={tag} variant={getBadgeVariant(index)}>
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
                variant={userLikeStatus?.liked ? "base" : "outline"}
                size="lg"
                className="gap-2"
              >
                <Heart
                  className={`w-5 h-5 ${userLikeStatus?.liked ? "fill-current" : ""}`}
                />
                {userLikeStatus?.liked ? "Liked" : "Like this post"}
              </Button>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="">Comments ({comments?.length || 0})</h3>
                <Button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  variant="outline"
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
                            className="w-full pl-10 pr-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-panel)] focus:outline-none focus:ring-2 focus:ring-accent"
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
                            className="w-full pl-10 pr-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-panel)] focus:outline-none focus:ring-2 focus:ring-accent"
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
                        className="w-full px-4 py-2 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-panel)] focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                        placeholder="Share your thoughts..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        Post Comment
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCommentForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
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
        </Card>
      </main>
      <Footer />
    </>
  );
}
