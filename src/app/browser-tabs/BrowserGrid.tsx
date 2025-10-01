"use client";

import Banner from "@/components/page/banner";
import BrowserCard from "@/components/page/browser-card";

// Link categories with Chrome color variants
const linkCategories = [
  {
    title: "Development Tools",
    color: "orange" as const,
    links: [
      {
        href: "https://effect.website/",
        label: "Effect - TypeScript Library",
        domain: "effect.website",
        favicon: "https://effect.website/favicon.ico",
      },
      {
        href: "https://effect.website/docs/getting-started/using-generators/",
        label: "Effect Generators Guide",
        domain: "effect.website",
        favicon: "https://effect.website/favicon.ico",
      },
      {
        href: "https://github.com/aulianza/aulianza.id",
        label: "aulianza.id",
        domain: "github.com/aulianza/aulianza.id",
        favicon: "https://github.com/favicon.ico",
      },
      {
        href: "https://www.augmentcode.com/",
        label: "Augment Code",
        domain: "augmentcode.com",
        favicon: "https://www.augmentcode.com/favicon.ico",
      },
      {
        href: "https://bun.sh/docs",
        label: "Bun Documentation",
        domain: "bun.sh",
        favicon: "https://bun.sh/favicon.ico",
      },
    ],
  },
  {
    title: "Design & UI Resources",
    color: "cyan" as const,
    links: [
      {
        href: "https://www.chakra-ui.com/playground",
        label: "Chakra UI Playground",
        domain: "chakra-ui.com",
        favicon: "https://www.chakra-ui.com/favicon.ico",
      },
      {
        href: "https://pro.aceternity.com/products/navbars",
        label: "Aceternity UI Components",
        domain: "aceternity.com",
        favicon: "https://pro.aceternity.com/favicon.ico",
      },
      {
        href: "https://www.heroui.com/docs/components/number-input",
        label: "Hero UI Components",
        domain: "heroui.com",
        favicon: "https://www.heroui.com/favicon.ico",
      },
      {
        href: "https://www.radix-ui.com/",
        label: "Radix UI",
        domain: "radix-ui.com",
        favicon: "https://www.radix-ui.com/favicon.ico",
      },
      {
        href: "https://www.framer.com/motion/",
        label: "Framer Motion",
        domain: "framer.com",
        favicon: "https://www.framer.com/favicon.ico",
      },
    ],
  },
  {
    title: "Learning & Tutorials",
    color: "purple" as const,
    links: [
      {
        href: "https://www.joshwcomeau.com/svg/friendly-introduction-to-svg/",
        label: "Josh Comeau - SVG Guide",
        domain: "joshwcomeau.com",
        favicon: "https://www.joshwcomeau.com/favicon.ico",
      },
      {
        href: "https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/",
        label: "Shaders with R3F",
        domain: "blog.maximeheckel.com",
        favicon: "https://blog.maximeheckel.com/favicon.ico",
      },
      {
        href: "https://learnxinyminutes.com/zig/",
        label: "Learn X in Y minutes",
        domain: "learnxinyminutes.com",
        favicon: "https://learnxinyminutes.com/favicon.ico",
      },
      {
        href: "https://developer.mozilla.org/",
        label: "MDN Web Docs",
        domain: "developer.mozilla.org",
        favicon: "https://developer.mozilla.org/favicon.ico",
      },
      {
        href: "https://samwho.dev/load-balancing/",
        label: "Load Balancing Guide",
        domain: "samwho.dev",
        favicon: "https://samwho.dev/favicon.ico",
      },
    ],
  },
  {
    title: "Layout & Design Patterns",
    color: "green" as const,
    links: [
      {
        href: "https://blog.openreplay.com/bento-box--a-refreshing-layout-approach-for-websites/",
        label: "Bento Box Layouts",
        domain: "blog.openreplay.com",
        favicon: "https://blog.openreplay.com/favicon.ico",
      },
      {
        href: "https://iamsteve.me/blog/bento-layout-css-grid",
        label: "Bento Layout CSS Grid",
        domain: "iamsteve.me",
        favicon: "https://iamsteve.me/favicon.ico",
      },
      {
        href: "https://bentogrids.com/",
        label: "Bento Grids",
        domain: "bentogrids.com",
        favicon: "https://bentogrids.com/favicon.ico",
      },
      {
        href: "https://dev.to/terenvelan/creating-variants-of-react-component-2b8m",
        label: "React Component Variants",
        domain: "dev.to",
        favicon: "https://dev.to/favicon.ico",
      },
      {
        href: "https://icograms.com/designer",
        label: "Icograms Designer",
        domain: "icograms.com",
        favicon: "https://icograms.com/favicon.ico",
      },
    ],
  },
  {
    title: "Icon Libraries",
    color: "blue" as const,
    links: [
      {
        href: "https://lucide.dev/icons/",
        label: "Lucide Icons",
        domain: "lucide.dev",
        favicon: "https://lucide.dev/favicon.ico",
      },
      {
        href: "https://react-icons.github.io/react-icons/",
        label: "React Icons",
        domain: "react-icons.github.io",
        favicon: "https://react-icons.github.io/favicon.ico",
      },
      {
        href: "https://simpleicons.org/",
        label: "Simple Icons",
        domain: "simpleicons.org",
        favicon: "https://simpleicons.org/favicon.ico",
      },
      {
        href: "https://feathericons.com/",
        label: "Feather Icons",
        domain: "feathericons.com",
        favicon: "https://feathericons.com/favicon.ico",
      },
      {
        href: "https://flowbite.com/icons/",
        label: "Flowbite Icons",
        domain: "flowbite.com",
        favicon: "https://flowbite.com/favicon.ico",
      },
    ],
  },
  {
    title: "Developer Portfolios",
    color: "pink" as const,
    links: [
      {
        href: "https://www.ericwu.me/",
        label: "Eric Wu",
        domain: "ericwu.me",
        favicon: "https://www.ericwu.me/favicon.ico",
      },
      {
        href: "https://www.braydoncoyer.dev/",
        label: "Braydon Coyer",
        domain: "braydoncoyer.dev",
        favicon: "https://www.braydoncoyer.dev/favicon.ico",
      },
      {
        href: "https://www.rachelhow.com/",
        label: "Rachel How",
        domain: "rachelhow.com",
        favicon: "https://www.rachelhow.com/favicon.ico",
      },
      {
        href: "https://kentcdodds.com/",
        label: "Kent C. Dodds",
        domain: "kentcdodds.com",
        favicon: "https://kentcdodds.com/favicon.ico",
      },
      {
        href: "https://azumbrunnen.me/",
        label: "Adrian Zumbrunnen",
        domain: "azumbrunnen.me",
        favicon: "https://azumbrunnen.me/favicon.ico",
      },
    ],
  },
  {
    title: "FOSS",
    color: "red" as const,
    links: [
      {
        href: "https://github.com/immich-app/immich",
        label: "Immich - Photo Backup",
        domain: "github.com/immich-app/immich",
        favicon: "https://github.com/favicon.ico",
      },
      {
        href: "https://omarchy.org/",
        label: "Omarchy Linux",
        domain: "omarchy.org",
        favicon: "https://omarchy.org/favicon.ico",
      },
      {
        href: "https://jellyfin.org/",
        label: "Jellyfin - Media Server",
        domain: "jellyfin.org",
        favicon: "https://jellyfin.org/favicon.ico",
      },
      {
        href: "https://github.com/meichthys/foss_photo_libraries",
        label: "FOSS Photo Software",
        domain: "github.com/meichthys/foss_photo_libraries",
        favicon: "https://github.com/favicon.ico",
      },
    ],
  },
];

export default function BrowserGrid() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="Chrome Tabs I Left Open"
        breadcrumbPage="Links"
        description="A curated collection of useful resources, tools, and inspiration that I keep coming back to."
      />

      {/* Link Categories Grid - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {linkCategories.map((category, categoryIndex) => (
          <BrowserCard
            key={category.title}
            title={category.title}
            color={category.color}
            links={category.links}
            delay={0.1 + categoryIndex * 0.1}
          />
        ))}
      </div>
    </main>
  );
}
