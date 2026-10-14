// src/lib/blog-content.ts
// Post bodies are stored as HTML or Markdown. The server renders them into
// the page (so crawlers and AI tools see the text), the client mounts known
// widgets into that DOM, and the admin preview/editor shows the same output.
// Every path goes through sanitizePostHtml, so stored or pasted HTML can't run
// scripts, event handlers, or javascript: links anywhere on the site.
//
// sanitize-html parses with htmlparser2 and needs no DOM, so the same
// allowlist runs on the server, in the browser, and in Vercel functions
// (jsdom-based sanitizers broke there; see ADR-008).
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

const GLOBAL_ATTRIBUTES = ["class", "title", "lang", "dir", "role", "aria-*", "data-*"];

export const POST_POLICY: sanitizeHtml.IOptions = {
  // Content tags only. Active or layout-hijacking content (script, style,
  // iframe, object, embed, forms, link, meta, base, svg) is never allowed.
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "div", "span",
    "section", "article", "aside", "header", "footer",
    "a", "img", "figure", "figcaption", "picture", "source", "video", "audio", "track",
    "ul", "ol", "li", "dl", "dt", "dd", "blockquote", "pre", "code", "kbd", "samp", "var",
    "em", "strong", "b", "i", "u", "s", "del", "ins", "mark", "sub", "sup", "small",
    "abbr", "cite", "q", "time", "details", "summary",
    "table", "caption", "colgroup", "col", "thead", "tbody", "tfoot", "tr", "th", "td",
  ],
  // No style, no event handlers, and no id/name (they can clobber globals).
  // data-* keeps widget markers like data-stepper.
  allowedAttributes: {
    "*": GLOBAL_ATTRIBUTES,
    a: ["href", "target", "rel"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding"],
    source: ["src", "srcset", "sizes", "type", "media"],
    video: ["src", "poster", "controls", "width", "height", "loop", "muted", "playsinline", "preload"],
    audio: ["src", "controls", "loop", "muted", "preload"],
    track: ["src", "kind", "srclang", "label", "default"],
    ol: ["start", "reversed", "type"],
    li: ["value"],
    th: ["colspan", "rowspan", "scope", "headers"],
    td: ["colspan", "rowspan", "headers"],
    col: ["span"],
    colgroup: ["span"],
    time: ["datetime"],
    details: ["open"],
    blockquote: ["cite"],
    q: ["cite"],
    del: ["cite", "datetime"],
    ins: ["cite", "datetime"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowProtocolRelative: false,
  // Dropped along with everything inside them, not just unwrapped.
  nonTextTags: ["script", "style", "textarea", "option", "noscript", "iframe", "object", "embed", "template", "title", "xmp", "noembed", "noframes", "svg", "math"],
  transformTags: {
    // A link that opens a new tab never gets a handle back to this page.
    a: (tagName, attribs) => {
      if (attribs.target !== "_blank") return { tagName, attribs };
      const rel = new Set((attribs.rel ?? "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      return { tagName, attribs: { ...attribs, rel: [...rel].join(" ") } };
    },
  },
};

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, POST_POLICY);
}

export function renderPostHtml(content: string | undefined): string {
  if (!content) return "";
  const trimmed = content.trim();
  // HTML posts pass through; anything else is Markdown. Marked does not
  // sanitize, so both branches go through the same allowlist.
  const html = /^<[a-z][\s\S]*>/i.test(trimmed) ? trimmed : (marked.parse(trimmed) as string);
  return sanitizePostHtml(html);
}
