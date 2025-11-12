// src/app/admin/AdminDashboard/MediaTab.tsx
"use client";

import { useState } from "react";
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

// Page icons map
const PAGE_ICONS: Record<string, any> = {
  home: Home,
  about: User,
  gallery: ImageIcon,
  projects: Briefcase,
  "browser-tabs": Chrome,
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      if (res) {
        // Save each uploaded file to the media table
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

    // Parse drop target: format is "page-{id}" or "post-{id}"
    if (dropTarget.startsWith("page-")) {
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

  // Get current view images
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
          <div className="w-64 border-r p-4 overflow-y-auto bg-panel border-border">
          <div className="space-y-1">
            {/* All Images */}
            <button
              onClick={() => setSelectedView("all")}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                selectedView === "all"
                  ? "bg-surface-hover ring-2 ring-accent"
                  : "hover:bg-surface-hover"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-ink font-medium">All Images</span>
                <span className="text-muted text-xs">
                  (
                  {organizedMedia.pages.reduce(
                    (sum, p) => sum + p.images.length,
                    0
                  ) +
                    organizedMedia.blogPosts.reduce(
                      (sum, p) => sum + p.images.length,
                      0
                    ) +
                    organizedMedia.unassigned.length}
                  )
                </span>
              </div>
            </button>

            {/* Unassigned */}
            <DroppableArea id="unassigned">
              <button
                onClick={() => setSelectedView("unassigned")}
                className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                  selectedView === "unassigned"
                    ? "bg-surface-hover ring-2 ring-accent"
                    : "hover:bg-surface-hover"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-ink font-medium">Unassigned</span>
                  <span className="text-muted text-xs">
                    ({organizedMedia.unassigned.length})
                  </span>
                </div>
              </button>
            </DroppableArea>

            {/* Pages */}
            <div className="mt-4">
              <button
                onClick={() => setPagesExpanded(!pagesExpanded)}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface-hover rounded-lg transition"
              >
                {pagesExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted flex-shrink-0" />
                )}
                <span className="text-ink font-semibold text-sm">Pages</span>
                <span className="text-muted text-xs ml-auto">
                  (
                  {organizedMedia.pages.reduce(
                    (sum, p) => sum + p.images.length,
                    0
                  )}
                  )
                </span>
              </button>
              {pagesExpanded && (
                <div className="space-y-1 ml-2">
                  {organizedMedia.pages.map((page) => {
                    const Icon = PAGE_ICONS[page.id] || FileText;
                    return (
                      <div key={page.id}>
                        <button
                          onClick={() => togglePage(page.id)}
                          className="w-full text-left px-3 py-2 rounded-lg transition text-sm hover:bg-surface-hover flex items-center gap-2"
                        >
                          {expandedPages.has(page.id) ? (
                            <ChevronDown className="w-3 h-3 text-muted flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-muted flex-shrink-0" />
                          )}
                          <Icon className="w-4 h-4 text-muted flex-shrink-0" />
                          <span className="text-ink text-xs flex-1">
                            {page.title}
                          </span>
                          <span className="text-muted text-xs">
                            ({page.images.length})
                          </span>
                        </button>
                        {expandedPages.has(page.id) && (
                          <DroppableArea id={`page-${page.id}`}>
                            <button
                              onClick={() => setSelectedView(`page-${page.id}`)}
                              className={`w-full text-left px-3 py-2 ml-4 rounded-lg transition text-sm ${
                                selectedView === `page-${page.id}`
                                  ? "bg-surface-hover ring-2 ring-accent"
                                  : "hover:bg-surface-hover"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <ImageIcon className="w-3 h-3 text-muted" />
                                <span className="text-muted text-xs">
                                  Images
                                </span>
                              </div>
                            </button>
                          </DroppableArea>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Blog Posts */}
            <div className="mt-4">
              <button
                onClick={() => setBlogPostsExpanded(!blogPostsExpanded)}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-surface-hover rounded-lg transition"
              >
                {blogPostsExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted flex-shrink-0" />
                )}
                <span className="text-ink font-semibold text-sm">
                  Blog Posts
                </span>
                <span className="text-muted text-xs ml-auto">
                  (
                  {organizedMedia.blogPosts.reduce(
                    (sum, p) => sum + p.images.length,
                    0
                  )}
                  )
                </span>
              </button>
              {blogPostsExpanded && (
                <div className="space-y-1 ml-2">
                  {organizedMedia.blogPosts.map((post) => (
                    <div key={post.id}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleBlogPost(post.id)}
                          className="flex-1 text-left px-3 py-2 rounded-lg transition text-sm hover:bg-surface-hover flex items-center gap-2"
                        >
                          {expandedBlogPosts.has(post.id) ? (
                            <ChevronDown className="w-3 h-3 text-muted flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-muted flex-shrink-0" />
                          )}
                          <span className="text-ink text-xs truncate flex-1">
                            {post.title}
                          </span>
                          <span className="text-muted text-xs">
                            ({post.images.length})
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
                                    const uploaded = await startUpload([file]);
                                    if (uploaded && uploaded[0]) {
                                      const mediaId = await createMedia({
                                        url: uploaded[0].url,
                                        filename: uploaded[0].name || post.title,
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
                            className={`w-full text-left px-3 py-2 ml-4 rounded-lg transition text-sm ${
                              selectedView === `post-${post.id}`
                                ? "bg-surface-hover ring-2 ring-accent"
                                : "hover:bg-surface-hover"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-3 h-3 text-muted" />
                              <span className="text-muted text-xs">
                                Cover Images
                              </span>
                            </div>
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
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header with Upload */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-ink">
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
              </h2>
              <p className="text-muted text-sm">
                {filteredImages.length} images
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
          <div className="mb-6">
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

          {/* Image Grid */}
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
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && draggedImage && (
          <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-accent shadow-2xl opacity-80">
            <img
              src={draggedImage.url}
              alt={draggedImage.filename}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </DragOverlay>
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
