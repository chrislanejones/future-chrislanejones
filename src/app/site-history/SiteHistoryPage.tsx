// src/app/site-history/SiteHistoryPage.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { FullWidthLayout } from "@/components/page/layout";

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

type SiteVersion = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageDescription: string;
  links?: { label: string; url: string }[];
};

const siteVersions: SiteVersion[] = [
  {
    title: "2007-2009 Pre-chrislanejones.com",
    description:
      "My first professional website was built on WordPress 2.1, released in January 2007. I modified the iconic Kubrick theme by Michael Heilemann—the default WordPress theme that defined an era of blogging.\n\nThe Kubrick theme was elegant in its simplicity: a clean white background, blue header, customizable header image, and that distinctive rounded sidebar. The domain was inspirationalexperiences.org.",
    image: "/site-history/WordPress-2.1-January-2007.webp",
    imageAlt: "WordPress 2.1 interface with Kubrick theme from January 2007",
    imageDescription: "WordPress 2.1 admin interface (Jan 2007)",
    links: [
      {
        label: "The Secret History of Kubrick Theme",
        url: "https://www.huffpost.com/entry/the-secret-history-of-kub_b_415050",
      },
      {
        label: "A Journey Through WordPress Interface",
        url: "https://planetozh.com/blog/2008/12/a-journey-through-five-years-of-wordpress-interface/",
      },
    ],
  },
  {
    title: "2012-2016 - Chrislanejones.com: The Video Production Years",
    description:
      "In 2013, I graduated with a Bachelor of Arts in Television Production after three video production communications internships at the University of North Florida.\n\nI started my career in video editing working at a local church in Jacksonville, FL—First Baptist Church of Jacksonville.When I worked at the church, I spent hours designing my website and I decided to switch careers to building websites.\n\nThis video production website portfolio helped me land my first job in tech, even though it referenced me being a video editor and web designer.\n\nI used a responsive theme to build my website, which was still a new concept in 2014. My first job in tech was at Web.com, and the majority of the websites were not responsive when I started.\n\nThis site was built with the CyberChimps Responsive WordPress theme—one of the early champions of mobile-first design in the WordPress ecosystem.",
    image: "/site-history/Original-Video-Production-Website.webp",
    imageAlt: "Original video production portfolio website",
    imageDescription: "Video production portfolio site (2012-2016)",
    links: [
      {
        label: "CyberChimps Responsive Theme Review",
        url: "https://wpblog.com/responsive-wordpress-themes-review/",
      },
    ],
  },
  {
    title: "2017-2024 - WordPress Bootstrap Resume: The Ugly Years",
    description:
      "I built my own WordPress website from scratch using Bootstrap, and honestly... it was ugly. I can't believe it was up for so long.\n\nThis website was live during my move to Virginia, a period of major life and career transition. Looking back, it's a humbling reminder that not every design decision ages well. The Bootstrap grid was there, the functionality worked, but the aesthetic? Let's just say it was more 'functional' than 'beautiful.'\n\nDespite its appearance, this site served its purpose—it got me through contract work, networking events, and eventually led to better opportunities. It's proof that perfect is the enemy of done, and sometimes you just need to ship it and iterate later.",
    image: "/site-history/My-Resume-Website.webp",
    imageAlt: "WordPress Bootstrap resume website from 2017-2024",
    imageDescription: "The Bootstrap years (2017-2024)",
  },
  {
    title: "2024-2025 - The Short-Lived Post-COVID WordPress Site",
    description:
      "This site was built during my transition from WordPress to React—a bridge between two worlds. I was falling in love with React's component model and growing increasingly frustrated with WordPress's direction, particularly the controversies surrounding Matt Mullenweg and the platform's fractured ecosystem.\n\nThe block editor (Gutenberg) felt clunky compared to the elegance of React components. The WordPress drama was exhausting. And most importantly, I wanted the creative freedom that React offered—especially for animations and micro-interactions.\n\nReact with Framer Motion made it trivially easy to add smooth, performant animations that would have been painful in WordPress.\n\nThis site didn't last long. By mid-2025, I had fully transitioned to a modern React stack with Next.js, TypeScript, Tailwind CSS, and Framer Motion.",
    image: "/site-history/Post-Covid-WordPress-Website.webp",
    imageAlt: "Post-COVID WordPress website during transition to React",
    imageDescription: "Transition phase WordPress site (2024-2025)",
  },
  {
    title: "2025 - Future: Modern React & Framer Motion",
    description:
      "This is the site you're looking at right now—built with Next.js 14, React, TypeScript, Tailwind CSS, and Framer Motion.\n\nI finally had the creative freedom I'd been craving. Framer Motion made animations smooth and intuitive. The component-based architecture meant I could build reusable pieces and iterate quickly. TypeScript caught bugs before they reached production. Tailwind made styling fast and consistent.\n\nThe bento grid layout, the smooth page transitions, the interactive components, the dark mode—all of this would have been significantly harder in WordPress. React gave me the tools to build the portfolio site I'd always envisioned.\n\nLooking ahead, I'm excited to continuing to push what's possible with modern web technologies. The journey continues.",
    image: "/site-history/New-React-Website.webp",
    imageAlt: "Current Next.js and React website with modern animations",
    imageDescription: "Modern React era (2025-Future)",
  },
];

function SiteVersionCard({
  version,
  index,
  total,
}: {
  version: SiteVersion;
  index: number;
  total: number;
}) {
  const isImageLeft = index % 2 === 0;

  return (
    <Card
      size="page-full"
      className="grid md:grid-cols-5 gap-8"
      delay={0.1 + index * 0.1}
    >
      <div
        className={cn(
          "flex flex-col justify-center md:col-span-2",
          "order-1",
          isImageLeft ? "md:order-2" : "md:order-1"
        )}
      >
        <h2 className="font-bold text-2xl mb-6">{version.title}</h2>
        <p className="text-muted leading-relaxed text-base whitespace-pre-line mb-6">
          {version.description}
        </p>

        {/* Links section */}
        {version.links && version.links.length > 0 && (
          <div className="mt-auto pt-4 border-t border-[color:var(--color-border)]">
            <h3 className="text-sm font-semibold text-[color:var(--color-ink)] mb-3">
              Related Links:
            </h3>
            <ul className="space-y-2">
              {version.links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-sm inline-flex items-center gap-2"
                  >
                    {link.label}
                    <svg
                      className="w-3 h-3"
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
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        className={cn(
          "relative rounded-2xl overflow-hidden ring-1 ring-white/10 min-h-[400px] md:col-span-3",
          "order-2",
          isImageLeft ? "md:order-1" : "md:order-2"
        )}
      >
        <Image
          src={version.image}
          alt={version.imageAlt}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={index === 0}
        />
        <div className="absolute bottom-4 right-4 text-xs px-3 py-1 rounded-full bg-base/80 backdrop-blur-sm">
          {version.imageDescription}
        </div>
      </div>
    </Card>
  );
}

function SiteHistoryGrid({ versions }: { versions: SiteVersion[] }) {
  return (
    <motion.section
      className="grid grid-cols-1 gap-8 auto-rows-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {versions.map((version, index) => (
        <SiteVersionCard
          key={version.title}
          version={version}
          index={index}
          total={versions.length}
        />
      ))}
    </motion.section>
  );
}

export default function SiteHistoryPage() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12" id="main-content">
      <Banner
        title="Site History"
        breadcrumbPage="Site History"
        description="The evolution of chrislanejones.com through various technologies, frameworks, and design iterations—from WordPress 2.1 to modern Next.js."
      />

      <FullWidthLayout>
        <SiteHistoryGrid versions={siteVersions} />
      </FullWidthLayout>
    </main>
  );
}
