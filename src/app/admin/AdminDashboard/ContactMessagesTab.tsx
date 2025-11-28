// src/app/admin/AdminDashboard/ContactMessagesTab.tsx
"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle,
  Circle,
  Search,
  User,
  MessageSquare,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const ContactMessagesTab = () => {
  const messages = useQuery(api.contactMessages.getAll) ?? [];
  const markAsRead = useMutation(api.contactMessages.markAsRead);
  const deleteMessage = useMutation(api.contactMessages.deleteMessage);
  const markAllAsRead = useMutation(api.contactMessages.markAllAsRead);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleSelectMessage = async (message: any) => {
    setSelectedMessage(message);
    if (!message.read) {
      await markAsRead({ id: message._id });
    }
  };

  const handleConfirmDelete = async (idToDelete: Id<"contactMessages">) => {
    try {
      await deleteMessage({ id: idToDelete });
      setDeleteConfirmId(null);
      if (selectedMessage?._id === idToDelete) {
        setSelectedMessage(null);
      }
      // useQuery will automatically refetch 'messages' here.
    } catch (error: any) {
      console.error("Failed to delete message:", error);
      // If the error indicates a nonexistent document, clear local state anyway
      if (error.message && error.message.includes("nonexistent document")) {
        console.warn(
          `Attempted to delete a message that might already be gone. ID: ${idToDelete}`
        );
        if (selectedMessage?._id === idToDelete) {
          setSelectedMessage(null);
        }
        setDeleteConfirmId(null);
        // You might want to display a toast notification to the user here
        // e.g., "Message already deleted by another user/session."
      } else {
        // For other types of errors, you might want to display a specific error message.
      }
    }
  };

  const handleDeleteClick = (id: Id<"contactMessages">) => {
    setDeleteConfirmId(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  };

  return (
    <div className="h-full flex bg-[color:var(--color-panel)] border border-[color:var(--color-border)] rounded-2xl overflow-hidden">
      <div className="w-1/3 border-r border-[color:var(--color-border)] flex flex-col">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[color:var(--color-base)] border-b border-[color:var(--color-border)] text-[color:var(--color-ink)] placeholder-[color:var(--color-muted)] focus:outline-none"
          />
        </div>
        <div className="flex justify-between items-center p-4 bg-[color:var(--color-base)] border-b border-[color:var(--color-border)]">
          <h2 className="text-[color:var(--color-ink)] font-semibold text-lg">
            Messages ({messages.length})
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
                {unreadCount} unread
              </span>
            )}
          </h2>
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-3 py-1 bg-[color:var(--color-muted-accent)] text-[color:var(--color-foreground)] rounded-lg text-sm hover:bg-[color:var(--color-surface-hover)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all read
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-[color:var(--color-muted)]">
              No messages found.
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message._id}
                onClick={() => handleSelectMessage(message)}
                className={`flex items-start gap-4 p-4 border-b border-[color:var(--color-border)] cursor-pointer hover:bg-[color:var(--color-surface-hover)] transition-colors ${
                  selectedMessage?._id === message._id
                    ? "bg-[color:var(--color-muted-accent)]"
                    : ""
                }`}
              >
                {!message.read ? (
                  <Circle className="w-3 h-3 mt-1.5 flex-shrink-0 text-[color:var(--color-accent)]" />
                ) : (
                  <CheckCircle className="w-3 h-3 mt-1.5 flex-shrink-0 text-[color:var(--color-muted)]" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-[color:var(--color-ink)] truncate">
                      {message.name}
                    </p>
                    <span className="text-xs text-[color:var(--color-muted)] flex-shrink-0">
                      {formatRelativeTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[color:var(--color-foreground)] truncate">
                    {message.message}
                  </p>
                  <p className="text-xs text-[color:var(--color-muted)] flex items-center gap-1 mt-1">
                    <MessageSquare className="w-3 h-3" />
                    Source: {message.source}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {selectedMessage ? (
          <div className="p-6 h-full flex flex-col">
            <div className="bg-[color:var(--color-base)] rounded-lg p-6 mb-6 border border-[color:var(--color-border)] flex-1 overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="mb-2 text-[color:var(--color-ink)] font-bold">
                    {selectedMessage.name}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[color:var(--color-foreground)]">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="transition-colors hover:text-[color:var(--color-accent)]"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2 text-[color:var(--color-foreground)]">
                        <Phone className="w-4 h-4" />
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="transition-colors hover:text-[color:var(--color-accent)]"
                        >
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[color:var(--color-foreground)]">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedMessage.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[color:var(--color-foreground)]">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Source: {selectedMessage.source}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteClick(selectedMessage._id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="pt-4 border-t border-[color:var(--color-border)]">
                <h3 className="mb-3 text-[color:var(--color-ink)] font-semibold">
                  Message
                </h3>
                <p className="whitespace-pre-wrap text-[color:var(--color-foreground)]">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
            {deleteConfirmId === selectedMessage._id && (
              <div className="bg-red-500/10 p-4 rounded-lg flex items-center justify-between mb-4">
                <p className="text-red-500">
                  Are you sure you want to delete this message?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirmDelete(selectedMessage._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 bg-[color:var(--color-surface-hover)] text-[color:var(--color-ink)] rounded-lg hover:bg-[color:var(--color-muted-accent)] transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={`mailto:${selectedMessage.email}`}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[color:var(--color-base)] text-[color:var(--color-ink)] rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-all border border-[color:var(--color-border)]"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>
              {selectedMessage.phone && (
                <a
                  href={`tel:${selectedMessage.phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[color:var(--color-base)] text-[color:var(--color-ink)] rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-all border border-[color:var(--color-border)]"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-[color:var(--color-muted)] mx-auto mb-4 opacity-50" />
              <p className="text-[color:var(--color-muted)]">
                Select a message to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessagesTab;
