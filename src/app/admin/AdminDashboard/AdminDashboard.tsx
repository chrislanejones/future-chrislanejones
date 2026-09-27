"use client";

import React, { useEffect, useState } from "react";
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
  Briefcase,
  Users,
  Globe,
  User,
  Database,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
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
import ProjectsTabEnhanced from "./ProjectsTabEnhanced";
import ClientsTabEnhanced from "./ClientsTabEnhanced";
import ConferencesTabEnhanced from "./ConferencesTabEnhanced";
import ProfileSocialTabEnhanced, {
  profileSocialSubsections,
} from "./ProfileSocialTabEnhanced";

type SubItem = { id: string; label: string; icon: LucideIcon };

const AdminSidebarContent = ({
  tabs,
  activeTab,
  onTabChange,
  onSignOut,
  subsectionsByTab,
  activeSubsection,
  onSubsectionChange,
}: {
  tabs: { id: string; label: string; icon: LucideIcon }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onSignOut: () => void;
  subsectionsByTab: Record<string, SubItem[]>;
  activeSubsection: string;
  onSubsectionChange: (id: string) => void;
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="admin-border-right admin-panel-glow bg-panel"
    >
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
            <React.Fragment key={tab.id}>
              <SidebarMenuItem>
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
              {activeTab === tab.id &&
                subsectionsByTab[tab.id] &&
                !isCollapsed && (
                  <SidebarMenuItem>
                    <ul className="ml-4 mt-1 border-l border-(--color-border) pl-2 space-y-1">
                      {subsectionsByTab[tab.id].map((sub) => {
                        const isActive = activeSubsection === sub.id;
                        return (
                          <li key={sub.id}>
                            <button
                              onClick={() => onSubsectionChange(sub.id)}
                              className={`w-full flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-md text-xs transition-colors ${
                                isActive
                                  ? "bg-accent/15 text-accent font-medium"
                                  : "text-muted hover:text-ink hover:bg-(--color-surface-hover)"
                              }`}
                            >
                              <sub.icon className="w-3.5 h-3.5 shrink-0" />
                              <span>{sub.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </SidebarMenuItem>
                )}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

const settingsSubsections: SubItem[] = [
  { id: "data-management", label: "Data Management", icon: Database },
  { id: "redirects", label: "Redirects", icon: ArrowRight },
  { id: "site-health", label: "Site Health", icon: Activity },
];

// Tabs that render several stacked sections get a sub-tree in the sidebar. The
// active id is mirrored into the URL hash, which each panel listens for.
const subsectionsByTab: Record<string, SubItem[]> = {
  "profile-social": profileSocialSubsections,
  settings: settingsSubsections,
};

const AdminDashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "pages";
  const [activeSubsection, setActiveSubsection] = useState("");

  // Keep the highlighted sub-item in step with the hash, which is also how the
  // panels themselves know which section to scroll to.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const valid = Object.values(subsectionsByTab).some((subs) =>
        subs.some((s) => s.id === hash),
      );
      if (hash && valid) setActiveSubsection(hash);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  // Switching tabs must not leave a sub-item from the previous tab highlighted.
  const currentSubsections = subsectionsByTab[activeTab];
  const resolvedSubsection =
    currentSubsections?.some((s) => s.id === activeSubsection)
      ? activeSubsection
      : (currentSubsections?.[0]?.id ?? "");

  const handleSubsectionChange = (id: string) => {
    setActiveSubsection(id);
    if (typeof window !== "undefined") {
      window.location.hash = id;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleTabChange = (tabId: string) => {
    router.push(`/admin?tab=${tabId}`);
  };

  const tabs = [
    { id: "pages", label: "Pages & Menu", icon: List },
    { id: "seo", label: "SEO & Title Manager", icon: FileText },
    { id: "media", label: "Media Manager", icon: Image },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "clients", label: "Clients", icon: Users },
    { id: "conferences", label: "Conferences", icon: Globe },
    { id: "career", label: "Career Timeline", icon: Calendar },
    { id: "links", label: "Links Manager", icon: Link },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "blog-posts", label: "Blog Posts", icon: FileText },
    { id: "engagement", label: "Comments & Likes", icon: Heart },
    { id: "profile-social", label: "Profile & Social", icon: User },
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
      case "projects":
        return <ProjectsTabEnhanced />;
      case "clients":
        return <ClientsTabEnhanced />;
      case "conferences":
        return <ConferencesTabEnhanced />;
      case "career":
        return <CareerTimelineTabEnhanced />;
      case "links":
        return <LinksManagerTabEnhanced />;
      case "messages":
        return <MessagesTabEnhanced />;
      case "blog-posts":
        return <BlogPostsTabEnhanced />;
      case "engagement":
        return <EngagementTabEnhanced />;
      case "profile-social":
        return <ProfileSocialTabEnhanced />;
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
          subsectionsByTab={subsectionsByTab}
          activeSubsection={resolvedSubsection}
          onSubsectionChange={handleSubsectionChange}
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
