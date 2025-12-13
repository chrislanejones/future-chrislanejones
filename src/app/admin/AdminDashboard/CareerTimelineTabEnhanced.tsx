"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  GripVertical,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Video,
  Star,
  Lightbulb,
  Mountain,
  Home,
  Users,
  Code2,
  Award,
  BookOpen,
  Coffee,
  Rocket,
  Target,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "@/components/ui/button";

interface CareerEvent {
  _id: Id<"careerTimeline">;
  year: string;
  title: string;
  description: string;
  location?: string;
  iconName: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Video,
  Star,
  Lightbulb,
  Mountain,
  Home,
  Users,
  Code2,
  Briefcase,
  Award,
  BookOpen,
  Coffee,
  Rocket,
  Target,
};

const VALID_ICONS = Object.keys(ICON_MAP);

const CareerTimelineTabEnhanced = () => {
  const events = useQuery(api.careerTimeline.getAllEvents) ?? [];
  const addEvent = useMutation(api.careerTimeline.addEvent);
  const updateEvent = useMutation(api.careerTimeline.updateEvent);
  const deleteEvent = useMutation(api.careerTimeline.deleteEvent);

  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
    location: "",
    iconName: "Briefcase",
  });

  // Auto-select first event
  useEffect(() => {
    if (events.length > 0 && !selectedEvent && !isCreating) {
      setSelectedEvent(events[0] as CareerEvent);
    }
  }, [events, selectedEvent, isCreating]);

  // Update form when event is selected
  useEffect(() => {
    if (selectedEvent && !isCreating) {
      setFormData({
        year: selectedEvent.year,
        title: selectedEvent.title,
        description: selectedEvent.description,
        location: selectedEvent.location || "",
        iconName: selectedEvent.iconName,
      });
      setIsEditing(false);
    }
  }, [selectedEvent, isCreating]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedEvent(null);
    setFormData({
      year: new Date().getFullYear().toString(),
      title: "",
      description: "",
      location: "",
      iconName: "Briefcase",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isCreating) {
        await addEvent({
          year: formData.year,
          title: formData.title,
          description: formData.description,
          location: formData.location || undefined,
          iconName: formData.iconName,
          order: events.length,
        });
        setSuccess("Event created successfully!");
        setIsCreating(false);
      } else if (selectedEvent) {
        await updateEvent({
          id: selectedEvent._id,
          year: formData.year,
          title: formData.title,
          description: formData.description,
          location: formData.location || undefined,
          iconName: formData.iconName,
          order: selectedEvent.order,
        });
        setSuccess("Event updated successfully!");
      }
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to save event"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: Id<"careerTimeline">) => {
    try {
      await deleteEvent({ id });
      setSuccess("Event deleted successfully!");
      setDeleteConfirm(null);
      if (selectedEvent?._id === id) {
        setSelectedEvent(null);
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete event")
      );
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
      if (events.length > 0) {
        setSelectedEvent(events[0] as CareerEvent);
      }
    } else if (selectedEvent) {
      setFormData({
        year: selectedEvent.year,
        title: selectedEvent.title,
        description: selectedEvent.description,
        location: selectedEvent.location || "",
        iconName: selectedEvent.iconName,
      });
    }
    setIsEditing(false);
  };

  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = ICON_MAP[iconName] || Briefcase;
    return <IconComponent className={className} />;
  };

  // Sort events by order
  const sortedEvents = [...events].sort((a, b) => a.order - b.order);

  if (events === undefined) {
    return <LoadingSpinner message="Loading timeline..." />;
  }

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Status Messages */}
      {error && (
        <div className="col-span-3">
          <ErrorDisplay error={error} onDismiss={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="col-span-3">
          <SuccessDisplay
            message={success}
            onDismiss={() => setSuccess(null)}
          />
        </div>
      )}

      {/* Left Panel - Event List */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-(--color-ink)">Timeline Events</h3>
        </div>

        {/* Add Event Button - Homepage style */}
        <Button
          onClick={handleCreateNew}
          variant="accent"
          className="w-full gap-2 mb-4"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Button>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {sortedEvents.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">
              No events yet. Add your first career milestone!
            </p>
          ) : (
            sortedEvents.map((event) => (
              <button
                key={event._id}
                onClick={() => {
                  setIsCreating(false);
                  setSelectedEvent(event as CareerEvent);
                }}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedEvent?._id === event._id && !isCreating
                    ? "bg-(--color-foreground) text-(--color-panel)"
                    : "bg-(--color-muted-accent) hover:bg-(--color-surface-hover) text-(--color-ink)"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 ${
                      selectedEvent?._id === event._id && !isCreating
                        ? "text-(--color-panel)"
                        : "text-accent"
                    }`}
                  >
                    {renderIcon(event.iconName, "w-4 h-4")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">
                        {event.title}
                      </span>
                      <span
                        className={`text-xs shrink-0 ${
                          selectedEvent?._id === event._id && !isCreating
                            ? "opacity-70"
                            : "text-muted"
                        }`}
                      >
                        {event.year}
                      </span>
                    </div>
                    {event.location && (
                      <p
                        className={`text-xs truncate ${
                          selectedEvent?._id === event._id && !isCreating
                            ? "opacity-70"
                            : "text-muted"
                        }`}
                      >
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Event Editor */}
      <div className="col-span-2 bg-(--color-panel) border border-(--color-border) rounded-2xl overflow-hidden flex flex-col">
        {selectedEvent || isCreating ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-(--color-muted-accent)">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  {renderIcon(formData.iconName, "w-5 h-5 text-accent")}
                </div>
                <div>
                  <h2 className="font-bold text-ink">
                    {isCreating ? "New Event" : formData.title || "Untitled"}
                  </h2>
                  <p className="text-sm text-muted">
                    {formData.year}
                    {formData.location && ` • ${formData.location}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                      {isSaving ? "Saving..." : "Save"}
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
                    {selectedEvent && (
                      <Button
                        onClick={() => setDeleteConfirm(selectedEvent._id)}
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Year */}
              <div>
                <label className="block mb-2 text-ink font-medium">Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => {
                    setFormData({ ...formData, year: e.target.value });
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-60"
                  placeholder="2024 or 2020-2024"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block mb-2 text-ink font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-60"
                  placeholder="Job title or milestone"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none resize-none disabled:opacity-60"
                  placeholder="Describe this milestone..."
                />
              </div>

              {/* Location */}
              <div>
                <label className="block mb-2 text-ink font-medium">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    setIsEditing(true);
                  }}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-(--color-muted-accent) rounded-xl text-ink focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-60"
                  placeholder="City, State or Company"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block mb-2 text-ink font-medium">Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {VALID_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        if (isEditing) {
                          setFormData({ ...formData, iconName });
                        }
                      }}
                      disabled={!isEditing}
                      className={`p-3 rounded-lg transition ${
                        formData.iconName === iconName
                          ? "bg-accent/20 text-accent ring-2 ring-accent"
                          : "bg-(--color-muted-accent) text-muted hover:text-ink disabled:opacity-40"
                      }`}
                      title={iconName}
                    >
                      {renderIcon(iconName, "w-5 h-5")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto opacity-40 mb-4" />
              <p>Select an event to view or edit</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-panel) rounded-2xl p-6 max-w-sm w-full border border-(--color-border)">
            <h3 className="text-lg font-bold text-ink mb-4">Delete Event?</h3>
            <p className="text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  handleDelete(deleteConfirm as Id<"careerTimeline">)
                }
                variant="disabled"
                className="flex-1"
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

export default CareerTimelineTabEnhanced;
