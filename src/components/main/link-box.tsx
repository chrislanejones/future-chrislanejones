"use client";

import { motion } from "framer-motion";
import Card from "../page/card";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Component props interface
interface LinkboxProps {
  size?:
    | "small"
    | "medium"
    | "large"
    | "wide"
    | "hero"
    | "full"
    | "page-full"
    | "page-half"
    | "page-third";
  delay?: number;
}

export default function Linkbox({ size = "large", delay = 0.3 }: LinkboxProps) {
  return (
    <Card size="large">
      {/* GitHub Gist Section */}

      <h3 className="text-lg font-bold text-foreground tracking-tight my-3">
        Github Gist
      </h3>
      <div className="grid grid-cols-1 gap-3 text-sm">
        <Button variant="base" asChild>
          <a
            href="https://gist.github.com/chrislanejones/125a1d94b66a5ae734e6e5d804e80b2e"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full"
          >
            <span>Large AI File Rebuild Script</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </a>
        </Button>
        <Button variant="base" asChild>
          <a
            href="https://gist.github.com/chrislanejones/61f01ecd60af2f7d35220f480f3361d3"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full"
          >
            <span>Laracon US 2025 – Tech Overview</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </a>
        </Button>
      </div>

      {/* AI Tools Section */}

      <h3 className="text-lg font-bold text-foreground tracking-tight my-4">
        Current AI Tools
      </h3>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[color:var(--color-muted-accent)] hover:shadow-soft transition group cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
            <svg
              className="h-5 w-5 text-ink"
              viewBox="0 0 46 32"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M32.73 0h-6.945L38.45 32h6.945L32.73 0ZM12.665 0 0 32h7.082l2.59-6.72h13.25l2.59 6.72h7.082L19.929 0h-7.264Zm-.702 19.337 4.334-11.246 4.334 11.246h-8.668Z"></path>
            </svg>
          </div>
          <span className="text-center font-medium">Claude</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[color:var(--color-muted-accent)] hover:shadow-soft transition group cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
            <svg
              className="h-5 w-5 text-ink"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <title>Gemini</title>
              <path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"></path>
            </svg>
          </div>
          <span className="text-center font-medium">Gemini 2.5 Pro</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[color:var(--color-muted-accent)] hover:shadow-soft transition group cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
            <svg
              className="h-5 w-5 text-ink"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2000 1700"
              fill="currentColor"
            >
              <polygon points="1008.73 0 827.29 251.03 54.43 251.03 235.74 0 1008.73 0"></polygon>
              <polygon points="1937.79 1449.1 1756.47 1700 986.3 1700 1167.48 1449.1 1937.79 1449.1"></polygon>
              <polygon points="2000 0 771.98 1700 0 1700 1228.02 0 2000 0"></polygon>
            </svg>
          </div>
          <span className="text-center font-medium">GLM 4.5</span>
        </div>
      </div>
    </Card>
  );
}
