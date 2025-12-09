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

  const [formData, setFormData] = useState({
    path: "",
    title: "",
    description: "",
    canonicalUrl: "",
    ogImage: "",
  });

  // Set first page as selected on initial load
  useEffect(() => {
    if (seoEntries.length > 0 && !selectedPage) {
      const firstEntry = seoEntries[0] as SEOEntry;
      setSelectedPage(firstEntry);
    }
  }, [seoEntries, selectedPage]);

  // Update form when selected page changes
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

  const handlePageSelect = (page: SEOEntry) => {
    setSelectedPage(page);
    setSaveStatus(null);
  };

  const handleSave = async () => {
    if (!selectedPage) return;

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

  // SEO scoring
  const calculateSEOScore = () => {
    let score = 0;

    // Title score (optimal: 50-60 chars)
    if (formData.title.length >= 30 && formData.title.length <= 60) {
      score += 25;
    } else if (formData.title.length >= 50 && formData.title.length <= 60) {
      score += 25;
    } else if (formData.title.length > 0) {
      score += 10;
    }

    // Description score (optimal: 150-160 chars)
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

    // Canonical URL
    if (formData.canonicalUrl) {
      score += 25;
    }

    // OG Image
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

  return (
    <div className="h-full flex gap-6">
      {/* Left Panel - Page List */}
      <div className="w-80 flex flex-col bg-panel border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-base border border-border rounded-lg text-ink focus:ring-2 focus:ring-accent focus:border-accent placeholder:text-muted"
            />
          </div>
          <p className="text-sm text-muted">{seoEntries.length} pages</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredPages.map((page) => (
            <button
              key={page._id}
              onClick={() => handlePageSelect(page as SEOEntry)}
              className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                selectedPage?._id === page._id
                  ? "bg-accent/10 border border-accent/30"
                  : "hover:bg-base border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-muted shrink-0" />
                <p className="font-medium text-ink truncate">{page.path}</p>
              </div>
              <p className="text-sm text-muted truncate pl-6">{page.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - SEO Editor */}
      <div className="flex-1 bg-panel border border-border rounded-2xl overflow-hidden flex flex-col">
        {selectedPage ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink">
                    {selectedPage.path}
                  </h2>
                  <p className="text-sm text-muted">
                    Last updated:{" "}
                    {new Date(selectedPage.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* SEO Score */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl font-bold ${getScoreColor(seoScore)}`}
                    >
                      {seoScore}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted">SEO Score</span>
                      <div className="w-16 h-1.5 bg-base rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBgColor(seoScore)} transition-all`}
                          style={{ width: `${seoScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {saveStatus && (
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                        saveStatus === "success"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {saveStatus === "success" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {saveStatus === "success" ? "Saved" : "Error"}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={!isEditing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      isEditing
                        ? "bg-accent text-on-accent hover:shadow-glow"
                        : "bg-base text-muted cursor-not-allowed"
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title */}
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

              {/* Description */}
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

              {/* OpenGraph Image */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  OpenGraph Image
                </label>
                {formData.ogImage ? (
                  <div className="relative">
                    <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border border-border bg-base">
                      <Image
                        src={formData.ogImage}
                        alt="OpenGraph preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setIsMediaDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-base border border-border rounded-lg text-ink hover:bg-muted/10 transition"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Change Image
                      </button>
                      <button
                        onClick={handleRemoveOgImage}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500/20 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsMediaDrawerOpen(true)}
                    className="flex items-center justify-center gap-3 w-full max-w-md aspect-video border-2 border-dashed border-border rounded-xl bg-base hover:border-accent hover:bg-accent/5 transition group"
                  >
                    <ImageIcon className="w-8 h-8 text-muted group-hover:text-accent transition" />
                    <span className="text-muted group-hover:text-accent transition font-medium">
                      Browse Image
                    </span>
                  </button>
                )}
                <p className="mt-2 text-sm text-muted">
                  Recommended: 1200×630px for optimal social media display
                </p>
              </div>

              {/* Search Preview */}
              <div className="mt-8 p-4 bg-base border border-border rounded-xl">
                <h3 className="mb-3 text-ink font-semibold flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Preview
                </h3>
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {formData.title || "Page Title"}
                  </p>
                  <p className="text-green-700 text-sm">
                    {formData.canonicalUrl ||
                      `https://chrislanejones.com${formData.path}`}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {formData.description ||
                      "Meta description will appear here..."}
                  </p>
                </div>
              </div>

              {/* SEO Best Practices */}
              <div className="p-4 bg-base border border-border rounded-xl">
                <h3 className="mb-3 text-ink font-semibold">
                  SEO Best Practices
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        formData.title.length >= 30 &&
                        formData.title.length <= 60
                          ? "text-green-500"
                          : "text-muted"
                      }`}
                    />
                    <span className="text-foreground text-sm">
                      Title: 30-60 characters (optimal: 50-60)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        formData.description.length >= 120 &&
                        formData.description.length <= 160
                          ? "text-green-500"
                          : "text-muted"
                      }`}
                    />
                    <span className="text-foreground text-sm">
                      Description: 120-160 characters (optimal: 150-160)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        formData.canonicalUrl ? "text-green-500" : "text-muted"
                      }`}
                    />
                    <span className="text-foreground text-sm">
                      Set canonical URL to prevent duplicate content
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        formData.ogImage ? "text-green-500" : "text-muted"
                      }`}
                    />
                    <span className="text-foreground text-sm">
                      Add OpenGraph image for social sharing
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
              <p className="text-muted">Select a page to edit SEO metadata</p>
            </div>
          </div>
        )}
      </div>

      {/* Media Drawer */}
      <MediaDrawer
        isOpen={isMediaDrawerOpen}
        onClose={() => setIsMediaDrawerOpen(false)}
        onSelect={handleMediaSelect}
        title="Select OpenGraph Image"
        description="Choose an image for social media sharing (1200×630px recommended)"
      />
    </div>
  );
};

export default SeoTabEnhanced;
