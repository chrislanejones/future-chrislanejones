"use client";

import React, { useState, useEffect } from "react";
import {
  Link as LinkIcon,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Search,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Folder,
  Globe,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const CHROME_COLORS = [
  { id: "blue", name: "Blue", class: "chrome-group-blue" },
  { id: "red", name: "Red", class: "chrome-group-red" },
  { id: "yellow", name: "Yellow", class: "chrome-group-yellow" },
  { id: "green", name: "Green", class: "chrome-group-green" },
  { id: "pink", name: "Pink", class: "chrome-group-pink" },
  { id: "purple", name: "Purple", class: "chrome-group-purple" },
  { id: "cyan", name: "Cyan", class: "chrome-group-cyan" },
  { id: "orange", name: "Orange", class: "chrome-group-orange" },
];

interface LinkFormData {
  _id?: Id<"browserLinks">;
  href: string;
  label: string;
  domain: string;
  favicon: string;
  category: string;
  color: string;
  order: number;
}

// Extract LinkModal as separate component to prevent re-rendering issues
const LinkModal = ({
  show,
  onClose,
  title,
  formData,
  onFormChange,
  onSave,
  onAutoFill,
}: {
  show: boolean;
  onClose: () => void;
  title: string;
  formData: LinkFormData;
  onFormChange: (data: LinkFormData) => void;
  onSave: () => void;
  onAutoFill: () => void;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#111418] border border-[#1f242b] rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#f3f4f6] font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 text-[#9ca3af] hover:text-[#f3f4f6] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* URL */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">URL *</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.href}
                onChange={(e) =>
                  onFormChange({ ...formData, href: e.target.value })
                }
                placeholder="https://example.com"
                className="flex-1 px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
              />
              <button
                onClick={onAutoFill}
                className="px-4 py-2 bg-[#1a1e24] text-[#f3f4f6] rounded-lg hover:bg-[#1f242b] transition-colors whitespace-nowrap"
              >
                Auto-fill
              </button>
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">Label *</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) =>
                onFormChange({ ...formData, label: e.target.value })
              }
              placeholder="My Awesome Site"
              className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">Domain *</label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) =>
                onFormChange({ ...formData, domain: e.target.value })
              }
              placeholder="example.com"
              className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>

          {/* Favicon */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">Favicon URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.favicon}
                onChange={(e) =>
                  onFormChange({ ...formData, favicon: e.target.value })
                }
                placeholder="https://example.com/favicon.ico"
                className="flex-1 px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
              />
              {formData.favicon && (
                <img
                  src={formData.favicon}
                  alt="favicon preview"
                  className="w-8 h-8 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                onFormChange({ ...formData, category: e.target.value })
              }
              placeholder="Development Tools"
              className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">Chrome Group Color *</label>
            <div className="grid grid-cols-4 gap-2">
              {CHROME_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() =>
                    onFormChange({ ...formData, color: color.id })
                  }
                  className={`${color.class} px-4 py-2 rounded-lg transition-all ${formData.color === color.id ? "ring-2 ring-[#4ade80] ring-offset-2 ring-offset-[#111418]" : "opacity-60 hover:opacity-100"}`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  order: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onSave}
            disabled={
              !formData.href ||
              !formData.label ||
              !formData.domain ||
              !formData.category
            }
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Link
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#1a1e24] text-[#f3f4f6] rounded-lg hover:bg-[#1f242b] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const LinksManagerTab = () => {
  const allLinks = useQuery(api.browserLinks.getAll) ?? [];
  const categories = useQuery(api.browserLinks.getCategories) ?? [];
  const createLink = useMutation(api.browserLinks.create);
  const updateLink = useMutation(api.browserLinks.update);
  const deleteLink = useMutation(api.browserLinks.deleteLink);
  const deleteCategory = useMutation(api.browserLinks.deleteCategory);
  const seedLinks = useMutation(api.browserLinks.seedLinks);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [showCategoryDeleteConfirm, setShowCategoryDeleteConfirm] =
    useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(
    null
  );
  const [formData, setFormData] = useState<LinkFormData>({
    href: "",
    label: "",
    domain: "",
    favicon: "",
    category: "",
    color: "blue",
    order: 0,
  });

  // Auto-select first category on load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].category);
    }
  }, [categories, selectedCategory]);

  const filteredLinks = selectedCategory
    ? allLinks.filter((link) => link.category === selectedCategory)
    : allLinks;

  const searchedLinks = filteredLinks.filter(
    (link) =>
      link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.href.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLink = () => {
    setFormData({
      href: "",
      label: "",
      domain: "",
      favicon: "",
      category: selectedCategory || "",
      color:
        categories.find((c) => c.category === selectedCategory)?.color ||
        "blue",
      order: filteredLinks.length,
    });
    setShowAddModal(true);
  };

  const handleEditLink = (link: any) => {
    setFormData({
      _id: link._id,
      href: link.href,
      label: link.label,
      domain: link.domain,
      favicon: link.favicon || "",
      category: link.category,
      color: link.color,
      order: link.order,
    });
    setShowEditModal(true);
  };

  const handleSaveLink = async () => {
    try {
      if (formData._id) {
        // Update existing link
        await updateLink({
          id: formData._id,
          href: formData.href,
          label: formData.label,
          domain: formData.domain,
          favicon: formData.favicon || undefined,
          category: formData.category,
          color: formData.color,
          order: formData.order,
        });
      } else {
        // Create new link
        await createLink({
          href: formData.href,
          label: formData.label,
          domain: formData.domain,
          favicon: formData.favicon || undefined,
          category: formData.category,
          color: formData.color,
          order: formData.order,
        });
      }
      setSaveStatus("success");
      setShowAddModal(false);
      setShowEditModal(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to save link:", error);
      setSaveStatus("error");
    }
  };

  const handleDeleteLink = async (id: Id<"browserLinks">) => {
    try {
      await deleteLink({ id });
      setShowDeleteConfirm(null);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to delete link:", error);
      setSaveStatus("error");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory({ category: selectedCategory });
      setShowCategoryDeleteConfirm(false);
      setSelectedCategory(null);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to delete category:", error);
      setSaveStatus("error");
    }
  };

  const handleSeedData = async () => {
    try {
      await seedLinks();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to seed data:", error);
      setSaveStatus("error");
    }
  };

  const handleAutoFill = () => {
    try {
      const url = new URL(formData.href);
      const domain = url.hostname.replace("www.", "");
      setFormData({
        ...formData,
        domain,
        favicon: `${url.origin}/favicon.ico`,
      });
    } catch (error) {
      console.error("Invalid URL");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#111418] border border-[#1f242b] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#0b0d10] border-b border-[#1f242b] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[#f3f4f6] font-bold">Links Manager</h1>
            <p className="text-[#9ca3af] mt-1">
              {allLinks.length} total links • {categories.length} categories
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSeedData}
              className="flex items-center gap-2 px-4 py-2 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              {allLinks.length === 0 ? "Seed Initial Data" : "Reseed Data"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Categories Sidebar */}
        <div className="w-64 border-r border-[#1f242b] p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#f3f4f6] font-semibold">Categories</h2>
          </div>
          <div className="space-y-1">
            {categories.map((cat) => {
              const linksInCategory = allLinks.filter(
                (l) => l.category === cat.category
              );
              const colorClass =
                CHROME_COLORS.find((c) => c.id === cat.color)?.class || "";

              return (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selectedCategory === cat.category ? "bg-[#1a1e24] border border-[#4ade80]" : "hover:bg-[#1a1e24]"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                    <span className="truncate text-[#f3f4f6]">{cat.category}</span>
                  </div>
                  <span className="text-[#9ca3af]">{linksInCategory.length} links</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Links List */}
        <div className="flex-1 overflow-y-auto">
          {selectedCategory && (
            <div className="p-4 border-b border-[#1f242b] bg-[#0b0d10]">
              <div className="flex items-center justify-between">
                <h2 className="text-[#f3f4f6] font-semibold">{selectedCategory}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddLink}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-all font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </button>
                  <button
                    onClick={() => setShowCategoryDeleteConfirm(true)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {searchedLinks.length === 0 ? (
            <div className="p-8 text-center">
              <LinkIcon className="w-12 h-12 mx-auto mb-3 text-[#9ca3af] opacity-50" />
              <p className="text-[#9ca3af]">No links found</p>
            </div>
          ) : (
            <div className="p-4 grid gap-3">
              {searchedLinks.map((link) => (
                <div
                  key={link._id}
                  className="bg-[#0b0d10] border border-[#1f242b] rounded-lg p-4 hover:border-[#4ade80] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {link.favicon && (
                        <img
                          src={link.favicon}
                          alt=""
                          className="w-5 h-5 mt-1 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="truncate text-[#f3f4f6] font-medium">{link.label}</h3>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-[#4ade80] hover:text-[#22c55e]"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="truncate text-[#9ca3af]">{link.domain}</p>
                        <p className="mt-1 truncate text-[#6b7280]">{link.href}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditLink(link)}
                        className="p-2 text-[#9ca3af] hover:text-[#4ade80] hover:bg-[#4ade80]/10 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(link._id)}
                        className="p-2 text-[#9ca3af] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === link._id && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="mb-3 text-[#f3f4f6]">Delete this link?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteLink(link._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1 bg-[#1a1e24] text-[#f3f4f6] rounded hover:bg-[#1f242b] transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <LinkModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Link"
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSaveLink}
        onAutoFill={handleAutoFill}
      />
      <LinkModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Link"
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSaveLink}
        onAutoFill={handleAutoFill}
      />

      {/* Category Delete Confirmation */}
      {showCategoryDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111418] border border-red-500/30 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-[#f3f4f6] font-bold">Delete Category?</h3>
            </div>
            <p className="text-[#9ca3af] mb-6">
              This will delete all links in "{selectedCategory}". This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCategory}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
              >
                Delete Category
              </button>
              <button
                onClick={() => setShowCategoryDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-[#1a1e24] text-[#f3f4f6] rounded-lg hover:bg-[#1f242b] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Toast */}
      {saveStatus && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg font-medium ${saveStatus === "success" ? "bg-[#4ade80] text-[#0b0d10]" : "bg-red-500 text-white"}`}
          >
            {saveStatus === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>
              {saveStatus === "success" ? "Success!" : "Error occurred"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksManagerTab;
