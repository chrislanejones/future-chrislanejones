"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/page/card";

type BrowserLink = {
  href: string;
  label: string;
  domain: string;
  favicon?: string;
};

type BrowserCardProps = {
  title: string;
  color:
    | "blue"
    | "red"
    | "yellow"
    | "green"
    | "pink"
    | "purple"
    | "cyan"
    | "orange";
  links: BrowserLink[];
  delay?: number;
};

export default function BrowserCard({
  title,
  color,
  links,
  delay = 0,
}: BrowserCardProps) {
  return (
    <Card
      size="page-third"
      padding="medium"
      delay={delay}
      className="backdrop-blur-sm"
    >
      <div className="space-y-4">
        {/* Chrome Tab Group Pill */}
        <div
          className={`chrome-group-${color} rounded-full px-4 py-2 inline-block`}
        >
          <h4 className="font-semibold text-[color:var(--color-ink)] text-sm">
            {title}
          </h4>
        </div>

        {/* Links Container - No colored background */}
        <div className="space-y-2">
          {links.map((link) => (
            <Button
              key={link.href}
              variant="base"
              showExternalIcon={true}
              asChild
              className="w-full"
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full gap-2"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {link.favicon && (
                    <img
                      src={link.favicon}
                      alt=""
                      className="w-4 h-4 flex-shrink-0"
                      onError={(e) => {
                        // Fallback if favicon fails to load
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <span className="truncate">{link.label}</span>
                </div>
                <span className="text-xs text-muted truncate max-w-[120px] flex-shrink-0">
                  {link.domain}
                </span>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
