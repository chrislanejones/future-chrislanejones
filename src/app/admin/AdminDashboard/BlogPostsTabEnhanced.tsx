// src/app/admin/AdminDashboard/BlogPostsTabEnhanced.tsx
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
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (posts.length > 0 && !selectedPost && !isCreating) {
      setSelectedPost(posts[0] as BlogPost);
    }
  }, [posts, selectedPost, isCreating]);

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
      });
      setIsEditing(false);
    }
  }, [selectedPost, isCreating]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(true);
    setSelectedPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tags: [],
      published: false,
    });
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setIsEditing(false);
    if (posts.length > 0) {
      setSelectedPost(posts[0] as BlogPost);
    }
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await createPost({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          coverImage: formData.coverImage || undefined,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
          published: formData.published,
        });
        setIsCreating(false);
      } else if (selectedPost) {
        await updatePost({
          id: selectedPost._id,
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          coverImage: formData.coverImage || undefined,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
          published: formData.published,
        });
      }
      setIsEditing(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus("error");
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    if (confirm(`Are you sure you want to delete "${selectedPost.title}"?`)) {
      try {
        await deletePost({ id: selectedPost._id });
        setSelectedPost(null);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (error) {
        setSaveStatus("error");
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
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
      slug: isCreating || !formData.slug ? generateSlug(title) : formData.slug,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await startUpload([file]);
  };

  const handleMediaSelect = (imageUrl: string) => {
    setFormData({ ...formData, coverImage: imageUrl });
    setIsMediaDrawerOpen(false);
  };

  if (!posts.length && !isCreating) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
          <p className="text-muted mb-4">No blog posts yet</p>
          <Button onClick={handleCreateNew} variant="accent">
            <Plus className="w-4 h-4 mr-2" />
            Create First Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar */}
      <div className="w-64 flex flex-col bg-panel border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <Button
            onClick={handleCreateNew}
            className="w-full gap-2"
            variant="accent"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-base border border-border rounded-lg text-ink focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 p-4">
          {filteredPosts.map((post) => (
            <button
              key={post._id}
              onClick={() => {
                setSelectedPost(post as BlogPost);
                setIsCreating(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedPost?._id === post._id
                  ? "bg-accent text-on-accent"
                  : "bg-base hover:bg-surface-hover text-ink"
              }`}
            >
              <p className="font-medium truncate text-sm">{post.title}</p>
              <p className="text-xs text-muted">{post.slug}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toast */}
        {saveStatus && (
          <div className="mb-4">
            {saveStatus === "success" ? (
              <SuccessDisplay
                message={
                  isCreating ? "Blog post created!" : "Blog post updated!"
                }
                onDismiss={() => setSaveStatus(null)}
              />
            ) : (
              <ErrorDisplay
                error={new Error("Failed to save blog post")}
                onDismiss={() => setSaveStatus(null)}
              />
            )}
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {isCreating ? "Create New Post" : "Edit Blog Post"}
            </h2>
            {selectedPost && !isCreating && (
              <p className="text-sm text-muted">
                Last updated:{" "}
                {new Date(selectedPost.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditing && !isCreating && (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="base"
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="gap-2 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
            {(isEditing || isCreating) && (
              <>
                <Button onClick={handleSave} variant="accent" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  onClick={
                    isCreating ? handleCancelCreate : () => setIsEditing(false)
                  }
                  variant="outline"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-4">
          {/* Title */}
          <div>
            <label className="block mb-2 font-medium text-ink">Title *</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              disabled={!isEditing && !isCreating}
              placeholder="Post title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block mb-2 font-medium text-ink">Slug *</label>
            <Input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              disabled={!isEditing && !isCreating}
              placeholder="post-slug"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block mb-2 font-medium text-ink">Excerpt *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              disabled={!isEditing && !isCreating}
              rows={3}
              className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              placeholder="Brief summary of the post..."
            />
          </div>

          {/* Content - HTML Editor */}
          <div>
            <label className="block mb-2 font-medium text-ink">Content *</label>
            <HtmlEditorEnhanced
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your content here..."
              onImageClick={() => setIsMediaDrawerOpen(true)}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-2 font-medium text-ink">
              Cover Image
            </label>
            {formData.coverImage && (
              <div className="mb-3 relative group">
                <Image
                  src={formData.coverImage}
                  alt="Cover preview"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                {(isEditing || isCreating) && (
                  <button
                    onClick={() => setFormData({ ...formData, coverImage: "" })}
                    className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                type="text"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                placeholder="Or paste image URL..."
                className="flex-1"
              />
              {(isEditing || isCreating) && (
                <Button
                  onClick={() => setIsMediaDrawerOpen(true)}
                  variant="outline"
                >
                  Browse
                </Button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-2 font-medium text-ink">Tags</label>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={!isEditing && !isCreating}
                placeholder="Add a tag..."
              />
              <Button
                onClick={handleAddTag}
                disabled={!isEditing && !isCreating}
                variant="outline"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent rounded-full"
                >
                  <Tag className="w-4 h-4 text-accent" />
                  <span className="text-sm text-ink">{tag}</span>
                  {(isEditing || isCreating) && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-accent hover:opacity-70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Published Status */}
          <div className="flex items-center justify-between p-4 bg-base border border-border rounded-lg">
            <div>
              <label className="text-ink font-medium">Published Status</label>
              <p className="text-sm text-muted">
                {formData.published
                  ? "Visible to public"
                  : "Hidden from public"}
              </p>
            </div>
            <Button
              onClick={() =>
                setFormData({ ...formData, published: !formData.published })
              }
              disabled={!isEditing && !isCreating}
              variant={formData.published ? "accent" : "outline"}
              className="gap-2"
            >
              {formData.published ? (
                <>
                  <Eye className="w-4 h-4" />
                  Published
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Draft
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Media Drawer */}
      <MediaDrawer
        isOpen={isMediaDrawerOpen}
        onClose={() => setIsMediaDrawerOpen(false)}
        onSelect={handleMediaSelect}
        title="Select Image"
        description="Choose an image for your blog post"
      />
    </div>
  );
};

export default BlogPostsTabEnhanced;
