import { describe, expect, test } from "vitest";
import { projectAddress, projectHref, projectOutboundLinks, projectSlug } from "./projects";

// Titles as stored in Convex on 10-14-2026.
const TITLES = [
  "Image Horse",
  "PGA Golf Game",
  "Web Crawler (Golang)",
  "Alembic - AI Marketing Analytics Platform",
  "VITA Major IT Projects Dashboard",
  "Job Listing Plugin for WordPress with Elementor Theme",
  "Image Horse - Marketing Website",
  "Wheelock Communities - Real Estate Development",
];

describe("projectSlug", () => {
  test("lowercases, dashes, and drops punctuation", () => {
    expect(projectSlug("Web Crawler (Golang)")).toBe("web-crawler-golang");
    expect(projectSlug("Alembic - AI Marketing Analytics Platform")).toBe(
      "alembic-ai-marketing-analytics-platform",
    );
    expect(projectSlug("Image Horse: Multi Image Annotator")).toBe("image-horse-multi-image-annotator");
    expect(projectSlug("  Café & Bar  ")).toBe("cafe-and-bar");
  });

  test("gives every current project a unique slug", () => {
    const slugs = TITLES.map(projectSlug);
    expect(new Set(slugs).size).toBe(TITLES.length);
    expect(slugs.every((slug) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))).toBe(true);
  });

  test("builds the detail URL", () => {
    expect(projectHref({ title: "PGA Golf Game" })).toBe("/projects/pga-golf-game");
  });
});

describe("projectOutboundLinks", () => {
  test("uses the live site, then GitHub and Codeberg, skipping blanks", () => {
    const links = projectOutboundLinks({
      title: "PGA Golf Game",
      description: "",
      githubUrl: "https://github.com/chrislanejones/pga",
      codebergUrl: "#",
      vercelUrl: "https://pga-golf-game.vercel.app/",
    });
    expect(links.map((link) => link.key)).toEqual(["site", "github"]);
    expect(links[0].href).toBe("https://pga-golf-game.vercel.app/");
  });

  test("sends the Image Horse app to its editor domain", () => {
    const project = {
      title: "Image Horse",
      description: "",
      githubUrl: "https://github.com/chrislanejones/image-horse",
      codebergUrl: "https://codeberg.org/chrislanejones/image-horse",
    };
    expect(projectOutboundLinks(project).map((link) => link.key)).toEqual(["site", "github", "codeberg"]);
    expect(projectOutboundLinks(project)[0].href).toBe("https://edit.imagehorse.app/");
    expect(projectAddress(project)).toBe("edit.imagehorse.app");
  });

  test("falls back to the repository host for the address bar", () => {
    expect(
      projectAddress({ title: "Web Crawler (Golang)", description: "", githubUrl: "https://github.com/chrislanejones/crawler" }),
    ).toBe("github.com/chrislanejones/crawler");
  });
});
