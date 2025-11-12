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
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useUploadThing } from "@/utils/uploadthing";

// Helper to get assigned media for a post
function getPostCoverImage(postId: string, allMedia: any[]) {
  const media = allMedia.find(
    (m) => m.assignedToType === "blogPost" && m.assignedToId === postId
  );
  return media?.url;
}

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

const BlogPostsTab = () => {
  const posts = useQuery(api.blogPosts.getAllPostsAdmin) ?? [];
  const allMedia = useQuery(api.media.getAll) ?? [];
  const createPost = useMutation(api.blogPosts.createPost);
  const updatePost = useMutation(api.blogPosts.updatePost);
  const deletePost = useMutation(api.blogPosts.deletePost);
  const createMedia = useMutation(api.media.create);
  const assignMedia = useMutation(api.media.assign);

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        // Create media entry and assign to current post
        const mediaId = await createMedia({
          url: res[0].url,
          filename: res[0].name || "Blog cover image",
          size: res[0].size,
        });

        // If editing existing post, assign immediately
        if (selectedPost && !isCreating) {
          await assignMedia({
            mediaId: mediaId as Id<"media">,
            assignedToType: "blogPost",
            assignedToId: selectedPost._id,
            assignedToTitle: selectedPost.title,
          });
        }

        setFormData({ ...formData, coverImage: res[0].url });
        setIsUploading(false);
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
      alert("Upload failed: " + error.message);
    },
  });

  // Form state
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

  // Initialize selected post
  useEffect(() => {
    if (posts.length > 0 && !selectedPost && !isCreating) {
      setSelectedPost(posts[0] as BlogPost);
    }
  }, [posts, selectedPost, isCreating]);

  // Update form when post selection changes
  useEffect(() => {
    if (selectedPost && !isCreating) {
      // Get cover image from media first, fallback to old field
      const coverImage = getPostCoverImage(selectedPost._id, allMedia) || selectedPost.coverImage || "";

      setFormData({
        title: selectedPost.title,
        slug: selectedPost.slug,
        excerpt: selectedPost.excerpt,
        content: selectedPost.content,
        coverImage,
        tags: selectedPost.tags || [],
        published: selectedPost.published,
      });
      setIsEditing(false);
    }
  }, [selectedPost, isCreating, allMedia]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
        // Create new post
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
        // Update existing post
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
      console.error("Failed to save post:", error);
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
        console.error("Failed to delete post:", error);
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
      tags: formData.tags.filter(tag => tag !== tagToRemove),
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

  // Show empty state
  if (!posts.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
          <p className="text-[#9ca3af] mb-4">No blog posts yet.</p>
          <p className="text-[#6b7280]">Use the Settings tab to seed initial data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Posts List */}
      <div className="w-80 bg-[#111418] border border-[#1f242b] rounded-2xl p-4 flex flex-col">
        <div className="mb-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>
          <button
            onClick={handleCreateNew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredPosts.map((post) => (
            <button
              key={post._id}
              onClick={() => {
                setSelectedPost(post as BlogPost);
                setIsCreating(false);
              }}
              className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                selectedPost?._id === post._id && !isCreating
                  ? "bg-[#1a1e24] border border-[#4ade80]"
                  : "bg-[#0b0d10] border border-[#1f242b] hover:border-[#4ade80]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {post.published ? (
                  <Eye className="w-3 h-3 text-[#4ade80]" />
                ) : (
                  <EyeOff className="w-3 h-3 text-[#9ca3af]" />
                )}
                <span className="text-[#f3f4f6] font-medium truncate">
                  {post.title}
                </span>
              </div>
              <p className="text-xs text-[#9ca3af] truncate mb-2">
                {post.excerpt}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-[#1a1e24] text-[#4ade80] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-[#111418] border border-[#1f242b] rounded-2xl p-6 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-[#f3f4f6] font-bold">
              {isCreating ? "Create New Post" : "Edit Blog Post"}
            </h2>
            {selectedPost && !isCreating && (
              <p className="text-[#9ca3af] mt-1">
                Last updated: {new Date(selectedPost.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditing && !isCreating && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
            {(isEditing || isCreating) && (
              <button
                onClick={isCreating ? handleCancelCreate : () => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1e24] text-[#f3f4f6] rounded-lg hover:bg-[#1f242b] transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              disabled={!isEditing && !isCreating}
              className="w-full px-4 py-3 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80] disabled:opacity-50"
              placeholder="Enter post title..."
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              disabled={!isEditing && !isCreating}
              className="w-full px-4 py-3 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80] disabled:opacity-50"
              placeholder="post-slug"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              disabled={!isEditing && !isCreating}
              rows={2}
              className="w-full px-4 py-3 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80] resize-none disabled:opacity-50"
              placeholder="Brief description of the post..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">
              Content (Markdown)
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              disabled={!isEditing && !isCreating}
              rows={12}
              className="w-full px-4 py-3 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80] resize-none font-mono text-sm disabled:opacity-50"
              placeholder="# Post Title&#10;&#10;Your markdown content here..."
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">
              Cover Image
            </label>

            {/* Image Preview */}
            {formData.coverImage && (
              <div className="mb-3 relative group">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg border border-[#1f242b]"
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

            {/* Upload Button */}
            {(isEditing || isCreating) && (
              <div className="mb-3">
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1e24] border border-[#1f242b] rounded-lg text-[#f3f4f6] hover:border-[#4ade80] hover:bg-[#1f242b] transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </>
                  )}
                </label>
              </div>
            )}

            {/* Manual URL Input */}
            <div className="relative">
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                disabled={!isEditing && !isCreating}
                className="w-full px-4 py-3 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80] disabled:opacity-50"
                placeholder="Or paste image URL..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                disabled={!isEditing && !isCreating}
                className="flex-1 px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80] disabled:opacity-50"
                placeholder="Add tag..."
              />
              <button
                onClick={handleAddTag}
                disabled={!isEditing && !isCreating}
                className="px-4 py-2 bg-[#1a1e24] text-[#f3f4f6] rounded-lg hover:bg-[#1f242b] transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 bg-[#1a1e24] text-[#4ade80] rounded-lg"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  {(isEditing || isCreating) && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#0b0d10] rounded-lg border border-[#1f242b]">
            <div>
              <label className="text-[#f3f4f6] font-medium">
                Published Status
              </label>
              <p className="text-[#9ca3af]">
                {formData.published ? "Visible to public" : "Hidden from public"}
              </p>
            </div>
            <button
              onClick={() => setFormData({ ...formData, published: !formData.published })}
              disabled={!isEditing && !isCreating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                formData.published
                  ? "bg-[#4ade80] text-[#0b0d10]"
                  : "bg-[#1a1e24] text-[#f3f4f6]"
              }`}
            >
              {formData.published ? (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Published
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  Draft
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Save Button */}
        {(isEditing || isCreating) && (
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {isCreating ? "Create Post" : "Save Changes"}
            </button>

            {saveStatus === "success" && (
              <div className="flex items-center gap-2 text-[#4ade80]">
                <CheckCircle className="w-4 h-4" />
                <span>Saved successfully!</span>
              </div>
            )}

            {saveStatus === "error" && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span>Failed to save</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostsTab;
