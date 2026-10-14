"use client";

import { useState } from "react";
import {
  Search,
  Upload,
  Trash2,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Home,
  Pencil,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Modal } from "@/components/ui/dialog";
import Image from "next/image";
import { MediaDrawer } from "../components/MediaDrawer";

// Derived from the Convex schema (SSOT) instead of hand-rolled shapes.
type MediaFile = Doc<"media">;

type GalleryItem = Doc<"homeGallery">;

const MediaTabEnhanced = () => {
  const organizedMedia = useQuery(api.media.getOrganized);
  const deleteMediaMutation = useMutation(api.media.deleteMedia);
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
    if (selectedGallerySlot === null) {
      setIsMediaDrawerOpen(false);
      return;
    }
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
    return <Spinner label="Loading media..." />;
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
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              className={`p-2 rounded transition ${
                viewMode === "grid"
                  ? "bg-(--color-foreground) text-(--color-base)"
                  : "text-muted hover:text-ink"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
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

        {/* Upload Button */}
        <div className="col-span-2 flex justify-end">
          <Button
            variant="primary"
            className="gap-2 w-full md:w-auto"
            onClick={() => {
              setSelectedGallerySlot(null);
              setIsMediaDrawerOpen(true);
            }}
          >
            <Upload className="w-4 h-4" />
            Upload Images
          </Button>
        </div>
      </div>

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
                className="text-xs ml-2"
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
                className="text-xs ml-2"
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
                              ? ""
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
                              ? ""
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
                          ? ""
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

        {/* Main panel: the home gallery's six slots, or the selected library view. */}
        <div className="flex-1 min-w-0 overflow-auto">
          {selectedView === "home-gallery" ? (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((position) => {
                const item = getGalleryItemByPosition(position);
                return (
                  <div key={position}>
                    <p className="text-xs text-muted mb-2">
                      {position === 1 ? "Featured Image" : `Slot ${position}`}
                    </p>
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
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveGalleryImage(position);
                              }}
                              className="size-6"
                              aria-label="Remove image from slot"
                            >
                              <Trash2 className="w-3 h-3" aria-hidden="true" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted">
                          <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                          <span className="text-xs">Add image</span>
                        </div>
                      )}
                    </button>
                    {item && (
                      <div className="mt-2 flex items-start justify-between gap-2">
                        <p className="text-xs text-muted line-clamp-2" title={item.alt}>
                          {item.alt || "No alt text"}
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="shrink-0 gap-1"
                          onClick={() => handleEditGalleryMetadata(position)}
                          aria-label={`Edit details for ${position === 1 ? "the featured image" : `slot ${position}`}`}
                        >
                          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                          Edit details
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="h-full min-h-48 flex flex-col items-center justify-center text-muted">
              <ImageIcon className="w-8 h-8 mb-2" aria-hidden="true" />
              <p className="text-sm">
                {searchQuery ? `No images match "${searchQuery}".` : "No images here yet."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" aria-label="Images">
              {filteredImages.map((img) => (
                <li key={img._id} className="bg-(--color-panel) border border-(--color-border) rounded-xl overflow-hidden">
                  <div className="relative aspect-square bg-(--color-muted-accent)">
                    <Image src={img.url} alt={img.altText || ""} fill className="object-cover" sizes="240px" />
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-sm font-medium text-ink truncate" title={img.filename}>{img.filename}</p>
                    <p className="text-xs text-muted truncate">{img.assignedToTitle || "Unassigned"}</p>
                    <div className="flex gap-2 pt-1">
                      <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleEditImage(img)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteConfirm(img._id)}
                        aria-label={`Delete ${img.filename}`} className="text-(--color-danger) hover:bg-(--color-danger)/10">
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="divide-y divide-(--color-border) bg-(--color-panel) border border-(--color-border) rounded-xl" aria-label="Images">
              {filteredImages.map((img) => (
                <li key={img._id} className="flex items-center gap-3 p-3">
                  <div className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-(--color-muted-accent)">
                    <Image src={img.url} alt={img.altText || ""} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{img.filename}</p>
                    <p className="text-xs text-muted truncate">
                      {img.assignedToTitle || "Unassigned"}
                      {img.size ? ` · ${Math.round(img.size / 1024)} KB` : ""}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleEditImage(img)}>Edit</Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleteConfirm(img._id)}
                    aria-label={`Delete ${img.filename}`} className="text-(--color-danger) hover:bg-(--color-danger)/10">
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
          title="Delete Image?"
          onConfirm={() => handleDeleteImage(deleteConfirm as Id<"media">)}
        />
      )}

      {/* Edit Gallery Slot Metadata Modal */}
      <Modal
        open={editingGallerySlot !== null}
        onOpenChange={(open) => !open && setEditingGallerySlot(null)}
        title={editingGallerySlot === 1 ? "Featured Image Details" : `Slot ${editingGallerySlot} Details`}
        className="max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="gallery-alt" className="block text-sm font-medium text-ink mb-2">
              Alt Text
            </label>
            <input
              id="gallery-alt"
              type="text"
              value={galleryAltText}
              onChange={(e) => setGalleryAltText(e.target.value)}
              className="w-full px-4 py-2 bg-(--color-muted-accent) rounded-lg text-ink focus:ring-2 focus:ring-accent focus:outline-none"
              placeholder="Describe the image for screen readers..."
            />
          </div>
          <div>
            <label htmlFor="gallery-description" className="block text-sm font-medium text-ink mb-2">
              Caption
            </label>
            <textarea
              id="gallery-description"
              value={galleryDescription}
              onChange={(e) => setGalleryDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-(--color-muted-accent) rounded-lg text-ink focus:ring-2 focus:ring-accent focus:outline-none resize-none"
              placeholder="Shown under the photo in the gallery..."
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button onClick={handleSaveGalleryMetadata} variant="primary" className="flex-1" disabled={!galleryAltText.trim()}>
            Save
          </Button>
          <Button onClick={() => setEditingGallerySlot(null)} variant="secondary" className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Edit Image Metadata Modal */}
      <Modal
        open={isEditDrawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditDrawerOpen(false);
            setEditingImageId(null);
          }
        }}
        title="Edit Image Metadata"
        className="max-w-sm"
      >
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
            variant="primary"
            className="flex-1"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setIsEditDrawerOpen(false);
              setEditingImageId(null);
            }}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Media Drawer for Gallery Image Selection */}
      <MediaDrawer
        isOpen={isMediaDrawerOpen}
        onClose={() => {
          setIsMediaDrawerOpen(false);
          setSelectedGallerySlot(null);
        }}
        onSelect={handleGalleryImageSelect}
        title={
          selectedGallerySlot === null
            ? "Upload to Media Library"
            : `Select Image for ${selectedGallerySlot === 1 ? "Featured Slot" : `Slot ${selectedGallerySlot}`}`
        }
        description="Choose an image from your media library or upload a new one"
      />
    </div>
  );
};

export default MediaTabEnhanced;
