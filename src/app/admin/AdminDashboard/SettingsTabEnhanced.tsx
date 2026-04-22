"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  RefreshCw,
  Database,
  Link as LinkIcon,
  Calendar,
  MessageSquare,
  Navigation,
  User,
  Users,
  Save,
  Trash2,
  FileText,
  Layout,
  Briefcase,
  Activity,
  Globe,
  Bot,
  Image as ImageIcon,
  ArrowRight,
  Plus,
  Edit2,
  ToggleLeft,
  ToggleRight,
  type LucideIcon,
} from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import { MediaDrawer } from "../components/MediaDrawer";
import Image from "next/image";

interface DataSource {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface LogEntry {
  timestamp: Date;
  message: string;
  type: "info" | "success" | "error";
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "data-management", label: "Data Management", icon: Database },
  { id: "redirects", label: "Redirects", icon: ArrowRight },
  { id: "site-health", label: "Site Health", icon: Activity },
];

const SettingsTabEnhanced = () => {
  // Profile from Convex
  const profile = useQuery(api.siteSettings.getProfile);
  const updateProfile = useMutation(api.siteSettings.updateProfile);
  const updateAvatar = useMutation(api.siteSettings.updateAvatar);
  const removeAvatarMutation = useMutation(api.siteSettings.removeAvatar);

  // Local profile state (for form editing)
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    avatar: "",
    email: "",
    location: "",
  });
  const [isAvatarDrawerOpen, setIsAvatarDrawerOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sync Convex data to local state
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        bio: profile.bio || "",
        avatar: profile.avatar || "",
        email: profile.email || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  // Scrollspy state
  const [activeSection, setActiveSection] = useState("profile");
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Data Management state
  const seedLinks = useMutation(api.browserLinks.seedLinks);
  const seedTimeline = useMutation(api.careerTimeline.seedTimeline);
  const seedBlogPosts = useMutation(api.blogPosts.seedBlogPosts);
  const seedNavigation = useMutation(api.navigation.seedNavigationData);
  const seedSEO = useMutation(api.seo.seedSEOData);
  const seedProfile = useMutation(api.siteSettings.seedProfile);
  const seedPageHeaders = useMutation(api.pageHeaders.seedPageHeaders);
  const seedProjects = useMutation(api.projects.seedProjects);
  const seedClients = useMutation(api.clients.seedClients);
  const seedClientIcons = useMutation(api.media.seedClientIcons);
  const seedRedirects = useMutation(api.redirects.seedRedirects);

  // Redirects
  const allRedirects = useQuery(api.redirects.getAll) ?? [];
  const createRedirect = useMutation(api.redirects.create);
  const updateRedirect = useMutation(api.redirects.update);
  const deleteRedirectMutation = useMutation(api.redirects.deleteRedirect);
  const toggleRedirectActive = useMutation(api.redirects.toggleActive);

  const [redirectForm, setRedirectForm] = useState({
    from: "",
    to: "",
    statusCode: 301,
    label: "",
    isActive: true,
  });
  const [editingRedirectId, setEditingRedirectId] = useState<Id<"redirects"> | null>(null);
  const [isAddingRedirect, setIsAddingRedirect] = useState(false);
  const [deleteRedirectConfirm, setDeleteRedirectConfirm] = useState<Id<"redirects"> | null>(null);
  const [isSavingRedirect, setIsSavingRedirect] = useState(false);

  const handleOpenAddRedirect = () => {
    setRedirectForm({ from: "", to: "", statusCode: 301, label: "", isActive: true });
    setEditingRedirectId(null);
    setIsAddingRedirect(true);
  };

  const handleEditRedirect = (r: typeof allRedirects[number]) => {
    setRedirectForm({ from: r.from, to: r.to, statusCode: r.statusCode, label: r.label ?? "", isActive: r.isActive });
    setEditingRedirectId(r._id);
    setIsAddingRedirect(true);
  };

  const handleSaveRedirect = async () => {
    if (!redirectForm.from.trim() || !redirectForm.to.trim()) return;
    setIsSavingRedirect(true);
    try {
      if (editingRedirectId) {
        await updateRedirect({
          id: editingRedirectId,
          from: redirectForm.from.trim(),
          to: redirectForm.to.trim(),
          statusCode: redirectForm.statusCode,
          label: redirectForm.label || undefined,
          isActive: redirectForm.isActive,
        });
        success("Redirect updated!");
      } else {
        await createRedirect({
          from: redirectForm.from.trim(),
          to: redirectForm.to.trim(),
          statusCode: redirectForm.statusCode,
          label: redirectForm.label || undefined,
          isActive: redirectForm.isActive,
        });
        success("Redirect created!");
      }
      setIsAddingRedirect(false);
      setEditingRedirectId(null);
    } catch {
      showError("Failed to save redirect");
    } finally {
      setIsSavingRedirect(false);
    }
  };

  const handleCancelRedirect = () => {
    setIsAddingRedirect(false);
    setEditingRedirectId(null);
  };

  const mutationMap: Record<string, () => Promise<unknown>> = {
    links: seedLinks,
    "career-timeline": seedTimeline,
    "blog-posts": seedBlogPosts,
    "page-headers": seedPageHeaders,
    navigation: seedNavigation,
    seo: seedSEO,
    profile: seedProfile,
    projects: seedProjects,
    clients: seedClients,
    "client-icons": seedClientIcons,
    redirects: seedRedirects,
  };

  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set(),
  );
  const [isReseeding, setIsReseeding] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const {
    toasts,
    removeToast,
    success,
    error: showError,
    loading: showLoading,
  } = useToast();
  const logEndRef = useRef<HTMLDivElement>(null);

  const handleAvatarSelect = async (url: string) => {
    setProfileData((prev) => ({ ...prev, avatar: url }));
    await updateAvatar({ avatar: url });
    setIsAvatarDrawerOpen(false);
    success("Avatar updated!");
  };

  // Scrollspy effect
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const offset = 100;

      const atBottom =
        scrollTop + container.clientHeight >= container.scrollHeight - 5;
      if (atBottom) {
        setActiveSection(menuItems[menuItems.length - 1].id);
        return;
      }

      for (const item of menuItems) {
        const section = sectionRefs.current[item.id];
        if (section) {
          const sectionTop = section.offsetTop - offset;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (section && contentRef.current) {
      setActiveSection(sectionId);
      contentRef.current.scrollTo({
        top: section.offsetTop - 24,
        behavior: "smooth",
      });
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        avatar: profileData.avatar || undefined,
        email: profileData.email || undefined,
        location: profileData.location || undefined,
      });
      success("Profile saved!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      showError("Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const addLog = (
    message: string,
    type: "info" | "success" | "error" = "info",
  ) => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date(),
        message,
        type,
      },
    ]);
  };

  const dataSources: DataSource[] = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "Site owner name, bio, and social links",
    },
    {
      id: "seo",
      label: "SEO Metadata",
      icon: FileText,
      description: "Page titles and meta descriptions",
    },
    {
      id: "page-headers",
      label: "Page Headers",
      icon: Layout,
      description: "Banner titles, breadcrumb labels, and page descriptions",
    },
    {
      id: "links",
      label: "Browser Links",
      icon: LinkIcon,
      description: "Bookmark collections and categories",
    },
    {
      id: "career-timeline",
      label: "Career Timeline",
      icon: Calendar,
      description: "Professional history and milestones",
    },
    {
      id: "blog-posts",
      label: "Blog Posts",
      icon: MessageSquare,
      description: "Sample blog content and articles",
    },
    {
      id: "navigation",
      label: "Navigation",
      icon: Navigation,
      description: "Header and footer menu items",
    },
    {
      id: "projects",
      label: "Projects",
      icon: Briefcase,
      description: "App and website project portfolio",
    },
    {
      id: "clients",
      label: "Clients",
      icon: Users,
      description: "Past and present client logos and links",
    },
    {
      id: "client-icons",
      label: "Clean Local Icons",
      icon: ImageIcon,
      description: "Remove static /client-icons/ entries — drawer shows UploadThing only",
    },
    {
      id: "redirects",
      label: "Redirects",
      icon: ArrowRight,
      description: "Seed the original /links and /docs redirects",
    },
  ];

  const toggleSource = (id: string) => {
    const newSelected = new Set(selectedSources);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSources(newSelected);
  };

  const selectAll = () => {
    setSelectedSources(new Set(dataSources.map((s) => s.id)));
  };

  const deselectAll = () => {
    setSelectedSources(new Set());
  };

  const formatResult = (result: unknown): string => {
    if (typeof result === "string") {
      return result;
    }
    if (result && typeof result === "object") {
      const obj = result as Record<string, unknown>;
      if ("message" in obj) {
        return String(obj.message);
      }
      if ("success" in obj) {
        const parts: string[] = [];
        if ("inserted" in obj) parts.push(`${obj.inserted} inserted`);
        if ("updated" in obj) parts.push(`${obj.updated} updated`);
        if ("total" in obj) parts.push(`${obj.total} total`);
        return parts.length > 0 ? parts.join(", ") : "Success";
      }
      if ("count" in obj) {
        return `${obj.count} records processed`;
      }
    }
    return "Completed";
  };

  const handleReseed = async () => {
    if (selectedSources.size === 0) {
      showError("Please select at least one data source to reseed");
      addLog("Reseed aborted: No data sources selected", "error");
      return;
    }

    setIsReseeding(true);
    addLog(
      `Starting reseed for ${selectedSources.size} data source(s)...`,
      "info",
    );

    let successCount = 0;
    let errorCount = 0;

    try {
      for (const source of dataSources) {
        if (selectedSources.has(source.id)) {
          addLog(`Reseeding ${source.label}...`, "info");
          try {
            const mutation = mutationMap[source.id];
            if (mutation) {
              const result = await mutation();
              addLog(`✓ ${source.label}: ${formatResult(result)}`, "success");
              successCount++;
            } else {
              addLog(`✗ ${source.label}: No mutation found`, "error");
              errorCount++;
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed";
            addLog(`✗ ${source.label}: ${errorMsg}`, "error");
            errorCount++;
          }
        }
      }

      const summary = `Reseed complete: ${successCount} succeeded, ${errorCount} failed`;
      addLog(summary, errorCount === 0 ? "success" : "error");

      if (errorCount === 0) {
        success("All data sources reseeded successfully!");
      } else {
        showError(`Reseed completed with ${errorCount} error(s)`);
      }

      setTimeout(() => {
        setSelectedSources(new Set());
      }, 2000);
    } catch (error) {
      const errorMsg = "Unexpected error during reseed";
      addLog(errorMsg, "error");
      showError(errorMsg);
      console.error("Reseed error:", error);
    } finally {
      setIsReseeding(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="h-full flex gap-6">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Sidebar Menu */}
      <div className="w-56 shrink-0">
        <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-3 sticky top-0">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-accent text-on-accent"
                    : "bg-(--color-muted-accent) text-muted hover:text-ink hover:bg-(--color-surface-hover)"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto pr-2 space-y-8 scroll-smooth"
      >
        {/* Profile Section */}
        <section
          id="profile"
          ref={(el) => {
            sectionRefs.current["profile"] = el;
          }}
          className="scroll-mt-6"
        >
          <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">Profile</h2>
                <p className="text-sm text-muted">
                  Your personal information displayed across the site
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-(--color-muted-accent)">
                    {profileData.avatar ? (
                      <Image
                        src={profileData.avatar}
                        alt="Avatar"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent/10">
                        <User className="w-10 h-10 text-accent/50" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsAvatarDrawerOpen(true)}
                    className="absolute -bottom-1 -right-1 p-2 bg-accent text-on-accent rounded-full cursor-pointer hover:bg-accent/90 transition shadow-md"
                    title="Change photo"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-ink">Profile Photo</p>
                  <p className="text-xs text-muted">
                    Recommended: Square image, at least 200x200px
                  </p>
                  {profileData.avatar && (
                    <button
                      onClick={async () => {
                        setProfileData((prev) => ({ ...prev, avatar: "" }));
                        await removeAvatarMutation();
                      }}
                      className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 mt-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove photo
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="profile-name"
                  className="block text-sm font-medium text-ink"
                >
                  Name
                </label>
                <Input
                  id="profile-name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Your name"
                  className="max-w-md"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label
                  htmlFor="profile-bio"
                  className="block text-sm font-medium text-ink"
                >
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="A short bio about yourself"
                  rows={4}
                  className="w-full px-3 py-2 bg-(--color-muted-accent) rounded-lg text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <p className="text-xs text-muted">
                  {profileData.bio.length}/300 characters
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <Button
                  onClick={handleSaveProfile}
                  variant="outline"
                  disabled={isSavingProfile}
                  className="gap-2"
                >
                  {isSavingProfile ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Data Management Section */}
        <section
          id="data-management"
          ref={(el) => {
            sectionRefs.current["data-management"] = el;
          }}
          className="scroll-mt-6"
        >

          <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Database className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">Data Management</h2>
                <p className="text-sm text-muted">
                  Reseed initial data for selected modules
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Source Selection */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">Data Sources</p>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs text-accent hover:underline"
                  >
                    Select all
                  </button>
                  <span className="text-muted">|</span>
                  <button
                    onClick={deselectAll}
                    className="text-xs text-muted hover:text-ink"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {dataSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedSources.has(source.id)
                        ? "ring-2 ring-accent bg-accent/10"
                        : "bg-(--color-muted-accent) hover:ring-2 hover:ring-accent/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedSources.has(source.id)
                            ? "bg-accent/20 text-accent"
                            : "bg-(--color-panel) text-muted"
                        }`}
                      >
                        <source.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p
                          className={`font-medium text-sm ${
                            selectedSources.has(source.id)
                              ? "text-ink"
                              : "text-muted"
                          }`}
                        >
                          {source.label}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {source.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Reseed Button */}
              <Button
                onClick={handleReseed}
                disabled={isReseeding || selectedSources.size === 0}
                variant="outline"
                className="w-full gap-2 mt-4"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isReseeding ? "animate-spin" : ""}`}
                />
                {isReseeding
                  ? "Reseeding..."
                  : selectedSources.size === 0
                    ? "Select data sources"
                    : `Reseed ${selectedSources.size} source${selectedSources.size > 1 ? "s" : ""}`}
              </Button>

              {/* Logs */}
              {logs.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-ink">Activity Log</p>
                    <button
                      onClick={clearLogs}
                      className="text-xs text-muted hover:text-ink"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto bg-(--color-muted-accent) rounded-lg p-3 space-y-1 font-mono text-xs">
                    {logs.map((log, i) => (
                      <div
                        key={i}
                        className={`${
                          log.type === "success"
                            ? "text-emerald-500"
                            : log.type === "error"
                              ? "text-red-500"
                              : "text-muted"
                        }`}
                      >
                        <span className="opacity-50">
                          [{log.timestamp.toLocaleTimeString()}]
                        </span>{" "}
                        {log.message}
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Redirects Section */}
        <section
          id="redirects"
          ref={(el) => { sectionRefs.current["redirects"] = el; }}
          className="scroll-mt-6"
        >
          <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-ink">Redirects</h2>
                  <p className="text-sm text-muted">Dynamic URL redirects handled at runtime via Convex</p>
                </div>
              </div>
              <Button onClick={handleOpenAddRedirect} variant="accent" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Redirect
              </Button>
            </div>

            {/* Add / Edit Form */}
            {isAddingRedirect && (
              <div className="mb-6 p-4 bg-(--color-muted-accent) rounded-xl border border-(--color-border) space-y-4">
                <h3 className="text-sm font-semibold text-ink">
                  {editingRedirectId ? "Edit Redirect" : "New Redirect"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted uppercase tracking-wide">From path</label>
                    <Input
                      value={redirectForm.from}
                      onChange={(e) => setRedirectForm((p) => ({ ...p, from: e.target.value }))}
                      placeholder="/old-page"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted uppercase tracking-wide">To path / URL</label>
                    <Input
                      value={redirectForm.to}
                      onChange={(e) => setRedirectForm((p) => ({ ...p, to: e.target.value }))}
                      placeholder="/new-page or https://..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted uppercase tracking-wide">Label (optional)</label>
                    <Input
                      value={redirectForm.label}
                      onChange={(e) => setRedirectForm((p) => ({ ...p, label: e.target.value }))}
                      placeholder="e.g. Old blog post"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted uppercase tracking-wide">Status code</label>
                    <div className="flex gap-2">
                      {[301, 302].map((code) => (
                        <button
                          key={code}
                          onClick={() => setRedirectForm((p) => ({ ...p, statusCode: code }))}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                            redirectForm.statusCode === code
                              ? "bg-accent/20 text-accent border-accent"
                              : "bg-(--color-panel) text-muted border-(--color-border) hover:text-ink"
                          }`}
                        >
                          {code}
                          <span className="block text-xs font-normal opacity-70">
                            {code === 301 ? "Permanent" : "Temporary"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-ink">
                    <button
                      onClick={() => setRedirectForm((p) => ({ ...p, isActive: !p.isActive }))}
                      className="text-accent"
                    >
                      {redirectForm.isActive
                        ? <ToggleRight className="w-6 h-6" />
                        : <ToggleLeft className="w-6 h-6 text-muted" />
                      }
                    </button>
                    Active
                  </label>
                  <div className="flex gap-2">
                    <Button onClick={handleCancelRedirect} variant="outline" size="sm">Cancel</Button>
                    <Button
                      onClick={handleSaveRedirect}
                      variant="accent"
                      size="sm"
                      className="gap-2"
                      disabled={isSavingRedirect || !redirectForm.from.trim() || !redirectForm.to.trim()}
                    >
                      <Save className="w-4 h-4" />
                      {isSavingRedirect ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Redirects List */}
            {allRedirects.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No redirects yet. Click + Add Redirect to create one.</p>
            ) : (
              <div className="space-y-2">
                {allRedirects.map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-(--color-muted-accent) border border-(--color-border) group"
                  >
                    <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted mb-0.5">From</p>
                        <code className="text-sm font-mono text-ink truncate block">{r.from}</code>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted mb-0.5">To</p>
                        <code className="text-sm font-mono text-ink truncate block">{r.to}</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-(--color-panel) text-muted font-mono border border-(--color-border)">
                        {r.statusCode}
                      </span>
                      <button
                        onClick={() => toggleRedirectActive({ id: r._id })}
                        title={r.isActive ? "Disable redirect" : "Enable redirect"}
                        className="text-accent hover:opacity-70 transition"
                      >
                        {r.isActive
                          ? <ToggleRight className="w-5 h-5" />
                          : <ToggleLeft className="w-5 h-5 text-muted" />
                        }
                      </button>
                      <button
                        onClick={() => handleEditRedirect(r)}
                        className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-(--color-panel) transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteRedirectConfirm(r._id)}
                        className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Delete Redirect Modal */}
        {deleteRedirectConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-(--color-panel) rounded-2xl p-6 max-w-sm w-full border border-(--color-border)">
              <h3 className="text-lg font-bold text-ink mb-4">Delete Redirect?</h3>
              <p className="text-muted mb-6">This cannot be undone.</p>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    await deleteRedirectMutation({ id: deleteRedirectConfirm });
                    setDeleteRedirectConfirm(null);
                    success("Redirect deleted");
                  }}
                  variant="outline"
                  className="flex-1 text-red-500"
                >
                  Delete
                </Button>
                <Button onClick={() => setDeleteRedirectConfirm(null)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Site Health Section */}
        <section
          id="site-health"
          ref={(el) => {
            sectionRefs.current["site-health"] = el;
          }}
          className="scroll-mt-6"
        >
          <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">Site Health</h2>
                <p className="text-sm text-muted">
                  Sitemap and crawl configuration
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Sitemap Card */}
              <div className="p-4 bg-(--color-muted-accent) rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent" />
                  <p className="text-sm font-medium text-ink">Sitemap</p>
                </div>
                <p className="text-xs text-muted">
                  Auto-generated from all published pages, blog posts, and conferences.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs bg-(--color-panel) px-2 py-1 rounded text-accent font-mono">
                    /sitemap.xml
                  </code>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline flex items-center gap-1"
                  >
                    View sitemap ↗
                  </a>
                </div>
              </div>

              {/* robots.txt Card */}
              <div className="p-4 bg-(--color-muted-accent) rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-accent" />
                  <p className="text-sm font-medium text-ink">robots.txt</p>
                </div>
                <p className="text-xs text-muted">
                  Crawler access rules served from <code className="font-mono">/robots.txt</code>.
                </p>
                <pre className="text-xs bg-(--color-panel) rounded-lg p-3 font-mono text-(--color-ink) whitespace-pre overflow-x-auto">
{`User-agent: *
Allow: /

Sitemap: https://www.chrislanejones.com/sitemap.xml`}
                </pre>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  View robots.txt ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <MediaDrawer
        isOpen={isAvatarDrawerOpen}
        onClose={() => setIsAvatarDrawerOpen(false)}
        onSelect={handleAvatarSelect}
        title="Select Profile Photo"
        description="Choose a photo from your media library or upload a new one"
      />
    </div>
  );
};

export default SettingsTabEnhanced;
