"use client";

import { useState, useEffect, useRef } from "react";
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
  Home,
  Star,
  X,
  Loader2,
  Edit2,
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
import { MediaDrawer } from "../components/MediaDrawer";

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

interface GalleryItem {
  _id: Id<"homeGallery">;
  position: number;
  url: string;
  alt: string;
  description?: string;
}

const MediaTabEnhanced = () => {
  const organizedMedia = useQuery(api.media.getOrganized);
  const deleteMediaMutation = useMutation(api.media.deleteMedia);
  const createMedia = useMutation(api.media.create);
  const assignMedia = useMutation(api.media.assign);
  const unassignMedia = useMutation(api.media.unassign);
  const updateMedia = useMutation(api.media.update);

  // Home Gallery
  const galleryItems = useQuery(api.homeGallery.getAll) as
    | GalleryItem[]
    | undefined;
  const setGalleryPosition = useMutation(api.homeGallery.setPosition);
  const removeGalleryPosition = useMutation(api.homeGallery.removePosition);
  const updateGalleryMetadata = useMutation(api.homeGallery.updateMetadata);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [expandedGalleries, setExpandedGalleries] = useState<Set<string>>(
    new Set(["galleries"])
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Gallery management state
  const [selectedGallerySlot, setSelectedGallerySlot] = useState<number | null>(
    null
  );
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [editingGallerySlot, setEditingGallerySlot] = useState<number | null>(
    null
  );
  const [galleryAltText, setGalleryAltText] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");

  // Image metadata editing state
  const [editingImageId, setEditingImageId] = useState<Id<"media"> | null>(
    null
  );
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editImageAlt, setEditImageAlt] = useState("");
  const [editImageFilename, setEditImageFilename] = useState("");

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

  const handleEditImage = (image: MediaFile) => {
    setEditingImageId(image._id);
    setEditImageAlt(image.altText || "");
    setEditImageFilename(image.filename);
    setIsEditDrawerOpen(true);
  };

  const handleSaveImageMetadata = async () => {
    if (!editingImageId) return;
    try {
      await updateMedia({
        id: editingImageId,
        altText: editImageAlt,
        filename: editImageFilename,
      });
      setSuccess("Image metadata updated");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update image")
      );
    }
    setIsEditDrawerOpen(false);
    setEditingImageId(null);
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

  const toggleGalleriesExpanded = (id: string) => {
    const newExpanded = new Set(expandedGalleries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedGalleries(newExpanded);
  };

  // Gallery handlers
  const handleGallerySlotClick = (position: number) => {
    setSelectedGallerySlot(position);
    setIsMediaDrawerOpen(true);
  };

  const handleGalleryImageSelect = async (imageUrl: string) => {
    if (selectedGallerySlot === null) return;
    try {
      await setGalleryPosition({
        position: selectedGallerySlot,
        url: imageUrl,
        alt: `Gallery image ${selectedGallerySlot}`,
        description: undefined,
      });
      setSuccess(
        `Image added to slot ${selectedGallerySlot === 1 ? "Featured" : selectedGallerySlot}`
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to set gallery image")
      );
    }
    setSelectedGallerySlot(null);
    setIsMediaDrawerOpen(false);
  };

  const handleRemoveGalleryImage = async (position: number) => {
    try {
      await removeGalleryPosition({ position });
      setSuccess("Image removed from gallery");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to remove gallery image")
      );
    }
  };

  const handleEditGalleryMetadata = (position: number) => {
    const item = galleryItems?.find((i) => i.position === position);
    if (item) {
      setEditingGallerySlot(position);
      setGalleryAltText(item.alt);
      setGalleryDescription(item.description || "");
    }
  };

  const handleSaveGalleryMetadata = async () => {
    if (editingGallerySlot === null) return;
    try {
      await updateGalleryMetadata({
        position: editingGallerySlot,
        alt: galleryAltText,
        description: galleryDescription || undefined,
      });
      setSuccess("Gallery metadata updated");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update metadata")
      );
    }
    setEditingGallerySlot(null);
  };

  const getGalleryItemByPosition = (
    position: number
  ): GalleryItem | undefined => {
    return galleryItems?.find((item) => item.position === position);
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
          <div className="flex items-center gap-1 bg-(--color-muted-accent) rounded-lg p-1">
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
            className="w-full pl-10 pr-4 py-2 bg-(--color-muted-accent) rounded-lg text-ink text-sm focus:ring-2 focus:ring-accent focus:outline-none"
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
        <div className="w-64 bg-(--color-panel) border border-(--color-border) rounded-2xl overflow-hidden flex flex-col shrink-0">
          <div className="p-4 bg-(--color-muted-accent)">
            <h3 className="font-semibold text-ink">Library</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* All Images */}
            <button
              onClick={() => setSelectedView("all")}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                selectedView === "all"
                  ? "bg-(--color-foreground) text-(--color-panel)"
                  : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-ink"
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
                  : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-ink"
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
                            : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-ink"
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
                            : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-ink"
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

            {/* Galleries Section */}
            <div className="mt-4 pt-4 border-t border-(--color-border)">
              <button
                onClick={() => toggleGalleriesExpanded("galleries")}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition"
              >
                {expandedGalleries.has("galleries") ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                Galleries
              </button>
              {expandedGalleries.has("galleries") && (
                <div className="space-y-1 pl-2">
                  <button
                    onClick={() => setSelectedView("home-gallery")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm flex items-center gap-2 ${
                      selectedView === "home-gallery"
                        ? "bg-(--color-foreground) text-(--color-panel)"
                        : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-ink"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    Home Page Gallery
                    <span
                      className={`text-xs ml-auto ${
                        selectedView === "home-gallery"
                          ? "opacity-70"
                          : "text-muted"
                      }`}
                    >
                      ({galleryItems?.length || 0}/6)
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Image Grid/List */}
        <div className="flex-1 min-w-0 overflow-auto">
          {/* Home Page Gallery View */}
          {selectedView === "home-gallery" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink">
                    Home Page Gallery
                  </h2>
                  <p className="text-sm text-muted">
                    Click on a slot to add or replace an image
                  </p>
                </div>
              </div>

              {/* Gallery Grid - 1 Featured + 5 Others */}
              <div className="grid grid-cols-3 gap-4">
                {/* Featured Image (Position 1) - full width */}
                <div className="col-span-3">
                  <p className="text-xs text-muted mb-2 flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent" />
                    Featured Image
                  </p>
                  {(() => {
                    const item = getGalleryItemByPosition(1);
                    return (
                      <button
                        onClick={() => handleGallerySlotClick(1)}
                        className={`relative w-full aspect-square rounded-xl overflow-hidden transition group ${
                          item
                            ? "bg-(--color-muted-accent)"
                            : "bg-(--color-muted-accent) border-2 border-dashed border-(--color-border) hover:border-accent"
                        }`}
                      >
                        {item ? (
                          <>
                            <Image
                              src={item.url}
                              alt={item.alt}
                              fill
                              className="object-cover"
                              sizes="600px"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                              <span className="px-3 py-1 bg-accent text-black rounded-lg text-sm font-medium">
                                Replace
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveGalleryImage(1);
                                }}
                                className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-muted">
                            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                            <span>Click to add featured image</span>
                          </div>
                        )}
                      </button>
                    );
                  })()}
                </div>

                {/* Slots 2–6 (3 × 2 grid) */}
                {[2, 3, 4, 5, 6].map((position) => {
                  const item = getGalleryItemByPosition(position);
                  return (
                    <div key={position}>
                      <p className="text-xs text-muted mb-2">Slot {position}</p>
                      <button
                        onClick={() => handleGallerySlotClick(position)}
                        className={`relative w-full aspect-square rounded-xl overflow-hidden transition group ${
                          item
                            ? "bg-(--color-muted-accent)"
                            : "bg-(--color-muted-accent) border-2 border-dashed border-(--color-border) hover:border-accent"
                        }`}
                      >
                        {item ? (
                          <>
                            <Image
                              src={item.url}
                              alt={item.alt}
                              fill
                              className="object-cover"
                              sizes="200px"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                              <span className="px-2 py-1 bg-accent text-black rounded text-xs font-medium">
                                Replace
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveGalleryImage(position);
                                }}
                                className="p-1.5 bg-red-500 rounded hover:bg-red-600 transition"
                              >
                                <Trash2 className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-muted">
                            <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                            <span className="text-xs">Add image</span>
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : filteredImages.length === 0 ? (
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
                  className="group relative aspect-square rounded-lg overflow-hidden bg-(--color-muted-accent) transition"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || image.filename}
                    fill
                    className="object-cover group-hover:brightness-50 transition"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-accent/80 rounded-lg hover:bg-accent transition"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </a>
                    <button
                      onClick={() => handleEditImage(image)}
                      className="p-2 bg-blue-500/80 rounded-lg hover:bg-blue-500 transition"
                    >
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(image._id)}
                      className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 opacity-0 group-hover:opacity-100 transition">
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
                  className="flex items-center gap-4 p-3 bg-(--color-muted-accent) rounded-lg hover:ring-2 hover:ring-accent transition"
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
                      onClick={() => handleEditImage(image)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
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
          <div className="bg-(--color-panel) rounded-2xl p-6 max-w-sm w-full border border-(--color-border)">
            <h3 className="text-lg font-bold text-ink mb-4">Delete Image?</h3>
            <p className="text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDeleteImage(deleteConfirm as Id<"media">)}
                variant="outline"
                className="flex-1 text-red-500 hover:bg-red-500/10 hover:text-red-400 border-red-500/30"
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

      {/* Edit Image Metadata Modal */}
      {isEditDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-panel) rounded-2xl p-6 max-w-sm w-full border border-(--color-border)">
            <h3 className="text-lg font-bold text-ink mb-4">
              Edit Image Metadata
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={editImageAlt}
                  onChange={(e) => setEditImageAlt(e.target.value)}
                  className="w-full px-4 py-2 bg-(--color-muted-accent) rounded-lg text-ink focus:ring-2 focus:ring-accent focus:outline-none"
                  placeholder="Describe the image..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Filename
                </label>
                <input
                  type="text"
                  value={editImageFilename}
                  onChange={(e) => setEditImageFilename(e.target.value)}
                  className="w-full px-4 py-2 bg-(--color-muted-accent) rounded-lg text-ink focus:ring-2 focus:ring-accent focus:outline-none"
                  placeholder="Image filename..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSaveImageMetadata}
                variant="accent"
                className="flex-1"
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsEditDrawerOpen(false);
                  setEditingImageId(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Drawer for Gallery Image Selection */}
      <MediaDrawer
        isOpen={isMediaDrawerOpen}
        onClose={() => {
          setIsMediaDrawerOpen(false);
          setSelectedGallerySlot(null);
        }}
        onSelect={handleGalleryImageSelect}
        title={`Select Image for ${selectedGallerySlot === 1 ? "Featured Slot" : `Slot ${selectedGallerySlot}`}`}
        description="Choose an image from your media library or upload a new one"
      />
    </div>
  );
};

export default MediaTabEnhanced;
