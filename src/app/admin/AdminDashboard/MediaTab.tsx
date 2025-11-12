"use client";

import { useState } from "react";
import {
  Search,
  Image,
  Folder,
  Trash2,
  ExternalLink,
  Calendar,
  X,
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

interface MediaImage {
  id: Id<"browserLinks">;
  href: string;
  label: string;
  domain: string;
  screenshotUrl?: string;
  screenshotUpdatedAt?: number;
}

interface CategoryImages {
  category: string;
  color: string;
  images: MediaImage[];
}

const MediaTab = () => {
  const categories = useQuery(api.browserLinks.getImagesByCategory) ?? [];
  const deleteScreenshot = useMutation(api.browserLinks.deleteScreenshot);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteScreenshot = async (id: string) => {
    try {
      await deleteScreenshot({ linkId: id as Id<"browserLinks"> });
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Failed to delete screenshot:", error);
    }
  };

  // Filter logic
  const filteredCategories = selectedCategory === "all" 
    ? categories
    : categories.filter(cat => cat.category === selectedCategory);

  const filteredImages = (images: MediaImage[]) => {
    if (!searchQuery) return images;
    return images.filter(img => 
      img.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-6 bg-[color:var(--color-panel)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold text-[color:var(--color-ink)]">Media Manager</h1>
            <p className="mt-1 text-[color:var(--color-muted)]">
              {categories.reduce((acc, cat) => acc + cat.images.length, 0)} total images
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-[color:var(--color-ink)] bg-panel border border-[color:var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-panel border border-[color:var(--color-border)] text-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category} ({cat.images.length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-[color:var(--color-muted)] mx-auto mb-3 opacity-50" />
            <p className="text-[color:var(--color-muted)]">No images found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category) => {
              const images = filteredImages(category.images);
              if (images.length === 0) return null;
              
              return (
                <div key={category.category}>
                  <div className="flex items-center gap-2 mb-4">
                    <Folder className="w-5 h-5 text-[color:var(--color-muted)]" />
                    <h2 className="font-semibold text-[color:var(--color-ink)]">
                      {category.category}
                    </h2>
                    <span className="text-[color:var(--color-muted)]">
                      ({images.length})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <TooltipProvider key={image.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="group relative overflow-hidden rounded-lg border border-[color:var(--color-border)] hover:border-[color:var(--color-accent)] transition cursor-pointer">
                              <img
                                src={image.screenshotUrl}
                                alt={image.label}
                                className="w-full h-32 object-cover"
                                loading="lazy"
                              />
                              
                              {/* Hover Actions */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                                <p className="text-white text-sm font-medium truncate">
                                  {image.label}
                                </p>
                                <p className="text-white/70 text-xs truncate">
                                  {image.domain}
                                </p>
                                {image.screenshotUpdatedAt && (
                                  <p className="text-white/50 text-xs mt-1">
                                    {new Date(image.screenshotUpdatedAt).toLocaleDateString()}
                                  </p>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <a
                                    href={image.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 bg-white/20 rounded hover:bg-white/30 transition"
                                  >
                                    <ExternalLink className="w-3 h-3 text-white" />
                                  </a>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirmId(image.id);
                                    }}
                                    className="p-1 bg-white/20 rounded hover:bg-red-500/50 transition"
                                  >
                                    <Trash2 className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                              </div>

                              {/* Delete Confirmation */}
                              {deleteConfirmId === image.id && (
                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                                  <div className="bg-[color:var(--color-panel)] p-3 rounded-lg border border-[color:var(--color-border)]">
                                    <p className="text-[color:var(--color-ink)] text-xs mb-2">Delete this image?</p>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteScreenshot(image.id);
                                        }}
                                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                                      >
                                        Yes
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteConfirmId(null);
                                        }}
                                        className="px-2 py-1 bg-[color:var(--color-surface-hover)] text-[color:var(--color-ink)] rounded text-xs hover:shadow-passive transition"
                                      >
                                        No
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{image.label}</p>
                            <p className="text-sm text-muted">{image.domain}</p>
                            {image.screenshotUpdatedAt && (
                              <p className="text-xs text-muted">
                                Updated: {new Date(image.screenshotUpdatedAt).toLocaleDateString()}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaTab;