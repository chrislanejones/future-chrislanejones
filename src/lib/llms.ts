// src/lib/llms.ts
// Builds /llms.txt (a map of the site for AI tools, per llmstxt.org) and
// /llms-full.txt (the same plus every blog post's full text). Blog bodies are
// client-rendered, so crawlers that skip JavaScript only find them here.
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { PERSON, SITE_URL } from "./structured-data";

const PAGES: [path: string, title: string, note: string][] = [
  ["/about", "About", "Background, from video production to web engineering, plus hiking and community work"],
  ["/career-and-resume", "Career & Resume", "Work history, skills, and a downloadable resume"],
  ["/projects", "Projects", "Apps, tools, and client websites"],
  ["/blog", "Blog", "Posts on React, Rust/WebAssembly, Convex, and web engineering"],
  ["/conferences", "Conferences", "Notes from web and open-source conferences attended since 2013"],
  ["/react-maintenance", "React Maintenance", "Monthly React/Next.js maintenance and support plan"],
  ["/wordpress-maintenance", "WordPress Maintenance", "Monthly WordPress maintenance plan"],
  ["/contact", "Contact", "Contact form for project and consulting inquiries"],
  ["/link-page", "Links", "All social and profile links"],
  ["/browser-tabs", "Browser Tabs", "Curated dev resources and tools"],
  ["/admin-showcase", "Admin Showcase", "Tour of the custom Next.js + Convex admin that runs this site"],
  ["/site-history", "Site History", "How this site changed from 2007 WordPress to Next.js"],
  ["/logo-page", "About the Logo", "The story behind the mountain logo"],
];

type Post = { title: string; slug: string; excerpt: string; content: string; createdAt: number; tags?: string[] };

async function load() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const [posts, projects, conferences] = await Promise.all([
    convex.query(api.blogPosts.getAllPosts, {}).catch(() => []),
    convex.query(api.projects.getAll, {}).catch(() => []),
    convex.query(api.conferences.getAll, {}).catch(() => []),
  ]);
  return { posts: posts as Post[], projects, conferences };
}

const day = (ms: number) => new Date(ms).toISOString().slice(0, 10);

function header(): string {
  const { city, region } = PERSON.location;
  return [
    `# ${PERSON.name}`,
    "",
    `> ${PERSON.headline}. Based in ${city}, ${region}.`,
    "",
    `${PERSON.description} This site is his portfolio, blog, and services page.`,
    "",
    `Profiles: ${PERSON.sameAs.join(", ")}`,
  ].join("\n");
}

export async function buildLlmsTxt(full: boolean): Promise<string> {
  const { posts, projects, conferences } = await load();
  const out: string[] = [header(), "", "## Pages", ""];
  for (const [path, title, note] of PAGES) out.push(`- [${title}](${SITE_URL}${path}): ${note}`);

  out.push("", "## Blog posts", "");
  for (const p of posts) out.push(`- [${p.title}](${SITE_URL}/blog/${p.slug}) (${day(p.createdAt)}): ${p.excerpt}`);

  out.push("", "## Projects", "");
  for (const p of projects) {
    const link = p.customUrl || p.vercelUrl || p.githubUrl || p.codebergUrl || `${SITE_URL}/projects`;
    out.push(`- [${p.title}](${link}): ${p.description}`);
  }

  out.push("", "## Optional", "");
  for (const c of [...conferences].sort((a, b) => b.year - a.year)) {
    out.push(`- [${c.name} ${c.year}](${SITE_URL}/conferences/${c.year}/${c.slug})`);
  }
  if (!full) out.push(`- [Full text of every blog post](${SITE_URL}/llms-full.txt)`);

  if (full) {
    for (const p of posts) {
      out.push("", "---", "", `## ${p.title}`, "", `URL: ${SITE_URL}/blog/${p.slug}`, `Published: ${day(p.createdAt)}`);
      if (p.tags?.length) out.push(`Tags: ${p.tags.join(", ")}`);
      out.push("", htmlToText(p.content));
    }
  }
  return out.join("\n") + "\n";
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };

// Post bodies are admin-authored HTML. Turn them into readable markdown-ish
// text: headings, list items, paragraphs, code blocks. Widgets and scripts go.
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|svg|button|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => `\n\`\`\`\n${code.replace(/<[^>]+>/g, "")}\n\`\`\`\n`)
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n\n${"#".repeat(Math.min(Number(n) + 2, 6))} ${t}\n\n`)
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|ul|ol|blockquote|table|tr)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === "#") {
        const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isNaN(n) ? m : String.fromCodePoint(n);
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
