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
  Terminal,
  Navigation,
  type LucideIcon,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface DataSource {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface LogEntry {
  timestamp: Date;
  message: string;
  type: "info" | "success" | "error";
}

const SettingsTabEnhanced = () => {
  // Mutations - stored separately, not in the dataSources array
  const seedSEO = useMutation(api.seo.seedSEOData);
  const seedLinks = useMutation(api.browserLinks.seedLinks);
  const seedTimeline = useMutation(api.careerTimeline.seedTimeline);
  const seedBlogPosts = useMutation(api.blogPosts.seedBlogPosts);
  const seedNavigation = useMutation(api.navigation.seedNavigationData);

  // Mutation map for easy lookup
  const mutationMap: Record<string, () => Promise<unknown>> = {
    seo: seedSEO,
    links: seedLinks,
    "career-timeline": seedTimeline,
    "blog-posts": seedBlogPosts,
    navigation: seedNavigation,
  };

  const [selectedSources, setSelectedSources] = useState<Set<string>>(
    new Set()
  );
  const [isReseeding, setIsReseeding] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (
    message: string,
    type: "info" | "success" | "error" = "info"
  ) => {
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

  const showToastNotification = (
    message: string,
    type: "success" | "error"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Data sources metadata only
  const dataSources: DataSource[] = [
    {
      id: "seo",
      label: "SEO Metadata",
      icon: FileText,
      description: "Page titles, descriptions, and canonical URLs",
    },
    {
      id: "links",
      label: "Browser Links",
      icon: LinkIcon,
      description: "Bookmark collections and categories",
    },
    {
      id: "career-timeline",
      label: "Career Timeline",
      icon: Calendar,
      description: "Professional history and milestones",
    },
    {
      id: "blog-posts",
      label: "Blog Posts",
      icon: MessageSquare,
      description: "Sample blog content and articles",
    },
    {
      id: "navigation",
      label: "Navigation",
      icon: Navigation,
      description: "Header and footer menu items",
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

  const formatResult = (result: unknown): string => {
    if (typeof result === "string") {
      return result;
    }
    if (result && typeof result === "object") {
      const obj = result as Record<string, unknown>;
      if ("message" in obj) {
        return String(obj.message);
      }
      if ("success" in obj) {
        const parts: string[] = [];
        if ("inserted" in obj) parts.push(`${obj.inserted} inserted`);
        if ("updated" in obj) parts.push(`${obj.updated} updated`);
        if ("total" in obj) parts.push(`${obj.total} total`);
        return parts.length > 0 ? parts.join(", ") : "Success";
      }
      if ("count" in obj) {
        return `${obj.count} records processed`;
      }
    }
    return "Completed";
  };

  const handleReseed = async () => {
    if (selectedSources.size === 0) {
      showToastNotification(
        "Please select at least one data source to reseed",
        "error"
      );
      addLog("Reseed aborted: No data sources selected", "error");
      return;
    }

    setIsReseeding(true);
    addLog(
      `Starting reseed for ${selectedSources.size} data source(s)...`,
      "info"
    );

    let successCount = 0;
    let errorCount = 0;

    try {
      for (const source of dataSources) {
        if (selectedSources.has(source.id)) {
          addLog(`Reseeding ${source.label}...`, "info");
          try {
            const mutation = mutationMap[source.id];
            if (mutation) {
              const result = await mutation();
              addLog(`✓ ${source.label}: ${formatResult(result)}`, "success");
              successCount++;
            } else {
              addLog(`✗ ${source.label}: No mutation found`, "error");
              errorCount++;
            }
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
        showToastNotification(
          "All data sources reseeded successfully!",
          "success"
        );
      } else {
        showToastNotification(
          `Reseed completed with ${errorCount} error(s)`,
          "error"
        );
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

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-4xl space-y-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            toastType === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {toastType === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-panel border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Database className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">Data Management</h2>
            <p className="text-sm text-muted">
              Reseed initial data for selected modules
            </p>
          </div>
        </div>
      </div>

      {/* Data Sources Selection */}
      <div className="bg-panel border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-ink font-semibold">Select Data Sources</h3>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 text-sm text-accent hover:bg-accent/10 rounded-lg transition"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="px-3 py-1 text-sm text-muted hover:bg-muted/10 rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dataSources.map((source) => {
            const Icon = source.icon;
            const isSelected = selectedSources.has(source.id);

            return (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                disabled={isReseeding}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
                  isSelected
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50 hover:bg-base"
                } ${isReseeding ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? "bg-accent/20" : "bg-base"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? "text-accent" : "text-muted"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${
                      isSelected ? "text-accent" : "text-ink"
                    }`}
                  >
                    {source.label}
                  </p>
                  <p className="text-sm text-muted truncate">
                    {source.description}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-accent bg-accent" : "border-muted"
                  }`}
                >
                  {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-panel border border-border rounded-2xl p-6">
        <div className="space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Reseeding adds initial data if tables are empty. Some operations
              may skip if data already exists.
            </p>
          </div>

          {/* Reseed Button */}
          <button
            onClick={handleReseed}
            disabled={isReseeding || selectedSources.size === 0}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
              isReseeding || selectedSources.size === 0
                ? "bg-base text-muted cursor-not-allowed"
                : "bg-accent text-on-accent hover:shadow-glow"
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${isReseeding ? "animate-spin" : ""}`}
            />
            {isReseeding
              ? "Reseeding Data..."
              : selectedSources.size === 0
                ? "Select Data Sources"
                : `Reseed ${selectedSources.size} Source${selectedSources.size > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>

      {/* Log Panel */}
      {logs.length > 0 && (
        <div className="bg-panel border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted" />
              <h3 className="text-ink font-semibold">Operation Log</h3>
            </div>
            <button
              onClick={clearLogs}
              className="text-sm text-muted hover:text-ink transition"
            >
              Clear
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto bg-base rounded-lg p-4 font-mono text-sm space-y-1">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  log.type === "success"
                    ? "text-green-500"
                    : log.type === "error"
                      ? "text-red-500"
                      : "text-muted"
                }`}
              >
                <span className="text-muted/50 shrink-0">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <span className="break-all">{log.message}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTabEnhanced;
