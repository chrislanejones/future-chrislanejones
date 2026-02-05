"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Save,
  Globe,
  FileText,
  Image as ImageIcon,
  Trash2,
  Layout,
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

interface PageHeaderEntry {
  _id: Id<"pageHeaders">;
  _creationTime: number;
  path: string;
  title: string;
  breadcrumbPage: string;
  description: string;
  updatedAt: number;
}

// Combined page entry for the list
interface PageEntry {
  path: string;
  title: string;
  seoEntry?: SEOEntry;
  headerEntry?: PageHeaderEntry;
}

export const SeoTabEnhanced = () => {
  const seoEntries = useQuery(api.seo.getAllSEO) ?? [];
  const pageHeaders = useQuery(api.pageHeaders.getAllPageHeaders) ?? [];
  const updateSEO = useMutation(api.seo.updateSEO);
  const updatePageHeader = useMutation(api.pageHeaders.updatePageHeader);

  const [selectedPage, setSelectedPage] = useState<PageEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(
    null,
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

  // Header/Title form data
  const [headerFormData, setHeaderFormData] = useState({
    title: "",
    breadcrumbPage: "",
    description: "",
  });

  // Merge SEO entries and page headers into a unified list
  const mergedPages: PageEntry[] = React.useMemo(() => {
    const pageMap = new Map<string, PageEntry>();

    // Add all SEO entries
    for (const seo of seoEntries) {
      pageMap.set(seo.path, {
        path: seo.path,
        title: seo.title,
        seoEntry: seo as SEOEntry,
      });
    }

    // Add/merge page headers
    for (const header of pageHeaders) {
      const existing = pageMap.get(header.path);
      if (existing) {
        existing.headerEntry = header as PageHeaderEntry;
      } else {
        pageMap.set(header.path, {
          path: header.path,
          title: header.title,
          headerEntry: header as PageHeaderEntry,
        });
      }
    }

    return Array.from(pageMap.values());
  }, [seoEntries, pageHeaders]);

  // Auto-select homepage (/) first, or first entry if no homepage
  useEffect(() => {
    if (mergedPages.length > 0 && !selectedPage) {
      const homePage = mergedPages.find((entry) => entry.path === "/");
      const firstEntry = homePage || mergedPages[0];
      setSelectedPage(firstEntry);
    }
  }, [mergedPages, selectedPage]);

  // Sync selectedPage with latest Convex data
  useEffect(() => {
    if (selectedPage && mergedPages.length > 0) {
      const updatedPage = mergedPages.find((p) => p.path === selectedPage.path);
      if (updatedPage) {
        // Update selectedPage reference if data changed
        setSelectedPage(updatedPage);
      }
    }
  }, [mergedPages]);

  useEffect(() => {
    if (selectedPage) {
      // Load SEO data
      if (selectedPage.seoEntry) {
        setFormData({
          path: selectedPage.path,
          title: selectedPage.seoEntry.title,
          description: selectedPage.seoEntry.description,
          canonicalUrl: selectedPage.seoEntry.canonicalUrl || "",
          ogImage: selectedPage.seoEntry.ogImage || "",
        });
      } else {
        setFormData({
          path: selectedPage.path,
          title: "",
          description: "",
          canonicalUrl: "",
          ogImage: "",
        });
      }

      // Load page header data from Convex
      if (selectedPage.headerEntry) {
        setHeaderFormData({
          title: selectedPage.headerEntry.title,
          breadcrumbPage: selectedPage.headerEntry.breadcrumbPage,
          description: selectedPage.headerEntry.description,
        });
      } else {
        setHeaderFormData({
          title: "",
          breadcrumbPage: "",
          description: "",
        });
      }

      setIsEditing(false);
    }
  }, [selectedPage]);

  const filteredPages = mergedPages.filter(
    (entry) =>
      entry.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort to ensure homepage is first
  const sortedFilteredPages = [...filteredPages].sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    return a.path.localeCompare(b.path);
  });

  const handlePageSelect = (page: PageEntry) => {
    setSelectedPage(page);
    setSaveStatus(null);
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    setIsSaving(true);
    try {
      // Save SEO data
      await updateSEO({
        path: formData.path,
        title: formData.title,
        description: formData.description,
        canonicalUrl: formData.canonicalUrl || undefined,
        ogImage: formData.ogImage || undefined,
      });

      // Save page header data (only if any header field has been filled)
      if (
        headerFormData.title ||
        headerFormData.breadcrumbPage ||
        headerFormData.description
      ) {
        await updatePageHeader({
          path: formData.path,
          title: headerFormData.title,
          breadcrumbPage: headerFormData.breadcrumbPage,
          description: headerFormData.description,
        });
      }

      setIsEditing(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to save:", error);
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
            className="w-full pl-10 pr-4 py-2 bg-(--color-muted-accent) rounded-lg text-ink text-sm focus:ring-2 focus:ring-accent focus:outline-none"
          />
        </div>

        {/* Page List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {sortedFilteredPages.map((entry) => (
            <button
              key={entry.path}
              onClick={() => handlePageSelect(entry)}
              className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                selectedPage?.path === entry.path
                  ? "bg-(--color-foreground) text-(--color-panel)"
                  : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-(--color-ink)"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe
                  className={`w-4 h-4 ${
                    selectedPage?.path === entry.path
                      ? "text-(--color-panel)"
                      : "text-muted"
                  }`}
                />
                <span className="truncate">{getPageName(entry.path)}</span>
                {/* Data indicators */}
                <div className="flex gap-1 ml-auto">
                  {entry.seoEntry && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedPage?.path === entry.path
                          ? "bg-(--color-panel)/50"
                          : "bg-blue-500"
                      }`}
                      title="Has SEO data"
                    />
                  )}
                  {entry.headerEntry && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedPage?.path === entry.path
                          ? "bg-(--color-panel)/50"
                          : "bg-green-500"
                      }`}
                      title="Has header data"
                    />
                  )}
                </div>
              </div>
              <p
                className={`text-xs truncate mt-1 ${
                  selectedPage?.path === entry.path
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
      <div className="col-span-2 bg-(--color-panel) border border-(--color-border) rounded-2xl overflow-hidden flex flex-col">
        {selectedPage ? (
          <>
            {/* Header with Save Button */}
            <div className="flex items-center justify-between px-6 py-4 bg-(--color-muted-accent)">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-bold text-ink">SEO and Title Manager</h2>
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

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={!isEditing || isSaving}
                  variant="outline"
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save All"}
                </Button>
              </div>
            </div>

            {/* Status Messages */}
            {saveStatus === "success" && (
              <div className="mx-6 mt-4">
                <SuccessDisplay
                  message="SEO and header settings saved successfully!"
                  onDismiss={() => setSaveStatus(null)}
                  compact
                />
              </div>
            )}
            {saveStatus === "error" && (
              <div className="mx-6 mt-4">
                <ErrorDisplay
                  error={new Error("Failed to save settings")}
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
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none"
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
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none resize-none"
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
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none"
                  placeholder="https://example.com/page"
                />
              </div>

              {/* OG Image */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  OpenGraph Image
                </label>
                {formData.ogImage ? (
                  <div className="relative rounded-xl overflow-hidden bg-(--color-muted-accent)">
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
                    className="w-full px-4 py-8 border-2 border-dashed border-(--color-muted-accent) rounded-xl text-muted hover:border-accent hover:text-accent transition flex flex-col items-center gap-2 bg-(--color-muted-accent)/30"
                  >
                    <ImageIcon className="w-8 h-8" />
                    <span>Click to select an image</span>
                    <span className="text-xs">1200×630px recommended</span>
                  </button>
                )}
              </div>

              {/* Search Preview Card */}
              <div className="p-4 bg-(--color-muted-accent) rounded-xl border border-(--color-border)">
                <h3 className="mb-3 text-ink font-semibold flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Preview
                </h3>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
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

              {/* === PAGE HEADER / TITLE FIELDS === */}
              <div className="pt-4 border-t border-(--color-border)">
                <h3 className="mb-1 text-ink font-semibold flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Page Header &amp; Banner
                </h3>
                <p className="text-xs text-muted mb-4">
                  Controls the banner title, breadcrumb label, and description
                  shown on the page itself.
                </p>
              </div>

              {/* Banner Title */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Banner Title
                </label>
                <input
                  type="text"
                  value={headerFormData.title}
                  onChange={(e) => {
                    setHeaderFormData({
                      ...headerFormData,
                      title: e.target.value,
                    });
                    setIsEditing(true);
                  }}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none"
                  placeholder="e.g. About, Projects, Career"
                />
              </div>

              {/* Breadcrumb Label */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Breadcrumb Label
                </label>
                <input
                  type="text"
                  value={headerFormData.breadcrumbPage}
                  onChange={(e) => {
                    setHeaderFormData({
                      ...headerFormData,
                      breadcrumbPage: e.target.value,
                    });
                    setIsEditing(true);
                  }}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none"
                  placeholder="e.g. About, Apps, Websites"
                />
                <p className="text-xs text-muted mt-1">
                  Shown in breadcrumb as: Home /{" "}
                  {headerFormData.breadcrumbPage || "Page"}
                </p>
              </div>

              {/* Banner Description */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Banner Description
                </label>
                <textarea
                  value={headerFormData.description}
                  onChange={(e) => {
                    setHeaderFormData({
                      ...headerFormData,
                      description: e.target.value,
                    });
                    setIsEditing(true);
                  }}
                  rows={2}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none resize-none"
                  placeholder="Short description shown in the page banner"
                />
              </div>

              {/* Banner Preview Card */}
              <div className="p-4 bg-(--color-muted-accent) rounded-xl border border-(--color-border)">
                <h3 className="mb-3 text-ink font-semibold flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Banner Preview
                </h3>
                <div className="bg-(--color-panel) rounded-lg overflow-hidden">
                  <div className="bg-linear-to-r from-accent/10 to-transparent px-6 py-5">
                    <p className="text-xs text-muted mb-1">
                      Home / {headerFormData.breadcrumbPage || "Page"}
                    </p>
                    <h4 className="text-lg font-bold text-ink">
                      {headerFormData.title || "Page Title"}
                    </h4>
                    <p className="text-sm text-muted mt-1">
                      {headerFormData.description ||
                        "Page description will appear here..."}
                    </p>
                  </div>
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
