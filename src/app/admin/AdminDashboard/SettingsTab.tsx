"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Database,
  FileText,
  Link as LinkIcon,
  Calendar,
  MessageSquare,
  Heart,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface DataSource {
  id: string;
  label: string;
  icon: LucideIcon;
  mutation: ReturnType<typeof useMutation>;
}

interface LogEntry {
  timestamp: Date;
  message: string;
  type: "info" | "success" | "error";
}

const SettingsTab = () => {
  const seedSEO = useMutation(api.seo.seedSEOData);
  const seedLinks = useMutation(api.browserLinks.seedLinks);
  const seedTimeline = useMutation(api.careerTimeline.seedTimeline);
  const seedBlogPosts = useMutation(api.blogPosts.seedBlogPosts);

  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [isReseeding, setIsReseeding] = useState(false);
  const [reseedStatus, setReseedStatus] = useState<"success" | "error" | null>(null);
  const [reseedMessage, setReseedMessage] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: "info" | "success" | "error" = "info") => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date(),
        message,
        type,
      },
    ]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const showToastNotification = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const dataSources: DataSource[] = [
    {
      id: "seo",
      label: "SEO Manager",
      icon: FileText,
      mutation: seedSEO,
    },
    {
      id: "links",
      label: "Links",
      icon: LinkIcon,
      mutation: seedLinks,
    },
    {
      id: "career-timeline",
      label: "Career Timeline",
      icon: Calendar,
      mutation: seedTimeline,
    },
    {
      id: "blog-posts",
      label: "Blog Posts",
      icon: MessageSquare,
      mutation: seedBlogPosts,
    },
  ];

  const toggleSource = (id: string) => {
    const newSelected = new Set(selectedSources);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSources(newSelected);
  };

  const selectAll = () => {
    setSelectedSources(new Set(dataSources.map((s) => s.id)));
  };

  const deselectAll = () => {
    setSelectedSources(new Set());
  };

  const handleReseed = async () => {
    if (selectedSources.size === 0) {
      showToastNotification("Please select at least one data source to reseed", "error");
      addLog("Reseed aborted: No data sources selected", "error");
      return;
    }

    setIsReseeding(true);
    setReseedStatus(null);
    addLog(`Starting reseed for ${selectedSources.size} data source(s)...`, "info");

    let successCount = 0;
    let errorCount = 0;

    try {
      for (const source of dataSources) {
        if (selectedSources.has(source.id)) {
          addLog(`Reseeding ${source.label}...`, "info");
          try {
            const result = await source.mutation();
            addLog(`✓ ${source.label}: ${result || "Success"}`, "success");
            successCount++;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed";
            addLog(`✗ ${source.label}: ${errorMsg}`, "error");
            errorCount++;
          }
        }
      }

      const summary = `Reseed complete: ${successCount} succeeded, ${errorCount} failed`;
      addLog(summary, errorCount === 0 ? "success" : "error");

      if (errorCount === 0) {
        showToastNotification("All data sources reseeded successfully!", "success");
      } else {
        showToastNotification(`Reseed completed with ${errorCount} error(s)`, "error");
      }

      setTimeout(() => {
        setSelectedSources(new Set());
      }, 2000);
    } catch (error) {
      const errorMsg = "Unexpected error during reseed";
      addLog(errorMsg, "error");
      showToastNotification(errorMsg, "error");
      console.error("Reseed error:", error);
    } finally {
      setIsReseeding(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-4 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-2 ${
              toastType === "success"
                ? "bg-[#4ade80] text-[#0b0d10] border-[#22c55e]"
                : "bg-red-500 text-white border-red-600"
            }`}
          >
            {toastType === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#111418] border border-[#1f242b] rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#4ade80]/10 rounded-lg">
            <Database className="w-5 h-5 text-[#4ade80]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#f3f4f6]">Data Management</h2>
            <p className="text-sm text-[#9ca3af]">Reseed initial data for selected modules</p>
          </div>
        </div>
      </div>

      {/* Data Sources Selection */}
      <div className="bg-[#111418] border border-[#1f242b] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#f3f4f6] font-semibold text-sm">Select Data Sources</h3>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-2 py-1 text-xs bg-[#1a1e24] text-[#f3f4f6] rounded hover:bg-[#1f242b] transition-colors"
            >
              All
            </button>
            <button
              onClick={deselectAll}
              className="px-2 py-1 text-xs bg-[#1a1e24] text-[#f3f4f6] rounded hover:bg-[#1f242b] transition-colors"
            >
              None
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {dataSources.map((source) => {
            const Icon = source.icon;
            const isSelected = selectedSources.has(source.id);

            return (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "bg-[#4ade80]/10 border-[#4ade80]"
                    : "bg-[#0b0d10] border-[#1f242b] hover:border-[#4ade80]/50"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-[#4ade80] border-[#4ade80]"
                      : "bg-transparent border-[#1f242b]"
                  }`}
                >
                  {isSelected && <CheckCircle className="w-3 h-3 text-[#0b0d10]" />}
                </div>
                <Icon className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
                <span className="text-[#f3f4f6] font-medium text-sm">{source.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reseed Action */}
      <div className="bg-[#111418] border border-[#1f242b] rounded-2xl p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-[#9ca3af] text-xs">
              Reseeding adds initial data if tables are empty. Some operations may skip if data exists.
            </p>
          </div>

          <button
            onClick={handleReseed}
            disabled={isReseeding || selectedSources.size === 0}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
              isReseeding || selectedSources.size === 0
                ? "bg-[#1a1e24] text-[#6b7280] cursor-not-allowed"
                : "bg-[#4ade80] text-[#0b0d10] hover:bg-[#22c55e]"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isReseeding ? "animate-spin" : ""}`} />
            {isReseeding
              ? "Reseeding Data..."
              : selectedSources.size === 0
              ? "Select Data Sources"
              : `Reseed ${selectedSources.size} Source${selectedSources.size > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>

      {/* Log Window */}
      <div className="bg-[#111418] border border-[#1f242b] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-[#4ade80]" />
          <h3 className="text-[#f3f4f6] font-semibold text-sm">Activity Log</h3>
          {logs.length > 0 && (
            <button
              onClick={() => setLogs([])}
              className="ml-auto text-xs text-[#9ca3af] hover:text-[#f3f4f6] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="bg-[#0b0d10] rounded-lg p-3 h-48 overflow-y-auto font-mono text-xs border border-[#1f242b]">
          {logs.length === 0 ? (
            <p className="text-[#6b7280] text-center py-6 text-xs">
              No activity yet. Select sources and click Reseed.
            </p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${
                    log.type === "success"
                      ? "text-[#4ade80]"
                      : log.type === "error"
                      ? "text-red-500"
                      : "text-[#9ca3af]"
                  }`}
                >
                  <span className="text-[#6b7280] flex-shrink-0 text-[10px]">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>
                  <span className="flex-1">{log.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
