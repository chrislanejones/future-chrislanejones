"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Save,
  Plus,
  CheckCircle,
  AlertCircle,
  Globe,
  FileText,
  Image as ImageIcon,
  Trash2,
  X,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { MediaDrawer } from "../components/MediaDrawer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";

interface SEOEntry {
  _id: Id<"seoMetadata">;
  _creationTime: number;
  path: string;
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  updatedAt: number;
}

export const SeoTabEnhanced = () => {
  const seoEntries = useQuery(api.seo.getAllSEO) ?? [];
  const updateSEO = useMutation(api.seo.updateSEO);

  const [selectedPage, setSelectedPage] = useState<SEOEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    path: "",
    title: "",
    description: "",
    canonicalUrl: "",
    ogImage: "",
  });

  // Auto-select homepage (/) first, or first entry if no homepage
  useEffect(() => {
    if (seoEntries.length > 0 && !selectedPage) {
      const homePage = seoEntries.find((entry) => entry.path === "/");
      const firstEntry = (homePage || seoEntries[0]) as SEOEntry;
      setSelectedPage(firstEntry);
    }
  }, [seoEntries, selectedPage]);

  useEffect(() => {
    if (selectedPage) {
      setFormData({
        path: selectedPage.path,
        title: selectedPage.title,
        description: selectedPage.description,
        canonicalUrl: selectedPage.canonicalUrl || "",
        ogImage:
          (selectedPage as SEOEntry & { ogImage?: string }).ogImage || "",
      });
      setIsEditing(false);
    }
  }, [selectedPage]);

  const filteredPages = seoEntries.filter(
    (entry) =>
      entry.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort to ensure homepage is first
  const sortedFilteredPages = [...filteredPages].sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    return a.path.localeCompare(b.path);
  });

  const handlePageSelect = (page: SEOEntry) => {
    setSelectedPage(page);
    setSaveStatus(null);
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    setIsSaving(true);
    try {
      await updateSEO({
        path: formData.path,
        title: formData.title,
        description: formData.description,
        canonicalUrl: formData.canonicalUrl || undefined,
        ogImage: formData.ogImage || undefined,
      });
      setIsEditing(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to save SEO:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaSelect = (imageUrl: string) => {
    setFormData({ ...formData, ogImage: imageUrl });
    setIsEditing(true);
  };

  const handleRemoveOgImage = () => {
    setFormData({ ...formData, ogImage: "" });
    setIsEditing(true);
  };

  const calculateSEOScore = () => {
    let score = 0;
    if (formData.title.length >= 30 && formData.title.length <= 60) {
      score += 25;
    } else if (formData.title.length >= 50 && formData.title.length <= 60) {
      score += 25;
    } else if (formData.title.length > 0) {
      score += 10;
    }

    if (
      formData.description.length >= 120 &&
      formData.description.length <= 160
    ) {
      score += 25;
    } else if (
      formData.description.length >= 150 &&
      formData.description.length <= 160
    ) {
      score += 25;
    } else if (formData.description.length > 0) {
      score += 10;
    }

    if (formData.canonicalUrl) {
      score += 25;
    }

    if (formData.ogImage) {
      score += 25;
    }

    return Math.min(score, 100);
  };

  const seoScore = calculateSEOScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPageName = (path: string): string => {
    if (path === "/") return "Home";
    const name = path
      .replace(/^\//, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return name;
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Left Panel - Page List */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
        <h3 className="font-semibold text-(--color-ink) mb-4">Pages</h3>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-base border border-border rounded-lg text-ink text-sm focus:ring-2 focus:ring-accent focus:border-accent"
          />
        </div>

        {/* Page List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {sortedFilteredPages.map((entry) => (
            <button
              key={entry._id}
              onClick={() => handlePageSelect(entry as SEOEntry)}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                selectedPage?._id === entry._id
                  ? "bg-(--color-foreground) text-(--color-panel)"
                  : "hover:bg-(--color-surface-hover) text-(--color-ink)"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe
                  className={`w-4 h-4 ${
                    selectedPage?._id === entry._id
                      ? "text-(--color-panel)"
                      : "text-muted"
                  }`}
                />
                <span className="truncate">{getPageName(entry.path)}</span>
              </div>
              <p
                className={`text-xs truncate mt-1 ${
                  selectedPage?._id === entry._id
                    ? "text-(--color-panel)/70"
                    : "text-muted"
                }`}
              >
                {entry.path}
              </p>
            </button>
          ))}
          {sortedFilteredPages.length === 0 && (
            <p className="text-sm text-muted text-center py-4">
              No pages found
            </p>
          )}
        </div>
      </div>

      {/* Right Panel - SEO Editor */}
      <div className="col-span-2 bg-panel border border-border rounded-2xl overflow-hidden flex flex-col">
        {selectedPage ? (
          <>
            {/* Header with Save Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-bold text-ink">
                    {getPageName(selectedPage.path)}
                  </h2>
                  <p className="text-sm text-muted">{selectedPage.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* SEO Score */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getScoreBgColor(seoScore)}`}
                  >
                    <span className="text-sm font-bold text-white">
                      {seoScore}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium ${getScoreColor(seoScore)}`}
                  >
                    SEO Score
                  </span>
                </div>

                {/* Save Button - Homepage style */}
                <Button
                  onClick={handleSave}
                  disabled={!isEditing || isSaving}
                  variant="outline"
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>

            {/* Status Messages */}
            {saveStatus === "success" && (
              <div className="mx-6 mt-4">
                <SuccessDisplay
                  message="SEO settings saved successfully!"
                  onDismiss={() => setSaveStatus(null)}
                  compact
                />
              </div>
            )}
            {saveStatus === "error" && (
              <div className="mx-6 mt-4">
                <ErrorDisplay
                  error={new Error("Failed to save SEO settings")}
                  onDismiss={() => setSaveStatus(null)}
                  compact
                />
              </div>
            )}

            {/* Form Fields */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Page Title */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Page Title
                  <span className="ml-2 text-sm text-muted">
                    ({formData.title.length}/60 chars)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setIsEditing(true);
                  }}
                  className="w-full px-4 py-3 bg-base border border-border rounded-xl text-ink focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="Enter page title..."
                />
                {formData.title.length > 60 && (
                  <p className="mt-1 text-sm text-yellow-500">
                    Title may be truncated in search results
                  </p>
                )}
              </div>

              {/* Meta Description */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Meta Description
                  <span className="ml-2 text-sm text-muted">
                    ({formData.description.length}/160 chars)
                  </span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setIsEditing(true);
                  }}
                  rows={3}
                  className="w-full px-4 py-3 bg-base border border-border rounded-xl text-ink focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                  placeholder="Enter meta description..."
                />
                {formData.description.length > 160 && (
                  <p className="mt-1 text-sm text-yellow-500">
                    Description may be truncated in search results
                  </p>
                )}
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={formData.canonicalUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, canonicalUrl: e.target.value });
                    setIsEditing(true);
                  }}
                  className="w-full px-4 py-3 bg-base border border-border rounded-xl text-ink focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="https://example.com/page"
                />
              </div>

              {/* OG Image */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  OpenGraph Image
                </label>
                {formData.ogImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <Image
                      src={formData.ogImage}
                      alt="OG Image"
                      width={600}
                      height={315}
                      className="w-full h-auto object-cover"
                    />
                    <button
                      onClick={handleRemoveOgImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsMediaDrawerOpen(true)}
                    className="w-full px-4 py-8 border-2 border-dashed border-border rounded-xl text-muted hover:border-accent hover:text-accent transition flex flex-col items-center gap-2"
                  >
                    <ImageIcon className="w-8 h-8" />
                    <span>Click to select an image</span>
                    <span className="text-xs">1200×630px recommended</span>
                  </button>
                )}
              </div>

              {/* Search Preview - Dark Mode Fixed */}
              <div className="p-4 bg-base border border-border rounded-xl">
                <h3 className="mb-3 text-ink font-semibold flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Preview
                </h3>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-blue-600 dark:text-blue-400 text-lg hover:underline cursor-pointer font-medium">
                    {formData.title || "Page Title"}
                  </p>
                  <p className="text-green-700 dark:text-green-400 text-sm">
                    {formData.canonicalUrl ||
                      `https://chrislanejones.com${formData.path}`}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {formData.description ||
                      "Meta description will appear here..."}
                  </p>
                </div>
              </div>
            </div>

            <MediaDrawer
              isOpen={isMediaDrawerOpen}
              onClose={() => setIsMediaDrawerOpen(false)}
              onSelect={handleMediaSelect}
              title="Select OpenGraph Image"
              description="Choose an image for social media sharing (1200×630px recommended)"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            Select a page to edit SEO settings
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoTabEnhanced;
