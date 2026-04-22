// src/app/admin/AdminDashboard/ProjectsTabEnhanced.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  Star,
  ChevronUp,
  ChevronDown,
  Edit2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { MediaDrawer } from "../components/MediaDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import Image from "next/image";

interface Project {
  _id: Id<"projects">;
  title: string;
  description: string;
  category: "app" | "website";
  features?: string[];
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
  const featuredProjects = useQuery(api.projects.getFeatured);
  const projectList = (projects ?? []) as Project[];
  const featuredList = (featuredProjects ?? []) as Project[];

  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProjectMutation = useMutation(api.projects.deleteProject);
  const toggleFeatured = useMutation(api.projects.toggleFeatured);
  const swapFeaturedOrder = useMutation(api.projects.swapFeaturedOrder);
  const createMedia = useMutation(api.media.create);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activePanel, setActivePanel] = useState<"edit" | "order">("edit");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "app" | "website">("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "app" as "app" | "website",
    features: "",  // newline-separated
    image: "",
    githubUrl: "",
    codebergUrl: "",
    vercelUrl: "",
    customUrl: "",
    featured: false,
    order: 0,
  });

  useEffect(() => {
    if (projectList.length > 0 && !selectedProject && !isCreating) {
      const p = projectList[0];
      setSelectedProject({ ...p, category: (p.category as "app" | "website") || "app" });
    }
  }, [projects, selectedProject, isCreating]);

  useEffect(() => {
    if (selectedProject && !isCreating) {
      setFormData({
        title: selectedProject.title,
        description: selectedProject.description,
        category: selectedProject.category,
        features: (selectedProject.features ?? []).join("\n"),
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
      features: "",
      image: "",
      githubUrl: "",
      codebergUrl: "",
      vercelUrl: "",
      customUrl: "",
      featured: false,
      order: 0,
    });
    setIsEditing(true);
    setActivePanel("edit");
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setSaveStatus("error");
      return;
    }

    const featuresArray = formData.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    setIsSaving(true);
    try {
      if (isCreating) {
        await createProject({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          features: featuresArray.length > 0 ? featuresArray : undefined,
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
          features: featuresArray.length > 0 ? featuresArray : undefined,
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
      if (selectedProject?._id === id) setSelectedProject(null);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  const handleToggleFeatured = async (_checked?: boolean) => {
    if (!selectedProject) return;
    const { featured } = await toggleFeatured({ id: selectedProject._id });
    setSelectedProject({ ...selectedProject, featured });
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
      if (projectList.length > 0) {
        const p = projectList[0];
        setSelectedProject({ ...p, category: (p.category as "app" | "website") || "app" });
      }
    } else if (selectedProject) {
      setFormData({
        title: selectedProject.title,
        description: selectedProject.description,
        category: selectedProject.category,
        features: (selectedProject.features ?? []).join("\n"),
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

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    await swapFeaturedOrder({
      idA: featuredList[index]._id,
      idB: featuredList[index - 1]._id,
    });
  };

  const handleMoveDown = async (index: number) => {
    if (index === featuredList.length - 1) return;
    await swapFeaturedOrder({
      idA: featuredList[index]._id,
      idB: featuredList[index + 1]._id,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Projects List */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-(--color-ink)">Projects</h3>
          <Button onClick={handleCreateNew} variant="accent" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-1 mb-3 p-1 bg-(--color-muted-accent) rounded-lg">
          {(["all", "app", "website"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                categoryFilter === cat
                  ? "bg-(--color-panel) text-(--color-ink) shadow-sm"
                  : "text-muted hover:text-(--color-ink)"
              }`}
            >
              {cat === "all" ? "All" : cat === "app" ? "App / Tool" : "Website"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {projectList
            .filter((p) => categoryFilter === "all" || p.category === categoryFilter)
            .map((project) => (
            <button
              key={project._id}
              onClick={() => {
                setSelectedProject({ ...project, category: (project.category as "app" | "website") || "app" });
                setActivePanel("edit");
              }}
              className={`w-full text-left p-3 rounded-lg transition ${
                selectedProject?._id === project._id
                  ? "bg-(--color-foreground) text-(--color-panel)"
                  : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover)"
              }`}
            >
              <p className="font-medium line-clamp-1">{project.title}</p>
              <p className="text-xs opacity-75">{project.category === "app" ? "App / Tool" : "Client Website"}</p>
              {project.featured && <p className="text-xs opacity-75">⭐ Featured</p>}
            </button>
          ))}
        </div>

        {/* Featured Order button */}
        <button
          onClick={() => setActivePanel(activePanel === "order" ? "edit" : "order")}
          className={`mt-4 w-full p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            activePanel === "order"
              ? "ring-2 ring-accent bg-accent/10 text-accent"
              : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-muted"
          }`}
        >
          <Star className="w-4 h-4" />
          Featured Order
        </button>
      </div>

      {/* Right panel */}
      <div className="col-span-2 bg-(--color-panel) border border-(--color-border) rounded-2xl overflow-hidden flex flex-col">
        {saveStatus === "success" && (
          <div className="px-6 pt-4">
            <SuccessDisplay message="Project saved successfully!" onDismiss={() => setSaveStatus(null)} compact />
          </div>
        )}
        {saveStatus === "error" && (
          <div className="px-6 pt-4">
            <ErrorDisplay error={new Error("Failed to save project")} onDismiss={() => setSaveStatus(null)} compact />
          </div>
        )}

        {/* ── FEATURED ORDER PANEL ── */}
        {activePanel === "order" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="mb-2">
              <h3 className="font-semibold text-ink">Featured Order</h3>
              <p className="text-sm text-muted mt-1">
                These projects appear on the home page carousel in this order.
              </p>
            </div>

            {featuredList.length === 0 ? (
              <p className="text-muted text-sm">No featured projects yet.</p>
            ) : (
              <div className="space-y-2">
                {featuredList.map((project, i) => (
                  <div
                    key={project._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-(--color-muted-accent) border border-(--color-border)"
                  >
                    <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-accent/10 text-accent text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-sm line-clamp-1">{project.title}</p>
                      <p className="text-xs text-muted capitalize">{project.category}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(i)}
                        disabled={i === 0}
                        className="p-1 rounded hover:bg-(--color-surface-hover) disabled:opacity-30 disabled:cursor-not-allowed transition"
                        aria-label="Move up"
                      >
                        <ChevronUp className="w-4 h-4 text-muted" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(i)}
                        disabled={i === featuredList.length - 1}
                        className="p-1 rounded hover:bg-(--color-surface-hover) disabled:opacity-30 disabled:cursor-not-allowed transition"
                        aria-label="Move down"
                      >
                        <ChevronDown className="w-4 h-4 text-muted" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted pt-2">
              To add or remove a project from featured, select it from the list and toggle the Featured button.
            </p>
          </div>
        )}

        {/* ── EDIT PANEL ── */}
        {activePanel === "edit" && (selectedProject || isCreating) && (
          <>
            {/* Banner header */}
            <div className="flex items-center justify-between px-6 py-4 bg-(--color-muted-accent) shrink-0">
              <div>
                <h2 className="font-bold text-ink">
                  {isCreating ? "New Project" : formData.title || "Untitled"}
                </h2>
                <p className="text-sm text-muted">
                  {formData.category === "app" ? "App / Tool" : "Client Website"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      variant="accent"
                      size="sm"
                      className="gap-2"
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    {selectedProject && (
                      <Button
                        onClick={() => setDeleteConfirm(selectedProject._id)}
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {formData.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image src={formData.image} alt={formData.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
              </div>
            )}

            <div>
              <label className="block mb-2 text-ink font-medium">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => { setFormData((p) => ({ ...p, title: e.target.value })); setIsEditing(true); }}
                disabled={!isEditing}
                placeholder="Project title"
              />
            </div>

            <div>
              <label className="block mb-2 text-ink font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) => { setFormData({ ...formData, category: e.target.value as "app" | "website" }); setIsEditing(true); }}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-60"
              >
                <option value="app">App / Tool</option>
                <option value="website">Client Website</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-ink font-medium">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => { setFormData((p) => ({ ...p, description: e.target.value })); setIsEditing(true); }}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none resize-none disabled:opacity-60"
                placeholder="Project description"
              />
            </div>

            <div>
              <label className="block mb-2 text-ink font-medium">
                Features{" "}
                <span className="text-muted font-normal text-sm">(one per line)</span>
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => { setFormData((p) => ({ ...p, features: e.target.value })); setIsEditing(true); }}
                disabled={!isEditing}
                rows={5}
                className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none resize-none disabled:opacity-60 font-mono text-sm"
                placeholder={"Offline-friendly and keyboard-navigable\nUndo/redo, rotation/flip, pagination\nBulk crop mirroring across selected images"}
              />
            </div>

            <div>
              <label className="block mb-2 text-ink font-medium">Image</label>
              {isEditing ? (
                <Button onClick={() => setIsMediaDrawerOpen(true)} variant="outline" className="w-full gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Select Image
                </Button>
              ) : (
                <p className="text-muted text-sm">{formData.image || "No image"}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "githubUrl", label: "GitHub URL", placeholder: "https://github.com/..." },
                { key: "codebergUrl", label: "Codeberg URL", placeholder: "https://codeberg.org/..." },
                { key: "vercelUrl", label: "Vercel / Live URL", placeholder: "https://..." },
                { key: "customUrl", label: "Custom URL", placeholder: "https://..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block mb-2 text-ink font-medium text-sm">{label}</label>
                  <Input
                    value={(formData as any)[key]}
                    onChange={(e) => { setFormData((p) => ({ ...p, [key]: e.target.value })); setIsEditing(true); }}
                    disabled={!isEditing}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>

            {/* Featured Toggle */}
            {(selectedProject || isCreating) && (
              <div className="flex items-center justify-between p-4 bg-(--color-muted-accent) rounded-xl">
                <label
                  htmlFor="featured-switch"
                  className="text-ink font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Star className="w-4 h-4" aria-hidden="true" />
                  Featured on home page
                </label>
                {selectedProject ? (
                  <Switch
                    id="featured-switch"
                    checked={selectedProject.featured}
                    onCheckedChange={handleToggleFeatured}
                  />
                ) : (
                  <Switch
                    id="featured-switch"
                    checked={formData.featured}
                    onCheckedChange={(checked) => { setFormData((p) => ({ ...p, featured: checked })); setIsEditing(true); }}
                  />
                )}
              </div>
            )}

            {/* Display Order */}
            <div>
              <label className="block mb-2 text-ink font-medium text-sm">Display Order</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => { setFormData((p) => ({ ...p, order: parseInt(e.target.value) || 0 })); setIsEditing(true); }}
                disabled={!isEditing}
              />
            </div>

          </div>
          </>
        )}

        {activePanel === "edit" && !selectedProject && !isCreating && (
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
              <Button onClick={() => handleDelete(deleteConfirm as Id<"projects">)} variant="outline" className="flex-1 text-red-500">
                Delete
              </Button>
              <Button onClick={() => setDeleteConfirm(null)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <MediaDrawer
        isOpen={isMediaDrawerOpen}
        onClose={() => setIsMediaDrawerOpen(false)}
        onSelect={(url) => { setFormData((p) => ({ ...p, image: url })); setIsEditing(true); setIsMediaDrawerOpen(false); }}
        title="Select Project Image"
        description="Choose an image for your project"
      />
    </div>
  );
};

export default ProjectsTabEnhanced;
