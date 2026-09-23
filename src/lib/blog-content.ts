// src/lib/blog-content.ts
// Post bodies are stored as HTML or Markdown. The server renders them into
// the page (so crawlers and AI tools see the text), and the client component
// then mounts widgets into that same DOM. Both sides use this one function.
import { marked } from "marked";

export function renderPostHtml(content: string | undefined): string {
  if (!content) return "";
  const trimmed = content.trim();
  // If content looks like HTML, pass through; otherwise treat as Markdown.
  if (/^<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return marked.parse(trimmed) as string;
}

// Scripts can't run from server-rendered HTML anyway, and the client runs any
// legacy inline scripts itself, so the server copy drops them.
export function stripScripts(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}
