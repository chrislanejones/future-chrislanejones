"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/page/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Image from "next/image";

type BrowserLink = {
  href: string;
  label: string;
  domain: string;
  favicon?: string;
  screenshotUrl?: string;
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
    <Card size="medium" delay={delay}>
      <div className="space-y-4">
        {/* Chrome Tab Group Badge */}
        <Badge variant={color} className="px-4 py-2">
          <h4 className="">{title}</h4>
        </Badge>

        {/* Links Container */}
        <div className="space-y-2">
          {links.map((link) => (
            <Tooltip key={link.href} delayDuration={200}>
              <TooltipTrigger asChild>
                <div>
                  <Button
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
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <span className="truncate">{link.label}</span>
                      </div>
                      <span className="text-muted truncate max-w-[120px] flex-shrink-0">
                        {link.domain}
                      </span>
                    </a>
                  </Button>
                </div>
              </TooltipTrigger>

              {/* Show screenshot tooltip if available */}
              {link.screenshotUrl && (
                <TooltipContent side="right" className="p-2" sideOffset={5}>
                  <Image
                    src={link.screenshotUrl}
                    alt={`${link.label} screenshot`}
                    width={560}
                    height={320}
                    className="h-40 w-[22rem] rounded-md object-cover"
                    unoptimized
                  />
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>
      </div>
    </Card>
  );
}
