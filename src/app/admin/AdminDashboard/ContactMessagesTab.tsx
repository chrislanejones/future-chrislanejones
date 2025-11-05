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
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleSelectMessage = async (message: any) => {
    setSelectedMessage(message);
    if (!message.read) {
      await markAsRead({ id: message._id });
    }
  };

  const handleDelete = async (id: Id<"contactMessages">) => {
    await deleteMessage({ id });
    setDeleteConfirmId(null);
    if (selectedMessage?._id === id) {
      setSelectedMessage(null);
    }
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
    <div className="h-full flex flex-col bg-[color:var(--color-panel)] border border-[color:var(--color-border)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[color:var(--color-base)] border-b border-[color:var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[color:var(--color-ink)] font-bold">
              Contact Messages
            </h1>
            <p className="mt-1 text-[color:var(--color-muted)]">
              {messages.length} total messages • {unreadCount} unread
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-[color:var(--color-base)] text-[color:var(--color-ink)] rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-all border border-[color:var(--color-border)]"
            >
              <CheckCircle className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[color:var(--color-base)] border border-[color:var(--color-border)] rounded-lg text-[color:var(--color-ink)] placeholder-[color:var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages List */}
        <div className="w-1/3 border-r border-[color:var(--color-border)] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-[color:var(--color-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-[color:var(--color-muted)]">No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-[color:var(--color-border)]">
              {filteredMessages.map((message) => (
                <button
                  key={message._id}
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full p-4 text-left hover:bg-[color:var(--color-surface-hover)] transition-all ${ selectedMessage?._id === message._id ? "bg-[color:var(--color-surface-hover)]" : "" } ${!message.read ? "border-l-4 border-[color:var(--color-accent)]" : ""}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {!message.read ? (
                        <Circle className="w-2 h-2 fill-[color:var(--color-accent)] text-[color:var(--color-accent)]" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-[color:var(--color-muted)]" />
                      )}
                      <span
                        className={`${ !message.read ? "text-[color:var(--color-ink)] font-medium" : "text-[color:var(--color-muted)]" }`}
                      >
                        {message.name}
                      </span>
                    </div>
                    <span className="text-[color:var(--color-muted)] text-sm">
                      {formatRelativeTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-[color:var(--color-muted)] text-sm">
                    {message.email}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[color:var(--color-foreground)] text-sm">
                    {message.message}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="flex-1 overflow-y-auto">
          {selectedMessage ? (
            <div className="p-6">
              <div className="bg-[color:var(--color-base)] rounded-lg p-6 mb-6 border border-[color:var(--color-border)]">
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
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteConfirmId(selectedMessage._id)}
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

                {/* Delete Confirmation */}
                {deleteConfirmId === selectedMessage._id && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="mb-3 text-[color:var(--color-ink)]">
                      Are you sure you want to delete this message?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(selectedMessage._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-4 py-2 bg-[color:var(--color-base)] text-[color:var(--color-ink)] rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-all border border-[color:var(--color-border)]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
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
    </div>
  );
};

export default ContactMessagesTab;
