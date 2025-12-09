// src/app/admin/AdminDashboard/AdminDashboardLayout.tsx
"use client";
import { useState } from "react";
import { MediaDrawer } from "../components/MediaDrawer";

export function AdminDashboardWithMediaDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [onSelectCallback, setOnSelectCallback] = useState<
    ((url: string) => void) | null
  >(null);

  const openMediaDrawer = (callback: (url: string) => void) => {
    setOnSelectCallback(() => callback);
    setIsMediaDrawerOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (onSelectCallback) {
      onSelectCallback(url);
    }
    setIsMediaDrawerOpen(false);
  };

  return (
    <>
      {children}
      <MediaDrawer
        isOpen={isMediaDrawerOpen}
        onClose={() => setIsMediaDrawerOpen(false)}
        onSelect={handleMediaSelect}
        title="Select Image"
        description="Choose an image from your media library"
      />
      {/* Store the function in window for access from other components */}
      {typeof window !== "undefined" &&
        ((window as any).__openMediaDrawer = openMediaDrawer)}
    </>
  );
}
