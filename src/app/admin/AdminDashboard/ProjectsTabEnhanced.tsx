// src/app/admin/AdminDashboard/ProjectsTabEnhanced.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useUploadThing } from "@/utils/uploadthing";
import { MediaDrawer } from "../components/MediaDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { Star } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

interface Project {
  _id: Id<"projects">;
  title: string;
  description: string;
  category: "app" | "website";
  image?: string;
  githubUrl?: string;
  codebergUrl?: string;
  vercelUrl?: string;
  customUrl?: string;
  featured: boolean;
  order?: number;
  createdAt: number;
  updatedAt: number;
}

const ProjectsTabEnhanced = () => {
  const projects = useQuery(api.projects.getAll);
  const projectList = projects ?? []; // always an array
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProjectMutation = useMutation(api.projects.deleteProject);
  const toggleFeatured = useMutation(api.projects.toggleFeatured);
  const createMedia = useMutation(api.media.create);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "app" as "app" | "website",
    image: "",
    githubUrl: "",
    codebergUrl: "",
    vercelUrl: "",
    customUrl: "",
    featured: false,
    order: 0,
  });

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        await createMedia({
          url: res[0].url,
          filename: res[0].name || "Project image",
          size: res[0].size,
        });
        setFormData((prev) => ({ ...prev, image: res[0].url }));
      }
    },
  });

  useEffect(() => {
    if (projectList.length > 0 && !selectedProject && !isCreating) {
      const projectData = projectList[0];
      setSelectedProject({
        ...projectData,
        category: (projectData.category as "app" | "website") || "app",
      });
    }
  }, [projects, selectedProject, isCreating]);

  useEffect(() => {
    if (selectedProject && !isCreating) {
      setFormData({
        title: selectedProject.title,
        description: selectedProject.description,
        category: selectedProject.category,
        image: selectedProject.image || "",
        githubUrl: selectedProject.githubUrl || "",
        codebergUrl: selectedProject.codebergUrl || "",
        vercelUrl: selectedProject.vercelUrl || "",
        customUrl: selectedProject.customUrl || "",
        featured: selectedProject.featured,
        order: selectedProject.order || 0,
      });
      setIsEditing(false);
    }
  }, [selectedProject, isCreating]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedProject(null);
    setFormData({
      title: "",
      description: "",
      category: "app",
      image: "",
      githubUrl: "",
      codebergUrl: "",
      vercelUrl: "",
      customUrl: "",
      featured: false,
      order: 0,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setSaveStatus("error");
      return;
    }

    setIsSaving(true);
    try {
      if (isCreating) {
        await createProject({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image: formData.image || undefined,
          githubUrl: formData.githubUrl || undefined,
          codebergUrl: formData.codebergUrl || undefined,
          vercelUrl: formData.vercelUrl || undefined,
          customUrl: formData.customUrl || undefined,
          featured: formData.featured,
          order: formData.order,
        });
        setSaveStatus("success");
        setIsCreating(false);
      } else if (selectedProject) {
        await updateProject({
          id: selectedProject._id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image: formData.image || undefined,
          githubUrl: formData.githubUrl || undefined,
          codebergUrl: formData.codebergUrl || undefined,
          vercelUrl: formData.vercelUrl || undefined,
          customUrl: formData.customUrl || undefined,
          featured: formData.featured,
          order: formData.order,
        });
        setSaveStatus("success");
      }
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to save project:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: Id<"projects">) => {
    try {
      await deleteProjectMutation({ id });
      setDeleteConfirm(null);
      if (selectedProject?._id === id) {
        setSelectedProject(null);
      }
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to delete project:", error);
      setSaveStatus("error");
    }
  };

  const handleToggleFeatured = async () => {
    if (!selectedProject) return;
    const { featured } = await toggleFeatured({ id: selectedProject._id });
    // Optimistically update local state so UI snaps without re-fetch
    setSelectedProject({ ...selectedProject, featured });
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
      if (projectList.length > 0) {
        const projectData = projectList[0];
        setSelectedProject({
          ...projectData,
          category: (projectData.category as "app" | "website") || "app",
        });
      }
    } else if (selectedProject) {
      setFormData({
        title: selectedProject.title,
        description: selectedProject.description,
        category: selectedProject.category,
        image: selectedProject.image || "",
        githubUrl: selectedProject.githubUrl || "",
        codebergUrl: selectedProject.codebergUrl || "",
        vercelUrl: selectedProject.vercelUrl || "",
        customUrl: selectedProject.customUrl || "",
        featured: selectedProject.featured,
        order: selectedProject.order || 0,
      });
    }
    setIsEditing(false);
  };

  const handleMediaSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
    setIsEditing(true);
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Projects List */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-(--color-ink)">Projects</h3>
          <Button
            onClick={handleCreateNew}
            variant="accent"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {projectList.map((project) => (
            <button
              key={project._id}
              onClick={() => {
                setSelectedProject({
                  ...project,
                  category: (project.category as "app" | "website") || "app",
                });
              }}
              className={`w-full text-left p-3 rounded-lg transition ${
                selectedProject?._id === project._id
                  ? "bg-(--color-foreground) text-(--color-panel)"
                  : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover)"
              }`}
            >
              <p className="font-medium line-clamp-1">{project.title}</p>
              <p className="text-xs opacity-75 capitalize">
                {project.category}
              </p>
              {project.featured && (
                <p className="text-xs opacity-75">⭐ Featured</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Project Details */}
      <div className="col-span-2 bg-(--color-panel) border border-(--color-border) rounded-2xl overflow-hidden flex flex-col">
        {saveStatus === "success" && (
          <div className="px-6 pt-4">
            <SuccessDisplay
              message="Project saved successfully!"
              onDismiss={() => setSaveStatus(null)}
              compact
            />
          </div>
        )}
        {saveStatus === "error" && (
          <div className="px-6 pt-4">
            <ErrorDisplay
              error={new Error("Failed to save project")}
              onDismiss={() => setSaveStatus(null)}
              compact
            />
          </div>
        )}

        {selectedProject || isCreating ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Image Preview */}
            {formData.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image
                  src={formData.image}
                  alt={formData.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block mb-2 text-ink font-medium">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, title: e.target.value }));
                  setIsEditing(true);
                }}
                disabled={!isEditing}
                placeholder="Project title"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 text-ink font-medium">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    category: e.target.value as "app" | "website",
                  });
                  setIsEditing(true);
                }}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-60"
              >
                <option value="app">App / Tool</option>
                <option value="website">Client Website</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-ink font-medium">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                  setIsEditing(true);
                }}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none resize-none disabled:opacity-60"
                placeholder="Project description"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block mb-2 text-ink font-medium">Image</label>
              {isEditing ? (
                <Button
                  onClick={() => setIsMediaDrawerOpen(true)}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Select Image
                </Button>
              ) : (
                <p className="text-muted text-sm">
                  {formData.image || "No image"}
                </p>
              )}
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-ink font-medium text-sm">
                  GitHub URL
                </label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }));
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block mb-2 text-ink font-medium text-sm">
                  Codeberg URL
                </label>
                <Input
                  value={formData.codebergUrl}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      codebergUrl: e.target.value,
                    }));
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  placeholder="https://codeberg.org/..."
                />
              </div>
              <div>
                <label className="block mb-2 text-ink font-medium text-sm">
                  Vercel URL
                </label>
                <Input
                  value={formData.vercelUrl}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      vercelUrl: e.target.value,
                    }));
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block mb-2 text-ink font-medium text-sm">
                  Custom URL
                </label>
                <Input
                  value={formData.customUrl}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      customUrl: e.target.value,
                    }));
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Featured Toggle */}
            {selectedProject && (
              <div className="flex items-center justify-between p-4 bg-(--color-muted-accent) rounded-xl">
                <label className="text-ink font-medium flex items-center gap-2">
                  <Star className="w-4 h-4" aria-hidden="true" />
                  Featured
                </label>
                <Button
                  variant={selectedProject.featured ? "accent" : "outline"}
                  size="sm"
                  onClick={handleToggleFeatured}
                >
                  {selectedProject.featured ? "Yes" : "No"}
                </Button>
              </div>
            )}

            {/* Order */}
            <div>
              <label className="block mb-2 text-ink font-medium text-sm">
                Display Order
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }));
                  setIsEditing(true);
                }}
                disabled={!isEditing}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-(--color-border)">
              {!isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  {selectedProject && (
                    <>
                      <Button onClick={handleToggleFeatured} variant="neutral">
                        {selectedProject.featured ? "Unfeature" : "Feature"}
                      </Button>
                      <Button
                        onClick={() => setDeleteConfirm(selectedProject._id)}
                        variant="outline"
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    variant="accent"
                    disabled={isSaving}
                    className="flex-1 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto opacity-40 mb-4" />
              <p>Select a project to view or edit</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-panel) rounded-2xl p-6 max-w-sm w-full border border-(--color-border)">
            <h3 className="text-lg font-bold text-ink mb-4">Delete Project?</h3>
            <p className="text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDelete(deleteConfirm as Id<"projects">)}
                variant="outline"
                className="flex-1 text-red-500"
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

      {/* Media Drawer */}
      <MediaDrawer
        isOpen={isMediaDrawerOpen}
        onClose={() => setIsMediaDrawerOpen(false)}
        onSelect={handleMediaSelect}
        title="Select Project Image"
        description="Choose an image for your project"
      />
    </div>
  );
};

export default ProjectsTabEnhanced;
