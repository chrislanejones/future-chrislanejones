// Presentation groups leave the saved links and admin categories intact.
const categoryNames: Record<string, string> = {
  "AI and LLM": "AI & coding agents",
  "Development Tools": "Development & version control",
  "Design & UI Resources": "UI components & motion",
  "Layout & Design Patterns": "Design inspiration & patterns",
  "Icon Libraries": "Icons & SVG",
  "Learning & Tutorials": "Docs & learning",
  "Developer Portfolios": "Portfolio inspiration",
  FOSS: "Open-source apps",
  "Startup & SaaS Intelligence": "Business & SaaS",
};

export const groupOrder = [
  "AI & coding agents",
  "MCP & agent skills",
  "Development & version control",
  "UI components & motion",
  "Design inspiration & patterns",
  "Icons & SVG",
  "Docs & learning",
  "Open-source apps",
  "Portfolio inspiration",
  "Business & SaaS",
  "Games",
];

const siteGroups: Record<string, string> = {
  "augmentcode.com": "AI & coding agents",
  "impeccable.style": "MCP & agent skills",
  "usehallmark.com": "MCP & agent skills",
  "mcpmarket.com": "MCP & agent skills",
  "claudemarketplaces.com": "MCP & agent skills",
  "lawsofux.com": "Design inspiration & patterns",
};

export function getLinkGroup(link: { href: string; category: string }) {
  try {
    const url = new URL(link.href);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "github.com" && url.pathname.replace(/\/$/, "").toLowerCase() === "/truehaiq/awesome-mcp") {
      return "MCP & agent skills";
    }
    if (host === "github.com" && url.pathname.replace(/\/$/, "") === "/aulianza/aulianza.id") {
      return "Portfolio inspiration";
    }
    if (siteGroups[host]) return siteGroups[host];
  } catch {
    // Keep legacy links visible even if their URL needs attention in the admin.
  }
  return categoryNames[link.category] ?? link.category;
}

export function compareGroups(a: string, b: string) {
  const rank = (name: string) => {
    const index = groupOrder.indexOf(name);
    return index < 0 ? groupOrder.length : index;
  };
  return rank(a) - rank(b) || a.localeCompare(b);
}
