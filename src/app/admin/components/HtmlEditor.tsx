"use client";
import React, { useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Code,
} from "lucide-react";

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const HtmlEditor: React.FC<HtmlEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter content...",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHTML, setIsHTML] = React.useState(false);

  useEffect(() => {
    if (editorRef.current && !isHTML) {
      editorRef.current.innerHTML = value;
    }
  }, []);

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
    if (isHTML && editorRef.current) {
      editorRef.current.innerHTML = value;
    }
    setIsHTML(!isHTML);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-panel">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-base">
        <button
          onClick={() => execCommand("bold")}
          title="Bold"
          className="p-2 hover:bg-surface-hover rounded transition"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCommand("italic")}
          title="Italic"
          className="p-2 hover:bg-surface-hover rounded transition"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCommand("underline")}
          title="Underline"
          className="p-2 hover:bg-surface-hover rounded transition"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="w-px bg-border" />

        <button
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
          className="p-2 hover:bg-surface-hover rounded transition"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
          className="p-2 hover:bg-surface-hover rounded transition"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px bg-border" />

        <button
          onClick={() => execCommand("formatBlock", "h2")}
          title="Heading"
          className="p-2 hover:bg-surface-hover rounded transition"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          onClick={insertLink}
          title="Insert Link"
          className="p-2 hover:bg-surface-hover rounded transition px-3 text-sm"
        >
          Link
        </button>

        <button
          onClick={() => execCommand("formatBlock", "pre")}
          title="Code Block"
          className="p-2 hover:bg-surface-hover rounded transition"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px bg-border" />

        <button
          onClick={toggleHTMLView}
          title="HTML View"
          className={`p-2 rounded transition px-3 text-sm ${
            isHTML ? "bg-accent text-on-accent" : "hover:bg-surface-hover"
          }`}
        >
          HTML
        </button>
      </div>

      {/* Editor */}
      {!isHTML ? (
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
