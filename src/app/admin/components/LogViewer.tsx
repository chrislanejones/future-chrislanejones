"use client";
import React, { useEffect, useRef } from "react";

interface LogViewerProps {
  logs: string[];
  maxHeight?: string;
  compact?: boolean;
}

export const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  maxHeight = "max-h-64",
  compact = false,
}) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (logs.length === 0) return null;

  if (compact) {
    return (
      <div className={`${maxHeight} overflow-y-auto bg-base rounded-lg p-3`}>
        <div className="space-y-1">
          {logs.map((log, i) => (
            <p
              key={i}
              className="text-xs text-muted font-mono wrap-break-words"
            >
              {log}
            </p>
          ))}
          <div ref={endRef} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${maxHeight} overflow-y-auto bg-base rounded-lg p-4`}>
      <p className="text-sm font-semibold text-muted mb-3">Operation Log</p>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <p key={i} className="text-xs text-muted font-mono wrap-break-words">
            {log}
          </p>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};
