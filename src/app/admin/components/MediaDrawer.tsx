"use client";
import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Search,
  Check,
  Upload,
  Loader2,
  Info,
  FileText,
  Type,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadThing } from "@/utils/uploadthing";

interface MediaItem {
  _id: Id<"media">;
  url: string;
  filename: string;
  altText?: string;
  size?: number;
  mimeType?: string;
  uploadedAt: number;
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
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allMedia = useQuery(api.media.getAll) ?? [];
  const createMedia = useMutation(api.media.create);
  const updateMedia = useMutation(api.media.update);
  const deleteMedia = useMutation(api.media.deleteMedia);

  // AUTO-SELECT FIRST PHOTO ON OPEN
  useEffect(() => {
    if (isOpen && allMedia.length > 0 && !selectedItem) {
      setSelectedItem(allMedia[0]);
    }
  }, [isOpen, allMedia, selectedItem]);

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        await createMedia({
          url: res[0].url,
          filename: res[0].name || "Uploaded image",
          size: res[0].size,
          mimeType: res[0].type,
        });
        setIsUploading(false);
      }
    },
  });

  const filteredMedia = allMedia.filter((media: MediaItem) => {
    const query = searchQuery.toLowerCase();
    return (
      media.filename.toLowerCase().includes(query) ||
      media.altText?.toLowerCase().includes(query)
    );
  });

  const handleUpdateMetadata = async (
    field: "filename" | "altText",
    value: string
  ) => {
    if (!selectedItem) return;
    setSelectedItem({ ...selectedItem, [field]: value });
    try {
      await updateMedia({ id: selectedItem._id, [field]: value });
    } catch (err) {
      console.error(err);
    }
  };

  const formatSize = (bytes?: number) =>
    bytes ? `${(bytes / 1024).toFixed(1)} KB` : "0 KB";
  const getFormat = (mime?: string) =>
    mime ? mime.split("/")[1].toUpperCase() : "IMG";

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] flex flex-col border-t border-(--color-border) bg-(--color-panel)">
        <DrawerHeader className="px-6 py-5 border-b border-(--color-border)">
          <DrawerTitle className="text-xl font-bold tracking-tight">
            {title}
          </DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden flex flex-row">
          {/* SIDEBAR: 1/4 Width */}
          <aside className="w-1/4 flex flex-col border-r border-(--color-border) px-6 py-6 overflow-y-auto shrink-0">
            <div className="space-y-6 flex-1">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    placeholder="Search library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="accent"
                  className="w-full gap-2"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files?.length) {
                      setIsUploading(true);
                      startUpload(Array.from(files));
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {selectedItem && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="s-title"
                        className="flex items-center gap-2 text-xs font-semibold uppercase text-muted"
                      >
                        <FileText className="w-3 h-3" /> Title
                      </Label>
                      <Input
                        id="s-title"
                        value={selectedItem.filename}
                        onChange={(e) =>
                          handleUpdateMetadata("filename", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="s-alt"
                        className="flex items-center gap-2 text-xs font-semibold uppercase text-muted"
                      >
                        <Type className="w-3 h-3" /> Alt Tag
                      </Label>
                      <Input
                        id="s-alt"
                        placeholder="Describe image..."
                        value={selectedItem.altText || ""}
                        onChange={(e) =>
                          handleUpdateMetadata("altText", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-(--color-muted-accent) rounded-xl space-y-2 border border-(--color-border)">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                      <Info className="w-3 h-3" /> Meta Information
                    </h4>
                    <div className="grid grid-cols-2 gap-y-1 text-xs">
                      <span className="text-muted">Format:</span>
                      <span className="text-ink text-right font-medium">
                        {getFormat(selectedItem.mimeType)}
                      </span>
                      <span className="text-muted">File Size:</span>
                      <span className="text-ink text-right font-medium">
                        {formatSize(selectedItem.size)}
                      </span>
                      <span className="text-muted">Uploaded:</span>
                      <span className="text-ink text-right font-medium">
                        {new Date(selectedItem.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedItem && (
              <div className="pt-6 mt-6 border-t border-(--color-border) space-y-3 px-1 pb-1">
                <Button
                  onClick={() => onSelect(selectedItem.url)}
                  variant="neutral"
                  className="w-full shadow-glow"
                >
                  Use This Image
                </Button>
                <Button
                  onClick={async () => {
                    if (confirm("Delete permanently?")) {
                      await deleteMedia({ id: selectedItem._id });
                      setSelectedItem(null);
                    }
                  }}
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Permanently
                </Button>
              </div>
            )}
          </aside>

          {/* PHOTO GRID: 3/4 Width */}
          <div className="flex-1 overflow-y-auto py-6 px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMedia.map((media: MediaItem) => (
                <button
                  key={media._id}
                  onClick={() => setSelectedItem(media)}
                  onDoubleClick={() => onSelect(media.url)}
                  className={`group relative aspect-square rounded-xl transition-all duration-200 ${
                    selectedItem?._id === media._id
                      ? "ring-4 ring-inset ring-accent"
                      : "hover:ring-2 hover:ring-inset hover:ring-accent/40"
                  }`}
                >
                  <Image
                    src={media.url}
                    alt={media.altText || media.filename}
                    fill
                    className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                    sizes="200px"
                  />
                  {selectedItem?._id === media._id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-accent/10 rounded-xl">
                      <div className="p-2 bg-accent rounded-full shadow-xl">
                        <Check className="w-5 h-5 text-black" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
