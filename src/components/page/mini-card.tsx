"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface MiniCardProps {
  title: string;
  excerpt: string;
  coverImage?: string;
  slug: string;
  createdAt: number;
  onClick?: () => void;
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
      className="group flex items-start gap-3 relative transition-all duration-300 opacity-90 hover:opacity-100 bg-[color:var(--color-base)] hover:bg-[color:var(--color-muted-accent)] rounded-lg p-3 border border-transparent hover:border-accent"
    >
      {coverImage && (
        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="64px"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="p font-semibold text-ink group-hover:text-accent transition-colors">
          {title}
        </h4>
      </div>
    </Link>
  );
}
