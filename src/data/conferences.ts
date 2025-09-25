// data/conferences.ts
export type Conference = {
  slug: string;
  name: string;
  year: number;
  dates?: { start: string; end?: string }; // ISO (YYYY-MM-DD)
  city?: string;
  venue?: string;
  url?: string;
  topics?: string[];
  summary?: string; // short blurb (MD/Plain)
  talkLinks?: { label: string; url: string }[];
  coverImage?: string; // path under /public
};

export const conferences: Conference[] = [
  {
    slug: "all-things-open-2024",
    name: "All Things Open",
    year: 2024,
    dates: { start: "2024-10-27", end: "2024-10-29" },
    city: "Raleigh, NC",
    venue: "Raleigh Convention Center",
    url: "https://2024.allthingsopen.org/",
    topics: ["Open Source", "Cloud", "AI/ML", "DevOps"],
    coverImage: "/conferences/All-Things-Open-2024-Smaller.png",
    summary:
      "All Things Open 2024 brought thousands of engineers, maintainers, and tech leaders to downtown Raleigh for three days of open source talks, hands-on sessions, and community meetups at the Raleigh Convention Center.",
  },
  {
    slug: "tech-coast-conference-2024",
    name: "Tech Coast Conference",
    year: 2024,
    dates: { start: "2024-08-29" },
    city: "Jacksonville, FL",
    venue: "UNF Adam W. Herbert University Center",
    url: "https://techcoastconference.com/",
    topics: ["IT Leadership", "Cybersecurity", "Cloud", "Data"],
    coverImage: "/conferences/Tech-Coast-Conference-2024.webp",
    summary:
      "Jacksonville’s flagship tech event featuring regional IT leaders, security practitioners, cloud experts, and vendors across a one-day multi-track program hosted at UNF.",
  },
  {
    slug: "that-conference-wi-2024",
    name: "THAT Conference (WI)",
    year: 2024,
    dates: { start: "2024-07-29", end: "2024-08-01" },
    city: "Wisconsin Dells, WI",
    venue: "Kalahari Resorts & Conventions",
    url: "https://thatconference.com/wi/2024/",
    topics: ["Full-stack", "Community", "Career"],
    coverImage: "/conferences/That-Conference-Logo-LowRes.png",
    summary:
      "Camp-style, family-friendly developer conference in the Wisconsin Dells, known for deep-dive technical talks alongside community and family activities.",
  },
  {
    slug: "renderatl-2024",
    name: "RenderATL",
    year: 2024,
    city: "Atlanta, GA",
    url: "https://www.renderatl.com/",
    topics: ["Frontend", "AI", "Cloud", "Leadership"],
    coverImage: "/conferences/RenderATL-2024-Logo-Green.png",
    summary:
      "A multi-day tech conference and expo in Atlanta covering frontend frameworks, AI, and leadership, with workshops, career programming, and a large sponsor hall.",
  },
  {
    slug: "wordcamp-us-2023",
    name: "WordCamp US",
    year: 2023,
    dates: { start: "2023-08-24", end: "2023-08-26" },
    city: "National Harbor, MD",
    venue: "Gaylord National Resort & Convention Center",
    url: "https://us.wordcamp.org/2023/",
    topics: ["WordPress", "Open Source", "Community"],
    coverImage: "/conferences/WordCamp-US-2023.webp",
    summary:
      "The flagship U.S. WordPress conference with Contributor Day, multi-track sessions, and an active sponsor hall at the Gaylord National in National Harbor.",
  },
  {
    slug: "rvajs-2023",
    name: "RVA JavaScript Conference",
    year: 2023,
    dates: { start: "2023-11-17" },
    city: "Richmond, VA",
    venue: "Science Museum of Virginia",
    url: "https://rvajavascript.com/",
    topics: ["JavaScript", "TypeScript", "Node.js", "React"],
    coverImage: "/conferences/RVAJS-Conf-Richmond-2023.webp",
    summary:
      "A one-day JavaScript conference hosted by rvatech/ with talks spanning TypeScript, Node, React, tooling, and architecture.",
  },
  {
    slug: "tech-coast-conference-2020",
    name: "Tech Coast Conference",
    year: 2020,
    dates: { start: "2020-08-19" },
    city: "Jacksonville, FL (Virtual)",
    url: "https://techcoastconference.com/",
    topics: ["IT Leadership", "Security", "Cloud"],
    coverImage: "/conferences/Tech-Coast-Conference-2020.webp",
    summary:
      "The 2020 edition pivoted online, delivering talks and panels focused on security, cloud, and regional tech growth in a virtual format.",
  },
  {
    slug: "tech-coast-conference-2018",
    name: "Tech Coast Conference",
    year: 2018,
    city: "Jacksonville, FL",
    venue: "UNF Adam W. Herbert University Center",
    url: "https://techcoastconference.com/",
    topics: ["IT", "Security", "Data"],
    coverImage: "/conferences/Tech-Coast-Conference-2018.webp",
    summary:
      "An early TCC edition hosted at UNF, gathering local technologists and businesses to discuss trends in security, data, and enterprise IT.",
  },
  {
    slug: "wordcamp-asheville-2017",
    name: "WordCamp Asheville",
    year: 2017,
    dates: { start: "2017-06-02", end: "2017-06-04" },
    city: "Asheville, NC",
    venue: "Mission Health / A-B Tech Conference Center",
    url: "https://asheville.wordcamp.org/2017/",
    topics: ["WordPress", "Community"],
    coverImage: "/conferences/WordCamp-Asheville-2017.webp",
    summary:
      "Regional WordCamp covering WordPress development, content, and design, held at the A-B Tech campus conference center.",
  },
  {
    slug: "wordcamp-jacksonville-2018",
    name: "WordCamp Jacksonville",
    year: 2018,
    dates: { start: "2018-04-07", end: "2018-04-08" },
    city: "Jacksonville, FL",
    venue: "Keiser University",
    url: "https://jacksonville.wordcamp.org/2018/",
    topics: ["WordPress", "Community"],
    coverImage: "/conferences/Jacksonville-WordCamp-2018.webp",
    summary:
      "Two-day WordCamp with multi-track sessions and a KidsCamp, hosted at Keiser University and focused on practical WordPress skills.",
  },
  {
    slug: "wordcamp-jacksonville-2017",
    name: "WordCamp Jacksonville",
    year: 2017,
    dates: { start: "2017-05-20", end: "2017-05-21" },
    city: "Jacksonville, FL",
    venue: "Keiser University",
    url: "https://jacksonville.wordcamp.org/2017/",
    topics: ["WordPress", "Community"],
    coverImage: "/conferences/WordCamp-Jackonville-2017.webp",
    summary:
      "Jacksonville’s second annual WordCamp, featuring business, user, and developer tracks, plus KidsCamp and community networking.",
  },
  {
    slug: "echo-conference-2013",
    name: "Echo Conference",
    year: 2013,
    dates: { start: "2013-07-24", end: "2013-07-26" },
    city: "Dallas, TX",
    venue: "Watermark Community Church",
    url: "https://churchm.ag/echo-conference-2013-design/",
    topics: ["Church Media", "Creative Tech"],
    coverImage: "/conferences/Echohub-Media-Conference-Dallas-2013.webp",
    summary:
      "A church media/creative conference for artists, geeks, and storytellers, hosted at Watermark Community Church in Dallas.",
  },

  // ——— NEW: requested additions ———
  {
    slug: "all-things-open-ai-2025",
    name: "All Things Open.AI",
    year: 2025,
    dates: { start: "2025-03-17", end: "2025-03-18" },
    city: "Durham, NC",
    venue: "Carolina Theatre",
    url: "https://allthingsai.org/",
    topics: ["AI/ML", "Open Source", "MLOps", "Safety"],
    coverImage: "/conferences/All-Things-Open-2024-Smaller.png", // swap if you add a 2025 AI-specific logo
    summary:
      "All Things Open.AI is a practitioner-focused spinoff from the All Things Open team, created to explore the real-world impact of AI across tooling, platforms, and organizations. The inaugural 2025 event ran two days at the Carolina Theatre in Durham, bringing together engineers, data scientists, and product leaders for dense, vendor-neutral content on the AI stack.\n\nTalks emphasized applied machine learning, model governance, safety and security, and the intersection of open source with rapidly evolving AI tooling. The format mirrored ATO’s community ethos—multi-track sessions, hands-on workshops, and hallway track networking—aimed at helping teams ship responsible AI in production.",
  },
  {
    slug: "epic-web-conf-2025",
    name: "Epic Web Conf",
    year: 2025,
    dates: { start: "2025-03-26" },
    city: "Salt Lake City, UT",
    venue: "Hilton Salt Lake City Center (main venue), plus offsite events",
    url: "https://www.epicweb.dev/conf",
    topics: ["Full-stack Web", "React", "Testing", "DX"],
    coverImage: "/conferences/That-Conference-Logo.webp", // TEMP: replace with your Epic Web logo when added
    summary:
      "Epic Web Conf is a curated full-stack conference founded by Kent C. Dodds’ EpicWeb.dev, bringing together framework authors, library maintainers, and working engineers to discuss building great UX and great DX. The 2025 edition took place in downtown Salt Lake City with a free livestream and hands-on workshops before/around the main program.\n\nSessions focused on pragmatic patterns for React and modern web apps (routing, data loading, server components, testing), plus real-world tooling—Vite/Vitest, Playwright, auth, caching, and performance. The hallway track was a highlight, with creators and practitioners trading hard-won lessons you can apply immediately to production apps.",
  },
];
