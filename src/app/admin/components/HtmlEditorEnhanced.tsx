// src/app/admin/components/HtmlEditorEnhanced.tsx
"use client";
import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Code,
  LinkIcon,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageClick?: () => void;
}

export const HtmlEditorEnhanced: React.FC<HtmlEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter content...",
  onImageClick,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtml, setIsHtml] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const toggleHTMLView = () => {
    if (isHtml && editorRef.current) {
      editorRef.current.innerHTML = value;
    }
    setIsHtml(!isHtml);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-panel">
      {/* Toolbar */}
      <div className="border-b border-border p-3 flex flex-wrap gap-1 bg-base">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("bold");
          }}
          className="p-2 hover:bg-surface-hover rounded transition"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("italic");
          }}
          className="p-2 hover:bg-surface-hover rounded transition"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("underline");
          }}
          className="p-2 hover:bg-surface-hover rounded transition"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="border-l border-border mx-1" />

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("insertUnorderedList");
          }}
          className="p-2 hover:bg-surface-hover rounded transition"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("insertOrderedList");
          }}
          className="p-2 hover:bg-surface-hover rounded transition"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="border-l border-border mx-1" />

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("formatBlock", "<h2>");
          }}
          className="p-2 hover:bg-surface-hover rounded transition"
          title="Heading"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("formatBlock", "<pre>");
          }}
          className="p-2 hover:bg-surface-hover rounded transition"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="border-l border-border mx-1" />

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
          className="p-2 hover:bg-surface-hover rounded transition"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {onImageClick && (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onImageClick();
            }}
            className="p-2 hover:bg-surface-hover rounded transition"
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </button>
        )}

        <div className="border-l border-border mx-1" />

        <button
          onClick={toggleHTMLView}
          className="px-3 py-2 hover:bg-surface-hover rounded transition text-xs font-medium"
          title="Toggle HTML View"
        >
          {isHtml ? "Visual" : "HTML"}
        </button>
      </div>

      {/* Editor Area */}
      {!isHtml ? (
        <div
          ref={editorRef}
          onInput={updateContent}
          contentEditable
          className="min-h-64 p-4 focus:outline-none text-ink prose prose-invert max-w-none"
          suppressContentEditableWarning
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-64 p-4 focus:outline-none text-ink bg-panel font-mono text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};
