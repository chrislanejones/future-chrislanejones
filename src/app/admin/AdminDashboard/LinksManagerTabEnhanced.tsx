"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Star,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface BrowserLink {
  _id: Id<"browserLinks">;
  href: string;
  label: string;
  domain: string;
  favicon?: string;
  category: string;
  color: string;
  order: number;
  featured?: boolean;
  createdAt: number;
  updatedAt: number;
}

interface Category {
  category: string;
  color: string;
  count: number;
}

const LinksManagerTabEnhanced = () => {
  const allLinks = (useQuery(api.browserLinks.getAll) ?? []) as BrowserLink[];
  const categories = (useQuery(api.browserLinks.getCategories) ??
    []) as Category[];

  const createLink = useMutation(api.browserLinks.create);
  const updateLink = useMutation(api.browserLinks.update);
  const deleteLink = useMutation(api.browserLinks.deleteLink);
  const deleteCategory = useMutation(api.browserLinks.deleteCategory);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
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
    category: "",
    color: "blue",
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    color: "blue",
  });

  // Auto-select first category on load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].category);
      setFormData((prev) => ({ ...prev, category: categories[0].category }));
    }
  }, [categories, selectedCategory]);

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

  const handleToggleFeatured = async (link: BrowserLink) => {
    try {
      await updateLink({
        id: link._id,
        featured: !link.featured,
      });
      setSuccess(
        link.featured
          ? `"${link.label}" removed from featured`
          : `"${link.label}" added to featured`
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to update featured status")
      );
    }
  };

  const handleOpenCategoryModal = () => {
    setCategoryFormData({ name: "", color: "blue" });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      setError(null);

      if (!categoryFormData.name.trim()) {
        setError(new Error("Category name is required"));
        return;
      }

      // Check if category already exists
      if (categories.some((c) => c.category.toLowerCase() === categoryFormData.name.toLowerCase())) {
        setError(new Error("A category with this name already exists"));
        return;
      }

      // Create a placeholder link for the new category
      await createLink({
        href: "https://example.com",
        label: "New Link",
        domain: "example.com",
        category: categoryFormData.name,
        color: categoryFormData.color,
        order: 0,
      });

      setSelectedCategory(categoryFormData.name);
      setShowCategoryModal(false);
      setSuccess(`Category "${categoryFormData.name}" created!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create category"));
    }
  };

  const currentCategoryLinks = getLinksInCategory(selectedCategory);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Status Messages */}
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
                <Button
                  onClick={handleSaveLink}
                  variant="accent"
                  className="flex-1 gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-panel) rounded-2xl p-6 max-w-sm w-full border border-(--color-border)">
            <h3 className="text-lg font-bold text-ink mb-4">Delete Link?</h3>
            <p className="text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDeleteLink(deleteConfirm)}
                variant="outline"
                className="flex-1 text-red-500 hover:bg-red-500/10 hover:text-red-600"
              >
                Delete
              </Button>
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-panel rounded-2xl p-6 max-w-md w-full border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">Add Category</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 text-muted hover:text-ink transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, name: e.target.value })
                  }
                  placeholder="My Category"
                  className="w-full px-3 py-2 rounded-lg bg-base border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
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
                        setCategoryFormData({ ...categoryFormData, color: color.id })
                      }
                      className={`${color.class} px-3 py-2 rounded-lg transition ${
                        categoryFormData.color === color.id
                          ? "ring-2 ring-accent"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSaveCategory}
                  variant="accent"
                  className="flex-1 gap-2"
                >
                  <Save className="w-4 h-4" />
                  Create Category
                </Button>
                <Button
                  onClick={() => setShowCategoryModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Categories Panel */}
        <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-(--color-ink)">Categories</h3>
            <Button
              onClick={handleOpenCategoryModal}
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
            >
              <Plus className="w-3 h-3" />
              Add Category
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition text-sm flex items-center justify-between ${
                  selectedCategory === cat.category
                    ? "bg-(--color-foreground) text-(--color-panel)"
                    : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-(--color-ink)"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full chrome-group-${cat.color}`}
                  />
                  <span>{cat.category}</span>
                </div>
                <span
                  className={`text-xs ${
                    selectedCategory === cat.category
                      ? "text-(--color-panel)/70"
                      : "text-muted"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Links Panel */}
        <div className="col-span-2 bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-(--color-ink)">
              {selectedCategory || "Select a category"}
            </h3>
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <Button
                  onClick={() => handleDeleteCategory(selectedCategory)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                  title="Delete category"
                  variant="outline"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={() => handleOpenModal()}
                variant="outline"
                className="gap-2"
                disabled={!selectedCategory}
              >
                <Plus className="w-4 h-4" />
                Add Link
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {currentCategoryLinks.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">
                No links in this category
              </p>
            ) : (
              currentCategoryLinks.map((link) => (
                <div
                  key={link._id}
                  className="p-3 bg-(--color-base) border border-(--color-border) rounded-lg group hover:border-accent transition"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted shrink-0 cursor-move" />

                    {link.favicon && (
                      <img
                        src={link.favicon}
                        alt=""
                        className="w-4 h-4 shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-(--color-ink) truncate">
                        {link.label}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {link.domain}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-4 pr-3 mr-1 border-r border-border/50">
                        <Switch
                          checked={!!link.featured}
                          onCheckedChange={() => handleToggleFeatured(link)}
                          id={`featured-${link._id}`}
                          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-600 [&>span]:bg-white [&>span]:shadow-md"
                        />
                        <label
                          htmlFor={`featured-${link._id}`}
                          className={`text-xs font-medium cursor-pointer select-none whitespace-nowrap ${
                            link.featured ? "text-emerald-500" : "text-muted"
                          }`}
                        >
                          Featured On Ohter Pages
                        </label>
                      </div>

                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted hover:text-ink transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Button
                        onClick={() => handleOpenModal(link._id)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => setDeleteConfirm(link._id)}
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksManagerTabEnhanced;
