"use client";

import React, { useState } from "react";
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
  List,
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
import PagesMenuTab from "./PagesMenuTab";
import { SEOTitlesTab } from "./SEOTitlesTab";
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
  const activeTab = searchParams.get("tab") || "pages-menu"; // Changed default tab to new "pages-menu"

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
    { id: "pages-menu", label: "Pages & Menu", icon: List },
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
              <h2 className="font-bold text-[#f3f4f6]">Main Panel</h2>
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
                      className={`${
                        activeTab === tab.id
                          ? "bg-[color:var(--color-muted-accent)] text-[#4ade80]"
                          : "text-[#f3f4f6] hover:text-[#4ade80] hover:bg-[#111418]/50"
                      } group-data-[state=collapsed]/sidebar-wrapper:justify-center`}
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
                <p className="text-[#9ca3af] text-sm">{getTabSubtitle()}</p>
              )}
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {activeTab === "pages-menu" && <PagesMenuTab />}
            {activeTab === "seo" && <SEOTitlesTab />}
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
