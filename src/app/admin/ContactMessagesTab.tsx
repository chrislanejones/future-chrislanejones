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
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

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
    <div className="h-full flex flex-col bg-[#111418] border border-[#1f242b] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#0b0d10] border-b border-[#1f242b] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#f3f4f6]">Contact Messages</h1>
            <p className="text-sm text-[#9ca3af] mt-1">
              {messages.length} total messages • {unreadCount} unread
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1e24] text-[#4ade80] rounded-lg hover:bg-[#1f242b] transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#0b0d10] border border-[#1f242b] rounded-lg text-[#f3f4f6] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages List */}
        <div className="w-1/3 border-r border-[#1f242b] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-[#9ca3af]">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1f242b]">
              {filteredMessages.map((message) => (
                <button
                  key={message._id}
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full p-4 text-left hover:bg-[#1a1e24] transition-all ${
                    selectedMessage?._id === message._id ? "bg-[#1a1e24]" : ""
                  } ${!message.read ? "border-l-4 border-[#4ade80]" : ""}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {!message.read ? (
                        <Circle className="w-2 h-2 fill-[#4ade80] text-[#4ade80]" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-[#6b7280]" />
                      )}
                      <span className={`font-semibold ${
                        !message.read ? "text-[#f3f4f6]" : "text-[#9ca3af]"
                      }`}>
                        {message.name}
                      </span>
                    </div>
                    <span className="text-xs text-[#6b7280]">
                      {formatRelativeTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[#9ca3af] truncate">{message.email}</p>
                  <p className="text-sm text-[#6b7280] mt-1 line-clamp-2">
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
              <div className="bg-[#0b0d10] rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#f3f4f6] mb-2">
                      {selectedMessage.name}
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-[#9ca3af]">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="hover:text-[#4ade80] transition-colors"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2 text-sm text-[#9ca3af]">
                          <Phone className="w-4 h-4" />
                          <a
                            href={`tel:${selectedMessage.phone}`}
                            className="hover:text-[#4ade80] transition-colors"
                          >
                            {selectedMessage.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-[#9ca3af]">
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

                <div className="pt-4 border-t border-[#1f242b]">
                  <h3 className="text-sm font-semibold text-[#9ca3af] mb-3">Message</h3>
                  <p className="text-[#f3f4f6] whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirmId === selectedMessage._id && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-[#f3f4f6] mb-3">
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
                        className="px-4 py-2 bg-[#1a1e24] text-[#f3f4f6] rounded-lg hover:bg-[#1f242b] transition-all"
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
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1e24] text-[#4ade80] rounded-lg hover:bg-[#1f242b] transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1e24] text-[#4ade80] rounded-lg hover:bg-[#1f242b] transition-all"
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
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-[#6b7280] opacity-50" />
                <p className="text-[#9ca3af]">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessagesTab;