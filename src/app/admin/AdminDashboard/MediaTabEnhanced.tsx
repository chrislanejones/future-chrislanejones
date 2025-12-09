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
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useUploadThing } from "@/utils/uploadthing";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { LoadingSpinner } from "../components/LoadingSpinner";
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
      {/* Header */}
      {error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}
      {success && (
        <SuccessDisplay message={success} onDismiss={() => setSuccess(null)} />
      )}

      <div className="bg-panel border border-border rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Media Library</h2>
            <p className="text-sm text-muted">{totalImages} total images</p>
          </div>

          <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-on-accent hover:shadow-glow transition font-medium cursor-pointer">
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload Images"}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 overflow-hidden flex gap-6">
        {/* Sidebar */}
        <div className="w-64 border border-border rounded-lg bg-panel overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border space-y-2">
            <button
              onClick={() => setSelectedView("all")}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                selectedView === "all"
                  ? "bg-accent text-on-accent"
                  : "hover:bg-surface-hover text-ink"
              }`}
            >
              All Images
            </button>
            <button
              onClick={() => setSelectedView("unassigned")}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                selectedView === "unassigned"
                  ? "bg-accent text-on-accent"
                  : "hover:bg-surface-hover text-ink"
              }`}
            >
              Unassigned ({organizedMedia.unassigned.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {/* Pages Section */}
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
                          ? "bg-accent text-on-accent"
                          : "hover:bg-surface-hover text-ink"
                      }`}
                    >
                      {page.title}
                      <span className="text-xs text-muted ml-2">
                        ({page.images.length})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                            ? "bg-accent text-on-accent"
                            : "hover:bg-surface-hover text-ink"
                        }`}
                      >
                        {post.title}
                        <span className="text-xs text-muted ml-2">
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

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-panel border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-accent text-on-accent"
                    : "hover:bg-surface-hover text-muted"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-accent text-on-accent"
                    : "hover:bg-surface-hover text-muted"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid/List View */}
          <div className="flex-1 overflow-y-auto">
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted">
                  {searchQuery ? "No images found" : "No images yet"}
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
                      className="object-cover group-hover:scale-105 transition"
                      sizes="150px"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
                      <div className="flex justify-end gap-1">
                        {deleteConfirm === image._id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDeleteImage(image._id)}
                              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(image._id)}
                            className="p-1 bg-red-500/80 text-white rounded hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div>
                        <p className="text-white text-xs font-medium truncate">
                          {image.filename}
                        </p>
                        {image.assignedToTitle && (
                          <p className="text-white/70 text-xs truncate">
                            → {image.assignedToTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredImages.map((image) => (
                  <div
                    key={image._id}
                    className="flex items-center gap-4 p-3 bg-base rounded-lg border border-border hover:border-accent transition group"
                  >
                    <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
                      <Image
                        src={image.url}
                        alt={image.altText || image.filename}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink truncate">
                        {image.filename}
                      </p>
                      {image.assignedToTitle && (
                        <p className="text-sm text-muted truncate">
                          → {image.assignedToTitle}
                        </p>
                      )}
                      <p className="text-xs text-muted">
                        {image.size
                          ? `${(image.size / 1024).toFixed(1)} KB`
                          : "Unknown size"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      {deleteConfirm === image._id ? (
                        <>
                          <button
                            onClick={() => handleDeleteImage(image._id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(image._id)}
                          className="p-2 bg-red-500/80 text-white rounded hover:bg-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTabEnhanced;
