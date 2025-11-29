"use client";
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pageHeaders } from "@/data/header-data";
import {
  GripVertical,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { DndProvider, useDrag, useDrop, ConnectDropTarget } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define drag item types
const ItemTypes = {
  HEADER_ITEM: "headerItem",
  FOOTER_SECTION: "footerSection",
  FOOTER_LINK: "footerLink",
  PAGE: "page",
} as const;

// Define types for drag and drop
interface DragItem {
  id: string;
  type: string;
  label?: string;
  _id?: Id<"headerNavItems"> | Id<"footerNavSections"> | Id<"footerNavLinks">;
  href?: string;
  isExternal?: boolean;
  originalIndex?: number;
  parentId?: Id<"headerNavItems">;
  sectionId?: Id<"footerNavSections">;
  path?: string;
}

interface DraggablePage {
  id: string;
  label: string;
  path: string;
  isExternal?: boolean;
  type: string;
}

interface DraggableHeaderNavItem {
  _id: Id<"headerNavItems">;
  id: string;
  label: string;
  href?: string;
  isExternal?: boolean;
  order: number;
  parentId?: Id<"headerNavItems">;
  children?: DraggableHeaderNavItem[];
}

interface DraggableFooterSection {
  _id: Id<"footerNavSections">;
  id: string;
  title: string;
  order: number;
  links?: DraggableFooterNavLink[];
}

interface DraggableFooterNavLink {
  _id: Id<"footerNavLinks">;
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  order: number;
  sectionId?: Id<"footerNavSections">;
}

// Context for sharing mutations
interface PagesMenuTabContextType {
  updateHeaderItem: any;
  deleteHeaderItem: any;
  addHeaderItem: any;
  updateFooterSection: any;
  deleteFooterSection: any;
  addFooterLink: any;
  updateFooterLink: any;
  deleteFooterLink: any;
}

const PagesMenuTabContext = createContext<PagesMenuTabContextType | null>(null);

function PagesMenuTabProvider({ children }: { children: React.ReactNode }) {
  const updateHeaderItem = useMutation(api.navigation.updateHeaderNavItem);
  const deleteHeaderItem = useMutation(api.navigation.deleteHeaderNavItem);
  const addHeaderItem = useMutation(api.navigation.addHeaderNavItem);
  const updateFooterSection = useMutation(
    api.navigation.updateFooterNavSection
  );
  const deleteFooterSection = useMutation(
    api.navigation.deleteFooterNavSection
  );
  const addFooterLink = useMutation(api.navigation.addFooterNavLink);
  const updateFooterLink = useMutation(api.navigation.updateFooterNavLink);
  const deleteFooterLink = useMutation(api.navigation.deleteFooterNavLink);

  return (
    <PagesMenuTabContext.Provider
      value={{
        updateHeaderItem,
        deleteHeaderItem,
        addHeaderItem,
        updateFooterSection,
        deleteFooterSection,
        addFooterLink,
        updateFooterLink,
        deleteFooterLink,
      }}
    >
      {children}
    </PagesMenuTabContext.Provider>
  );
}

function usePagesMenuTabContext() {
  const context = useContext(PagesMenuTabContext);
  if (!context) {
    throw new Error(
      "usePagesMenuTabContext must be used within PagesMenuTabProvider"
    );
  }
  return context;
}

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const [item] = newArray.splice(from, 1);
  newArray.splice(to, 0, item);
  return newArray;
}

function DraggablePageItem({ page }: { page: DraggablePage }) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PAGE,
    item: {
      id: page.id,
      type: ItemTypes.PAGE,
      label: page.label,
      path: page.path,
      isExternal: page.isExternal,
    } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 p-3 rounded-md mb-2 text-sm relative z-10 ${
        isDragging
          ? "opacity-50 border-dashed border-[color:var(--color-accent)]"
          : "border border-[color:var(--color-border)]"
      } bg-[color:var(--color-base)] cursor-grab`}
      style={{ boxShadow: isDragging ? "var(--shadow-glow)" : "none" }}
    >
      <GripVertical className="w-4 h-4 text-[color:var(--color-muted)]" />
      <span>{page.label}</span>
    </div>
  );
}

// Fixed DroppableTarget component with proper ref handling
function DroppableTarget({
  id,
  children,
  label,
  accept,
}: {
  id: string;
  children: React.ReactNode;
  label: string;
  accept: string[];
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept,
    drop: (item: DragItem) => {
      console.log("Dropped item:", item, "on target:", id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Create a proper ref callback function
  const setDropRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop(node);
    },
    [drop]
  );

  return (
    <div className="w-80 bg-[color:var(--color-panel)] border border-[color:var(--color-border)] rounded-2xl">
      <div className="p-4 border-b border-[color:var(--color-border)]">
        <h3 className="text-[color:var(--color-ink)] font-semibold">{label}</h3>
      </div>
      <div
        ref={setDropRef}
        className={`p-4 transition-colors min-h-[400px] ${
          isOver ? "bg-[color:var(--color-accent)]/10" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function PagesMenuTab() {
  const headerItems = useQuery(api.navigation.getHeaderNavItems) ?? [];
  const footerSections = useQuery(api.navigation.getFooterNavSections) ?? [];
  const addHeaderItem = useMutation(api.navigation.addHeaderNavItem);
  const addFooterSection = useMutation(api.navigation.addFooterNavSection);
  const reorderHeaderItems = useMutation(api.navigation.reorderHeaderNavItems);
  const reorderFooterSections = useMutation(
    api.navigation.reorderFooterNavSections
  );

  const allPagesFromApp: DraggablePage[] = useMemo(() => {
    const uniquePaths = new Set<string>();
    const pages: DraggablePage[] = [];

    for (const path in pageHeaders) {
      if (!uniquePaths.has(path)) {
        uniquePaths.add(path);
        const headerData = pageHeaders[path as keyof typeof pageHeaders];
        pages.push({
          id: path,
          path: path,
          label: headerData.title || path,
          isExternal: false,
          type: "page",
        });
      }
    }

    return pages.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const moveHeaderItem = useCallback(
    (
      dragId: string,
      hoverId: string,
      dragParentId?: Id<"headerNavItems">,
      hoverParentId?: Id<"headerNavItems">
    ) => {
      const updates: Array<{
        id: Id<"headerNavItems">;
        order: number;
        parentId?: Id<"headerNavItems">;
      }> = [];

      headerItems.forEach((item, index) => {
        updates.push({
          id: item._id,
          order: index,
          parentId: item.parentId,
        });

        item.children?.forEach((child, childIndex) => {
          updates.push({
            id: child._id,
            order: childIndex,
            parentId: item._id,
          });
        });
      });

      reorderHeaderItems({ updates });
    },
    [headerItems, reorderHeaderItems]
  );

  const moveFooterSection = useCallback(
    (dragId: string, hoverId: string) => {
      const dragIndex = footerSections.findIndex((s) => s._id === dragId);
      const hoverIndex = footerSections.findIndex((s) => s._id === hoverId);

      if (dragIndex === -1 || hoverIndex === -1) return;

      const updatedSections = arrayMove(footerSections, dragIndex, hoverIndex);
      const updates = updatedSections.map((section, index) => ({
        id: section._id,
        order: index,
      }));

      reorderFooterSections({ updates });
    },
    [footerSections, reorderFooterSections]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Header Navigation */}
      <DroppableTarget
        id="headerNavTarget"
        label="Header Navigation"
        accept={[ItemTypes.PAGE, ItemTypes.HEADER_ITEM]}
      >
        <Button
          onClick={async () => {
            const label = prompt(
              "Enter label for new main navigation item (e.g., 'About'):"
            );
            if (label) {
              const newOrder = headerItems.filter((i) => !i.parentId).length;
              await addHeaderItem({
                label,
                href: undefined,
                isExternal: false,
                parentId: undefined,
                order: newOrder,
              });
            }
          }}
          size="sm"
          variant="neutral"
          className="w-full mb-3"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Main Item (Dropdown Holder)
        </Button>
        {headerItems
          .filter((item) => item.parentId === undefined)
          .map((item) => (
            <div key={item._id} className="mb-2">
              {/* This would be your SortableHeaderNavItem component */}
              <div className="p-3 border rounded">{item.label}</div>
            </div>
          ))}
      </DroppableTarget>

      {/* Available Pages */}
      <DroppableTarget id="availablePages" label="Available Pages" accept={[]}>
        <div className="space-y-2">
          {allPagesFromApp.map((page) => (
            <DraggablePageItem key={page.id} page={page} />
          ))}
        </div>
      </DroppableTarget>

      {/* Footer Navigation */}
      <DroppableTarget
        id="footerNavTarget"
        label="Footer Navigation"
        accept={[ItemTypes.PAGE, ItemTypes.FOOTER_SECTION]}
      >
        <Button
          onClick={async () => {
            const title = prompt("Enter title for new footer section:");
            if (title) {
              const newOrder = footerSections.length;
              await addFooterSection({
                title,
                order: newOrder,
              });
            }
          }}
          size="sm"
          variant="neutral"
          className="w-full mb-3"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Section
        </Button>
        {footerSections.map((section) => (
          <div key={section._id} className="mb-2">
            {/* This would be your SortableFooterSection component */}
            <div className="p-3 border rounded">{section.title}</div>
          </div>
        ))}
      </DroppableTarget>
    </div>
  );
}

const WrappedPagesMenuTab = () => (
  <DndProvider backend={HTML5Backend}>
    <PagesMenuTabProvider>
      <PagesMenuTab />
    </PagesMenuTabProvider>
  </DndProvider>
);

export default WrappedPagesMenuTab;
