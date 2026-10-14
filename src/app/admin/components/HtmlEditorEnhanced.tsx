// src/app/admin/components/HtmlEditorEnhanced.tsx
"use client";
import { sanitizePostHtml } from "@/lib/blog-content";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Code,
  LinkIcon,
  Image as ImageIcon,
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
  // Markdown posts open in source view: the visual editor would wrap every
  // keystroke in <div>/<br> and quietly turn the Markdown into broken HTML.
  const [isHtml, setIsHtml] = useState(
    () => value.trim() !== "" && !/^<[a-z]/i.test(value.trim()),
  );

  // Load the post into the visual editor. Without this it opened EMPTY, and
  // the first keystroke saved only what was typed, wiping the post. Skipped
  // when the DOM already matches, so typing never resets the caret.
  useLayoutEffect(() => {
    const el = editorRef.current;
    if (isHtml || !el) return;
    const safe = sanitizePostHtml(value);
    if (el.innerHTML !== safe) el.innerHTML = safe;
  }, [value, isHtml]);

  // Pasted HTML goes through the same allowlist as published posts.
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const html = event.clipboardData.getData("text/html");
    if (!html) return;
    event.preventDefault();
    document.execCommand("insertHTML", false, sanitizePostHtml(html));
    updateContent();
  };

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

  const toggleHTMLView = () => setIsHtml(!isHtml);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-panel">
      {/* Toolbar */}
      <div className="border-b border-border p-3 flex flex-wrap gap-1 bg-base">
        <Button
          variant="ghost"
          size="icon-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("bold");
          }}
          aria-label="Bold"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("italic");
          }}
          aria-label="Italic"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("underline");
          }}
          aria-label="Underline"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="border-l border-border mx-1" />

        <Button
          variant="ghost"
          size="icon-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("insertUnorderedList");
          }}
          aria-label="Bullet List"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("insertOrderedList");
          }}
          aria-label="Numbered List"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="border-l border-border mx-1" />

        <Button
          variant="ghost"
          size="icon-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("formatBlock", "<h2>");
          }}
          aria-label="Heading"
          title="Heading"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("formatBlock", "<pre>");
          }}
          aria-label="Code Block"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </Button>

        <div className="border-l border-border mx-1" />

        <Button
          variant="ghost"
          size="icon-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
          aria-label="Insert Link"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        {onImageClick && (
          <Button
            variant="ghost"
            size="icon-sm"
            onMouseDown={(e) => {
              e.preventDefault();
              onImageClick();
            }}
            aria-label="Insert Image"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" aria-hidden="true" />
          </Button>
        )}

        <div className="border-l border-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleHTMLView}
          className="px-3 text-xs font-medium"
          title="Toggle HTML View"
        >
          {isHtml ? "Visual" : "HTML"}
        </Button>
      </div>

      {/* Editor Area */}
      {!isHtml ? (
        <div
          ref={editorRef}
          onInput={updateContent}
          onPaste={handlePaste}
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
