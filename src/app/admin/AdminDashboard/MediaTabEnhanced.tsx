"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Upload,
  Trash2,
  Download,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronRight,
  Filter,
  ImageIcon,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useUploadThing } from "@/utils/uploadthing";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MediaFile {
  _id: Id<"media">;
  url: string;
  filename: string;
  altText?: string;
  size?: number;
  assignedToType?: string;
  assignedToId?: string;
  assignedToTitle?: string;
  uploadedAt: number;
}

const MediaTabEnhanced = () => {
  const organizedMedia = useQuery(api.media.getOrganized);
  const deleteMediaMutation = useMutation(api.media.deleteMedia);
  const createMedia = useMutation(api.media.create);
  const assignMedia = useMutation(api.media.assign);
  const unassignMedia = useMutation(api.media.unassign);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      if (res) {
        for (const file of res) {
          await createMedia({
            url: file.url,
            filename: file.name || "Untitled",
            size: file.size,
          });
        }
        setSuccess(`Successfully uploaded ${res.length} file(s)`);
        setTimeout(() => setSuccess(null), 3000);
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      setError(error);
      setIsUploading(false);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    await startUpload(Array.from(files));
  };

  const handleDeleteImage = async (mediaId: Id<"media">) => {
    try {
      await deleteMediaMutation({ id: mediaId });
      setSuccess("Image deleted successfully");
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete image")
      );
    }
  };

  const togglePageExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const togglePostExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  if (!organizedMedia) {
    return <LoadingSpinner message="Loading media..." />;
  }

  const getCurrentImages = (): MediaFile[] => {
    if (selectedView === "all") {
      return [
        ...organizedMedia.pages.flatMap((p) => p.images),
        ...organizedMedia.blogPosts.flatMap((p) => p.images),
        ...organizedMedia.unassigned,
      ];
    } else if (selectedView === "unassigned") {
      return organizedMedia.unassigned;
    } else if (selectedView.startsWith("page-")) {
      const pageId = selectedView.replace("page-", "");
      const page = organizedMedia.pages.find((p) => p.id === pageId);
      return page?.images || [];
    } else if (selectedView.startsWith("post-")) {
      const postId = selectedView.replace("post-", "");
      const post = organizedMedia.blogPosts.find((p) => p.id === postId);
      return post?.images || [];
    }
    return [];
  };

  const currentImages = getCurrentImages();

  const filteredImages = currentImages.filter((img) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      img.filename.toLowerCase().includes(query) ||
      img.altText?.toLowerCase().includes(query) ||
      img.assignedToTitle?.toLowerCase().includes(query)
    );
  });

  const totalImages =
    organizedMedia.pages.reduce((sum, p) => sum + p.images.length, 0) +
    organizedMedia.blogPosts.reduce((sum, p) => sum + p.images.length, 0) +
    organizedMedia.unassigned.length;

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Status Messages */}
      {error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}
      {success && (
        <SuccessDisplay message={success} onDismiss={() => setSuccess(null)} />
      )}

      {/* Header Actions */}
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-ink font-medium">
            <ImageIcon className="w-5 h-5 text-accent" />
            <span>{totalImages} images</span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-base rounded-lg p-1 border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition ${
                viewMode === "grid"
                  ? "bg-(--color-foreground) text-(--color-base)"
                  : "text-muted hover:text-ink"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition ${
                viewMode === "list"
                  ? "bg-(--color-foreground) text-(--color-base)"
                  : "text-muted hover:text-ink"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="relative col-span-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-base border border-border rounded-lg text-ink text-sm focus:ring-2 focus:ring-accent focus:border-accent"
          />
        </div>

        {/* Upload Button - Homepage Style */}
        <div className="col-span-2 flex justify-end">
          <Button
            variant="accent"
            className="gap-2 w-full md:w-auto"
            disabled={isUploading}
            asChild
          >
            <label className="cursor-pointer">
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Upload Images"}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center gap-2 text-accent">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Sidebar - Library */}
        <div className="w-64 border border-border rounded-lg bg-panel overflow-hidden flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-ink">Library</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* All Images */}
            <button
              onClick={() => setSelectedView("all")}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                selectedView === "all"
                  ? "bg-(--color-foreground) text-(--color-panel)"
                  : "hover:bg-surface-hover text-ink"
              }`}
            >
              All Images
              <span
                className={`text-xs ml-2 ${
                  selectedView === "all" ? "opacity-70" : "opacity-70"
                }`}
              >
                ({totalImages})
              </span>
            </button>

            {/* Unassigned */}
            <button
              onClick={() => setSelectedView("unassigned")}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                selectedView === "unassigned"
                  ? "bg-(--color-foreground) text-(--color-panel)"
                  : "hover:bg-surface-hover text-ink"
              }`}
            >
              Unassigned
              <span
                className={`text-xs ml-2 ${
                  selectedView === "unassigned" ? "opacity-70" : "opacity-70"
                }`}
              >
                ({organizedMedia.unassigned.length})
              </span>
            </button>

            {/* Pages Section */}
            {organizedMedia.pages.length > 0 && (
              <div>
                <button
                  onClick={() => togglePageExpanded("pages")}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition"
                >
                  {expandedPages.has("pages") ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  Pages
                </button>
                {expandedPages.has("pages") && (
                  <div className="space-y-1 pl-2">
                    {organizedMedia.pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => setSelectedView(`page-${page.id}`)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                          selectedView === `page-${page.id}`
                            ? "bg-(--color-foreground) text-(--color-panel)"
                            : "hover:bg-surface-hover text-ink"
                        }`}
                      >
                        {page.title}
                        <span
                          className={`text-xs ml-2 ${
                            selectedView === `page-${page.id}`
                              ? "opacity-70"
                              : "text-muted"
                          }`}
                        >
                          ({page.images.length})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Blog Posts Section */}
            {organizedMedia.blogPosts.length > 0 && (
              <div>
                <button
                  onClick={() => togglePostExpanded("posts")}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition"
                >
                  {expandedPosts.has("posts") ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  Blog Posts
                </button>
                {expandedPosts.has("posts") && (
                  <div className="space-y-1 pl-2">
                    {organizedMedia.blogPosts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => setSelectedView(`post-${post.id}`)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                          selectedView === `post-${post.id}`
                            ? "bg-(--color-foreground) text-(--color-panel)"
                            : "hover:bg-surface-hover text-ink"
                        }`}
                      >
                        {post.title}
                        <span
                          className={`text-xs ml-2 ${
                            selectedView === `post-${post.id}`
                              ? "opacity-70"
                              : "text-muted"
                          }`}
                        >
                          ({post.images.length})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Image Grid/List */}
        <div className="flex-1 min-w-0 overflow-auto">
          {/* Images */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 mx-auto text-muted opacity-50 mb-4" />
              <p className="text-muted">
                {searchQuery ? "No images found" : "No images in this view"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image._id}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-accent transition"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || image.filename}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </a>
                    <button
                      onClick={() => setDeleteConfirm(image._id)}
                      className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition">
                    <p className="text-xs text-white truncate">
                      {image.filename}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map((image) => (
                <div
                  key={image._id}
                  className="flex items-center gap-4 p-3 border border-border rounded-lg hover:border-accent transition"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={image.url}
                      alt={image.altText || image.filename}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-medium truncate">
                      {image.filename}
                    </p>
                    {image.assignedToTitle && (
                      <p className="text-sm text-muted truncate">
                        Assigned to: {image.assignedToTitle}
                      </p>
                    )}
                    {image.size && (
                      <p className="text-xs text-muted">
                        {(image.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted hover:text-ink transition"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setDeleteConfirm(image._id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-panel rounded-2xl p-6 max-w-sm w-full border border-border">
            <h3 className="text-lg font-bold text-ink mb-4">Delete Image?</h3>
            <p className="text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDeleteImage(deleteConfirm as Id<"media">)}
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

export default MediaTabEnhanced;
