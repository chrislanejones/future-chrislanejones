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
import MessagesTabEnhanced from "./MessagesTabEnhanced";
import EngagementTabEnhanced from "./EngagementTabEnhanced";

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
    <Sidebar collapsible="icon" className="admin-border-right admin-panel-glow bg-panel">
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
                variant={activeTab === tab.id ? "accent" : "outline"}
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
          <SidebarMenuItem>
            <div className={`flex ${isCollapsed ? "justify-center" : "px-2"}`}>
              1
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
        return <MessagesTabEnhanced />;
      case "blog-posts":
        return <BlogPostsTabEnhanced />;
      case "engagement":
        return <EngagementTabEnhanced />;
      case "settings":
        return <SettingsTabEnhanced />;
      default:
        return <PagesMenuTabEnhanced />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-panel border-border text-ink">
        <AdminSidebarContent
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSignOut={handleSignOut}
        />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-10 flex items-center justify-between admin-border-bottom bg-panel px-6 py-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-ink">
                {tabs.find((t) => t.id === activeTab)?.label || "Admin"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-muted">
                  {user.emailAddresses[0]?.emailAddress}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
              <SimpleModeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{renderTabContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
