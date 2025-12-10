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
  Upload,
  Save,
  Trash2,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/utils/uploadthing";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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

  const mutationMap: Record<string, () => Promise<unknown>> = {
    links: seedLinks,
    "career-timeline": seedTimeline,
    "blog-posts": seedBlogPosts,
    navigation: seedNavigation,
    seo: seedSEO,
    profile: seedProfile,
  };

  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set()
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

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        setProfileData((prev) => ({ ...prev, avatar: res[0].url }));
        await updateAvatar({ avatar: res[0].url });
        setIsUploadingAvatar(false);
        success("Avatar uploaded!");
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setIsUploadingAvatar(false);
      showError("Failed to upload avatar");
    },
  });

  // Scrollspy effect
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const offset = 100;

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
      contentRef.current.scrollTo({
        top: section.offsetTop - 24,
        behavior: "smooth",
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    await startUpload([file]);
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
    type: "info" | "success" | "error" = "info"
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
      "info"
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
        <div className="bg-panel border border-border rounded-2xl p-3 sticky top-0">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-accent text-on-accent"
                    : "text-muted hover:text-ink hover:bg-surface-hover"
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
          <div className="bg-panel border border-border rounded-2xl p-6">
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
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-base border-2 border-border">
                    {profileData.avatar ? (
                      <Image
                        src={profileData.avatar}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent/10">
                        <User className="w-10 h-10 text-accent/50" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 p-2 bg-accent text-on-accent rounded-full cursor-pointer hover:bg-accent/90 transition shadow-md"
                  >
                    {isUploadingAvatar ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
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
                  className="w-full px-3 py-2 bg-base border border-border rounded-lg text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
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
          <div className="bg-panel border border-border rounded-2xl p-6">
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
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedSources.has(source.id)
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedSources.has(source.id)
                            ? "bg-accent/20 text-accent"
                            : "bg-base text-muted"
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
                  <div className="max-h-48 overflow-y-auto bg-base rounded-lg p-3 space-y-1 font-mono text-xs">
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
      </div>
    </div>
  );
};

export default SettingsTabEnhanced;
