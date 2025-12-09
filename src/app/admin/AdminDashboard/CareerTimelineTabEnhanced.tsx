"use client";
import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  GripVertical,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { useCareerEffect } from "../hooks/useCareerEffect";

const ICON_MAP: Record<string, any> = {
  GraduationCap: "🎓",
  Video: "🎬",
  Star: "⭐",
  Lightbulb: "💡",
  Mountain: "⛰️",
  Home: "🏠",
  Users: "👥",
  Code2: "💻",
  Briefcase: "💼",
  Award: "🏆",
  BookOpen: "📖",
  Coffee: "☕",
  Rocket: "🚀",
  Target: "🎯",
};

const AVAILABLE_ICONS = Object.keys(ICON_MAP);

const CareerTimelineTabEnhanced = () => {
  const events = useQuery(api.careerTimeline.getAllEvents) ?? [];
  const addEvent = useMutation(api.careerTimeline.addEvent);
  const updateEvent = useMutation(api.careerTimeline.updateEvent);
  const deleteEvent = useMutation(api.careerTimeline.deleteEvent);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
    location: "",
    iconName: "Star",
  });

  const handleOpenModal = (eventId?: string) => {
    if (eventId) {
      const event = events.find((e) => e._id === (eventId as any));
      if (event) {
        setFormData({
          year: event.year,
          title: event.title,
          description: event.description,
          location: event.location || "",
          iconName: event.iconName,
        });
        setEditingEventId(eventId);
        setIsEditing(true);
      }
    } else {
      setFormData({
        year: new Date().getFullYear().toString(),
        title: "",
        description: "",
        location: "",
        iconName: "Star",
      });
      setEditingEventId(null);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSaveEvent = async () => {
    try {
      setError(null);

      if (
        !formData.year.trim() ||
        !formData.title.trim() ||
        !formData.description.trim()
      ) {
        setError(new Error("Year, Title, and Description are required"));
        return;
      }

      if (formData.description.length < 20) {
        setError(new Error("Description must be at least 20 characters"));
        return;
      }

      const maxOrder =
        events.length > 0 ? Math.max(...events.map((e) => e.order)) : 0;

      if (isEditing && editingEventId) {
        const event = events.find((e) => e._id === (editingEventId as any));
        if (event) {
          await updateEvent({
            id: event._id,
            year: formData.year,
            title: formData.title,
            description: formData.description,
            location: formData.location || undefined,
            iconName: formData.iconName,
            order: event.order,
          });
          setSuccess("Event updated successfully!");
        }
      } else {
        await addEvent({
          year: formData.year,
          title: formData.title,
          description: formData.description,
          location: formData.location || undefined,
          iconName: formData.iconName,
          order: maxOrder + 1,
        });
        setSuccess("Event created successfully!");
      }

      setShowModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to save event"));
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const event = events.find((e) => e._id === (eventId as any));
      if (event && confirm(`Delete "${event.title}"?`)) {
        await deleteEvent({ id: event._id });
        setSuccess("Event deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete event")
      );
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      {error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}
      {success && (
        <SuccessDisplay message={success} onDismiss={() => setSuccess(null)} />
      )}

      {/* Add Button */}
      <div className="bg-panel border border-border rounded-lg p-4">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-on-accent rounded-lg hover:shadow-glow transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-panel rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">
                {isEditing ? "Edit Event" : "Add Event"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-muted hover:text-ink transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Year *
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder="2024 or 2023-2024"
                  className="w-full px-3 py-2 rounded-lg bg-base border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Event Title"
                  className="w-full px-3 py-2 rounded-lg bg-base border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value,
                    })
                  }
                  placeholder="City, Country"
                  className="w-full px-3 py-2 rounded-lg bg-base border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the event (20+ characters)"
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-base border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() =>
                        setFormData({ ...formData, iconName: icon })
                      }
                      className={`text-2xl p-2 rounded-lg transition ${
                        formData.iconName === icon
                          ? "ring-2 ring-accent bg-accent/10"
                          : "hover:bg-base"
                      }`}
                      title={icon}
                    >
                      {ICON_MAP[icon]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveEvent}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-on-accent rounded-lg hover:shadow-glow transition font-bold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-muted-accent text-ink rounded-lg hover:bg-surface-hover transition font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto bg-panel border border-border rounded-lg p-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
            <p className="text-muted mb-4">No events yet</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-accent text-on-accent rounded-lg hover:shadow-glow transition font-medium"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events
              .sort((a, b) => a.order - b.order)
              .map((event, index) => (
                <div key={event._id} className="flex gap-4 group">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl border-2 border-accent">
                      {ICON_MAP[event.iconName] || "•"}
                    </div>
                    {index !== events.length - 1 && (
                      <div className="w-1 h-12 bg-accent/20 mt-2" />
                    )}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 pb-4">
                    <div className="bg-base rounded-lg p-4 border border-border hover:border-accent transition">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs text-accent font-semibold">
                            {event.year}
                          </p>
                          <p className="text-lg font-bold text-ink">
                            {event.title}
                          </p>
                          {event.location && (
                            <p className="text-sm text-muted">
                              📍 {event.location}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleOpenModal(event._id)}
                            className="p-2 bg-accent/10 text-accent rounded hover:bg-accent/20 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-muted leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerTimelineTabEnhanced;
