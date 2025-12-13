// src/app/admin/components/MediaDrawer.tsx
"use client";
import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Search, Check, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/utils/uploadthing";

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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allMedia = useQuery(api.media.getAll) ?? [];
  const createMedia = useMutation(api.media.create);

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        await createMedia({
          url: res[0].url,
          filename: res[0].name || "Uploaded image",
          size: res[0].size,
        });
        setIsUploading(false);
        // Auto-select the newly uploaded image
        onSelect(res[0].url);
        onClose();
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
    },
  });

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await startUpload([file]);
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] flex flex-col border-t border-(--color-border) bg-(--color-panel)">
        <DrawerHeader className="bg-(--color-muted-accent)">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6">
          {/* Search and Upload Row */}
          <div className="my-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-(--color-muted-accent) rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent placeholder-muted"
              />
            </div>
            <Button
              onClick={handleUploadClick}
              variant="accent"
              className="gap-2 shrink-0"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Images Grid */}
          <div className="flex-1 overflow-y-auto">
            {filteredMedia.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted">
                  {searchQuery ? "No images found" : "No images in library"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={handleUploadClick}
                    variant="outline"
                    className="mt-4 gap-2"
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4" />
                    Upload your first image
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMedia.map((media: MediaItem) => (
                  <button
                    key={media._id}
                    onClick={() => handleSelect(media.url)}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-(--color-muted-accent) hover:ring-2 hover:ring-accent hover:ring-(--color-accent) transition"
                  >
                    <Image
                      src={media.url}
                      alt={media.altText || media.filename}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                      sizes="150px"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <div className="p-2 bg-accent rounded-full">
                        <Check className="w-5 h-5 text-black" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition">
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
