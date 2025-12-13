"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Heart,
  MessageCircle,
  CheckCircle,
  X,
  Trash2,
  ExternalLink,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Eye,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "@/components/ui/button";

interface BlogComment {
  _id: Id<"blogComments">;
  postId: Id<"blogPosts">;
  postTitle: string;
  postSlug: string;
  parentId?: Id<"blogComments">;
  authorName: string;
  authorEmail: string;
  content: string;
  approved: boolean;
  createdAt: number;
  updatedAt: number;
}

interface LikesStats {
  total: number;
  byPost: {
    postId: string;
    postTitle: string;
    postSlug: string;
    likesCount: number;
  }[];
}

const EngagementTabEnhanced = () => {
  const comments = useQuery(api.blogPosts.getAllCommentsAdmin) ?? [];
  const likesData = useQuery(api.blogPosts.getAllLikesAdmin) as
    | LikesStats
    | undefined;
  const pendingCount = useQuery(api.blogPosts.getPendingCommentsCount) ?? 0;

  const approveComment = useMutation(api.blogPosts.approveComment);
  const deleteComment = useMutation(api.blogPosts.deleteComment);

  const [activeTab, setActiveTab] = useState<"comments" | "likes">("comments");
  const [selectedComment, setSelectedComment] = useState<BlogComment | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved"
  >("all");
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Auto-select first pending comment or first comment
  useEffect(() => {
    if (comments.length > 0 && !selectedComment) {
      const pendingComment = comments.find((c) => !c.approved);
      setSelectedComment((pendingComment || comments[0]) as BlogComment);
    }
  }, [comments, selectedComment]);

  const handleApprove = async (commentId: Id<"blogComments">) => {
    try {
      await approveComment({ commentId });
      setSuccess("Comment approved successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to approve comment")
      );
    }
  };

  const handleDelete = async (commentId: Id<"blogComments">) => {
    try {
      await deleteComment({ commentId });
      setSuccess("Comment deleted successfully");
      setDeleteConfirm(null);
      if (selectedComment?._id === commentId) {
        setSelectedComment(null);
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete comment")
      );
    }
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.authorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && !comment.approved) ||
      (filterStatus === "approved" && comment.approved);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatFullDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (comments === undefined || likesData === undefined) {
    return <LoadingSpinner message="Loading engagement data..." />;
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Status Messages */}
      {error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}
      {success && (
        <SuccessDisplay message={success} onDismiss={() => setSuccess(null)} />
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-4 pb-4">
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
            activeTab === "comments"
              ? "bg-(--color-foreground) text-(--color-panel)"
              : "text-muted hover:text-ink hover:bg-surface-hover"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Comments
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 bg-accent text-on-accent text-xs font-bold rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("likes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
            activeTab === "likes"
              ? "bg-(--color-foreground) text-(--color-panel)"
              : "text-muted hover:text-ink hover:bg-surface-hover"
          }`}
        >
          <Heart className="w-4 h-4" />
          Likes
          <span className="px-2 py-0.5 bg-muted-accent text-muted text-xs rounded-full">
            {likesData?.total ?? 0}
          </span>
        </button>
      </div>

      {/* Comments Tab Content */}
      {activeTab === "comments" && (
        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Left Panel - Comment List */}
          <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-(--color-ink)">Comments</h3>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-(--color-muted-accent) rounded-lg text-ink text-sm focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-4 p-1 bg-(--color-muted-accent) rounded-lg">
              {(["all", "pending", "approved"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition ${
                    filterStatus === status
                      ? "bg-(--color-foreground) text-(--color-panel)"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredComments.length === 0 ? (
                <p className="text-sm text-muted text-center py-8">
                  No comments found
                </p>
              ) : (
                filteredComments.map((comment) => (
                  <button
                    key={comment._id}
                    onClick={() => setSelectedComment(comment as BlogComment)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedComment?._id === comment._id
                        ? "bg-(--color-foreground) text-(--color-panel)"
                        : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-(--color-ink)"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 ${
                          selectedComment?._id === comment._id
                            ? "text-(--color-panel)"
                            : comment.approved
                              ? "text-green-500"
                              : "text-yellow-500"
                        }`}
                      >
                        {comment.approved ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <MessageCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium truncate">
                            {comment.authorName}
                          </span>
                          <span
                            className={`text-xs shrink-0 ${
                              selectedComment?._id === comment._id
                                ? "opacity-70"
                                : "text-muted"
                            }`}
                          >
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p
                          className={`text-xs truncate ${
                            selectedComment?._id === comment._id
                              ? "opacity-70"
                              : "text-muted"
                          }`}
                        >
                          on {comment.postTitle}
                        </p>
                        <p
                          className={`text-sm truncate mt-1 ${
                            selectedComment?._id === comment._id
                              ? "opacity-70"
                              : "text-muted"
                          }`}
                        >
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Comment Detail */}
          <div className="col-span-2 bg-(--color-panel) border border-(--color-border) rounded-2xl overflow-hidden flex flex-col">
            {selectedComment ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-(--color-muted-accent)">
                  <div>
                    <h2 className="font-bold text-ink">
                      {selectedComment.authorName}
                    </h2>
                    <p className="text-sm text-muted">
                      {selectedComment.authorEmail}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!selectedComment.approved && (
                      <Button
                        onClick={() => handleApprove(selectedComment._id)}
                        variant="accent"
                        size="sm"
                        className="gap-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Approve
                      </Button>
                    )}
                    <Button
                      onClick={() => setDeleteConfirm(selectedComment._id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        selectedComment.approved
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {selectedComment.approved ? "Approved" : "Pending"}
                    </span>
                    <span className="text-muted">
                      {formatFullDate(selectedComment.createdAt)}
                    </span>
                  </div>

                  {/* Post Link */}
                  <div className="p-3 bg-(--color-muted-accent) rounded-lg">
                    <p className="text-xs text-muted mb-1">Comment on:</p>
                    <a
                      href={`/blog/${selectedComment.postSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-ink hover:text-accent transition"
                    >
                      <span className="font-medium">
                        {selectedComment.postTitle}
                      </span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Comment Body */}
                  <div className="p-4 bg-(--color-muted-accent) rounded-xl">
                    <p className="text-ink whitespace-pre-wrap leading-relaxed">
                      {selectedComment.content}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto opacity-40 mb-4" />
                  <p>Select a comment to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Likes Tab Content */}
      {activeTab === "likes" && (
        <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-6 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-(--color-ink) text-lg">
                Likes Overview
              </h3>
              <p className="text-muted text-sm">
                Total likes across all posts: {likesData?.total ?? 0}
              </p>
            </div>
          </div>

          {likesData && likesData.byPost.length > 0 ? (
            <div className="space-y-3">
              {likesData.byPost.map((post, index) => (
                <div
                  key={post.postId}
                  className="flex items-center gap-4 p-4 bg-(--color-muted-accent) rounded-xl hover:ring-2 hover:ring-accent transition"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/blog/${post.postSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-ink hover:text-accent transition truncate flex items-center gap-2"
                    >
                      {post.postTitle}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-accent">
                    <Heart className="w-5 h-5" fill="currentColor" />
                    <span className="font-bold">{post.likesCount}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-32 h-2 bg-muted-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{
                        width: `${(post.likesCount / (likesData.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 mx-auto text-muted opacity-40 mb-4" />
              <p className="text-muted">No likes yet</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-panel) rounded-2xl p-6 max-w-sm w-full border border-(--color-border)">
            <h3 className="text-lg font-bold text-ink mb-4">Delete Comment?</h3>
            <p className="text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  handleDelete(deleteConfirm as Id<"blogComments">)
                }
                variant="disabled"
                className="flex-1"
              >
                Delete
              </Button>
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementTabEnhanced;
