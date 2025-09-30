"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/page/card";
import Banner from "@/components/page/banner";

// Link categories with Chrome color variants (expanded with new sites)
const linkCategories = [
  {
    title: "Development Tools",
    color: "orange",
    links: [
      {
        href: "https://effect.website/",
        label: "Effect - TypeScript Library",
        domain: "effect.website",
      },
      {
        href: "https://effect.website/docs/getting-started/using-generators/",
        label: "Effect Generators Guide",
        domain: "effect.website",
      },
      {
        href: "https://github.com/aulianza/aulianza.id",
        label: "aulianza.id",
        domain: "github.com/aulianza/aulianza.id",
      },
      {
        href: "https://www.augmentcode.com/",
        label: "Augment Code",
        domain: "augmentcode.com",
      },
      {
        href: "https://bun.sh/docs",
        label: "Bun Documentation",
        domain: "bun.sh",
      },
    ],
  },
  {
    title: "Design & UI Resources",
    color: "cyan",
    links: [
      {
        href: "https://www.chakra-ui.com/playground",
        label: "Chakra UI Playground",
        domain: "chakra-ui.com",
      },
      {
        href: "https://pro.aceternity.com/products/navbars",
        label: "Aceternity UI Components",
        domain: "aceternity.com",
      },
      {
        href: "https://www.heroui.com/docs/components/number-input",
        label: "Hero UI Components",
        domain: "heroui.com",
      },
      {
        href: "https://www.radix-ui.com/",
        label: "Radix UI",
        domain: "radix-ui.com",
      },
      {
        href: "https://www.framer.com/motion/",
        label: "Framer Motion",
        domain: "framer.com",
      },
    ],
  },
  {
    title: "Learning & Tutorials",
    color: "purple",
    links: [
      {
        href: "https://www.joshwcomeau.com/svg/friendly-introduction-to-svg/",
        label: "Josh Comeau - SVG Guide",
        domain: "joshwcomeau.com",
      },
      {
        href: "https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/",
        label: "Shaders with R3F",
        domain: "blog.maximeheckel.com",
      },
      {
        href: "https://learnxinyminutes.com/zig/",
        label: "Learn X in Y minutes",
        domain: "learnxinyminutes.com",
      },
      {
        href: "https://developer.mozilla.org/",
        label: "MDN Web Docs",
        domain: "developer.mozilla.org",
      },
      {
        href: "https://samwho.dev/load-balancing/",
        label: "Load Balancing Guide",
        domain: "samwho.dev",
      },
    ],
  },
  {
    title: "Layout & Design Patterns",
    color: "green",
    links: [
      {
        href: "https://blog.openreplay.com/bento-box--a-refreshing-layout-approach-for-websites/",
        label: "Bento Box Layouts",
        domain: "blog.openreplay.com",
      },
      {
        href: "https://iamsteve.me/blog/bento-layout-css-grid",
        label: "Bento Layout CSS Grid",
        domain: "iamsteve.me",
      },
      {
        href: "https://bentogrids.com/",
        label: "Bento Grids",
        domain: "bentogrids.com",
      },
      {
        href: "https://dev.to/terenvelan/creating-variants-of-react-component-2b8m",
        label: "React Component Variants",
        domain: "dev.to",
      },
      {
        href: "https://icograms.com/designer",
        label: "Icograms Designer",
        domain: "icograms.com",
      },
    ],
  },
  {
    title: "Icon Libraries",
    color: "blue",
    links: [
      {
        href: "https://lucide.dev/icons/",
        label: "Lucide Icons",
        domain: "lucide.dev",
      },
      {
        href: "https://react-icons.github.io/react-icons/",
        label: "React Icons",
        domain: "react-icons.github.io",
      },
      {
        href: "https://simpleicons.org/",
        label: "Simple Icons",
        domain: "simpleicons.org",
      },
      {
        href: "https://feathericons.com/",
        label: "Feather Icons",
        domain: "feathericons.com",
      },
      {
        href: "https://flowbite.com/icons/",
        label: "Flowbite Icons",
        domain: "flowbite.com",
      },
    ],
  },
  {
    title: "Developer Portfolios",
    color: "pink",
    links: [
      {
        href: "https://www.ericwu.me/",
        label: "Eric Wu",
        domain: "ericwu.me",
      },
      {
        href: "https://www.braydoncoyer.dev/",
        label: "Braydon Coyer",
        domain: "braydoncoyer.dev",
      },
      {
        href: "https://www.rachelhow.com/",
        label: "Rachel How",
        domain: "rachelhow.com",
      },
      {
        href: "https://kentcdodds.com/",
        label: "Kent C. Dodds",
        domain: "kentcdodds.com",
      },
      {
        href: "https://azumbrunnen.me/",
        label: "Adrian Zumbrunnen",
        domain: "azumbrunnen.me",
      },
    ],
  },
  {
    title: "FOSS",
    color: "red",
    links: [
      {
        href: "https://github.com/immich-app/immich",
        label: "Immich - Photo Backup",
        domain: "github.com/immich-app/immich",
      },
      {
        href: "https://omarchy.org/",
        label: "Omarchy Linux",
        domain: "omarchy.org",
      },
      {
        href: "https://jellyfin.org/",
        label: "Jellyfin - Media Server",
        domain: "jellyfin.org",
      },
      {
        href: "https://github.com/meichthys/foss_photo_libraries",
        label: "FOSS Photo Software",
        domain: "github.com/meichthys/foss_photo_libraries",
      },
    ],
  },
] as const;

export default function LinkGrid() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="Chrome Tabs I Left Open"
        breadcrumbPage="Links"
        description="A curated collection of useful resources, tools, and inspiration that I keep coming back to."
      />

      {/* Link Categories Grid - Updated to be 1/3 width each */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {linkCategories.map((category, categoryIndex) => (
          <Card
            key={category.title}
            size="page-third"
            padding="medium"
            glass={true}
            color={category.color}
            delay={0.1 + categoryIndex * 0.1}
            className="backdrop-blur-sm"
          >
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-center text-lg">
                {category.title}
              </h4>

              <div className="space-y-2">
                {category.links.map((link, linkIndex) => (
                  <Button
                    key={link.href}
                    variant="base"
                    showExternalIcon={true}
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center">
                        <span>{link.label}</span>
                      </div>
                      {link.domain && (
                        <span className="text-xs truncate ml-2">
                          {link.domain}
                        </span>
                      )}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
