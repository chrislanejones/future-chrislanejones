"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { TooltipProvider } from "@/components/ui/tooltip";
import Banner from "@/components/page/banner";
import BrowserCard from "@/components/page/browser-card";

// Strong typing for what BrowserCard receives per link
export type BrowserLinkItem = {
  href: string;
  label: string;
  domain: string;
  favicon?: string;
};

export default function BrowserTabs() {
  const allLinks = useQuery(api.browserLinks.getAll) ?? [];
  const categories = useQuery(api.browserLinks.getCategories) ?? [];

  const linkCategories = categories.map((cat) => ({
    title: cat.category,
    color: cat.color as
      | "blue"
      | "red"
      | "yellow"
      | "green"
      | "pink"
      | "purple"
      | "cyan"
      | "orange",
    links: allLinks
      .filter((link) => link.category === cat.category)
      .sort((a, b) => a.order - b.order)
      .map<BrowserLinkItem>((link) => ({
        href: link.href,
        label: link.label,
        domain: link.domain,
        favicon: link.favicon,
      })),
  }));

  if (!allLinks.length) {
    return (
      <main className="site-container py-12">
        <Banner
          title="Chrome Tabs I Left Open"
          breadcrumbPage="Links"
          description="A curated collection of useful resources, tools, and inspiration."
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#4ade80] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading links...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="site-container py-12">
      <Banner
        title="Chrome Tabs I Left Open"
        breadcrumbPage="Links"
        description="A curated collection of useful resources, tools, and inspiration that I keep coming back to."
      />

      {/* Provide TooltipProvider context for individual link tooltips */}
      <TooltipProvider delayDuration={100}>
        {/* Grid of BrowserCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {linkCategories.map((category, categoryIndex) => (
            <BrowserCard
              key={category.title}
              title={category.title}
              color={category.color}
              links={category.links}
              delay={0.05 + categoryIndex * 0.05}
            />
          ))}
        </div>
      </TooltipProvider>
    </main>
  );
}
