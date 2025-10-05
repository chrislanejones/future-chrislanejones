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

      <h3 className="text-xl font-bold text-foreground tracking-tight my-3">
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
    </Card>
  );
}
