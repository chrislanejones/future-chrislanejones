"use client";

import Link from "next/link";

interface MiniCardProps {
  title: string;
  excerpt: string;
  coverImage?: string;
  slug: string;
  createdAt: number;
  onClick?: () => void;
}

function getDaysAgo(timestamp: number): string {
  const now = Date.now();
  const diffInMs = now - timestamp;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
}

export default function MiniCard({
  title,
  excerpt,
  coverImage,
  slug,
  createdAt,
  onClick,
}: MiniCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      onClick={onClick}
      className="group flex flex-col items-center justify-center relative transition-all duration-300 opacity-90 hover:opacity-100 bg-[color:var(--color-base)] hover:bg-[color:var(--color-muted-accent)] rounded-lg p-4 border-1 border-transparent hover:border-[color:var(--color-accent)] hover:shadow-glow w-full min-h-[50px]"
    >
      <div className="flex-1 text-center">
        <h4 className="text-ink group-hover:text-accent transition-colors">
          {title}
        </h4>
      </div>
      <p className="text-muted mt-2">created {getDaysAgo(createdAt)}</p>
    </Link>
  );
}
