"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { GripVertical, Trash2, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Types ─────────────────────────────────────────────────────────────── */

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

interface ExternalLinkItem {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
}

/* Drag payload shapes */
type DragPayload =
  | { type: "page"; title: string; path: string }
  | { type: "external"; label: string; href: string; isExternal: boolean };

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const getPageName = (path: string): string => {
  if (path === "/") return "Home";
  return path
    .replace(/^\//, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/* ─── DraggablePageItem ──────────────────────────────────────────────────── */

const DraggablePageItem = ({ page }: { page: SEOPage }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ type: "page", title: getPageName(page.path), path: page.path })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-2 bg-(--color-muted-accent) rounded-lg text-sm text-(--color-ink) cursor-move hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
        <span>{getPageName(page.path)}</span>
      </div>
    </div>
  );
};

/* ─── DraggableExternalLinkItem ──────────────────────────────────────────── */

const DraggableExternalLinkItem = ({
  link,
  onDelete,
}: {
  link: ExternalLinkItem;
  onDelete: () => void;
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "external",
        label: link.label,
        href: link.href,
        isExternal: link.isExternal,
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
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">{link.label}</span>
        {link.isExternal && (
          <ExternalLink className="w-3 h-3 text-muted shrink-0" aria-hidden="true" />
        )}
        <button
          onClick={onDelete}
          className="shrink-0 p-0.5 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
          title={`Delete "${link.label}"`}
        >
          <Trash2 className="w-3 h-3" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

/* ─── ExternalLinksPanel ─────────────────────────────────────────────────── */

const ExternalLinksPanel = ({
  links,
  onAdd,
  onDelete,
}: {
  links: ExternalLinkItem[];
  onAdd: (label: string, href: string, isExternal: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [isExternal, setIsExternal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !href.trim()) return;
    onAdd(label.trim(), href.trim(), isExternal);
    setLabel("");
    setHref("");
    setIsExternal(false);
    setShowForm(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-(--color-border)">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-(--color-ink)">External Links</h4>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-xs text-accent hover:underline"
          >
            <Plus className="w-3 h-3" />
            Add Link
          </button>
        )}
      </div>

      <p className="text-xs text-muted mb-3">
        Create links here, then drag to header or footer sections.
      </p>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-3 space-y-2">
          <input
            type="text"
            placeholder="Label (e.g. Old Website)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-(--color-border) rounded-lg bg-(--color-panel) text-(--color-ink) focus:outline-none focus:ring-1 focus:ring-accent"
            autoFocus
            required
          />
          <input
            type="text"
            placeholder="URL (e.g. https://old.example.com)"
            value={href}
            onChange={(e) => {
              setHref(e.target.value);
              if (e.target.value.startsWith("http")) setIsExternal(true);
            }}
            className="w-full px-2 py-1.5 text-sm border border-(--color-border) rounded-lg bg-(--color-panel) text-(--color-ink) focus:outline-none focus:ring-1 focus:ring-accent"
            required
          />
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={isExternal}
              onChange={(e) => setIsExternal(e.target.checked)}
              className="rounded"
            />
            Open in new tab
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-2 py-1 text-xs bg-accent text-white rounded hover:opacity-90 transition-opacity"
            >
              Create Link
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setLabel("");
                setHref("");
                setIsExternal(false);
              }}
              className="flex-1 px-2 py-1 text-xs border border-(--color-border) rounded hover:bg-(--color-muted-accent) transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Link list */}
      <div className="space-y-2">
        {links.length === 0 && !showForm && (
          <p className="text-xs text-muted text-center py-2">
            No external links yet.
          </p>
        )}
        {links.map((link) => (
          <DraggableExternalLinkItem
            key={link.id}
            link={link}
            onDelete={() => onDelete(link.id)}
          />
        ))}
      </div>
    </div>
  );
};

/* ─── HeaderNavItemComponent ─────────────────────────────────────────────── */

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

  return (
    <div
      className={`p-3 bg-(--color-base) border rounded-lg group hover:border-accent/30 transition-colors ${
        isDragOver ? "border-accent bg-accent/5" : "border-(--color-border)"
      }`}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); onDrop(e); }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="w-4 h-4 text-muted shrink-0 cursor-move" aria-hidden="true" />
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
              className="p-2 bg-(--color-muted-accent) rounded-lg text-sm text-(--color-ink) group/child"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
                  <span>{child.label}</span>
                </div>
                <button
                  onClick={() => onDeleteChild(child._id)}
                  className="shrink-0 p-1 text-red-500 opacity-0 group-hover/child:opacity-100 hover:bg-red-500/10 rounded transition-all"
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

/* ─── FooterSectionComponent ─────────────────────────────────────────────── */

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

  return (
    <div
      className={`p-3 bg-(--color-base) border rounded-lg group hover:border-accent/30 transition-colors ${
        isDragOver ? "border-accent bg-accent/5" : "border-(--color-border)"
      }`}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); onDrop(e); }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="w-4 h-4 text-muted shrink-0 cursor-move" aria-hidden="true" />
          <span className="font-medium text-(--color-ink)">{section.title}</span>
        </div>
        <button
          onClick={onDelete}
          className="shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
          title={`Delete "${section.title}"`}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {section.links && section.links.length > 0 ? (
        <div className="ml-2 space-y-2 pt-2 border-t border-(--color-border)">
          {section.links.map((link) => (
            <div
              key={link._id}
              className="p-2 bg-(--color-muted-accent) rounded-lg text-sm text-(--color-ink) group/link"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GripVertical className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
                  <span className="truncate">{link.label}</span>
                  {link.isExternal && (
                    <span className="text-xs text-muted shrink-0">(ext)</span>
                  )}
                </div>
                <button
                  onClick={() => onDeleteLink(link._id)}
                  className="shrink-0 p-1 text-red-500 opacity-0 group-hover/link:opacity-100 hover:bg-red-500/10 rounded transition-all"
                  title={`Delete "${link.label}"`}
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted mt-2 text-center py-1">
          Drag links here
        </p>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */

const PagesMenuTabEnhanced = () => {
  const seoPages = useQuery(api.seo.getAllSEO) as SEOPage[] | undefined;
  const headerItems = useQuery(api.navigation.getHeaderNavItems) as HeaderNavItem[] | undefined;
  const footerSections = useQuery(api.navigation.getFooterNavSections) as FooterNavSection[] | undefined;

  const addHeaderNavItem = useMutation(api.navigation.addHeaderNavItem);
  const deleteHeaderNavItem = useMutation(api.navigation.deleteHeaderNavItem);
  const addFooterNavSection = useMutation(api.navigation.addFooterNavSection);
  const deleteFooterNavSection = useMutation(api.navigation.deleteFooterNavSection);
  const addFooterNavLink = useMutation(api.navigation.addFooterNavLink);
  const deleteFooterNavLink = useMutation(api.navigation.deleteFooterNavLink);

  // External links palette (session-scoped; drag to nav to persist)
  const [externalLinks, setExternalLinks] = useState<ExternalLinkItem[]>([]);

  /* ── Order helpers ── */

  const getNextHeaderOrder = () => {
    if (!headerItems || headerItems.length === 0) return 0;
    return Math.max(...headerItems.map((i) => i.order)) + 1;
  };

  const getNextFooterSectionOrder = () => {
    if (!footerSections || footerSections.length === 0) return 0;
    return Math.max(...footerSections.map((s) => s.order)) + 1;
  };

  const getNextFooterLinkOrder = (sectionId: Id<"footerNavSections">) => {
    const section = footerSections?.find((s) => s._id === sectionId);
    if (!section || section.links.length === 0) return 0;
    return Math.max(...section.links.map((l) => l.order)) + 1;
  };

  /* ── External link palette handlers ── */

  const handleAddExternalLink = (label: string, href: string, isExternal: boolean) => {
    setExternalLinks((prev) => [
      ...prev,
      { id: `ext-${Date.now()}`, label, href, isExternal },
    ]);
  };

  const handleDeleteExternalLink = (id: string) => {
    setExternalLinks((prev) => prev.filter((l) => l.id !== id));
  };

  /* ── Parse drag payload ── */

  const parseDragPayload = (e: React.DragEvent): DragPayload | null => {
    try {
      return JSON.parse(e.dataTransfer.getData("application/json")) as DragPayload;
    } catch {
      return null;
    }
  };

  /* ── Navigation mutation helpers ── */

  const handleAddHeaderItem = async () => {
    try {
      await addHeaderNavItem({ label: "New Item", href: "/", order: getNextHeaderOrder() });
    } catch (err) {
      console.error("Failed to add header item:", err);
    }
  };

  const handleAddFooterSection = async () => {
    try {
      await addFooterNavSection({ title: "New Section", order: getNextFooterSectionOrder() });
    } catch (err) {
      console.error("Failed to add footer section:", err);
    }
  };

  const handleDeleteHeaderItem = async (id: Id<"headerNavItems">) => {
    try { await deleteHeaderNavItem({ id }); } catch (err) { console.error(err); }
  };

  const handleDeleteFooterSection = async (id: Id<"footerNavSections">) => {
    try { await deleteFooterNavSection({ id }); } catch (err) { console.error(err); }
  };

  const handleDeleteFooterLink = async (id: Id<"footerNavLinks">) => {
    try { await deleteFooterNavLink({ id }); } catch (err) { console.error(err); }
  };

  const handleAddFooterLink = async (
    sectionId: Id<"footerNavSections">,
    label: string,
    href: string,
    isExternal: boolean
  ) => {
    try {
      await addFooterNavLink({
        sectionId,
        label,
        href,
        isExternal: isExternal || undefined,
        order: getNextFooterLinkOrder(sectionId),
      });
    } catch (err) {
      console.error("Failed to add footer link:", err);
    }
  };

  /* ── Drop handlers ── */

  const handleDropOnHeaderItem = async (parentId: Id<"headerNavItems">, e: React.DragEvent) => {
    const data = parseDragPayload(e);
    if (!data) return;
    const parent = headerItems?.find((item) => item._id === parentId);
    const childOrder = parent?.children?.length ?? 0;
    try {
      if (data.type === "page") {
        await addHeaderNavItem({ label: data.title, href: data.path, parentId, order: childOrder });
      } else if (data.type === "external") {
        await addHeaderNavItem({ label: data.label, href: data.href, isExternal: data.isExternal || undefined, parentId, order: childOrder });
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleDropOnHeaderColumn = async (e: React.DragEvent) => {
    const data = parseDragPayload(e);
    if (!data) return;
    try {
      if (data.type === "page") {
        await addHeaderNavItem({ label: data.title, href: data.path, order: getNextHeaderOrder() });
      } else if (data.type === "external") {
        await addHeaderNavItem({ label: data.label, href: data.href, isExternal: data.isExternal || undefined, order: getNextHeaderOrder() });
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleDropOnFooterSection = async (sectionId: Id<"footerNavSections">, e: React.DragEvent) => {
    const data = parseDragPayload(e);
    if (!data) return;
    try {
      if (data.type === "page") {
        await addFooterNavLink({ sectionId, label: data.title, href: data.path, order: getNextFooterLinkOrder(sectionId) });
      } else if (data.type === "external") {
        await handleAddFooterLink(sectionId, data.label, data.href, data.isExternal);
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  /* ── Loading state ── */

  if (seoPages === undefined || headerItems === undefined || footerSections === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  const sortedPages = [...seoPages].sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    return a.path.localeCompare(b.path);
  });

  /* ── Render ── */

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* ── Left column: Pages + External Links ── */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col overflow-y-auto">
        <h3 className="font-semibold text-(--color-ink) mb-1">Available Pages</h3>
        <p className="text-xs text-muted mb-4">Drag pages to header or footer sections</p>
        <div className="space-y-2">
          {sortedPages.map((page) => (
            <DraggablePageItem key={page._id} page={page} />
          ))}
        </div>

        <ExternalLinksPanel
          links={externalLinks}
          onAdd={handleAddExternalLink}
          onDelete={handleDeleteExternalLink}
        />
      </div>

      {/* ── Header Navigation column ── */}
      <div
        className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col transition-colors"
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-accent"); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove("border-accent"); }}
        onDrop={(e) => {
          e.currentTarget.classList.remove("border-accent");
          const target = e.target as HTMLElement;
          if (!target.closest(".group")) handleDropOnHeaderColumn(e);
        }}
      >
        <h3 className="font-semibold text-(--color-ink) mb-4">Header Navigation</h3>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            <Button variant="outline" className="w-full gap-2" onClick={handleAddHeaderItem}>
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

      {/* ── Footer Sections column ── */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
        <h3 className="font-semibold text-(--color-ink) mb-4">Footer Sections</h3>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            <Button variant="outline" className="w-full gap-2" onClick={handleAddFooterSection}>
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
