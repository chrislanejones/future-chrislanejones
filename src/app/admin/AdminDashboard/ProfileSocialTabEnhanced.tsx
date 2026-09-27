"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDownUp,
  Edit2,
  ExternalLink,
  GripVertical,
  Link2,
  Plus,
  RefreshCw,
  Save,
  Share2,
  Trash2,
  Trash,
  User,
  type LucideIcon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SOCIAL_ICONS, SocialIcon } from "@/lib/social-icons";
import { MediaDrawer } from "../components/MediaDrawer";
import { ToastContainer } from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";

type SocialLink = Doc<"socialLinks">;
type LinkKind = SocialLink["kind"];

// The three places a link can appear. Each carries its own slot number on the
// row; undefined means the link is not on that surface.
type Surface = "header" | "footer" | "linkPage";

const SURFACE_FIELD = {
  header: "headerOrder",
  footer: "footerOrder",
  linkPage: "linkPageOrder",
} as const satisfies Record<Surface, keyof SocialLink>;

const SURFACE_LABEL: Record<Surface, string> = {
  header: "Site header",
  footer: "Site footer",
  linkPage: "Link page",
};

// Short badge prefix shown against each row in the list.
const SURFACE_BADGE: Record<Surface, string> = {
  header: "H",
  footer: "F",
  linkPage: "L",
};

export const profileSocialSubsections: {
  id: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "social-links", label: "Social Links", icon: Share2 },
  { id: "extra-links", label: "Other Links", icon: Link2 },
];

/* ── Section chrome, matching the other admin panels ──────────────────────── */

const SectionCard = ({
  icon: Icon,
  title,
  description,
  children,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-6">
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
      {action}
    </div>
    {children}
  </div>
);

/* ── Surface slot preview ─────────────────────────────────────────────────────
   Answers "which order is the header / footer pulling from" at a glance: the
   icons in the exact order the site renders them, each with its slot number. */

const SurfacePreview = ({
  surface,
  links,
  onRenumber,
}: {
  surface: Surface;
  links: SocialLink[];
  onRenumber: () => void;
}) => {
  const field = SURFACE_FIELD[surface];
  const slotOf = (link: SocialLink) => link[field] as number | undefined;
  const title = `${SURFACE_LABEL[surface]} pulls this order`;

  const onSurface = links
    .filter((l) => typeof slotOf(l) === "number")
    .sort((a, b) => (slotOf(a) ?? 0) - (slotOf(b) ?? 0));

  const slots = onSurface.map((l) => slotOf(l));
  const needsRenumber = slots.some((slot, i) => slot !== i);

  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-base) p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-ink">{title}</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">
            {onSurface.length} link{onSurface.length === 1 ? "" : "s"}
          </span>
          {needsRenumber && (
            <Button
              onClick={onRenumber}
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
              title="Close gaps and duplicate slot numbers"
            >
              <ArrowDownUp className="w-3 h-3" />
              Renumber
            </Button>
          )}
        </div>
      </div>
      {onSurface.length === 0 ? (
        <p className="text-xs text-muted py-2">
          No links assigned to this surface yet.
        </p>
      ) : (
        <ol className="flex flex-wrap items-center gap-2">
          {onSurface.map((link) => (
            <li
              key={link._id}
              className="flex items-center gap-2 rounded-lg bg-(--color-muted-accent) pl-1.5 pr-2.5 py-1.5"
              title={`${link.label} — slot ${slotOf(link)}`}
            >
              <span className="grid h-5 w-5 place-items-center rounded-md bg-accent text-on-accent text-[11px] font-bold tabular-nums">
                {slotOf(link)}
              </span>
              <span className="text-ink">
                <SocialIcon iconKey={link.iconKey} size={14} />
              </span>
              <span className="text-xs text-ink">{link.label}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

/* ── One links group (social or extra) ───────────────────────────────────── */

const emptyForm = {
  label: "",
  href: "",
  iconKey: "link",
  isExternal: true,
  headerOrder: "" as string,
  footerOrder: "" as string,
  linkPageOrder: "" as string,
};

const LinksGroup = ({
  kind,
  links,
  allLinks,
  onNotify,
  onError,
}: {
  kind: LinkKind;
  links: SocialLink[];
  allLinks: SocialLink[];
  onNotify: (message: string) => void;
  onError: (message: string) => void;
}) => {
  const createLink = useMutation(api.socialLinks.create);
  const updateLink = useMutation(api.socialLinks.update);
  const deleteLink = useMutation(api.socialLinks.deleteLink);
  const reorderLinks = useMutation(api.socialLinks.reorder);
  const setSurfaceOrder = useMutation(api.socialLinks.setSurfaceOrder);

  const [selectedId, setSelectedId] = useState<Id<"socialLinks"> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"socialLinks"> | null>(
    null,
  );
  const [formData, setFormData] = useState(emptyForm);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const selected = links.find((l) => l._id === selectedId) ?? null;

  // Auto-select during render instead of in an effect: setting the selection
  // makes the condition false on the very next pass, so this converges without
  // the extra render (and the flash of nothing selected) an effect would cost.
  if (links.length > 0 && !selectedId && !isCreating) {
    setSelectedId(links[0]._id);
  }

  // Reload the form only when a DIFFERENT record is selected. Guarding on the
  // id (rather than the object) stops a Convex refresh from re-running this and
  // wiping unsaved edits.
  const [loadedId, setLoadedId] = useState<string | null>(null);
  if (selected && !isCreating && selected._id !== loadedId) {
    setLoadedId(selected._id);
    setFormData({
      label: selected.label,
      href: selected.href,
      iconKey: selected.iconKey,
      isExternal: selected.isExternal ?? true,
      headerOrder:
        typeof selected.headerOrder === "number"
          ? String(selected.headerOrder)
          : "",
      footerOrder:
        typeof selected.footerOrder === "number"
          ? String(selected.footerOrder)
          : "",
      linkPageOrder:
        typeof selected.linkPageOrder === "number"
          ? String(selected.linkPageOrder)
          : "",
    });
    setIsEditing(false);
  }

  const patch = (next: Partial<typeof emptyForm>) => {
    setFormData((prev) => ({ ...prev, ...next }));
    setIsEditing(true);
  };

  // Next free slot on a surface, so a new link lands at the end rather than
  // colliding with an existing number.
  const nextSlot = (surface: Surface) => {
    const field = SURFACE_FIELD[surface];
    const taken = allLinks
      .map((l) => l[field])
      .filter((v): v is number => typeof v === "number");
    return taken.length === 0 ? 0 : Math.max(...taken) + 1;
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedId(null);
    setLoadedId(null);
    // Default a new link onto the link page — that is almost always why it is
    // being added. The header and footer are deliberate curation, so those two
    // slots stay blank until they are filled in.
    setFormData({
      ...emptyForm,
      isExternal: kind === "social",
      linkPageOrder: String(nextSlot("linkPage")),
    });
    setIsEditing(true);
  };

  // A surface slot is free-form on the form, so normalize here: blank means
  // "not on that surface", which the mutation stores as null.
  const slotValue = (raw: string): number | null => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : null;
  };

  const handleSave = async () => {
    if (!formData.label.trim() || !formData.href.trim()) {
      onError("Label and URL are required");
      return;
    }
    setIsSaving(true);
    try {
      if (isCreating) {
        const nextOrder =
          links.length > 0 ? Math.max(...links.map((l) => l.order)) + 1 : 0;
        const created = await createLink({
          kind,
          label: formData.label.trim(),
          href: formData.href.trim(),
          iconKey: formData.iconKey,
          isExternal: formData.isExternal,
          order: nextOrder,
          headerOrder: slotValue(formData.headerOrder) ?? undefined,
          footerOrder: slotValue(formData.footerOrder) ?? undefined,
          linkPageOrder: slotValue(formData.linkPageOrder) ?? undefined,
        });
        setIsCreating(false);
        setSelectedId(created);
        setLoadedId(null);
        onNotify(`"${formData.label.trim()}" added`);
      } else if (selected) {
        await updateLink({
          id: selected._id,
          label: formData.label.trim(),
          href: formData.href.trim(),
          iconKey: formData.iconKey,
          isExternal: formData.isExternal,
          headerOrder: slotValue(formData.headerOrder),
          footerOrder: slotValue(formData.footerOrder),
          linkPageOrder: slotValue(formData.linkPageOrder),
        });
        onNotify(`"${formData.label.trim()}" saved`);
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save link:", err);
      onError("Failed to save link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
      setSelectedId(links[0]?._id ?? null);
      setLoadedId(null);
    } else if (selected) {
      setLoadedId(null);
    }
    setIsEditing(false);
  };

  const handleDelete = async (id: Id<"socialLinks">) => {
    try {
      await deleteLink({ id });
      setDeleteConfirm(null);
      if (selectedId === id) {
        setSelectedId(null);
        setLoadedId(null);
      }
      onNotify("Link deleted");
    } catch (err) {
      console.error("Failed to delete link:", err);
      onError("Failed to delete link");
    }
  };

  /* ── drag-to-reorder within this group ── */

  const handleDrop = async (targetId: string) => {
    setDragOverId(null);
    if (!draggedId || draggedId === targetId) return;

    const ordered = [...links];
    const fromIdx = ordered.findIndex((l) => l._id === draggedId);
    const toIdx = ordered.findIndex((l) => l._id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const [moved] = ordered.splice(fromIdx, 1);
    ordered.splice(toIdx, 0, moved);

    try {
      await reorderLinks({
        items: ordered.map((l, i) => ({ id: l._id, order: i })),
      });
    } catch (err) {
      console.error("Failed to reorder links:", err);
      onError("Failed to reorder links");
    }
    setDraggedId(null);
  };

  const handleRenumber = async (surface: Surface) => {
    const field = SURFACE_FIELD[surface];
    const ids = allLinks
      .filter((l) => typeof l[field] === "number")
      .sort((a, b) => (a[field] ?? 0) - (b[field] ?? 0))
      .map((l) => l._id);
    try {
      await setSurfaceOrder({ surface, ids });
      setLoadedId(null);
      onNotify(`${SURFACE_LABEL[surface]} slots renumbered`);
    } catch (err) {
      console.error("Failed to renumber slots:", err);
      onError("Failed to renumber slots");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {(["header", "footer", "linkPage"] as const).map((surface) => (
          <SurfacePreview
            key={surface}
            surface={surface}
            links={allLinks}
            onRenumber={() => handleRenumber(surface)}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 min-h-[28rem]">
        {/* ── Left: list ── */}
        <div className="bg-(--color-base) border border-(--color-border) rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-(--color-ink)">
              {kind === "social" ? "Social" : "Other"}
            </h3>
            <Button
              onClick={handleCreateNew}
              variant="accent"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New
            </Button>
          </div>

          <p className="text-xs text-muted mb-3">
            Drag to reorder; H / F / L are the header, footer and link-page slots
          </p>

          <div className="flex-1 overflow-y-auto space-y-1.5">
            {links.map((link) => (
              <div
                key={link._id}
                draggable
                onDragStart={() => setDraggedId(link._id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (link._id !== draggedId) setDragOverId(link._id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={() => handleDrop(link._id)}
                onDragEnd={() => {
                  setDraggedId(null);
                  setDragOverId(null);
                }}
                onClick={() => {
                  setSelectedId(link._id);
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all
                  ${dragOverId === link._id ? "border-2 border-accent bg-accent/5" : "border border-transparent"}
                  ${draggedId === link._id ? "opacity-40" : ""}
                  ${
                    selectedId === link._id && !isCreating
                      ? "bg-(--color-foreground) text-(--color-panel)"
                      : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-(--color-ink)"
                  }`}
              >
                <GripVertical className="w-4 h-4 shrink-0 text-muted cursor-grab" />
                <span className="shrink-0">
                  <SocialIcon iconKey={link.iconKey} size={16} />
                </span>
                <span className="text-sm font-medium truncate flex-1">
                  {link.label}
                </span>
                <span className="flex items-center gap-1 shrink-0 text-[10px] font-bold tabular-nums">
                  {(["header", "footer", "linkPage"] as const).map((surface) => {
                    const slot = link[SURFACE_FIELD[surface]] as
                      | number
                      | undefined;
                    return (
                      <span
                        key={surface}
                        className={`rounded px-1 py-0.5 ${
                          typeof slot === "number"
                            ? "bg-accent text-on-accent"
                            : "bg-(--color-base) text-muted"
                        }`}
                        title={`${SURFACE_LABEL[surface]} slot`}
                      >
                        {SURFACE_BADGE[surface]}
                        {typeof slot === "number" ? slot : "–"}
                      </span>
                    );
                  })}
                </span>
              </div>
            ))}

            {links.length === 0 && (
              <p className="text-sm text-muted text-center py-8">
                No links yet. Click + New to add one.
              </p>
            )}
          </div>
        </div>

        {/* ── Right: detail form ── */}
        <div className="col-span-2 bg-(--color-base) border border-(--color-border) rounded-xl overflow-hidden flex flex-col">
          {selected || isCreating || selectedId ? (
            <>
              <div className="flex items-center justify-between px-5 py-4 bg-(--color-muted-accent) shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-(--color-panel) text-ink">
                    <SocialIcon iconKey={formData.iconKey} size={18} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-ink truncate">
                      {isCreating
                        ? `New ${kind === "social" ? "social" : "other"} link`
                        : formData.label || "Untitled"}
                    </h3>
                    {formData.href && (
                      <p className="text-sm text-muted truncate">
                        {formData.href}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isEditing ? (
                    <>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        variant="accent"
                        size="sm"
                        className="gap-2"
                        disabled={isSaving}
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving…" : "Save"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      {selected && (
                        <Button
                          onClick={() => setDeleteConfirm(selected._id)}
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {formData.href.startsWith("http") && (
                        <a
                          href={formData.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-muted hover:text-ink transition rounded-lg hover:bg-(--color-panel)"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-ink">
                      Label <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.label}
                      onChange={(e) => patch({ label: e.target.value })}
                      disabled={!isEditing}
                      placeholder="GitHub"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-ink">
                      URL <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.href}
                      onChange={(e) => patch({ href: e.target.value })}
                      disabled={!isEditing}
                      placeholder={
                        kind === "social"
                          ? "https://github.com/you"
                          : "/react-maintenance"
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-ink">
                    Icon
                  </label>
                  <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 lg:grid-cols-13">
                    {SOCIAL_ICONS.map((entry) => (
                      <button
                        key={entry.key}
                        type="button"
                        disabled={!isEditing}
                        onClick={() => patch({ iconKey: entry.key })}
                        title={entry.label}
                        aria-label={entry.label}
                        aria-pressed={formData.iconKey === entry.key}
                        className={`grid aspect-square place-items-center rounded-lg transition ${
                          formData.iconKey === entry.key
                            ? "bg-accent text-on-accent ring-2 ring-accent"
                            : "bg-(--color-muted-accent) text-ink hover:bg-(--color-surface-hover)"
                        } ${isEditing ? "cursor-pointer" : "cursor-default opacity-80"}`}
                      >
                        <SocialIcon iconKey={entry.key} size={16} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-(--color-border) bg-(--color-panel) p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-ink">
                      Where this link shows
                    </h4>
                    <p className="text-xs text-muted">
                      A slot number is the position that surface pulls from.
                      Leave it blank to keep the link off that surface.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {(
                      [
                        ["header", "headerOrder"],
                        ["footer", "footerOrder"],
                        ["linkPage", "linkPageOrder"],
                      ] as const
                    ).map(([surface, formKey]) => (
                      <div key={surface} className="space-y-2">
                        <label
                          htmlFor={`${formKey}-${selected?._id ?? "new"}`}
                          className="block text-sm font-medium text-ink"
                        >
                          {SURFACE_LABEL[surface]} slot
                        </label>
                        <Input
                          id={`${formKey}-${selected?._id ?? "new"}`}
                          type="number"
                          min={0}
                          inputMode="numeric"
                          value={formData[formKey]}
                          onChange={(e) => patch({ [formKey]: e.target.value })}
                          disabled={!isEditing}
                          placeholder={`Not on ${SURFACE_LABEL[surface].toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-1">
                    <div className="flex items-center gap-3">
                      <Switch
                        id={`external-${selected?._id ?? "new"}`}
                        checked={formData.isExternal}
                        onCheckedChange={(checked) =>
                          patch({ isExternal: checked })
                        }
                        disabled={!isEditing}
                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-600 [&>span]:bg-white [&>span]:shadow-md"
                      />
                      <label
                        htmlFor={`external-${selected?._id ?? "new"}`}
                        className="text-sm text-ink cursor-pointer select-none"
                      >
                        External — opens in a new tab
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted">
              <div className="text-center">
                <Link2 className="w-12 h-12 mx-auto opacity-40 mb-4" />
                <p>Select a link to view or edit</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-panel) rounded-2xl p-6 max-w-sm w-full border border-(--color-border)">
            <h3 className="text-lg font-bold text-ink mb-4">Delete link?</h3>
            <p className="text-muted mb-6">This cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDelete(deleteConfirm)}
                variant="outline"
                className="flex-1 text-red-500 hover:bg-red-500/10 hover:text-red-600"
              >
                Delete
              </Button>
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Panel ───────────────────────────────────────────────────────────────── */

const ProfileSocialTabEnhanced = () => {
  const profile = useQuery(api.siteSettings.getProfile);
  const allLinks = (useQuery(api.socialLinks.getAll) ?? []) as SocialLink[];

  const updateProfile = useMutation(api.siteSettings.updateProfile);
  const updateAvatar = useMutation(api.siteSettings.updateAvatar);
  const removeAvatarMutation = useMutation(api.siteSettings.removeAvatar);

  const {
    toasts,
    removeToast,
    success,
    error: showError,
  } = useToast();

  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    avatar: "",
    email: "",
    location: "",
  });
  const [isAvatarDrawerOpen, setIsAvatarDrawerOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Reload the form only when a DIFFERENT record is selected. Guarding on the
  // id (rather than the object) stops a Convex refresh from re-running this and
  // wiping unsaved edits, and doing it in render avoids a stale first paint.
  const [loadedProfileId, setLoadedProfileId] = useState<string | null>(null);
  if (profile && profile._id !== loadedProfileId) {
    setLoadedProfileId(profile._id);
    setProfileData({
      name: profile.name || "",
      bio: profile.bio || "",
      avatar: profile.avatar || "",
      email: profile.email || "",
      location: profile.location || "",
    });
  }

  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scrollToHash = () => {
      const target = window.location.hash.replace(/^#/, "");
      if (!target) return;
      if (!profileSocialSubsections.some((s) => s.id === target)) return;
      window.setTimeout(() => {
        const section = sectionRefs.current[target];
        if (section && contentRef.current) {
          contentRef.current.scrollTo({
            top: section.offsetTop - 24,
            behavior: "smooth",
          });
        }
      }, 50);
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        avatar: profileData.avatar || undefined,
        email: profileData.email || undefined,
        location: profileData.location || undefined,
      });
      success("Profile saved!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      showError("Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarSelect = async (url: string) => {
    try {
      await updateAvatar({ avatar: url });
      setProfileData((prev) => ({ ...prev, avatar: url }));
      setIsAvatarDrawerOpen(false);
      success("Avatar updated!");
    } catch (err) {
      console.error("Failed to update avatar:", err);
      showError("Failed to update avatar");
    }
  };

  const socialGroup = allLinks
    .filter((l) => l.kind === "social")
    .sort((a, b) => a.order - b.order);
  const extraGroup = allLinks
    .filter((l) => l.kind === "extra")
    .sort((a, b) => a.order - b.order);

  return (
    <div className="h-full flex">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Section navigation lives in the admin sidebar tree. */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto pr-2 space-y-8 scroll-smooth"
      >
        {/* ── Profile ── */}
        <section
          id="profile"
          ref={(el) => {
            sectionRefs.current["profile"] = el;
          }}
          className="scroll-mt-6"
        >
          <SectionCard
            icon={User}
            title="Profile"
            description="The photo, name and bio the site pulls from Convex"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-(--color-muted-accent)">
                    {profileData.avatar ? (
                      <Image
                        src={profileData.avatar}
                        alt="Avatar"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent/10">
                        <User className="w-10 h-10 text-accent/50" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsAvatarDrawerOpen(true)}
                    className="absolute -bottom-1 -right-1 p-2 bg-accent text-on-accent rounded-full cursor-pointer hover:bg-accent/90 transition shadow-md"
                    title="Change photo"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-ink">Profile Photo</p>
                  <p className="text-xs text-muted">
                    Recommended: Square image, at least 200x200px. This photo
                    feeds the home page “My Ramblings” card and the link page.
                  </p>
                  {profileData.avatar && (
                    <button
                      onClick={async () => {
                        try {
                          await removeAvatarMutation();
                          setProfileData((prev) => ({ ...prev, avatar: "" }));
                          success("Photo removed");
                        } catch (err) {
                          console.error("Failed to remove avatar:", err);
                          showError("Failed to remove photo");
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 mt-2"
                    >
                      <Trash className="w-3 h-3" />
                      Remove photo
                    </button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="profile-name"
                    className="block text-sm font-medium text-ink"
                  >
                    Name
                  </label>
                  <Input
                    id="profile-name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="profile-location"
                    className="block text-sm font-medium text-ink"
                  >
                    Location
                  </label>
                  <Input
                    id="profile-location"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Jacksonville, Florida"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="profile-email"
                  className="block text-sm font-medium text-ink"
                >
                  Email
                </label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  className="max-w-md"
                />
                <p className="text-xs text-muted">
                  Admin-only — stripped from the public profile query.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="profile-bio"
                  className="block text-sm font-medium text-ink"
                >
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="A short bio about yourself"
                  rows={4}
                  className="w-full px-3 py-2 bg-(--color-muted-accent) rounded-lg text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <p className="text-xs text-muted">
                  {profileData.bio.length}/300 characters
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSaveProfile}
                  variant="accent"
                  disabled={isSavingProfile}
                  className="gap-2"
                >
                  {isSavingProfile ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Profile
                </Button>
              </div>
            </div>
          </SectionCard>
        </section>

        {/* ── Social links ── */}
        <section
          id="social-links"
          ref={(el) => {
            sectionRefs.current["social-links"] = el;
          }}
          className="scroll-mt-6"
        >
          <SectionCard
            icon={Share2}
            title="Social Links"
            description="One row per profile. The header, footer and link page all read from here."
          >
            <LinksGroup
              kind="social"
              links={socialGroup}
              allLinks={allLinks}
              onNotify={success}
              onError={showError}
            />
          </SectionCard>
        </section>

        {/* ── Extra links ── */}
        <section
          id="extra-links"
          ref={(el) => {
            sectionRefs.current["extra-links"] = el;
          }}
          className="scroll-mt-6"
        >
          <SectionCard
            icon={Link2}
            title="Other Links"
            description="Non-social buttons on the link page — services, resume, anything else"
          >
            <LinksGroup
              kind="extra"
              links={extraGroup}
              allLinks={allLinks}
              onNotify={success}
              onError={showError}
            />
          </SectionCard>
        </section>
      </div>

      <MediaDrawer
        isOpen={isAvatarDrawerOpen}
        onClose={() => setIsAvatarDrawerOpen(false)}
        onSelect={handleAvatarSelect}
        title="Select Profile Photo"
        description="Choose an image from your media library or upload a new one"
      />
    </div>
  );
};

export default ProfileSocialTabEnhanced;
