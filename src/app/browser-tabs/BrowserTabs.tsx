"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api"; // ✅ ensure correct path
import {
  TooltipProvider, // ✅ provider only (tooltip UI will live inside BrowserCard)
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Banner from "@/components/page/banner";
import BrowserCard from "@/components/page/browser-card";

function ThumbSkeleton() {
  return <div className="h-32 w-56 rounded-md bg-muted/40 animate-pulse" />;
}

// Strong typing for what BrowserCard receives per link (now includes screenshotUrl)
export type BrowserLinkItem = {
  href: string;
  label: string;
  domain: string;
  favicon?: string;
  screenshotUrl?: string; // 👈 used to show hover image tooltip
};

export default function BrowserTabs() {
  const allLinks = useQuery(api.browserLinks.getAll) ?? [];
  const categories = useQuery(api.browserLinks.getCategories) ?? [];

  // Helper to bridge old/new field names while you migrate schema/types
  const getScreenshotUrl = (link: any) =>
    link?.screenshotUrl ?? link?.UPLOADTHINGUrl ?? undefined;

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
        // ✅ pass screenshot URL forward so tooltip can show a photo
        screenshotUrl: getScreenshotUrl(link),
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

      {/* Keep your original layout — just provide TooltipProvider context */}
      <TooltipProvider delayDuration={100}>
        {/* Grid of BrowserCards (no top row of badges) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {linkCategories.map((category, categoryIndex) => {
            // pick the first available screenshot in this category (if any)
            const firstScreenshot = category.links.find(
              (l) => !!l.screenshotUrl
            )?.screenshotUrl;

            return (
              <Tooltip key={category.title}>
                <TooltipTrigger asChild>
                  <div>
                    <BrowserCard
                      title={category.title}
                      color={category.color}
                      links={category.links} // <-- unchanged, includes screenshotUrl
                      delay={0.05 + categoryIndex * 0.05}
                    />
                  </div>
                </TooltipTrigger>

                {/* Tooltip content – small preview; no page style changes */}
                <TooltipContent side="top" className="p-2">
                  {firstScreenshot ? (
                    <Image
                      src={firstScreenshot}
                      alt={`${category.title} preview`}
                      width={560}
                      height={320}
                      className="h-40 w-[22rem] rounded-md object-cover"
                      unoptimized // avoid next/image host configuration
                    />
                  ) : (
                    <div className="flex w-[22rem] items-center justify-center rounded-md bg-muted/40 p-3 text-sm">
                      <ThumbSkeleton />
                      <span className="ml-2">No previews yet</span>
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </main>
  );
}
