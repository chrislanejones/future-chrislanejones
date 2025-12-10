"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SEOPage {
  _id: Id<"seoMetadata">;
  path: string;
  title: string;
  description: string;
}

interface HeaderNavItem {
  _id: Id<"headerNavItems">;
  label: string;
  href?: string;
  isExternal?: boolean;
  order: number;
  parentId?: Id<"headerNavItems">;
  children?: HeaderNavItem[];
}

interface FooterNavLink {
  _id: Id<"footerNavLinks">;
  sectionId: Id<"footerNavSections">;
  label: string;
  href: string;
  isExternal?: boolean;
  order: number;
}

interface FooterNavSection {
  _id: Id<"footerNavSections">;
  title: string;
  order: number;
  links: FooterNavLink[];
}

const getPageName = (path: string): string => {
  if (path === "/") return "Home";
  const name = path
    .replace(/^\//, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return name;
};

const DraggablePageItem = ({ page }: { page: SEOPage }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "page",
        title: page.title,
        path: page.path,
      })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-2 bg-(--color-muted-accent) rounded-lg text-sm text-(--color-ink) cursor-move group hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical
            className="w-4 h-4 text-muted shrink-0"
            aria-hidden="true"
          />
          <span>{getPageName(page.path)}</span>
        </div>
      </div>
    </div>
  );
};

const HeaderNavItemComponent = ({
  item,
  onDelete,
  onDeleteChild,
  onDrop,
}: {
  item: HeaderNavItem;
  onDelete: () => void;
  onDeleteChild: (childId: Id<"headerNavItems">) => void;
  onDrop: (e: React.DragEvent) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop(e);
  };

  return (
    <div
      className={`p-3 bg-(--color-base) border rounded-lg group hover:border-accent/30 transition-colors ${
        isDragOver ? "border-accent bg-accent/5" : "border-(--color-border)"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical
            className="w-4 h-4 text-muted shrink-0 cursor-move"
            aria-hidden="true"
          />
          <span className="font-medium text-(--color-ink)">{item.label}</span>
        </div>
        <button
          onClick={onDelete}
          className="shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
          title={`Delete "${item.label}"`}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      {item.children && item.children.length > 0 && (
        <div className="ml-2 space-y-2 pt-2 border-t border-(--color-border)">
          {item.children.map((child) => (
            <div
              key={child._id}
              className="p-2 bg-(--color-muted-accent) rounded-lg text-sm text-(--color-ink) group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical
                    className="w-4 h-4 text-muted shrink-0"
                    aria-hidden="true"
                  />
                  <span>{child.label}</span>
                </div>
                <button
                  onClick={() => onDeleteChild(child._id)}
                  className="shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
                  title={`Delete "${child.label}"`}
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FooterSectionComponent = ({
  section,
  onDelete,
  onDeleteLink,
  onDrop,
}: {
  section: FooterNavSection;
  onDelete: () => void;
  onDeleteLink: (linkId: Id<"footerNavLinks">) => void;
  onDrop: (e: React.DragEvent) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop(e);
  };

  return (
    <div
      className={`p-3 bg-(--color-base) border rounded-lg group hover:border-accent/30 transition-colors ${
        isDragOver ? "border-accent bg-accent/5" : "border-(--color-border)"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical
            className="w-4 h-4 text-muted shrink-0 cursor-move"
            aria-hidden="true"
          />
          <span className="font-medium text-(--color-ink)">
            {section.title}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
          title={`Delete "${section.title}"`}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      {section.links && section.links.length > 0 && (
        <div className="ml-2 space-y-2 pt-2 border-t border-(--color-border)">
          {section.links.map((link) => (
            <div
              key={link._id}
              className="p-2 bg-(--color-muted-accent) rounded-lg text-sm text-(--color-ink) group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical
                    className="w-4 h-4 text-muted shrink-0"
                    aria-hidden="true"
                  />
                  <span>{link.label}</span>
                </div>
                <button
                  onClick={() => onDeleteLink(link._id)}
                  className="shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
                  title={`Delete "${link.label}"`}
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PagesMenuTabEnhanced = () => {
  const seoPages = useQuery(api.seo.getAllSEO) as SEOPage[] | undefined;
  const headerItems = useQuery(api.navigation.getHeaderNavItems) as
    | HeaderNavItem[]
    | undefined;
  const footerSections = useQuery(api.navigation.getFooterNavSections) as
    | FooterNavSection[]
    | undefined;

  const addHeaderNavItem = useMutation(api.navigation.addHeaderNavItem);
  const deleteHeaderNavItem = useMutation(api.navigation.deleteHeaderNavItem);
  const addFooterNavSection = useMutation(api.navigation.addFooterNavSection);
  const deleteFooterNavSection = useMutation(
    api.navigation.deleteFooterNavSection
  );
  const addFooterNavLink = useMutation(api.navigation.addFooterNavLink);
  const deleteFooterNavLink = useMutation(api.navigation.deleteFooterNavLink);

  const getNextHeaderOrder = () => {
    if (!headerItems || headerItems.length === 0) return 0;
    return Math.max(...headerItems.map((item) => item.order)) + 1;
  };

  const getNextFooterSectionOrder = () => {
    if (!footerSections || footerSections.length === 0) return 0;
    return Math.max(...footerSections.map((section) => section.order)) + 1;
  };

  const getNextFooterLinkOrder = (sectionId: Id<"footerNavSections">) => {
    const section = footerSections?.find((s) => s._id === sectionId);
    if (!section || section.links.length === 0) return 0;
    return Math.max(...section.links.map((link) => link.order)) + 1;
  };

  const handleAddHeaderItem = async () => {
    try {
      await addHeaderNavItem({
        label: "New Item",
        href: "/",
        order: getNextHeaderOrder(),
      });
    } catch (err) {
      console.error("Failed to add header item:", err);
    }
  };

  const handleAddFooterSection = async () => {
    try {
      await addFooterNavSection({
        title: "New Section",
        order: getNextFooterSectionOrder(),
      });
    } catch (err) {
      console.error("Failed to add footer section:", err);
    }
  };

  const handleDeleteHeaderItem = async (id: Id<"headerNavItems">) => {
    try {
      await deleteHeaderNavItem({ id });
    } catch (err) {
      console.error("Failed to delete header item:", err);
    }
  };

  const handleDeleteFooterSection = async (id: Id<"footerNavSections">) => {
    try {
      await deleteFooterNavSection({ id });
    } catch (err) {
      console.error("Failed to delete footer section:", err);
    }
  };

  const handleDeleteFooterLink = async (id: Id<"footerNavLinks">) => {
    try {
      await deleteFooterNavLink({ id });
    } catch (err) {
      console.error("Failed to delete footer link:", err);
    }
  };

  const handleDropOnHeaderItem = async (
    parentId: Id<"headerNavItems">,
    e: React.DragEvent
  ) => {
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "page") {
        const parent = headerItems?.find((item) => item._id === parentId);
        const childOrder = parent?.children?.length ?? 0;
        await addHeaderNavItem({
          label: data.title,
          href: data.path,
          parentId: parentId,
          order: childOrder,
        });
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleDropOnFooterSection = async (
    sectionId: Id<"footerNavSections">,
    e: React.DragEvent
  ) => {
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "page") {
        await addFooterNavLink({
          sectionId: sectionId,
          label: data.title,
          href: data.path,
          order: getNextFooterLinkOrder(sectionId),
        });
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleDropOnHeaderColumn = async (e: React.DragEvent) => {
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "page") {
        await addHeaderNavItem({
          label: data.title,
          href: data.path,
          order: getNextHeaderOrder(),
        });
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  if (
    seoPages === undefined ||
    headerItems === undefined ||
    footerSections === undefined
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  // Sort pages with homepage first
  const sortedPages = [...seoPages].sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    return a.path.localeCompare(b.path);
  });

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Available Pages Column */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
        <h3 className="font-semibold text-(--color-ink) mb-4">
          Available Pages
        </h3>
        <p className="text-xs text-muted mb-4">
          Drag pages to header or footer sections
        </p>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {sortedPages.map((page) => (
              <DraggablePageItem key={page._id} page={page} />
            ))}
          </div>
        </div>
      </div>
      {/* Header Navigation Column */}
      <div
        className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col transition-colors"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-accent");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("border-accent");
        }}
        onDrop={(e) => {
          e.currentTarget.classList.remove("border-accent");
          const target = e.target as HTMLElement;
          if (!target.closest(".group")) {
            handleDropOnHeaderColumn(e);
          }
        }}
      >
        <h3 className="font-semibold text-(--color-ink) mb-4">
          Header Navigation
        </h3>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {/* Add Header Item Button - Homepage style */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleAddHeaderItem}
            >
              <Plus className="w-4 h-4" />
              Add Header Item
            </Button>

            {headerItems.map((item) => (
              <HeaderNavItemComponent
                key={item._id}
                item={item}
                onDelete={() => handleDeleteHeaderItem(item._id)}
                onDeleteChild={(childId) => handleDeleteHeaderItem(childId)}
                onDrop={(e) => handleDropOnHeaderItem(item._id, e)}
              />
            ))}
            {headerItems.length === 0 && (
              <p className="text-sm text-muted text-center py-4">
                Drag pages here to add to header navigation
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Sections Column */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
        <h3 className="font-semibold text-(--color-ink) mb-4">
          Footer Sections
        </h3>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {/* Add Section Button - Homepage style */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleAddFooterSection}
            >
              <Plus className="w-4 h-4" />
              Add Section
            </Button>

            {footerSections.map((section) => (
              <FooterSectionComponent
                key={section._id}
                section={section}
                onDelete={() => handleDeleteFooterSection(section._id)}
                onDeleteLink={handleDeleteFooterLink}
                onDrop={(e) => handleDropOnFooterSection(section._id, e)}
              />
            ))}
            {footerSections.length === 0 && (
              <p className="text-sm text-muted text-center py-4">
                Add sections to organize footer links
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagesMenuTabEnhanced;
