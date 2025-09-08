"use client";

import { motion } from "framer-motion";
import Banner from "@/components/page/banner";

/* ---------------------------------- Types --------------------------------- */

type TabLink = {
  title: string;
  url: string;
  description?: string;
};

type TopicCategory = {
  title: string;
  tabs: TabLink[];
};

/* --------------------------------- Helpers -------------------------------- */

const getDomainFromUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

/* --------------------------------- Data ----------------------------------- */

const browserTabsByTopic: TopicCategory[] = [
  {
    title: "Development Libraries & Tools",
    tabs: [
      {
        title: "Effect - TypeScript Library",
        url: "https://effect.website/",
        description: "Powerful TypeScript library for building robust applications"
      },
      {
        title: "Learn X in Y minutes - Zig",
        url: "https://learnxinyminutes.com/zig/",
        description: "Quick guide to learning Zig programming language"
      },
      {
        title: "Bun Documentation",
        url: "https://bun.sh/docs",
        description: "Fast all-in-one JavaScript runtime"
      },
      {
        title: "Tauri Apps",
        url: "https://tauri.app/",
        description: "Build smaller, faster, and more secure desktop applications"
      },
    ]
  },
  {
    title: "UI/UX Design Resources",
    tabs: [
      {
        title: "Aceternity UI Components",
        url: "https://pro.aceternity.com/products/navbars",
        description: "Premium React components and templates"
      },
      {
        title: "ooorganize SVG Pattern Generator",
        url: "https://www.fffuel.co/ooorganize/",
        description: "Create organic SVG grid patterns for your designs"
      },
      {
        title: "Tweakcn Design Tools",
        url: "https://tweakcn.com/",
        description: "Collection of design utilities and tools"
      },
      {
        title: "Radix UI",
        url: "https://www.radix-ui.com/",
        description: "Open-source UI component library"
      },
      {
        title: "Framer Motion",
        url: "https://www.framer.com/motion/",
        description: "Production-ready animation library for React"
      },
    ]
  },
  {
    title: "Portfolio & Inspiration",
    tabs: [
      {
        title: "aulianza.id Portfolio",
        url: "https://github.com/aulianza/aulianza.id",
        description: "Modern developer portfolio built with Next.js"
      },
      {
        title: "Awwwards",
        url: "https://www.awwwards.com/",
        description: "Website awards and design inspiration"
      },
      {
        title: "Dribbble",
        url: "https://dribbble.com/",
        description: "Design work from world-class designers"
      },
    ]
  },
  {
    title: "Documentation & Learning",
    tabs: [
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org/",
        description: "Comprehensive web development documentation"
      },
      {
        title: "React Documentation",
        url: "https://react.dev/",
        description: "Official React documentation and guides"
      },
      {
        title: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/",
        description: "Complete guide to TypeScript"
      },
      {
        title: "Next.js Documentation",
        url: "https://nextjs.org/docs",
        description: "Full-stack React framework documentation"
      },
    ]
  },
  {
    title: "AI & Machine Learning",
    tabs: [
      {
        title: "Hugging Face",
        url: "https://huggingface.co/",
        description: "The AI community building the future"
      },
      {
        title: "OpenAI Platform",
        url: "https://platform.openai.com/",
        description: "Build with OpenAI's powerful models"
      },
      {
        title: "Anthropic Claude",
        url: "https://claude.ai/",
        description: "AI assistant for various tasks"
      },
    ]
  },
];

/* ------------------------------- Components ------------------------------- */

function TabCard({ tab, index }: { tab: TabLink; index: number }) {
  return (
    <motion.a
      href={tab.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card glass shadow-passive p-6 hover:shadow-glow transition-all duration-300 block group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex flex-col space-y-3">
        <h3 className="font-semibold text-lg text-white group-hover:text-accent transition-colors">
          {tab.title}
        </h3>
        {tab.description && (
          <p className="text-sm text-muted line-clamp-2">
            {tab.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-white/50">
            {getDomainFromUrl(tab.url)}
          </span>
          <svg
            className="w-4 h-4 text-white/30 group-hover:text-accent transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}

function TopicSection({ category, categoryIndex }: { category: TopicCategory; categoryIndex: number }) {
  return (
    <motion.section
      className="mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <span className="w-2 h-2 bg-accent rounded-full" />
        {category.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {category.tabs.map((tab, index) => (
          <TabCard 
            key={tab.url} 
            tab={tab} 
            index={index + categoryIndex * 10}
          />
        ))}
      </div>
    </motion.section>
  );
}

/* --------------------------------- Page ----------------------------------- */

export default function BrowserGrid() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="Chrome Tabs Left Open"
        breadcrumbPage="Browser Tabs"
        description="A curated collection of useful resources, tools, and inspiration that I keep coming back to."
      />

      {/* Content */}
      <div className="space-y-8">
        {browserTabsByTopic.map((category, index) => (
          <TopicSection 
            key={category.title} 
            category={category} 
            categoryIndex={index}
          />
        ))}
      </div>
    </main>
  );
}
