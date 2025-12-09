"use client";
import React, { useState, useMemo, useCallback, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pageHeaders } from "@/data/header-data";
import { GripVertical, Plus, Trash2, Edit2 } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  PAGE: "page",
  HEADER_ITEM: "headerItem",
  FOOTER_SECTION: "footerSection",
};

// Draggable Page Item Component
function DraggablePageItem({
  page,
  onDelete,
}: {
  page: any;
  onDelete: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.PAGE,
      item: { id: page.id, label: page.label, path: page.path },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [page]
  );

  drag(ref);

  return (
    <div
      ref={ref}
      className={`p-2 bg-[color:var(--color-muted-accent)] rounded-lg text-sm text-[color:var(--color-ink)] cursor-move group hover:opacity-80 transition-opacity ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="w-4 h-4 text-white flex-shrink-0" />
          <span>{page.label}</span>
        </div>

        {/* Delete Page Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(page.id);
          }}
          className="flex-shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
          title={`Remove "${page.label}" from navigation`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Droppable Target Component
function DroppableTarget({
  id,
  label,
  accept,
  children,
  onDrop,
}: {
  id: string;
  label: string;
  accept: string[];
  children: React.ReactNode;
  onDrop?: (item: any) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept,
      drop: (item: any) => {
        if (onDrop) {
          onDrop(item);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDrop]
  );

  drop(ref);

  return (
    <div
      ref={ref}
      className={`bg-[color:var(--color-panel)] border border-[color:var(--color-border)] rounded-2xl p-4 flex flex-col transition-colors ${
        isOver
          ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5"
          : ""
      }`}
    >
      <h3 className="font-semibold text-[color:var(--color-ink)] mb-4">
        {label}
      </h3>
      <div
        className={`flex-1 overflow-y-auto ${isOver ? "ring-2 ring-[color:var(--color-accent)] rounded-lg p-2" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

// Footer Section Component - handles hooks properly
function FooterSection({
  section,
  onDropPage,
  onDeleteSection,
  onDeleteLink,
}: {
  section: any;
  onDropPage: (item: any) => void;
  onDeleteSection: (id: Id<"footerNavSections">) => void;
  onDeleteLink: (id: Id<"footerNavLinks">) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.PAGE],
      drop: (item: any) => {
        onDropPage(item);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDropPage]
  );

  drop(ref);

  return (
    <div
      ref={ref}
      className={`p-3 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg group hover:border-red-500/30 transition-colors ${
        isOver ? "border-[color:var(--color-accent)]" : ""
      }`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="w-4 h-4 text-white flex-shrink-0" />
          <span className="font-medium text-[color:var(--color-ink)]">
            {section.title}
          </span>
        </div>

        {/* Delete Section Button */}
        <button
          onClick={async () => {
            if (
              confirm(
                `Delete "${section.title}"? This will delete all links in this section.`
              )
            ) {
              onDeleteSection(section._id);
            }
          }}
          className="flex-shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
          title={`Delete "${section.title}" section`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Links in Section */}
      {section.links && section.links.length > 0 && (
        <div className="ml-2 space-y-2 pt-2 border-t border-[color:var(--color-border)]">
          {section.links.map((link: any) => (
            <div
              key={link._id}
              className="p-2 bg-[color:var(--color-muted-accent)] rounded-lg text-sm text-[color:var(--color-ink)] group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="w-4 h-4 text-white flex-shrink-0" />
                  <span>{link.label}</span>
                </div>

                {/* Delete Link Button */}
                <button
                  onClick={async () => {
                    if (confirm(`Delete link "${link.label}"?`)) {
                      onDeleteLink(link._id);
                    }
                  }}
                  className="flex-shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
                  title={`Delete "${link.label}"`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PagesMenuTab() {
  const headerItems = useQuery(api.navigation.getHeaderNavItems) ?? [];
  const footerSections = useQuery(api.navigation.getFooterNavSections) ?? [];

  // Mutations
  const addHeaderItem = useMutation(api.navigation.addHeaderNavItem);
  const deleteHeaderItem = useMutation(api.navigation.deleteHeaderNavItem);
  const addFooterSection = useMutation(api.navigation.addFooterNavSection);
  const deleteFooterSection = useMutation(
    api.navigation.deleteFooterNavSection
  );
  const addFooterLink = useMutation(api.navigation.addFooterNavLink);
  const deleteFooterLink = useMutation(api.navigation.deleteFooterNavLink);

  // Memoize available pages - show only labels, not paths
  const allPagesFromApp = useMemo(() => {
    const uniquePaths = new Set<string>();
    const pages = [];

    for (const path in pageHeaders) {
      if (!uniquePaths.has(path)) {
        uniquePaths.add(path);
        const headerData = pageHeaders[path as keyof typeof pageHeaders];
        pages.push({
          id: path,
          path,
          label: headerData.title || path,
        });
      }
    }

    return pages.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // Handle dropping page to header
  const handleDropToHeader = useCallback(
    async (item: any) => {
      try {
        await addHeaderItem({
          label: item.label,
          href: item.path,
          order: headerItems.length,
        });
      } catch (error) {
        console.error("Failed to add header item:", error);
      }
    },
    [headerItems.length, addHeaderItem]
  );

  // Handle dropping page to footer section
  const handleDropToFooterSection = useCallback(
    async (item: any, sectionId: Id<"footerNavSections">) => {
      try {
        const section = footerSections.find((s) => s._id === sectionId);
        if (section) {
          await addFooterLink({
            sectionId,
            label: item.label,
            href: item.path,
            order: section.links?.length || 0,
          });
        }
      } catch (error) {
        console.error("Failed to add footer link:", error);
      }
    },
    [footerSections, addFooterLink]
  );

  // Handle delete page (remove from all navigation)
  const handleDeletePage = useCallback(
    async (pageId: string) => {
      const relatedHeaders = headerItems.filter((item) => item.href === pageId);
      for (const header of relatedHeaders) {
        try {
          await deleteHeaderItem({ id: header._id });
        } catch (error) {
          console.error("Failed to delete header item:", error);
        }
      }

      for (const section of footerSections) {
        const relatedLinks = section.links?.filter(
          (link) => link.href === pageId
        );
        if (relatedLinks) {
          for (const link of relatedLinks) {
            try {
              await deleteFooterLink({ id: link._id });
            } catch (error) {
              console.error("Failed to delete footer link:", error);
            }
          }
        }
      }
    },
    [headerItems, footerSections, deleteHeaderItem, deleteFooterLink]
  );

  // Handle add header item manually
  const handleAddHeaderManually = async () => {
    const label = prompt("Enter label for new header item:");
    if (label) {
      const href = prompt("Enter path (e.g., /about):");
      if (href) {
        try {
          await addHeaderItem({
            label,
            href,
            order: headerItems.length,
          });
        } catch (error) {
          console.error("Failed to add header item:", error);
        }
      }
    }
  };

  // Handle add footer section manually
  const handleAddFooterSection = async () => {
    const title = prompt("Enter footer section title:");
    if (title) {
      try {
        await addFooterSection({
          title,
          order: footerSections.length,
        });
      } catch (error) {
        console.error("Failed to add footer section:", error);
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-3 gap-6 h-full">
        {/* Column 1: Available Pages */}
        <DroppableTarget
          id="availablePagesTarget"
          label="Available Pages"
          accept={[ItemTypes.PAGE]}
        >
          <div className="space-y-2">
            {allPagesFromApp.map((page) => (
              <DraggablePageItem
                key={page.id}
                page={page}
                onDelete={handleDeletePage}
              />
            ))}
          </div>
        </DroppableTarget>

        {/* Column 2: Header Navigation */}
        <DroppableTarget
          id="headerNavTarget"
          label="Header Navigation"
          accept={[ItemTypes.PAGE]}
          onDrop={handleDropToHeader}
        >
          <div className="space-y-3">
            <Button
              onClick={handleAddHeaderManually}
              size="sm"
              variant="neutral"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Header Item
            </Button>

            {headerItems?.map((item) => (
              <div
                key={item._id}
                className="p-3 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg group hover:border-red-500/30 transition-colors"
              >
                {/* Main Header Item */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <GripVertical className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="font-medium text-[color:var(--color-ink)]">
                      {item.label}
                    </span>
                  </div>

                  {/* Delete Header Item Button */}
                  <button
                    onClick={async () => {
                      if (confirm(`Delete "${item.label}"?`)) {
                        try {
                          await deleteHeaderItem({ id: item._id });
                        } catch (error) {
                          console.error("Failed to delete:", error);
                        }
                      }
                    }}
                    className="flex-shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
                    title={`Delete "${item.label}"`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Child Items */}
                {item.children && item.children.length > 0 && (
                  <div className="ml-2 space-y-2 pt-2 border-t border-[color:var(--color-border)]">
                    {item.children.map((child) => (
                      <div
                        key={child._id}
                        className="p-2 bg-[color:var(--color-muted-accent)] rounded-lg text-sm text-[color:var(--color-ink)] group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <GripVertical className="w-4 h-4 text-white flex-shrink-0" />
                            <span>{child.label}</span>
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete "${child.label}"?`)) {
                                try {
                                  await deleteHeaderItem({
                                    id: child._id,
                                  });
                                } catch (error) {
                                  console.error("Failed to delete:", error);
                                }
                              }
                            }}
                            className="flex-shrink-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DroppableTarget>

        {/* Column 3: Footer Navigation */}
        <DroppableTarget
          id="footerNavTarget"
          label="Footer Navigation"
          accept={[ItemTypes.PAGE]}
        >
          <div className="space-y-3">
            <Button
              onClick={handleAddFooterSection}
              size="sm"
              variant="neutral"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Section
            </Button>

            {footerSections?.map((section) => (
              <FooterSection
                key={section._id}
                section={section}
                onDropPage={(item) =>
                  handleDropToFooterSection(item, section._id)
                }
                onDeleteSection={async (id) => {
                  try {
                    await deleteFooterSection({ id });
                  } catch (error) {
                    console.error("Failed to delete section:", error);
                  }
                }}
                onDeleteLink={async (id) => {
                  try {
                    await deleteFooterLink({ id });
                  } catch (error) {
                    console.error("Failed to delete link:", error);
                  }
                }}
              />
            ))}
          </div>
        </DroppableTarget>
      </div>
    </DndProvider>
  );
}

export default PagesMenuTab;
