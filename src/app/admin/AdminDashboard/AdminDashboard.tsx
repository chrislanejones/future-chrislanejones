// src/app/admin/AdminDashboard/AdminDashboard.tsx
"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Settings,
  Image,
  FileText,
  LogOut,
  List,
  Link,
  Calendar,
  MessageSquare,
  Heart,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SimpleModeToggle } from "@/components/simple-mode-toggle";
import { SeoTabEnhanced } from "./SeoTabEnhanced";
import SettingsTabEnhanced from "./SettingsTabEnhanced";
import MediaTabEnhanced from "./MediaTabEnhanced";
import BlogPostsTabEnhanced from "./BlogPostsTabEnhanced";
import PagesMenuTabEnhanced from "./PagesMenuTabEnhanced";
import LinksManagerTabEnhanced from "./LinksManagerTabEnhanced";
import CareerTimelineTabEnhanced from "./CareerTimelineTabEnhanced";

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center text-muted space-y-3">
      <Heart className="w-10 h-10 opacity-40 mx-auto" />
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p>Module coming soon.</p>
    </div>
  </div>
);

// Separate component for sidebar content to access useSidebar hook
const AdminSidebarContent = ({
  tabs,
  activeTab,
  onTabChange,
  onSignOut,
}: {
  tabs: { id: string; label: string; icon: LucideIcon }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onSignOut: () => void;
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-panel">
      <SidebarHeader className="flex flex-col gap-2 p-4">
        <div className="px-2">
          {!isCollapsed && (
            <h2 className="font-bold text-ink text-lg">Admin Dashboard</h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden flex-1 overflow-y-auto p-2 space-y-1">
        <SidebarMenu>
          {tabs.map((tab) => (
            <SidebarMenuItem key={tab.id}>
              <Button
                variant={activeTab === tab.id ? "accent" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`w-full justify-start gap-3 ${
                  isCollapsed ? "justify-center px-0" : ""
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {!isCollapsed && <span>{tab.label}</span>}
              </Button>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-2 mt-auto p-4">
        <SidebarMenu>
          {/* Sign Out Button */}
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className={`w-full justify-start gap-2 ${
                isCollapsed ? "justify-center px-0" : ""
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </SidebarMenuItem>

          {/* Theme Toggle Button */}
          <SidebarMenuItem>
            <div className={`flex ${isCollapsed ? "justify-center" : "px-2"}`}>
              <SimpleModeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

const AdminDashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "pages";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleTabChange = (tabId: string) => {
    router.push(`/admin?tab=${tabId}`);
  };

  const tabs = [
    { id: "pages", label: "Pages & Menu", icon: List },
    { id: "seo", label: "SEO Manager", icon: FileText },
    { id: "media", label: "Media Manager", icon: Image },
    { id: "links", label: "Links Manager", icon: Link },
    { id: "career", label: "Career Timeline", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "blog-posts", label: "Blog Posts", icon: FileText },
    { id: "engagement", label: "Comments & Likes", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "pages":
        return <PagesMenuTabEnhanced />;
      case "seo":
        return <SeoTabEnhanced />;
      case "media":
        return <MediaTabEnhanced />;
      case "links":
        return <LinksManagerTabEnhanced />;
      case "career":
        return <CareerTimelineTabEnhanced />;
      case "messages":
        return <ComingSoon title="Messages" />;
      case "blog-posts":
        return <BlogPostsTabEnhanced />;
      case "engagement":
        return <ComingSoon title="Comments & Likes" />;
      case "settings":
        return <SettingsTabEnhanced />;
      default:
        return <PagesMenuTabEnhanced />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-panel border-border text-ink">
        {/* Sidebar */}
        <AdminSidebarContent
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSignOut={handleSignOut}
        />

        {/* Main Content */}
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-panel px-6 py-3">
            <div className="flex items-center gap-2">
              {/* Hamburger Menu Toggle */}
              <SidebarTrigger className="rounded-md p-2 hover:bg-accent/10 text-ink" />
              <h2 className="font-semibold text-ink text-lg">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-base">
            {renderTabContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
