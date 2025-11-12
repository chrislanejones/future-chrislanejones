"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Settings,
  Image,
  FileText,
  Save,
  AlertCircle,
  CheckCircle,
  LogOut,
  MessageSquare,
  Link as LinkIcon,
  Calendar,
  PanelLeft,
  Plus,
  Heart,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import ContactMessagesTab from "./ContactMessagesTab";
import MediaTab from "./MediaTab";
import LinksManagerTab from "./LinksManagerTab";
import CareerTimelineTab from "./CareerTimelineTab";
import BlogPostsTab from "./BlogPostsTab";
import BlogEngagementTab from "./BlogEngagementTab";
import SettingsTab from "./SettingsTab";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// SEO Character limits
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
        <span className="text-[#9ca3af]">{label}</span>
        <span className={`${status.color} font-medium`}>
          {current}/{limits.max} - {status.message}
        </span>
      </div>
      <div className="h-2 bg-[#0b0d10] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${percentage > 100 ? "bg-red-500" : percentage > 90 ? "bg-yellow-500" : "bg-green-500"}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const SEOTab = () => {
  const pages = useQuery(api.seo.getAllSEO) ?? [];
  const updateSEO = useMutation(api.seo.updateSEO);
  const addNewPage = useMutation(api.seo.updateSEO);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPagePath, setNewPagePath] = useState("");
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(
    null
  );

  // Initialize selected page when data loads
  useEffect(() => {
    if (pages.length > 0 && !selectedPage) {
      setSelectedPage(pages[0]);
      setEditedTitle(pages[0].title);
      setEditedDescription(pages[0].description);
    }
  }, [pages, selectedPage]);

  // Update form when page selection changes
  useEffect(() => {
    if (selectedPage) {
      setEditedTitle(selectedPage.title);
      setEditedDescription(selectedPage.description);
    }
  }, [selectedPage]);

  const filteredPages = pages.filter(
    (page) =>
      page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPage = async () => {
    if (!newPagePath) return;

    try {
      await addNewPage({
        path: newPagePath,
        title: `${newPagePath}`,
        description: "Add your description here",
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
      await updateSEO({
        path: selectedPage.path,
        title: editedTitle,
        description: editedDescription,
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
      editedDescription !== selectedPage.description);

  // Show empty state
  if (!pages.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
          <p className="text-[#9ca3af] mb-4">No SEO pages yet.</p>
          <p className="text-[#6b7280]">
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
      {/* Page List */}
      <div className="w-80 bg-[#111418] border border-[#1f242b] rounded-2xl p-4 flex flex-col">
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-colors whitespace-nowrap font-medium"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Add Page Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#111418] border border-[#1f242b] rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="mb-4 text-[#f3f4f6] font-bold">Add New Page</h3>
              <input
                type="text"
                value={newPagePath}
                onChange={(e) => setNewPagePath(e.target.value)}
                placeholder="/new-page"
                className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80] mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddPage}
                  className="flex-1 px-4 py-2 bg-[#4ade80] rounded-lg hover:bg-[#22c55e] transition-colors"
                >
                  Add Page
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewPagePath("");
                  }}
                  className="flex-1 px-4 py-2 bg-[#1a1e24] rounded-lg hover:bg-[#1f242b] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredPages.map((page) => (
            <button
              key={page._id}
              onClick={() => handlePageSelect(page)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selectedPage._id === page._id ? "bg-[#1a1e24] border border-[#4ade80]" : "bg-[#0b0d10] border border-[#1f242b] hover:border-[#4ade80]"}`}
            >
              <div className="mb-1 text-[#4ade80] font-medium">{page.path}</div>
              <div className="truncate text-[#f3f4f6]">{page.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-[#111418] border border-[#1f242b] rounded-2xl p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="mb-2 text-[#f3f4f6] font-bold">Edit SEO Metadata</h2>
          <p className="text-[#9ca3af]">
            Page:{" "}
            <span className="text-[#4ade80] font-medium">
              {selectedPage.path}
            </span>
          </p>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">
              Page Title
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
              placeholder="Enter page title..."
            />
            <div className="mt-3">
              <CharacterCounter
                current={editedTitle.length}
                limits={SEO_LIMITS.title}
                label="Title length"
              />
            </div>
            <div className="mt-3 p-3 bg-[#0b0d10] rounded-lg border border-[#1f242b]">
              <p className="mb-1 text-[#9ca3af] font-medium">Google Preview:</p>
              <p className="truncate text-[#f3f4f6]">{editedTitle}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-[#f3f4f6] font-medium">
              Meta Description
            </label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80] resize-none"
              placeholder="Enter meta description..."
            />
            <div className="mt-3">
              <CharacterCounter
                current={editedDescription.length}
                limits={SEO_LIMITS.description}
                label="Description length"
              />
            </div>
            <div className="mt-3 p-3 bg-[#0b0d10] rounded-lg border border-[#1f242b]">
              <p className="mb-1 text-[#9ca3af] font-medium">Google Preview:</p>
              <p className="line-clamp-2 text-[#f3f4f6]">{editedDescription}</p>
            </div>
          </div>

          {/* SEO Tips */}
          <div className="p-4 bg-[#0b0d10] rounded-lg border border-[#1f242b]">
            <h3 className="mb-3 text-[#f3f4f6] font-semibold">
              SEO Best Practices
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#4ade80]" />
                <span className="text-[#9ca3af]">
                  Title: 30-60 characters (optimal: 50-60)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#4ade80]" />
                <span className="text-[#9ca3af]">
                  Description: 120-160 characters (optimal: 150-160)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#4ade80]" />
                <span className="text-[#9ca3af]">
                  Include primary keyword near the beginning
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#4ade80]" />
                <span className="text-[#9ca3af]">
                  Make it compelling - this is your search result ad
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium ${hasChanges ? "bg-[#4ade80] text-[#0b0d10] hover:bg-[#22c55e]" : "bg-[#1a1e24] text-[#6b7280] cursor-not-allowed"}`}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>

          {saveStatus === "success" && (
            <div className="flex items-center gap-2 text-[#4ade80]">
              <CheckCircle className="w-4 h-4" />
              <span>Changes saved successfully!</span>
            </div>
          )}

          {saveStatus === "error" && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>Failed to save changes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ComingSoonTab = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full bg-[#111418] border border-[#1f242b] rounded-2xl">
    <div className="text-center">
      <div className="w-16 h-16 bg-[#1a1e24] rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-[#4ade80]" />
      </div>
      <h2 className="mb-2 text-[#f3f4f6] font-bold">{title}</h2>
      <p className="text-[#9ca3af]">This feature is coming soon</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active tab from URL search params, default to "seo"
  const activeTab = searchParams.get("tab") || "seo";

  // Query data for tab info
  const allLinks = useQuery(api.browserLinks.getAll) ?? [];
  const categories = useQuery(api.browserLinks.getCategories) ?? [];
  const blogPosts = useQuery(api.blogPosts.getAllPostsAdmin) ?? [];
  const allMedia = useQuery(api.media.getAll) ?? [];
  const totalImages = allMedia.length;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleTabChange = (tabId: string) => {
    router.push(`/admin?tab=${tabId}`);
  };

  const tabs = [
    { id: "seo", label: "SEO Manager", icon: FileText },
    { id: "media", label: "Media Manager", icon: Image },
    { id: "links", label: "Links Manager", icon: LinkIcon },
    { id: "career-timeline", label: "Career Timeline Manager", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "blog-posts", label: "Blog Posts", icon: FileText },
    { id: "blog-engagement", label: "Comments & Likes", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Get tab subtitle info
  const getTabSubtitle = () => {
    switch (activeTab) {
      case "media":
        return `${totalImages} total images • Drag & drop to assign to pages or posts`;
      case "links":
        return `${allLinks.length} total links • ${categories.length} categories`;
      case "career-timeline":
        return "Manage your career timeline events displayed on the career page";
      default:
        return null;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="dark flex h-screen w-full bg-[#0b0d10]">
        {/* Sidebar */}
        <Sidebar collapsible="icon" className="border-r border-[#1f242b]">
          <SidebarHeader>
            <div className="px-2 group-data-[state=collapsed]/sidebar-wrapper:hidden">
              <h1 className="font-bold text-[#f3f4f6]">Admin</h1>
              <p className="text-[#9ca3af] mt-1">Portfolio Manager</p>
              {user && (
                <p className="text-[#9ca3af] mt-2 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <SidebarMenuItem key={tab.id} className="px-2">
                    <SidebarMenuButton
                      onClick={() => handleTabChange(tab.id)}
                      isActive={activeTab === tab.id}
                      className={`${activeTab === tab.id ? "bg-[#111418] text-[#4ade80] border border-[#4ade80]" : "text-[#f3f4f6] hover:text-[#4ade80] hover:bg-[#111418]/50"} group-data-[state=collapsed]/sidebar-wrapper:justify-center`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">
                        {tab.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem className="px-2">
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="text-[#f3f4f6] hover:text-[#4ade80] hover:bg-[#111418]/50 group-data-[state=collapsed]/sidebar-wrapper:justify-center"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">
                    Sign Out
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          <div className="sticky top-0 z-10 flex min-h-14 items-center gap-2 border-b border-[#1f242b] bg-[#111418] px-4 py-3">
            <SidebarTrigger className="text-[#f3f4f6]" />
            <div className="flex-1">
              <h2 className="font-semibold text-[#f3f4f6]">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              {getTabSubtitle() && (
                <p className="text-[#9ca3af] text-sm">
                  {getTabSubtitle()}
                </p>
              )}
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {activeTab === "seo" && <SEOTab />}
            {activeTab === "media" && <MediaTab />}
            {activeTab === "links" && <LinksManagerTab />}
            {activeTab === "career-timeline" && <CareerTimelineTab />}
            {activeTab === "messages" && <ContactMessagesTab />}
            {activeTab === "blog-posts" && <BlogPostsTab />}
            {activeTab === "blog-engagement" && <BlogEngagementTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
