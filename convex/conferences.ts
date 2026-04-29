import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("conferences").collect();
    return rows.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      const aDate = a.dateStart ?? "";
      const bDate = b.dateStart ?? "";
      return bDate.localeCompare(aDate);
    });
  },
});

async function syncLogoToMedia(
  ctx: { db: import("./_generated/server").DatabaseWriter },
  logo: string,
  label: string,
  altText: string,
) {
  const existing = await ctx.db
    .query("media")
    .filter((q) => q.eq(q.field("url"), logo))
    .first();
  if (!existing) {
    await ctx.db.insert("media", {
      url: logo,
      filename: label,
      altText,
      uploadedAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
}

export const create = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    year: v.number(),
    dateStart: v.optional(v.string()),
    dateEnd: v.optional(v.string()),
    city: v.optional(v.string()),
    venue: v.optional(v.string()),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    logo: v.optional(v.string()),
    logoAlt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.logo) {
      await syncLogoToMedia(
        ctx,
        args.logo,
        `${args.name} ${args.year} logo`,
        args.logoAlt ?? `${args.name} logo`,
      );
    }
    return ctx.db.insert("conferences", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("conferences"),
    slug: v.optional(v.string()),
    name: v.optional(v.string()),
    year: v.optional(v.number()),
    dateStart: v.optional(v.string()),
    dateEnd: v.optional(v.string()),
    city: v.optional(v.string()),
    venue: v.optional(v.string()),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    logo: v.optional(v.string()),
    logoAlt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    if (args.logo) {
      const conf = await ctx.db.get(id);
      const label = `${args.name ?? conf?.name ?? "Conference"} ${args.year ?? conf?.year ?? ""} logo`.trim();
      await syncLogoToMedia(ctx, args.logo, label, args.logoAlt ?? `${label}`);
    }
    return ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const deleteConference = mutation({
  args: { id: v.id("conferences") },
  handler: async (ctx, args) => {
    return ctx.db.delete(args.id);
  },
});

export const seedConferences = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("conferences").collect();
    if (existing.length > 0) {
      // Sync any existing conference logos that are missing from the media table
      for (const conf of existing) {
        if (conf.logo) {
          await syncLogoToMedia(
            ctx,
            conf.logo,
            `${conf.name} ${conf.year} logo`,
            conf.logoAlt ?? `${conf.name} logo`,
          );
        }
      }
      return { success: true, message: "Conferences already seeded — logos synced to media" };
    }

    const seed = [
      {
        slug: "all-things-open-2025",
        name: "All Things Open",
        year: 2025,
        dateStart: "2025-10-26",
        dateEnd: "2025-10-28",
        city: "Raleigh, NC",
        venue: "Raleigh Convention Center",
        url: "https://2025.allthingsopen.org/",
        tags: ["Open Source", "Cloud", "AI/ML", "DevOps"],
        logo: "/conferences/All-Things-Open-2025.webp",
        description:
          "All Things Open 2025 brings thousands of engineers, maintainers, and tech leaders to downtown Raleigh for three days of open source talks, hands-on sessions, and community meetups at the Raleigh Convention Center.",
      },
      {
        slug: "epic-web-conf-2025",
        name: "Epic Web Conf",
        year: 2025,
        dateStart: "2025-03-26",
        city: "Salt Lake City, UT",
        venue: "Hilton Salt Lake City Center",
        url: "https://www.epicweb.dev/conf",
        tags: ["Full-stack Web", "React", "Testing", "DX"],
        logo: "/conferences/Epic-Web-Logo-2025.webp",
        description:
          "Epic Web Conf is a curated full-stack conference founded by Kent C. Dodds' EpicWeb.dev, bringing together framework authors, library maintainers, and working engineers to discuss building great UX and great DX. The 2025 edition took place in downtown Salt Lake City with a free livestream and hands-on workshops.",
      },
      {
        slug: "all-things-open-ai-2025",
        name: "All Things Open.AI",
        year: 2025,
        dateStart: "2025-03-17",
        dateEnd: "2025-03-18",
        city: "Durham, NC",
        venue: "Carolina Theatre",
        url: "https://allthingsai.org/",
        tags: ["AI/ML", "Open Source", "MLOps", "Safety"],
        logo: "/conferences/All-Things-Open-AI-2025.webp",
        description:
          "All Things Open.AI is a practitioner-focused spinoff from the All Things Open team, created to explore the real-world impact of AI across tooling, platforms, and organizations. The inaugural 2025 event ran two days at the Carolina Theatre in Durham.",
      },
      {
        slug: "all-things-open-2024",
        name: "All Things Open",
        year: 2024,
        dateStart: "2024-10-27",
        dateEnd: "2024-10-29",
        city: "Raleigh, NC",
        venue: "Raleigh Convention Center",
        url: "https://2024.allthingsopen.org/",
        tags: ["Open Source", "Cloud", "AI/ML", "DevOps"],
        logo: "/conferences/All-Things-Open-2024-Smaller.png",
        description:
          "All Things Open 2024 brought thousands of engineers, maintainers, and tech leaders to downtown Raleigh for three days of open source talks, hands-on sessions, and community meetups at the Raleigh Convention Center.",
      },
      {
        slug: "tech-coast-conference-2024",
        name: "Tech Coast Conference",
        year: 2024,
        dateStart: "2024-08-29",
        city: "Jacksonville, FL",
        venue: "UNF Adam W. Herbert University Center",
        url: "https://techcoastconference.com/",
        tags: ["IT Leadership", "Cybersecurity", "Cloud", "Data"],
        logo: "/conferences/Tech-Coast-Conference-2024.webp",
        description:
          "Jacksonville's flagship tech event featuring regional IT leaders, security practitioners, cloud experts, and vendors across a one-day multi-track program hosted at UNF.",
      },
      {
        slug: "that-conference-wi-2024",
        name: "THAT Conference (WI)",
        year: 2024,
        dateStart: "2024-07-29",
        dateEnd: "2024-08-01",
        city: "Wisconsin Dells, WI",
        venue: "Kalahari Resorts & Conventions",
        url: "https://thatconference.com/wi/2024/",
        tags: ["Full-stack", "Community", "Career"],
        logo: "/conferences/That-Conference-Logo-LowRes.png",
        description:
          "Camp-style, family-friendly developer conference in the Wisconsin Dells, known for deep-dive technical talks alongside community and family activities.",
      },
      {
        slug: "renderatl-2024",
        name: "RenderATL",
        year: 2024,
        city: "Atlanta, GA",
        url: "https://www.renderatl.com/",
        tags: ["Frontend", "AI", "Cloud", "Leadership"],
        logo: "/conferences/RenderATL-2024-Logo-Green.png",
        description:
          "A multi-day tech conference and expo in Atlanta covering frontend frameworks, AI, and leadership, with workshops, career programming, and a large sponsor hall.",
      },
      {
        slug: "rvajs-2023",
        name: "RVA JavaScript Conference",
        year: 2023,
        dateStart: "2023-11-17",
        city: "Richmond, VA",
        venue: "Science Museum of Virginia",
        url: "https://rvajavascript.com/",
        tags: ["JavaScript", "TypeScript", "Node.js", "React"],
        logo: "/conferences/RVAJS-Conf-Richmond-2023.webp",
        description:
          "A one-day JavaScript conference hosted by rvatech/ with talks spanning TypeScript, Node, React, tooling, and architecture.",
      },
      {
        slug: "wordcamp-us-2023",
        name: "WordCamp US",
        year: 2023,
        dateStart: "2023-08-24",
        dateEnd: "2023-08-26",
        city: "National Harbor, MD",
        venue: "Gaylord National Resort & Convention Center",
        url: "https://us.wordcamp.org/2023/",
        tags: ["WordPress", "Open Source", "Community"],
        logo: "/conferences/WordCamp-US-2023.webp",
        description:
          "The flagship U.S. WordPress conference with Contributor Day, multi-track sessions, and an active sponsor hall at the Gaylord National in National Harbor.",
      },
      {
        slug: "tech-coast-conference-2020",
        name: "Tech Coast Conference",
        year: 2020,
        dateStart: "2020-08-19",
        city: "Jacksonville, FL (Virtual)",
        url: "https://techcoastconference.com/",
        tags: ["IT Leadership", "Security", "Cloud"],
        logo: "/conferences/Tech-Coast-Conference-2020.webp",
        description:
          "The 2020 edition pivoted online, delivering talks and panels focused on security, cloud, and regional tech growth in a virtual format.",
      },
      {
        slug: "tech-coast-conference-2018",
        name: "Tech Coast Conference",
        year: 2018,
        city: "Jacksonville, FL",
        venue: "UNF Adam W. Herbert University Center",
        url: "https://techcoastconference.com/",
        tags: ["IT", "Security", "Data"],
        logo: "/conferences/Tech-Coast-Conference-2018.webp",
        description:
          "An early TCC edition hosted at UNF, gathering local technologists and businesses to discuss trends in security, data, and enterprise IT.",
      },
      {
        slug: "wordcamp-jacksonville-2018",
        name: "WordCamp Jacksonville",
        year: 2018,
        dateStart: "2018-04-07",
        dateEnd: "2018-04-08",
        city: "Jacksonville, FL",
        venue: "Keiser University",
        url: "https://jacksonville.wordcamp.org/2018/",
        tags: ["WordPress", "Community"],
        logo: "/conferences/Jacksonville-WordCamp-2018.webp",
        description:
          "Two-day WordCamp with multi-track sessions and a KidsCamp, hosted at Keiser University and focused on practical WordPress skills.",
      },
      {
        slug: "wordcamp-jacksonville-2017",
        name: "WordCamp Jacksonville",
        year: 2017,
        dateStart: "2017-05-20",
        dateEnd: "2017-05-21",
        city: "Jacksonville, FL",
        venue: "Keiser University",
        url: "https://jacksonville.wordcamp.org/2017/",
        tags: ["WordPress", "Community"],
        logo: "/conferences/WordCamp-Jackonville-2017.webp",
        description:
          "Jacksonville's second annual WordCamp, featuring business, user, and developer tracks, plus KidsCamp and community networking.",
      },
      {
        slug: "wordcamp-asheville-2017",
        name: "WordCamp Asheville",
        year: 2017,
        dateStart: "2017-06-02",
        dateEnd: "2017-06-04",
        city: "Asheville, NC",
        venue: "Mission Health / A-B Tech Conference Center",
        url: "https://asheville.wordcamp.org/2017/",
        tags: ["WordPress", "Community"],
        logo: "/conferences/WordCamp-Asheville-2017.webp",
        description:
          "Regional WordCamp covering WordPress development, content, and design, held at the A-B Tech campus conference center.",
      },
      {
        slug: "echo-conference-2013",
        name: "Echo Conference",
        year: 2013,
        dateStart: "2013-07-24",
        dateEnd: "2013-07-26",
        city: "Dallas, TX",
        venue: "Watermark Community Church",
        url: "https://churchm.ag/echo-conference-2013-design/",
        tags: ["Church Media", "Creative Tech"],
        logo: "/conferences/Echohub-Media-Conference-Dallas-2013.webp",
        description:
          "A church media/creative conference for artists, geeks, and storytellers, hosted at Watermark Community Church in Dallas.",
      },
    ];

    for (const item of seed) {
      await ctx.db.insert("conferences", {
        ...item,
        logoAlt: `${item.name} logo`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      if (item.logo) {
        await syncLogoToMedia(
          ctx,
          item.logo,
          `${item.name} ${item.year} logo`,
          `${item.name} logo`,
        );
      }
    }

    return { success: true, inserted: seed.length };
  },
});
