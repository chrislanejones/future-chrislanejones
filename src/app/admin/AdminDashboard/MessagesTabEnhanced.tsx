"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Mail,
  MailOpen,
  Trash2,
  Phone,
  Calendar,
  ExternalLink,
  CheckCircle,
  X,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { SuccessDisplay } from "../components/SuccessDisplay";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  _id: Id<"contactMessages">;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: number;
  read: boolean;
  source: string;
}

const MessagesTabEnhanced = () => {
  const messages = useQuery(api.contactMessages.getAll) ?? [];
  const markAsRead = useMutation(api.contactMessages.markAsRead);
  const deleteMessage = useMutation(api.contactMessages.deleteMessage);

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read">(
    "all"
  );
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Auto-select first unread message or first message
  useEffect(() => {
    if (messages.length > 0 && !selectedMessage) {
      const unreadMessage = messages.find((m) => !m.read);
      setSelectedMessage((unreadMessage || messages[0]) as ContactMessage);
    }
  }, [messages, selectedMessage]);

  // Mark as read when selected
  useEffect(() => {
    if (selectedMessage && !selectedMessage.read) {
      handleMarkAsRead(selectedMessage._id);
    }
  }, [selectedMessage?._id]);

  const handleMarkAsRead = async (id: Id<"contactMessages">) => {
    try {
      await markAsRead({ id });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id: Id<"contactMessages">) => {
    try {
      await deleteMessage({ id });
      setSuccess("Message deleted successfully");
      setDeleteConfirm(null);
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete message")
      );
    }
  };

  const handleSelectMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "unread" && !message.read) ||
      (filterStatus === "read" && message.read);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatFullDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (messages === undefined) {
    return <LoadingSpinner message="Loading messages..." />;
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

      {/* Left Panel - Message List */}
      <div className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-(--color-ink)">Messages</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-accent text-on-accent text-xs font-bold rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-base border border-border rounded-lg text-ink text-sm focus:ring-2 focus:ring-accent focus:border-accent"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-4 p-1 bg-base rounded-lg">
          {(["all", "unread", "read"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 px-3 py-1.5 text-sm rounded-md transition ${
                filterStatus === status
                  ? "bg-(--color-foreground) text-(--color-panel)"
                  : "text-muted hover:text-ink"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredMessages.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">
              No messages found
            </p>
          ) : (
            filteredMessages.map((message) => (
              <button
                key={message._id}
                onClick={() => handleSelectMessage(message as ContactMessage)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedMessage?._id === message._id
                    ? "bg-(--color-foreground) text-(--color-panel)"
                    : "hover:bg-(--color-surface-hover) text-(--color-ink)"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 ${
                      selectedMessage?._id === message._id
                        ? "text-(--color-panel)"
                        : message.read
                          ? "text-muted"
                          : "text-accent"
                    }`}
                  >
                    {message.read ? (
                      <MailOpen className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-medium truncate ${
                          !message.read && selectedMessage?._id !== message._id
                            ? "text-(--color-ink)"
                            : ""
                        }`}
                      >
                        {message.name}
                      </span>
                      <span
                        className={`text-xs shrink-0 ${
                          selectedMessage?._id === message._id
                            ? "opacity-70"
                            : "text-muted"
                        }`}
                      >
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate mt-1 ${
                        selectedMessage?._id === message._id
                          ? "opacity-70"
                          : "text-muted"
                      }`}
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Message Detail */}
      <div className="col-span-2 bg-panel border border-border rounded-2xl overflow-hidden flex flex-col">
        {selectedMessage ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="font-bold text-ink">{selectedMessage.name}</h2>
                <p className="text-sm text-muted">{selectedMessage.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="p-2 text-muted hover:text-ink transition rounded-lg hover:bg-surface-hover"
                  title="Reply via email"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Button
                  onClick={() => setDeleteConfirm(selectedMessage._id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <Calendar className="w-4 h-4" />
                  <span>{formatFullDate(selectedMessage.createdAt)}</span>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-muted">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="hover:text-ink transition"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      selectedMessage.read
                        ? "bg-muted-accent text-muted"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {selectedMessage.read ? "Read" : "Unread"}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-muted-accent text-muted rounded-full">
                    {selectedMessage.source}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 bg-base border border-border rounded-xl">
                <p className="text-ink whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button variant="accent" className="gap-2" asChild>
                  <a href={`mailto:${selectedMessage.email}`}>
                    <Mail className="w-4 h-4" />
                    Reply
                  </a>
                </Button>
                {selectedMessage.phone && (
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={`tel:${selectedMessage.phone}`}>
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto opacity-40 mb-4" />
              <p>Select a message to view</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-panel rounded-2xl p-6 max-w-sm w-full border border-border">
            <h3 className="text-lg font-bold text-ink mb-4">Delete Message?</h3>
            <p className="text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  handleDelete(deleteConfirm as Id<"contactMessages">)
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

export default MessagesTabEnhanced;
