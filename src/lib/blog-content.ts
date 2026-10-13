// src/lib/blog-content.ts
// Post bodies are stored as HTML or Markdown. The server renders them into
// the page (so crawlers and AI tools see the text), the client mounts known
// widgets into that DOM, and the admin preview/editor shows the same output.
// Every path goes through sanitizePostHtml, so stored or pasted HTML can't run
// scripts, event handlers, or javascript: links anywhere on the site.
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

const POLICY = {
  USE_PROFILES: { html: true },
  // Active or layout-hijacking content is never allowed in a post body.
  FORBID_TAGS: ["style", "iframe", "frame", "object", "embed", "form", "input", "button", "textarea", "select", "link", "meta", "base"],
  FORBID_ATTR: ["style", "srcdoc", "formaction"],
  // Links may open in a new tab; data-* keeps widget markers like data-stepper.
  ADD_ATTR: ["target", "rel"],
  ALLOW_DATA_ATTR: true,
};

export function sanitizePostHtml(html: string): string {
  return DOMPurify.sanitize(html, POLICY) as string;
}

export function renderPostHtml(content: string | undefined): string {
  if (!content) return "";
  const trimmed = content.trim();
  // HTML posts pass through; anything else is Markdown. Marked does not
  // sanitize, so both branches go through the same allowlist.
  const html = /^<[a-z][\s\S]*>/i.test(trimmed) ? trimmed : (marked.parse(trimmed) as string);
  return sanitizePostHtml(html);
}
