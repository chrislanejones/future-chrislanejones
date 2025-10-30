"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Banner from "@/components/page/banner";
import BrowserCard from "@/components/page/browser-card";

export default function BrowserTabs() {
  // Fetch all links and categories from Convex
  const allLinks = useQuery(api.browserLinks.getAll) ?? [];
  const categories = useQuery(api.browserLinks.getCategories) ?? [];

  // Group links by category
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
      .map((link) => ({
        href: link.href,
        label: link.label,
        domain: link.domain,
        favicon: link.favicon,
      })),
  }));

  // Show loading state
  if (!allLinks.length) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Banner
          title="Chrome Tabs I Left Open"
          breadcrumbPage="Links"
          description="A curated collection of useful resources, tools, and inspiration."
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#4ade80] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#9ca3af]">Loading links...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Banner
        title="Chrome Tabs I Left Open"
        breadcrumbPage="Links"
        description="A curated collection of useful resources, tools, and inspiration that I keep coming back to."
      />

      {/* Link Categories Grid - Responsive 1/2/3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </main>
  );
}
