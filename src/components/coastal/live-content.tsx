"use client";

import { Component, type ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { clients as staticClients } from "@/data/clients";
import { GalleryPanel, type GalleryPhoto } from "./gallery-panel";
import { QUOTES } from "@/components/main/quote-content";
import { ProjectCard, type ProjectCardData } from "./project-card";
import styles from "./coastal.module.css";
import interior from "./interior.module.css";
import { BlogPostCard } from "./blog-post-card";
import type { Doc } from "../../../convex/_generated/dataModel";
import { featuredProjects } from "@/data/projects-data";
import { imageHorseMarketingProject } from "@/data/project-presentation";
import { Button } from "@/components/ui/button";

// Public content remains reactive and admin-managed. Each section can recover
// independently if its query fails, without blanking the rest of the homepage.
export class ContentBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const fallbackProjects: ProjectCardData[] = featuredProjects;

function ProjectView({ projects }: { projects: ProjectCardData[] }) {
  return (
    <div className={styles.projectGrid}>
      {projects.slice(0, 3).map((project, index) => (
        <ProjectCard
          key={project.title}
          project={project}
          variant={index === 0 ? "primary" : "secondary"}
          heading="h3"
          sizes={index === 0 ? "(max-width: 767px) 90vw, 60vw" : "(max-width: 767px) 90vw, 32vw"}
          showFeatures={project.title === imageHorseMarketingProject.title}
          delay={index * 0.06}
        />
      ))}
    </div>
  );
}
function LiveProjects() {
  const projects = useQuery(api.projects.getFeatured);
  return (
    <ProjectView projects={projects?.length ? projects : fallbackProjects} />
  );
}
export function CoastalProjects() {
  return (
    <ContentBoundary fallback={<ProjectView projects={fallbackProjects} />}>
      <LiveProjects />
    </ContentBoundary>
  );
}

type Client = { name: string; logo: string; url: string; logoAlt?: string };
function ClientView({ clients }: { clients: Client[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(clients.length / 6);
  const safePage = Math.min(page, pages - 1);
  return (
    <div className={styles.clientSection}>
      <div className={styles.clientHeading}>
        <h2>Past and present clients</h2>
        <div className={styles.carouselButtons}>
          <Button
            variant="circle"
            size="sm"
            onClick={() => setPage((safePage - 1 + pages) % pages)}
            aria-label="Previous clients"
            disabled={pages < 2}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </Button>
          <Button
            variant="circle"
            size="sm"
            onClick={() => setPage((safePage + 1) % pages)}
            aria-label="Next clients"
            disabled={pages < 2}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div className={styles.clientLogos}>
        {clients.slice(safePage * 6, safePage * 6 + 6).map((client) => (
          <a
            href={client.url}
            key={client.name}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={client.name}
          >
            <Image
              src={client.logo}
              alt={client.logoAlt || client.name}
              width={170}
              height={70}
              className={styles.clientLogo}
            />
          </a>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        Showing clients {safePage * 6 + 1} to{" "}
        {Math.min((safePage + 1) * 6, clients.length)} of {clients.length}
      </span>
    </div>
  );
}
function LiveClients() {
  const clients = useQuery(api.clients.getAll);
  return <ClientView clients={clients?.length ? clients : staticClients} />;
}
export function CoastalClients() {
  return (
    <ContentBoundary fallback={<ClientView clients={staticClients} />}>
      <LiveClients />
    </ContentBoundary>
  );
}

type Post = Doc<"blogPosts">;
// The two newest posts as text-only cards, the same card as /blog minus the cover.
function LatestPostsView({ posts }: { posts?: Post[] }) {
  if (posts === undefined)
    return (
      <div className={interior.postGrid} aria-busy="true">
        {[0, 1].map((index) => (
          <div key={index} className={styles.postSkeleton} aria-hidden="true" />
        ))}
      </div>
    );
  if (!posts.length)
    return (
      <p className={styles.emptyPosts}>
        More writing is on the way. Browse the blog for articles and tutorials.
      </p>
    );
  return (
    <div className={interior.postGrid}>
      {[...posts]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 2)
        .map((post) => (
          <BlogPostCard
            key={post._id}
            post={post}
            heading="h3"
            showImage={false}
          />
        ))}
    </div>
  );
}
function LiveLatestPosts() {
  const posts = useQuery(api.blogPosts.getAllPosts);
  return <LatestPostsView posts={posts} />;
}
export function CoastalLatestPosts() {
  return (
    <ContentBoundary fallback={<LatestPostsView posts={[]} />}>
      <LiveLatestPosts />
    </ContentBoundary>
  );
}

const photos: GalleryPhoto[] = [
  {
    src: "/gallery/fan-gallery/Theo-and-I-at-RenderATL.webp",
    alt: "Chris and Theo Browne at RenderATL",
    description: "Theo Browne and I at Render 2024",
  },
  {
    src: "/gallery/fan-gallery/Jason-Lengstorf-and-I.webp",
    alt: "Chris and Jason Lengstorf at Epic Web",
    description: "Jason Lengstorf and I at Epic Web Conf 2025",
  },
  {
    src: "/gallery/fan-gallery/Group-Photo-With-Kent-C-Dodds-at-THAT-Conf.webp",
    alt: "Chris, Kent C. Dodds, and friends at THAT Conference",
    description: "With Kent C. Dodds at THAT Conf WI 2024",
  },
  {
    src: "/gallery/fan-gallery/Kevin-Powell-And-I-THAT-Conf.webp",
    alt: "Chris and Kevin Powell at THAT Conference",
    description: "Kevin Powell and I at THAT Conf WI 2025",
  },
  {
    src: "/gallery/fan-gallery/ChrisSev-Avindra-and-I-ATO-2024.webp",
    alt: "Chris with Chris Sev and Avindra Fernando",
    description: "Chris Sev, Avindra Fernando, and I at ATO 2024",
  },
];
function GalleryView({ items }: { items: GalleryPhoto[] }) {
  return (
    <div className={styles.gallery}>
      <div className={styles.galleryImage}>
        <Image
          src={items[0].src}
          alt={items[0].alt}
          fill
          sizes="(max-width: 767px) 90vw, 30vw"
          quality={60}
          className={styles.coverImage}
        />
        <div className={styles.galleryFooter}>
          <h3>Conference photos</h3>
          <GalleryPanel
            photos={items}
            title="Conference photos"
            description="People I’ve met along the way."
            label="Open conference photo gallery"
          />
        </div>
      </div>
    </div>
  );
}
function LiveGallery() {
  const items = useQuery(api.homeGallery.getGalleryPhotos);
  return <GalleryView items={items?.length ? items : photos} />;
}
export function CoastalGallery() {
  return (
    <ContentBoundary fallback={<GalleryView items={photos} />}>
      <LiveGallery />
    </ContentBoundary>
  );
}

function RamblingsView({
  avatar = "/Professional-Photo-of-Chris-Lane-Jones.webp",
  name = "Chris Lane Jones",
}: {
  avatar?: string;
  name?: string;
}) {
  const [index, setIndex] = useState(1);
  return (
    <section className={styles.ramblings} aria-labelledby="ramblings-title">
      <div className={styles.quoteBody}>
        <blockquote aria-live="polite">{QUOTES[index]}</blockquote>
        <div className={styles.quoteSizer} aria-hidden="true" inert>
          {QUOTES.map((quote, quoteIndex) => (
            <div className={styles.quoteMeasure} key={quoteIndex}>
              {quote}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.quoteFooter}>
        <Link href="/about" className={styles.quoteAuthor}>
          <Image
            src={avatar}
            alt={`${name} profile photo`}
            width={44}
            height={44}
          />
          <span>
            {name}
            <h3 id="ramblings-title">My ramblings</h3>
          </span>
        </Link>
        <Button
          variant="circle"
          size="sm"
          aria-label="New quote"
          onClick={() => setIndex((index + 1) % QUOTES.length)}
        >
          <RefreshCw size={17} aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
function LiveRamblings() {
  const profile = useQuery(api.siteSettings.getProfile);
  return (
    <RamblingsView
      avatar={profile?.avatar || undefined}
      name={profile?.name || undefined}
    />
  );
}
export function CoastalRamblings() {
  return (
    <ContentBoundary fallback={<RamblingsView />}>
      <LiveRamblings />
    </ContentBoundary>
  );
}
