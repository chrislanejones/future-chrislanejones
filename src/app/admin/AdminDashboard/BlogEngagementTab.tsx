"use client";

import React, { useState } from "react";
import {
  Search,
  MessageSquare,
  Heart,
  CheckCircle,
  XCircle,
  Trash2,
  Mail,
  Clock,
  Filter,
  TrendingUp,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

type EnrichedComment = {
  _id: Id<"blogComments">;
  postId: Id<"blogPosts">;
  parentId?: Id<"blogComments">;
  authorName: string;
  authorEmail: string;
  content: string;
  approved: boolean;
  createdAt: number;
  updatedAt: number;
  postTitle: string;
  postSlug: string;
};

const BlogEngagementTab = () => {
  const comments = useQuery(api.blogPosts.getAllCommentsAdmin) ?? [];
  const likesData = useQuery(api.blogPosts.getAllLikesAdmin);
  const approveComment = useMutation(api.blogPosts.approveComment);
  const deleteComment = useMutation(api.blogPosts.deleteComment);

  const [activeView, setActiveView] = useState<"comments" | "likes">("comments");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && !comment.approved) ||
      (filterStatus === "approved" && comment.approved);

    return matchesSearch && matchesFilter;
  });

  const pendingCount = comments.filter((c) => !c.approved).length;
  const approvedCount = comments.filter((c) => c.approved).length;

  const handleApprove = async (commentId: Id<"blogComments">) => {
    try {
      await approveComment({ commentId });
    } catch (error) {
      console.error("Failed to approve comment:", error);
    }
  };

  const handleDelete = async (commentId: Id<"blogComments">, authorName: string) => {
    if (confirm(`Delete comment from ${authorName}?`)) {
      try {
        await deleteComment({ commentId });
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("comments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === "comments"
                ? "bg-[#4ade80] text-[#0b0d10]"
                : "bg-[#111418] text-[#f3f4f6] border border-[#1f242b] hover:border-[#4ade80]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Comments
            {pendingCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeView === "comments" ? "bg-[#0b0d10] text-[#4ade80]" : "bg-[#4ade80] text-[#0b0d10]"
              }`}>
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveView("likes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === "likes"
                ? "bg-[#4ade80] text-[#0b0d10]"
                : "bg-[#111418] text-[#f3f4f6] border border-[#1f242b] hover:border-[#4ade80]"
            }`}
          >
            <Heart className="w-4 h-4" />
            Likes
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <div className="px-4 py-2 bg-[#111418] border border-[#1f242b] rounded-lg">
            <span className="text-[#9ca3af]">Total Comments: </span>
            <span className="text-[#f3f4f6] font-bold">{comments.length}</span>
          </div>
          {likesData && (
            <div className="px-4 py-2 bg-[#111418] border border-[#1f242b] rounded-lg">
              <span className="text-[#9ca3af]">Total Likes: </span>
              <span className="text-[#f3f4f6] font-bold">{likesData.total}</span>
            </div>
          )}
        </div>
      </div>

      {/* Comments View */}
      {activeView === "comments" && (
        <div className="space-y-4">
          {/* Filters and Search */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comments..."
                className="w-full pl-10 pr-4 py-2 bg-[#111418] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "all"
                    ? "bg-[#4ade80] text-[#0b0d10]"
                    : "bg-[#111418] text-[#f3f4f6] border border-[#1f242b]"
                }`}
              >
                All ({comments.length})
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "pending"
                    ? "bg-[#4ade80] text-[#0b0d10]"
                    : "bg-[#111418] text-[#f3f4f6] border border-[#1f242b]"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilterStatus("approved")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "approved"
                    ? "bg-[#4ade80] text-[#0b0d10]"
                    : "bg-[#111418] text-[#f3f4f6] border border-[#1f242b]"
                }`}
              >
                Approved ({approvedCount})
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {filteredComments.length === 0 ? (
              <div className="text-center py-12 bg-[#111418] border border-[#1f242b] rounded-2xl">
                <MessageSquare className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
                <p className="text-[#9ca3af]">
                  {searchQuery || filterStatus !== "all"
                    ? "No comments match your filters"
                    : "No comments yet"}
                </p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment._id}
                  className={`p-4 bg-[#111418] border rounded-xl transition-all ${
                    comment.approved
                      ? "border-[#1f242b]"
                      : "border-yellow-500/30 bg-yellow-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#f3f4f6] font-medium">
                          {comment.authorName}
                        </span>
                        <span className="text-[#9ca3af]">•</span>
                        <a
                          href={`mailto:${comment.authorEmail}`}
                          className="text-[#4ade80] hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          {comment.authorEmail}
                        </a>
                        <span className="text-[#9ca3af]">•</span>
                        <span className="text-[#9ca3af] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-[#9ca3af] mb-2">
                        On post:{" "}
                        <span className="text-[#4ade80]">{comment.postTitle}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!comment.approved && (
                        <button
                          onClick={() => handleApprove(comment._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-colors font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                      )}
                      {comment.approved && (
                        <span className="flex items-center gap-1 px-3 py-1.5 bg-[#4ade80]/10 text-[#4ade80] rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                          Approved
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id, comment.authorName)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-[#f3f4f6] leading-relaxed pl-4 border-l-2 border-[#4ade80]">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Likes View */}
      {activeView === "likes" && likesData && (
        <div className="space-y-4">
          {/* Total Stats Card */}
          <div className="p-6 bg-[#111418] border border-[#1f242b] rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#4ade80]/10 rounded-xl">
                <Heart className="w-6 h-6 text-[#4ade80]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#f3f4f6]">
                  {likesData.total}
                </h3>
                <p className="text-[#9ca3af]">Total Likes Across All Posts</p>
              </div>
            </div>
          </div>

          {/* Likes by Post */}
          <div className="bg-[#111418] border border-[#1f242b] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#4ade80]" />
              <h3 className="text-[#f3f4f6] font-bold">Likes by Post</h3>
            </div>
            <div className="space-y-3">
              {likesData.byPost.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
                  <p className="text-[#9ca3af]">No likes yet</p>
                </div>
              ) : (
                likesData.byPost.map((post, index) => (
                  <div
                    key={post.postId}
                    className="flex items-center justify-between p-4 bg-[#0b0d10] border border-[#1f242b] rounded-xl hover:border-[#4ade80] transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-[#1a1e24] rounded-lg text-[#4ade80] font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[#f3f4f6] font-medium">
                          {post.postTitle}
                        </h4>
                        <p className="text-xs text-[#9ca3af]">{post.postSlug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#4ade80]/10 rounded-lg">
                      <Heart className="w-4 h-4 text-[#4ade80] fill-[#4ade80]" />
                      <span className="text-[#4ade80] font-bold">
                        {post.likesCount}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEngagementTab;
