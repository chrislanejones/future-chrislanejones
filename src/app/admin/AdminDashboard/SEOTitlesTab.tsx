"use client";
import React, { useState, useEffect } from "react";
import { Search, Save, AlertCircle, CheckCircle, Plus, X } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const SEO_LIMITS = {
  title: { min: 30, max: 60, warning: 55 },
  description: { min: 120, max: 160, warning: 155 },
};

interface CharacterCounterProps {
  current: number;
  limits: {
    min: number;
    max: number;
    warning: number;
  };
  label: string;
}

const CharacterCounter = ({
  current,
  limits,
  label,
}: CharacterCounterProps) => {
  const getStatus = () => {
    if (current < limits.min)
      return { color: "text-yellow-500", message: "Too short" };
    if (current > limits.max)
      return { color: "text-red-500", message: "Too long - will be truncated" };
    if (current > limits.warning)
      return { color: "text-yellow-500", message: "Approaching limit" };
    return { color: "text-green-500", message: "Good length" };
  };

  const status = getStatus();
  const percentage = (current / limits.max) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[color:var(--color-ink)] text-sm">{label}</span>
        <span className={`${status.color} font-medium`}>
          {current}/{limits.max} - {status.message}
        </span>
      </div>
      <div className="h-2 bg-[color:var(--color-muted-accent)] rounded-full">
        <div
          className={`h-full transition-all ${
            percentage > 100
              ? "bg-red-500"
              : percentage > 90
                ? "bg-yellow-500"
                : "bg-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export const SEOTitlesTab = () => {
  const pages = useQuery(api.seo.getAllSEO) ?? [];
  const updateSEO = useMutation(api.seo.updateSEO);
  const addNewPage = useMutation(api.seo.updateSEO);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPagePath, setNewPagePath] = useState("");

  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCanonicalUrl, setEditedCanonicalUrl] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(
    null
  );

  useEffect(() => {
    if (pages.length > 0 && !selectedPage) {
      setSelectedPage(pages[0]);
      setEditedTitle(pages[0].title);
      setEditedDescription(pages[0].description);
      setEditedCanonicalUrl(pages[0].canonicalUrl || pages[0].path);
    }
  }, [pages, selectedPage]);

  useEffect(() => {
    if (selectedPage) {
      setEditedTitle(selectedPage.title);
      setEditedDescription(selectedPage.description);
      setEditedCanonicalUrl(selectedPage.canonicalUrl || selectedPage.path);
    }
  }, [selectedPage]);

  const filteredPages = pages.filter(
    (page) =>
      page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.canonicalUrl?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPage = async () => {
    if (!newPagePath) return;
    try {
      await addNewPage({
        path: newPagePath,
        title: `${newPagePath}`,
        description: "Add your description here",
        canonicalUrl: newPagePath,
      });
      setShowAddModal(false);
      setNewPagePath("");
      setSaveStatus("success");
    } catch (error) {
      console.error("Failed to add page:", error);
      setSaveStatus("error");
    }
  };

  const handlePageSelect = (page: any) => {
    setSelectedPage(page);
    setSaveStatus(null);
  };

  const handleSave = async () => {
    try {
      const canonicalUrlToSend =
        editedCanonicalUrl.trim() === ""
          ? undefined
          : editedCanonicalUrl.trim();

      await updateSEO({
        path: selectedPage.path,
        title: editedTitle,
        description: editedDescription,
        canonicalUrl: canonicalUrlToSend,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus("error");
      console.error("Failed to save:", error);
    }
  };

  const hasChanges =
    selectedPage &&
    (editedTitle !== selectedPage.title ||
      editedDescription !== selectedPage.description ||
      editedCanonicalUrl !== (selectedPage.canonicalUrl || selectedPage.path));

  if (!pages.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[color:var(--color-muted)] mx-auto mb-4 opacity-50" />
          <p className="text-[color:var(--color-muted)] text-xl mb-2">
            No SEO data found.
          </p>
          <p className="text-[color:var(--color-muted)]">
            Use the Settings tab to seed initial data
          </p>
        </div>
      </div>
    );
  }

  if (!selectedPage) {
    return null;
  }

  return (
    <div className="flex gap-6 h-full">
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[color:var(--color-panel)] rounded-2xl p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="mb-4 text-[color:var(--color-ink)] font-bold">
              Add New Page SEO
            </h3>
            <input
              type="text"
              value={newPagePath}
              onChange={(e) => setNewPagePath(e.target.value)}
              placeholder="/new-page"
              className="w-full px-4 py-2 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg text-[color:var(--color-ink)] focus-ring placeholder-[color:var(--color-muted)]"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddPage}
                className="flex-1 px-4 py-2 bg-[color:var(--color-accent)] text-[color:var(--color-on-accent)] rounded-lg hover:shadow-glow transition font-medium"
              >
                Add Page
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewPagePath("");
                }}
                className="flex-1 px-4 py-2 bg-[color:var(--color-surface-hover)] text-[color:var(--color-ink)] rounded-lg hover:shadow-passive transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-64 flex flex-col bg-[color:var(--color-panel)] border border-[color:var(--color-border)] rounded-2xl">
        <div className="p-4 border-b border-[color:var(--color-border)]">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[color:var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg text-[color:var(--color-ink)] focus-ring placeholder-[color:var(--color-muted)]"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[color:var(--color-muted-accent)] text-[color:var(--color-foreground)] rounded-lg hover:bg-[color:var(--color-surface-hover)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add New Page
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 p-4">
          {filteredPages.map((page) => (
            <button
              key={page._id}
              onClick={() => handlePageSelect(page)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedPage._id === page._id
                  ? "bg-[color:var(--color-muted-accent)]"
                  : "bg-[color:var(--color-panel)] hover:bg-[color:var(--color-surface-hover)]"
              }`}
            >
              <p className="mb-1 text-[color:var(--color-ink)] font-medium">
                {page.canonicalUrl || page.path}{" "}
                {/* Changed to canonicalUrl or path */}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[color:var(--color-panel)] border border-[color:var(--color-border)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[color:var(--color-ink)]">
            {selectedPage.title}
          </h2>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saveStatus === "success"}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              !hasChanges || saveStatus === "success"
                ? "bg-[color:var(--color-muted)] text-[color:var(--color-foreground)] opacity-50 cursor-not-allowed"
                : "bg-[color:var(--color-accent)] text-[color:var(--color-on-accent)] hover:shadow-glow"
            }`}
          >
            {saveStatus === "success" ? (
              <>
                <CheckCircle className="w-4 h-4" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
          <div>
            <label className="block mb-2 text-[color:var(--color-ink)] font-medium">
              Page Title
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg text-[color:var(--color-ink)] focus-ring placeholder-[color:var(--color-muted)]"
              placeholder="Enter page title..."
            />
            <div className="mt-3">
              <CharacterCounter
                current={editedTitle.length}
                limits={SEO_LIMITS.title}
                label="Title length"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[color:var(--color-ink)] font-medium">
              Meta Description
            </label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg text-[color:var(--color-ink)] focus-ring placeholder-[color:var(--color-muted)] resize-y"
              placeholder="Enter meta description..."
            />
            <div className="mt-3">
              <CharacterCounter
                current={editedDescription.length}
                limits={SEO_LIMITS.description}
                label="Description length"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[color:var(--color-ink)] font-medium">
              Canonical URL
            </label>
            <input
              type="text"
              value={editedCanonicalUrl}
              onChange={(e) => setEditedCanonicalUrl(e.target.value)}
              className="w-full px-4 py-3 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg text-[color:var(--color-ink)] focus-ring placeholder-[color:var(--color-muted)]"
              placeholder="https://yourwebsite.com/page"
            />
          </div>

          {/* OpenGraph Image - Disabled as requested */}
          <div className="mt-8">
            <h3 className="mb-3 text-[color:var(--color-ink)] font-semibold">
              OpenGraph Image (Coming Soon)
            </h3>
            <div className="p-4 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg text-[color:var(--color-muted)] text-sm">
              Uploading and managing OpenGraph images will be available in a
              future update.
            </div>
          </div>

          <div className="mt-3 p-3 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg">
            <h3 className="mb-3 text-[color:var(--color-ink)] font-semibold">
              SEO Best Practices
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[color:var(--color-accent)]" />
                <span className="text-[color:var(--color-foreground)] text-sm">
                  Title: 30-60 characters (optimal: 50-60)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[color:var(--color-accent)]" />
                <span className="text-[color:var(--color-foreground)] text-sm">
                  Description: 120-160 characters (optimal: 150-160)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[color:var(--color-accent)]" />
                <span className="text-[color:var(--color-foreground)] text-sm">
                  Include primary keyword near the beginning
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[color:var(--color-accent)]" />
                <span className="text-[color:var(--color-foreground)] text-sm">
                  Make it compelling - this is your search result ad
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
