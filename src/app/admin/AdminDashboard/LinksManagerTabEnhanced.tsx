"use client";
import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Link as LinkIcon,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { useLinksEffect } from "../hooks/useLinksEffect";

const LinksManagerTabEnhanced = () => {
  const allLinks = useQuery(api.browserLinks.getAll) ?? [];
  const categories = useQuery(api.browserLinks.getCategories) ?? [];
  const createLink = useMutation(api.browserLinks.create);
  const updateLink = useMutation(api.browserLinks.update);
  const deleteLink = useMutation(api.browserLinks.deleteLink);
  const deleteCategory = useMutation(api.browserLinks.deleteCategory);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.category || ""
  );
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    href: "",
    label: "",
    domain: "",
    favicon: "",
    category: selectedCategory,
    color: "blue",
  });

  const CHROME_COLORS = [
    { id: "blue", name: "Blue", class: "bg-blue-500" },
    { id: "red", name: "Red", class: "bg-red-500" },
    { id: "yellow", name: "Yellow", class: "bg-yellow-500" },
    { id: "green", name: "Green", class: "bg-green-500" },
    { id: "pink", name: "Pink", class: "bg-pink-500" },
    { id: "purple", name: "Purple", class: "bg-purple-500" },
    { id: "cyan", name: "Cyan", class: "bg-cyan-500" },
    { id: "orange", name: "Orange", class: "bg-orange-500" },
  ];

  const getLinksInCategory = (category: string) => {
    return allLinks.filter((link) => link.category === category);
  };

  const handleOpenModal = (linkId?: string) => {
    if (linkId) {
      const link = allLinks.find((l) => l._id === (linkId as any));
      if (link) {
        setFormData({
          href: link.href,
          label: link.label,
          domain: link.domain,
          favicon: link.favicon || "",
          category: link.category,
          color: link.color,
        });
        setEditingLinkId(linkId);
        setIsEditing(true);
      }
    } else {
      setFormData({
        href: "",
        label: "",
        domain: "",
        favicon: "",
        category: selectedCategory,
        color: "blue",
      });
      setEditingLinkId(null);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSaveLink = async () => {
    try {
      setError(null);

      if (!formData.href.trim() || !formData.label.trim()) {
        setError(new Error("URL and Label are required"));
        return;
      }

      // Extract domain from URL
      const url = new URL(formData.href);
      const domain = url.hostname;

      if (isEditing && editingLinkId) {
        await updateLink({
          id: editingLinkId as Id<"browserLinks">,
          href: formData.href,
          label: formData.label,
          domain,
          favicon: formData.favicon || undefined,
          category: formData.category,
          color: formData.color,
          order: 0,
        });
        setSuccess("Link updated successfully!");
      } else {
        await createLink({
          href: formData.href,
          label: formData.label,
          domain,
          favicon: formData.favicon || undefined,
          category: formData.category,
          color: formData.color,
          order: getLinksInCategory(formData.category).length,
        });
        setSuccess("Link created successfully!");
      }

      setShowModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to save link"));
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink({ id: linkId as Id<"browserLinks"> });
      setSuccess("Link deleted successfully!");
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete link"));
    }
  };

  const handleDeleteCategory = async (category: string) => {
    try {
      const count = getLinksInCategory(category).length;
      if (
        confirm(
          `Delete "${category}" and all ${count} link(s)? This cannot be undone.`
        )
      ) {
        await deleteCategory({ category });
        setSelectedCategory(
          categories.find((c) => c.category !== category)?.category || ""
        );
        setSuccess(`Category "${category}" deleted!`);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete category")
      );
    }
  };

  const currentCategoryLinks = getLinksInCategory(selectedCategory);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      {error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}
      {success && (
        <SuccessDisplay message={success} onDismiss={() => setSuccess(null)} />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-panel rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">
                {isEditing ? "Edit Link" : "Add Link"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-muted hover:text-ink transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  value={formData.href}
                  onChange={(e) =>
                    setFormData({ ...formData, href: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg bg-base border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="My Link"
                  className="w-full px-3 py-2 rounded-lg bg-base border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  value={formData.favicon}
                  onChange={(e) =>
                    setFormData({ ...formData, favicon: e.target.value })
                  }
                  placeholder="https://example.com/favicon.ico"
                  className="w-full px-3 py-2 rounded-lg bg-base border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-base border border-border text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {categories.map((cat) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CHROME_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() =>
                        setFormData({ ...formData, color: color.id })
                      }
                      className={`${color.class} px-3 py-2 rounded-lg transition ${
                        formData.color === color.id
                          ? "ring-2 ring-accent"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveLink}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-on-accent rounded-lg hover:shadow-glow transition font-bold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-muted-accent text-ink rounded-lg hover:bg-surface-hover transition font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 overflow-hidden flex gap-6">
        {/* Categories Sidebar */}
        <div className="w-64 border border-border rounded-lg bg-panel overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-ink mb-3">Categories</h3>
            <button
              onClick={() => handleOpenModal()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent text-on-accent rounded-lg hover:shadow-glow transition font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  selectedCategory === cat.category
                    ? "bg-accent text-on-accent"
                    : "hover:bg-surface-hover text-ink"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${CHROME_COLORS.find((c) => c.id === cat.color)?.class}`}
                  />
                  <span className="truncate text-sm">{cat.category}</span>
                </div>
                <span className="text-xs text-opacity-70">
                  {getLinksInCategory(cat.category).length} links
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Links View */}
        <div className="flex-1 overflow-y-auto bg-panel border border-border rounded-lg p-6">
          {selectedCategory && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-ink">
                  {selectedCategory}
                </h2>
                <button
                  onClick={() => handleDeleteCategory(selectedCategory)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {currentCategoryLinks.length === 0 ? (
                <div className="text-center py-12">
                  <LinkIcon className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
                  <p className="text-muted mb-4">No links in this category</p>
                  <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-accent text-on-accent rounded-lg hover:shadow-glow transition font-medium"
                  >
                    Add First Link
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentCategoryLinks.map((link) => (
                    <div
                      key={link._id}
                      className="group p-4 bg-base border border-border rounded-lg hover:border-accent transition"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {link.favicon && (
                          <img
                            src={link.favicon}
                            alt=""
                            className="w-6 h-6 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ink truncate">
                            {link.label}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {link.domain}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleOpenModal(link._id)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded hover:bg-accent/20 transition text-sm font-medium"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        {deleteConfirm === link._id ? (
                          <>
                            <button
                              onClick={() => handleDeleteLink(link._id)}
                              className="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm font-medium"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(link._id)}
                            className="flex items-center justify-center px-2 py-1 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}

                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-2 py-1 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinksManagerTabEnhanced;
