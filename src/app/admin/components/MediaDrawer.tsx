// src/app/admin/components/MediaDrawer.tsx
"use client";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Search, Check } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  _id: string;
  url: string;
  filename: string;
  altText?: string;
  size?: number;
}

interface MediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  title?: string;
  description?: string;
}

export const MediaDrawer: React.FC<MediaDrawerProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = "Select Image",
  description = "Choose an image from your media library",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const allMedia = useQuery(api.media.getAll) ?? [];

  const filteredMedia = allMedia.filter((media: MediaItem) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      media.filename.toLowerCase().includes(query) ||
      media.altText?.toLowerCase().includes(query)
    );
  });

  const handleSelect = (imageUrl: string) => {
    onSelect(imageUrl);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-6">
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-base border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent placeholder-muted"
            />
          </div>

          {/* Images Grid */}
          <div className="flex-1 overflow-y-auto">
            {filteredMedia.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted">
                  {searchQuery ? "No images found" : "No images in library"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMedia.map((media: MediaItem) => (
                  <button
                    key={media._id}
                    onClick={() => handleSelect(media.url)}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-accent transition"
                  >
                    <Image
                      src={media.url}
                      alt={media.altText || media.filename}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                      sizes="150px"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition">
                      <p className="text-xs text-white truncate">
                        {media.filename}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
