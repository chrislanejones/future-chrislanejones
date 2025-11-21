// src/app/admin/AdminDashboard/MediaTab.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  FileText,
  Upload,
  Plus,
  Trash2,
  Home,
  User,
  Briefcase,
  Chrome,
  LayoutGrid,
  Users,
  Calendar,
  Link2,
  Wrench,
  Code2,
  History,
  Award,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useUploadThing } from "@/utils/uploadthing";

// Page icons map - ALL pages included
const PAGE_ICONS: Record<string, any> = {
  home: Home,
  about: User,
  career: Briefcase,
  projects: Code2,
  contact: Users,
  "wordpress-maintenance": Wrench,
  "react-maintenance": Code2,
  "browser-tabs": Chrome,
  conferences: Calendar,
  "site-history": History,
  "about-the-logo": Award,
  "link-page": Link2,
  gallery: ImageIcon, // Fallback for any other pages
};

const MediaTab = () => {
  const organizedMedia = useQuery(api.media.getOrganized);
  const assignMedia = useMutation(api.media.assign);
  const unassignMedia = useMutation(api.media.unassign);
  const deleteMediaMutation = useMutation(api.media.deleteMedia);
  const createMedia = useMutation(api.media.create);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState<string>("all");
  const [pagesExpanded, setPagesExpanded] = useState(true);
  const [blogPostsExpanded, setBlogPostsExpanded] = useState(true);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [expandedBlogPosts, setExpandedBlogPosts] = useState<Set<string>>(
    new Set()
  );
  const [galleryDrawerOpen, setGalleryDrawerOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
      alert("Upload failed: " + error.message);
    },
  });

  useEffect(() => {
    if (organizedMedia?.pages.length && !selectedView) {
      setSelectedView(`page-${organizedMedia.pages[0].id}`);
    }
  }, [organizedMedia, selectedView]);

  const togglePage = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const toggleBlogPost = (postId: string) => {
    const newExpanded = new Set(expandedBlogPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedBlogPosts(newExpanded);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    await startUpload(Array.from(files));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const mediaId = active.id as string;
    const dropTarget = over.id as string;

    // Handle gallery drawer slots
    if (dropTarget.startsWith("home-gallery-")) {
      const slotIndex = parseInt(dropTarget.replace("home-gallery-", ""));
      const homePage = organizedMedia?.pages.find((p) => p.id === "home");
      if (homePage) {
        await assignMedia({
          mediaId: mediaId as Id<"media">,
          assignedToType: "galleryDrawer",
          assignedToId: `home-slot-${slotIndex}`,
          assignedToTitle: `Gallery Drawer Slot ${slotIndex + 1}`,
        });
      }
    } else if (dropTarget.startsWith("page-")) {
      const pageId = dropTarget.replace("page-", "");
      const page = organizedMedia?.pages.find((p) => p.id === pageId);
      if (page) {
        await assignMedia({
          mediaId: mediaId as Id<"media">,
          assignedToType: "page",
          assignedToId: page.id,
          assignedToTitle: page.title,
        });
      }
    } else if (dropTarget.startsWith("post-")) {
      const postId = dropTarget.replace("post-", "");
      const post = organizedMedia?.blogPosts.find((p) => p.id === postId);
      if (post) {
        await assignMedia({
          mediaId: mediaId as Id<"media">,
          assignedToType: "blogPost",
          assignedToId: post.id,
          assignedToTitle: post.title,
        });
      }
    } else if (dropTarget === "unassigned") {
      await unassignMedia({ mediaId: mediaId as Id<"media"> });
    }

    setActiveId(null);
  };

  const handleDeleteImage = async (mediaId: Id<"media">) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await deleteMediaMutation({ id: mediaId });
    }
  };

  if (!organizedMedia) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getCurrentImages = () => {
    if (selectedView === "all") {
      const allImages = [
        ...organizedMedia.pages.flatMap((p) => p.images),
        ...organizedMedia.blogPosts.flatMap((p) => p.images),
        ...organizedMedia.unassigned,
      ];
      return allImages;
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

  const draggedImage = currentImages.find((img) => img._id === activeId);

  return (
    <TooltipProvider>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="h-full flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r overflow-y-auto bg-panel border-border">
            <div className="py-2 space-y-1">
              {/* All Images */}
              <button
                onClick={() => setSelectedView("all")}
                className={`w-full text-left px-4 py-3 rounded-none transition text-sm flex items-center gap-3 ${
                  selectedView === "all"
                    ? "bg-accent text-on-accent"
                    : "text-ink hover:bg-surface-hover"
                }`}
              >
                <ImageIcon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">All Images</span>
                <span className="text-xs opacity-70">
                  {organizedMedia.pages.reduce(
                    (sum, p) => sum + p.images.length,
                    0
                  ) +
                    organizedMedia.blogPosts.reduce(
                      (sum, p) => sum + p.images.length,
                      0
                    ) +
                    organizedMedia.unassigned.length}
                </span>
              </button>

              {/* Unassigned */}
              <DroppableArea id="unassigned">
                <button
                  onClick={() => setSelectedView("unassigned")}
                  className={`w-full text-left px-4 py-3 rounded-none transition text-sm flex items-center gap-3 ${
                    selectedView === "unassigned"
                      ? "bg-accent text-on-accent"
                      : "text-ink hover:bg-surface-hover"
                  }`}
                >
                  <div className="w-4 h-4 flex-shrink-0 rounded-full border-2 border-dashed border-current" />
                  <span className="flex-1">Unassigned</span>
                  <span className="text-xs opacity-70">
                    ({organizedMedia.unassigned.length})
                  </span>
                </button>
              </DroppableArea>

              {/* Pages Section */}
              <div className="border-t border-border">
                <button
                  onClick={() => setPagesExpanded(!pagesExpanded)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-ink hover:bg-surface-hover transition"
                >
                  {pagesExpanded ? (
                    <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted" />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0 text-muted" />
                  )}
                  <span className="flex-1 text-sm font-medium">Pages</span>
                  <span className="text-xs text-muted">
                    {organizedMedia.pages.reduce(
                      (sum, p) => sum + p.images.length,
                      0
                    )}
                  </span>
                </button>
                {pagesExpanded && (
                  <div className="space-y-1">
                    {organizedMedia.pages.map((page) => {
                      const Icon = PAGE_ICONS[page.id] || FileText;

                      return (
                        <div key={page.id}>
                          {page.id === "home" ? (
                            <div>
                              <button
                                onClick={() => togglePage(page.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-hover transition text-ink"
                              >
                                {expandedPages.has(page.id) ? (
                                  <ChevronDown className="w-3 h-3 text-muted" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-muted" />
                                )}
                                <Icon className="w-4 h-4 text-muted" />
                                <span className="flex-1 truncate text-xs">
                                  {page.title}
                                </span>
                                <span className="text-xs text-muted">
                                  {page.images.length}
                                </span>
                              </button>
                              {expandedPages.has(page.id) && (
                                <button
                                  onClick={() =>
                                    setGalleryDrawerOpen(!galleryDrawerOpen)
                                  }
                                  className={`w-full text-left px-8 py-2 text-xs transition flex items-center gap-2 ${
                                    galleryDrawerOpen
                                      ? "bg-accent text-on-accent"
                                      : "text-muted hover:bg-surface-hover"
                                  }`}
                                >
                                  <LayoutGrid className="w-3 h-3" />
                                  Image gallery drawer
                                </button>
                              )}
                            </div>
                          ) : (
                            <div>
                              <button
                                onClick={() => togglePage(page.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-hover transition text-ink"
                              >
                                {expandedPages.has(page.id) ? (
                                  <ChevronDown className="w-3 h-3 text-muted" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-muted" />
                                )}
                                <Icon className="w-4 h-4 text-muted" />
                                <span className="flex-1 truncate text-xs">
                                  {page.title}
                                </span>
                                <span className="text-xs text-muted">
                                  {page.images.length}
                                </span>
                              </button>
                              {expandedPages.has(page.id) && (
                                <DroppableArea id={`page-${page.id}`}>
                                  <button
                                    onClick={() =>
                                      setSelectedView(`page-${page.id}`)
                                    }
                                    className={`w-full text-left px-8 py-2 text-xs transition flex items-center gap-2 ${
                                      selectedView === `page-${page.id}`
                                        ? "bg-accent text-on-accent"
                                        : "text-muted hover:bg-surface-hover"
                                    }`}
                                  >
                                    <ImageIcon className="w-3 h-3" />
                                    Images
                                  </button>
                                </DroppableArea>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Blog Posts Section */}
              <div className="border-t border-border">
                <button
                  onClick={() => setBlogPostsExpanded(!blogPostsExpanded)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-ink hover:bg-surface-hover transition"
                >
                  {blogPostsExpanded ? (
                    <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted" />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0 text-muted" />
                  )}
                  <span className="flex-1 text-sm font-medium">Blog Posts</span>
                  <span className="text-xs text-muted">
                    {organizedMedia.blogPosts.reduce(
                      (sum, p) => sum + p.images.length,
                      0
                    )}
                  </span>
                </button>
                {blogPostsExpanded && (
                  <div className="space-y-1">
                    {organizedMedia.blogPosts.map((post) => (
                      <div key={post.id}>
                        <div className="flex items-center gap-1 px-4">
                          <button
                            onClick={() => toggleBlogPost(post.id)}
                            className="flex-1 text-left px-0 py-2 text-sm hover:bg-surface-hover transition text-ink flex items-start gap-2"
                          >
                            {expandedBlogPosts.has(post.id) ? (
                              <ChevronDown className="w-3 h-3 text-muted flex-shrink-0 mt-0.5" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-muted flex-shrink-0 mt-0.5" />
                            )}
                            <span className="flex-1 break-words text-xs leading-tight">
                              {post.title}
                            </span>
                            <span className="text-xs text-muted flex-shrink-0">
                              {post.images.length}
                            </span>
                          </button>
                          {post.images.length === 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <label className="p-1 text-accent hover:bg-accent/10 rounded cursor-pointer transition">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      setIsUploading(true);
                                      const uploaded = await startUpload([
                                        file,
                                      ]);
                                      if (uploaded && uploaded[0]) {
                                        const mediaId = await createMedia({
                                          url: uploaded[0].url,
                                          filename:
                                            uploaded[0].name || post.title,
                                          size: uploaded[0].size,
                                        });
                                        await assignMedia({
                                          mediaId: mediaId as Id<"media">,
                                          assignedToType: "blogPost",
                                          assignedToId: post.id,
                                          assignedToTitle: post.title,
                                        });
                                      }
                                      e.target.value = "";
                                    }}
                                    className="hidden"
                                  />
                                  <Plus className="w-3 h-3" />
                                </label>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Quick upload cover image</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        {expandedBlogPosts.has(post.id) && (
                          <DroppableArea id={`post-${post.id}`}>
                            <button
                              onClick={() => setSelectedView(`post-${post.id}`)}
                              className={`w-full text-left px-8 py-2 text-xs transition flex items-center gap-2 ${
                                selectedView === `post-${post.id}`
                                  ? "bg-accent text-on-accent"
                                  : "text-muted hover:bg-surface-hover"
                              }`}
                            >
                              <ImageIcon className="w-3 h-3" />
                              Cover Images
                            </button>
                          </DroppableArea>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-panel border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">
                    {selectedView === "all" && "All Images"}
                    {selectedView === "unassigned" && "Unassigned Images"}
                    {selectedView.startsWith("page-") &&
                      organizedMedia.pages.find(
                        (p) => p.id === selectedView.replace("page-", "")
                      )?.title}
                    {selectedView.startsWith("post-") &&
                      organizedMedia.blogPosts.find(
                        (p) => p.id === selectedView.replace("post-", "")
                      )?.title}
                  </p>
                </div>

                {/* Upload Button */}
                <label className="flex items-center gap-2 px-4 py-2 bg-accent text-base-dark rounded-lg hover:bg-accent/90 transition-colors cursor-pointer font-medium">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-base-dark border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Images</span>
                    </>
                  )}
                </label>
              </div>

              {/* Search Bar */}
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-ink bg-panel border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pb-96">
              {/* Standard Image Grid */}
              {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
                  <p className="text-muted mb-2">
                    {searchQuery ? "No images found" : "No images yet"}
                  </p>
                  {!searchQuery && selectedView === "unassigned" && (
                    <p className="text-muted text-sm">
                      Upload images to get started
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredImages.map((image) => (
                    <DraggableImage
                      key={image._id}
                      image={image}
                      onDelete={() => handleDeleteImage(image._id)}
                    />
                  ))}
                </div>
              )}

              {/* Gallery Drawer Grid - Appears at bottom when open */}
              {selectedView === "page-home" && galleryDrawerOpen && (
                <div className="mt-8 border-t border-border pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <LayoutGrid className="w-5 h-5 text-accent" />
                    <h3 className="text-lg font-semibold text-ink">
                      Gallery Drawer Images
                    </h3>
                    <span className="text-sm text-muted">
                      (First image is preview, others appear in drawer)
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-4 mb-4">
                    {[0, 1, 2, 3, 4, 5].map((slotIndex) => {
                      const slotId = `home-gallery-${slotIndex}`;
                      const isPreview = slotIndex === 0;

                      return (
                        <DroppableArea key={slotId} id={slotId}>
                          <div className="group relative aspect-square rounded-lg border-2 border-dashed border-border bg-[var(--color-muted-accent)] hover:border-accent hover:bg-accent/5 transition flex flex-col items-center justify-center cursor-pointer">
                            {/* Visual feedback for hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                              <ImageIcon className="w-8 h-8 text-accent" />
                            </div>

                            {/* Placeholder content */}
                            {isPreview ? (
                              <p className="text-xs text-center text-muted">
                                Preview Slot
                              </p>
                            ) : (
                              <p className="text-xs text-center text-muted">
                                Slot {slotIndex + 1}
                              </p>
                            )}
                          </div>
                        </DroppableArea>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-[var(--color-muted-accent)] border border-border rounded-lg">
                    <p className="text-xs text-muted">
                      <strong className="text-ink">Tip:</strong> Drag images
                      from above to these slots. The first slot will be the
                      preview image.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DndContext>
    </TooltipProvider>
  );
};

// Draggable Image Component
function DraggableImage({
  image,
  onDelete,
}: {
  image: any;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: image._id,
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`group relative overflow-hidden rounded-lg border border-border hover:border-accent transition cursor-grab active:cursor-grabbing ${
              isDragging ? "opacity-50" : ""
            }`}
          >
            <img
              src={image.url}
              alt={image.filename}
              className="w-full h-32 object-cover"
              loading="lazy"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-1 bg-red-500/90 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
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
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{image.filename}</p>
          {image.assignedToTitle && (
            <p className="text-sm text-muted">
              Assigned to: {image.assignedToTitle}
            </p>
          )}
          <p className="text-xs text-muted">
            {image.size
              ? `${(image.size / 1024).toFixed(1)} KB`
              : "Unknown size"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Droppable Area Component
function DroppableArea({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`transition-colors ${
        isOver ? "bg-accent/10 ring-2 ring-accent rounded-lg" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default MediaTab;
