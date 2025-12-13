"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Tag,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useUploadThing } from "@/utils/uploadthing";
import { HtmlEditorEnhanced } from "../components/HtmlEditorEnhanced";
import { MediaDrawer } from "../components/MediaDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import Image from "next/image";

interface BlogPost {
  _id: Id<"blogPosts">;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  published: boolean;
  likesCount?: number;
  createdAt: number;
  updatedAt: number;
}

const BlogPostsTabEnhanced = () => {
  const posts = useQuery(api.blogPosts.getAllPostsAdmin) ?? [];
  const createPost = useMutation(api.blogPosts.createPost);
  const updatePost = useMutation(api.blogPosts.updatePost);
  const deletePost = useMutation(api.blogPosts.deletePost);
  const createMedia = useMutation(api.media.create);

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        await createMedia({
          url: res[0].url,
          filename: res[0].name || "Blog cover image",
          size: res[0].size,
        });
        setFormData({ ...formData, coverImage: res[0].url });
        setIsUploading(false);
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: [] as string[],
    published: false,
    createdAt: Date.now(),
  });

  const [tagInput, setTagInput] = useState("");

  // Auto-select first post
  useEffect(() => {
    if (posts.length > 0 && !selectedPost && !isCreating) {
      setSelectedPost(posts[0] as BlogPost);
    }
  }, [posts, selectedPost, isCreating]);

  // Update form when post is selected
  useEffect(() => {
    if (selectedPost && !isCreating) {
      setFormData({
        title: selectedPost.title,
        slug: selectedPost.slug,
        excerpt: selectedPost.excerpt,
        content: selectedPost.content,
        coverImage: selectedPost.coverImage || "",
        tags: selectedPost.tags || [],
        published: selectedPost.published,
        createdAt: selectedPost.createdAt,
      });
      setIsEditing(false);
    }
  }, [selectedPost, isCreating]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tags: [],
      published: false,
      createdAt: Date.now(),
    });
    setIsEditing(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
    setIsEditing(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
      setIsEditing(true);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      setSaveStatus("error");
      return;
    }

    setIsSaving(true);
    try {
      if (isCreating) {
        await createPost({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          coverImage: formData.coverImage || undefined,
          tags: formData.tags,
          published: formData.published,
        });
        setSaveStatus("success");
        setIsCreating(false);
      } else if (selectedPost) {
        await updatePost({
          id: selectedPost._id,
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          coverImage: formData.coverImage || undefined,
          tags: formData.tags,
          published: formData.published,
          createdAt: formData.createdAt,
        });
        setSaveStatus("success");
      }
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to save post:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: Id<"blogPosts">) => {
    try {
      await deletePost({ id });
      setDeleteConfirm(null);
      if (selectedPost?._id === id) {
        setSelectedPost(null);
      }
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to delete post:", error);
      setSaveStatus("error");
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
      if (posts.length > 0) {
        setSelectedPost(posts[0] as BlogPost);
      }
    } else if (selectedPost) {
      setFormData({
        title: selectedPost.title,
        slug: selectedPost.slug,
        excerpt: selectedPost.excerpt,
        content: selectedPost.content,
        coverImage: selectedPost.coverImage || "",
        tags: selectedPost.tags || [],
        published: selectedPost.published,
        createdAt: selectedPost.createdAt,
      });
    }
    setIsEditing(false);
  };

  const handleMediaSelect = (imageUrl: string) => {
    setFormData({ ...formData, coverImage: imageUrl });
    setIsEditing(true);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Status Messages */}
      {saveStatus === "success" && (
        <div className="col-span-3">
          <SuccessDisplay
            message="Changes saved successfully!"
            onDismiss={() => setSaveStatus(null)}
            compact
          />
        </div>
      )}
      {saveStatus === "error" && (
        <div className="col-span-3">
          <ErrorDisplay
            error={
              new Error("Failed to save changes. Please check required fields.")
            }
            onDismiss={() => setSaveStatus(null)}
            compact
          />
        </div>
      )}

      {/* Left Panel - Post List */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-(--color-ink)">Blog Posts</h3>
        </div>

        {/* New Post Button - Homepage style */}
        <Button
          onClick={handleCreateNew}
          variant="accent"
          className="w-full gap-2 mb-4"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-(--color-muted-accent) rounded-lg text-ink text-sm focus:ring-2 focus:ring-accent focus:outline-none"
          />
        </div>

        {/* Post List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredPosts.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">
              {searchQuery
                ? "No posts found"
                : "No posts yet. Create your first one!"}
            </p>
          ) : (
            filteredPosts.map((post) => (
              <button
                key={post._id}
                onClick={() => {
                  setIsCreating(false);
                  setSelectedPost(post as BlogPost);
                }}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedPost?._id === post._id && !isCreating
                    ? "bg-(--color-foreground) text-(--color-panel)"
                    : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-(--color-ink)"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 ${
                      selectedPost?._id === post._id && !isCreating
                        ? "text-(--color-panel)"
                        : post.published
                          ? "text-green-500"
                          : "text-muted"
                    }`}
                  >
                    {post.published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate block">
                      {post.title}
                    </span>
                    <span
                      className={`text-xs ${
                        selectedPost?._id === post._id && !isCreating
                          ? "opacity-70"
                          : "text-muted"
                      }`}
                    >
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Post Editor */}
      <div className="col-span-2 bg-(--color-panel) border border-(--color-border) rounded-2xl overflow-hidden flex flex-col">
        {selectedPost || isCreating ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-(--color-muted-accent)">
              <div>
                <h2 className="font-bold text-ink">
                  {isCreating ? "New Post" : formData.title || "Untitled"}
                </h2>
                <p className="text-sm text-muted">
                  {formData.slug && `/${formData.slug}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      variant="accent"
                      size="sm"
                      className="gap-2"
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    {selectedPost && (
                      <Button
                        onClick={() => setDeleteConfirm(selectedPost._id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block mb-2 text-ink font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-60"
                  placeholder="Enter post title..."
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block mb-2 text-ink font-medium">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-60"
                  placeholder="post-url-slug"
                />
              </div>

              {/* Publish Date */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Publish Date
                  </span>
                </label>
                <input
                  type="datetime-local"
                  value={
                    formData.createdAt && !isNaN(formData.createdAt)
                      ? new Date(formData.createdAt).toISOString().slice(0, 16)
                      : new Date().toISOString().slice(0, 16)
                  }
                  onChange={(e) => {
                    const newDate = new Date(e.target.value).getTime();
                    if (!isNaN(newDate)) {
                      setFormData({ ...formData, createdAt: newDate });
                      setIsEditing(true);
                    }
                  }}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-60"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => {
                    setFormData({ ...formData, excerpt: e.target.value });
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  rows={2}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none resize-none disabled:opacity-60"
                  placeholder="Brief description of the post..."
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Cover Image
                </label>
                {formData.coverImage ? (
                  <div className="relative rounded-xl overflow-hidden bg-(--color-muted-accent)">
                    <Image
                      src={formData.coverImage}
                      alt="Cover"
                      width={800}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    {isEditing && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => setIsMediaDrawerOpen(true)}
                          className="p-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition"
                          title="Change image"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setFormData({ ...formData, coverImage: "" });
                            setIsEditing(true);
                          }}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => isEditing && setIsMediaDrawerOpen(true)}
                    disabled={!isEditing}
                    className="w-full px-4 py-8 border-2 border-dashed border-(--color-muted-accent) rounded-xl text-muted hover:border-accent hover:text-accent transition flex flex-col items-center gap-2 bg-(--color-muted-accent)/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <ImageIcon className="w-8 h-8" />
                    <span>Click to select a cover image</span>
                  </button>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block mb-2 text-ink font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-500 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                      className="flex-1 px-3 py-2 bg-(--color-muted-accent) rounded-lg text-ink text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                      placeholder="Add a tag..."
                    />
                    <Button onClick={handleAddTag} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-4 bg-(--color-muted-accent) rounded-xl">
                <div className="flex items-center gap-3">
                  {formData.published ? (
                    <Eye className="w-5 h-5 text-green-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-muted" />
                  )}
                  <div>
                    <p className="font-medium text-ink">
                      {formData.published ? "Published" : "Draft"}
                    </p>
                    <p className="text-sm text-muted">
                      {formData.published
                        ? "Post is visible to everyone"
                        : "Post is hidden from public"}
                    </p>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        published: !formData.published,
                      });
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      formData.published
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-muted-accent text-ink hover:bg-surface-hover"
                    }`}
                  >
                    {formData.published ? "Unpublish" : "Publish"}
                  </button>
                )}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Content
                </label>
                {isEditing ? (
                  <HtmlEditorEnhanced
                    value={formData.content}
                    onChange={(content) => {
                      setFormData({ ...formData, content });
                    }}
                    placeholder="Write your post content..."
                  />
                ) : (
                  <div
                    className="p-4 bg-(--color-muted-accent) rounded-xl prose prose-sm dark:prose-invert max-w-none min-h-[200px]"
                    dangerouslySetInnerHTML={{
                      __html: formData.content || "<p>No content yet...</p>",
                    }}
                  />
                )}
              </div>
            </div>

            <MediaDrawer
              isOpen={isMediaDrawerOpen}
              onClose={() => setIsMediaDrawerOpen(false)}
              onSelect={handleMediaSelect}
              title="Select Cover Image"
              description="Choose a cover image for your blog post"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center">
              <Tag className="w-12 h-12 mx-auto opacity-40 mb-4" />
              <p>Select a post to view or edit</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-panel) rounded-2xl p-6 max-w-sm w-full border border-(--color-border)">
            <h3 className="text-lg font-bold text-ink mb-4">Delete Post?</h3>
            <p className="text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDelete(deleteConfirm as Id<"blogPosts">)}
                variant="outline"
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

export default BlogPostsTabEnhanced;
