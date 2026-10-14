"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Download, FileText, Upload } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

type Kind = "pdf" | "docx";

const FORMATS: { kind: Kind; label: string; accept: string }[] = [
  { kind: "pdf", label: "PDF", accept: "application/pdf,.pdf" },
  {
    kind: "docx",
    label: "Word",
    accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
];

const kb = (bytes: number | null) => (bytes ? `${Math.round(bytes / 1024)} KB` : "");
const day = (ms: number) =>
  new Date(ms).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, "-");

// Replaces the live resume files (what /career-and-resume/download/{pdf,docx}
// serves). Each format uploads and publishes on its own; the server checks
// the file type and size before the old file is deleted.
export function ResumeFilesPanel() {
  const status = useQuery(api.resume.getAdminStatus);
  const generateUploadUrl = useMutation(api.resume.generateAdminUploadUrl);
  const publish = useMutation(api.resume.publish);
  const [busy, setBusy] = useState<Kind | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const inputs = useRef<Record<Kind, HTMLInputElement | null>>({ pdf: null, docx: null });

  const upload = async (kind: Kind, file: File) => {
    setBusy(kind);
    setMessage(null);
    try {
      // The server double-checks size and type; this just saves a pointless upload.
      if (!file.name.toLowerCase().endsWith(`.${kind}`)) throw new Error(`Choose a .${kind} file.`);
      const url = await generateUploadUrl();
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const { storageId } = await res.json();
      const result = await publish({ kind, storageId });
      if (result?.error) throw new Error(result.error);
      setMessage({ tone: "ok", text: `${kind.toUpperCase()} resume updated.` });
    } catch (err) {
      const text = err instanceof Error ? err.message : "Upload failed";
      setMessage({ tone: "error", text });
    } finally {
      setBusy(null);
      const input = inputs.current[kind];
      if (input) input.value = "";
    }
  };

  return (
    <section className="bg-(--color-panel) border border-(--color-border) rounded-2xl p-4" aria-labelledby="resume-files-title">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 id="resume-files-title" className="font-semibold text-ink flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" aria-hidden="true" />
          Resume files
        </h3>
        {message && (
          <p role="status" className={`text-sm ${message.tone === "ok" ? "text-(--color-success)" : "text-(--color-danger)"}`}>
            {message.text}
          </p>
        )}
      </div>
      <ul className="grid sm:grid-cols-2 gap-3">
        {FORMATS.map(({ kind, label, accept }) => {
          const live = status?.find((f) => f.kind === kind);
          return (
            <li key={kind} className="flex items-center gap-3 rounded-xl bg-(--color-muted-accent) p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-xs text-muted truncate">
                  {status === undefined
                    ? "Loading..."
                    : live
                      ? `${live.filename} · ${kb(live.size)} · updated ${day(live.updatedAt)}`
                      : "Not uploaded yet"}
                </p>
              </div>
              {live?.url && (
                <Button asChild variant="ghost" size="icon-sm" aria-label={`Download the live ${label} resume`}>
                  <a href={live.url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
              <input
                ref={(el) => {
                  inputs.current[kind] = el;
                }}
                type="file"
                accept={accept}
                className="sr-only"
                id={`resume-${kind}`}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(kind, file);
                }}
              />
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5"
                disabled={busy !== null}
                onClick={() => inputs.current[kind]?.click()}
                aria-label={`Upload a new ${label} resume`}
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                {busy === kind ? "Uploading..." : "Upload"}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
