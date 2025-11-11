"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  GripVertical,
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
} from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

type TimelineEvent = {
  _id: Id<"careerTimeline">;
  year: string;
  title: string;
  description: string;
  location?: string;
  iconName: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

// Lucide icon mapping
const ICON_MAP: Record<string, React.ComponentType<any>> = {
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

const AVAILABLE_ICONS = [
  { name: "GraduationCap", label: "Graduation" },
  { name: "Video", label: "Video" },
  { name: "Star", label: "Star" },
  { name: "Lightbulb", label: "Lightbulb" },
  { name: "Mountain", label: "Mountain" },
  { name: "Home", label: "Home" },
  { name: "Users", label: "Users/Meetup" },
  { name: "Code2", label: "Code" },
  { name: "Briefcase", label: "Briefcase" },
  { name: "Award", label: "Award" },
  { name: "BookOpen", label: "Book" },
  { name: "Coffee", label: "Coffee" },
  { name: "Rocket", label: "Rocket" },
  { name: "Target", label: "Target" },
];

const CareerTimelineTab = () => {
  const events = useQuery(api.careerTimeline.getAllEvents) ?? [];
  const addEvent = useMutation(api.careerTimeline.addEvent);
  const updateEvent = useMutation(api.careerTimeline.updateEvent);
  const deleteEvent = useMutation(api.careerTimeline.deleteEvent);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);

  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
    location: "",
    iconName: "GraduationCap",
  });

  const resetForm = () => {
    setFormData({
      year: "",
      title: "",
      description: "",
      location: "",
      iconName: "GraduationCap",
    });
    setEditingEvent(null);
    setShowAddModal(false);
  };

  const handleAdd = async () => {
    if (!formData.year || !formData.title || !formData.description) {
      setSaveStatus("error");
      return;
    }

    try {
      const maxOrder = events.length > 0 ? Math.max(...events.map((e) => e.order)) : 0;
      await addEvent({
        year: formData.year,
        title: formData.title,
        description: formData.description,
        location: formData.location || undefined,
        iconName: formData.iconName,
        order: maxOrder + 1,
      });
      setSaveStatus("success");
      resetForm();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to add event:", error);
      setSaveStatus("error");
    }
  };

  const handleUpdate = async () => {
    if (!editingEvent || !formData.year || !formData.title || !formData.description) {
      setSaveStatus("error");
      return;
    }

    try {
      await updateEvent({
        id: editingEvent._id,
        year: formData.year,
        title: formData.title,
        description: formData.description,
        location: formData.location || undefined,
        iconName: formData.iconName,
        order: editingEvent.order,
      });
      setSaveStatus("success");
      resetForm();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to update event:", error);
      setSaveStatus("error");
    }
  };

  const handleDelete = async (id: Id<"careerTimeline">) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent({ id });
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (error) {
        console.error("Failed to delete event:", error);
        setSaveStatus("error");
      }
    }
  };

  const openEditModal = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      year: event.year,
      title: event.title,
      description: event.description,
      location: event.location || "",
      iconName: event.iconName,
    });
    setShowAddModal(true);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-[#f3f4f6]">
            Career Timeline Manager
          </h2>
          <p className="text-[#9ca3af] mt-1">
            Manage your career timeline events displayed on the career page
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Status Messages */}
      {saveStatus === "success" && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-500">Operation completed successfully!</span>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-500">Failed to complete operation</span>
        </div>
      )}

      {/* Events List */}
      <div className="bg-[#111418] border border-[#1f242b] rounded-2xl p-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
            <p className="text-[#9ca3af] mb-4">
              No timeline events yet.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
              <p className="text-[#6b7280] self-center">or use Settings tab to seed data</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex items-start gap-4 p-4 bg-[#0b0d10] border border-[#1f242b] rounded-lg hover:border-[#4ade80] transition-all"
              >
                <div className="flex-shrink-0">
                  <GripVertical className="w-5 h-5 text-[#9ca3af]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[#4ade80] font-medium">
                        {event.year}
                      </span>
                      <h3 className="text-[#f3f4f6] font-semibold mt-1">
                        {event.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 hover:bg-[#1a1e24] rounded-md text-[#9ca3af] hover:text-[#f3f4f6] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 hover:bg-[#1a1e24] rounded-md text-[#9ca3af] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[#9ca3af] mb-2">
                    {event.description}
                  </p>
                  {event.location && (
                    <p className="text-[#9ca3af]">📍 {event.location}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {ICON_MAP[event.iconName] &&
                      React.createElement(ICON_MAP[event.iconName], {
                        className: "w-4 h-4 text-[#4ade80]"
                      })
                    }
                    <p className="text-[#9ca3af]">
                      {event.iconName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111418] border border-[#1f242b] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-[#f3f4f6]">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-[#1a1e24] rounded-md text-[#9ca3af] hover:text-[#f3f4f6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Year */}
              <div>
                <label className="block font-medium text-[#f3f4f6] mb-2">
                  Year *
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder="e.g., 2024 or 2020-2023"
                  className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block font-medium text-[#f3f4f6] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Event title"
                  className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-[#f3f4f6] mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Event description"
                  rows={4}
                  className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#4ade80] resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-medium text-[#f3f4f6] mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., Jacksonville, FL"
                  className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block font-medium text-[#f3f4f6] mb-2">
                  Icon *
                </label>
                <select
                  value={formData.iconName}
                  onChange={(e) =>
                    setFormData({ ...formData, iconName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
                >
                  {AVAILABLE_ICONS.map((icon) => (
                    <option key={icon.name} value={icon.name}>
                      {icon.label}
                    </option>
                  ))}
                </select>
                {/* Icon Preview */}
                <div className="mt-3 p-3 bg-[#0b0d10] rounded-lg border border-[#1f242b] flex items-center gap-3">
                  <span className="text-[#9ca3af]">Preview:</span>
                  {ICON_MAP[formData.iconName] &&
                    React.createElement(ICON_MAP[formData.iconName], {
                      className: "w-6 h-6 text-[#4ade80]"
                    })
                  }
                  <span className="text-[#f3f4f6]">{formData.iconName}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingEvent ? handleUpdate : handleAdd}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4ade80] text-[#0b0d10] rounded-lg hover:bg-[#22c55e] transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                {editingEvent ? "Update Event" : "Add Event"}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-[#1a1e24] text-[#f3f4f6] rounded-lg hover:bg-[#1f242b] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerTimelineTab;
