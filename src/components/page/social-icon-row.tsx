// src/components/page/social-icon-row.tsx
//
// The header and footer icon rows render inside the root layout, so ANY error
// they raise takes down every page on the site. Convex's useQuery throws when
// the server errors — a function that is not deployed yet, a schema mismatch, a
// preview deployment that was never seeded — and a throw during render is not
// something the calling component can catch.
//
// So the query lives in its own child component behind an error boundary, and
// the boundary falls back to the hard-coded list in links.tsx. A stale icon row
// is a much smaller problem than a blank site.
"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "@/lib/social-icons";
import { socialLinks, footerSocialLinks, type SocialLink } from "./links";

type Surface = "header" | "footer";

const FALLBACK: Record<Surface, SocialLink[]> = {
  header: socialLinks,
  footer: footerSocialLinks,
};

class SocialIconsBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Worth shouting about: the row is now showing the built-in list, which
    // will not reflect anything edited in the admin panel.
    console.error(
      "Social links unavailable from Convex; falling back to the built-in list.",
      error,
    );
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function IconButtons({
  links,
  asListItems,
}: {
  links: SocialLink[];
  asListItems?: boolean;
}) {
  return (
    <>
      {links.map((social) => {
        const button = (
          <Button
            asChild
            variant="neutral"
            size="icon"
            round={true}
            title={social.label}
          >
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            >
              {social.icon}
            </a>
          </Button>
        );

        return asListItems ? (
          <div key={social.href} role="listitem">
            {button}
          </div>
        ) : (
          <React.Fragment key={social.href}>{button}</React.Fragment>
        );
      })}
    </>
  );
}

function LiveSocialIcons({
  surface,
  asListItems,
}: {
  surface: Surface;
  asListItems?: boolean;
}) {
  const rows = useQuery(
    surface === "header"
      ? api.socialLinks.getForHeader
      : api.socialLinks.getForFooter,
  );

  // undefined is a cold query, [] is an unseeded table; both mean "show the
  // built-in list" rather than an empty row.
  const links: SocialLink[] =
    rows && rows.length > 0
      ? rows.map((row) => ({
          href: row.href,
          label: row.label,
          icon: <SocialIcon iconKey={row.iconKey} size={18} />,
        }))
      : FALLBACK[surface];

  return <IconButtons links={links} asListItems={asListItems} />;
}

export function SocialIconRow({
  surface,
  asListItems,
}: {
  surface: Surface;
  asListItems?: boolean;
}) {
  return (
    <SocialIconsBoundary
      fallback={
        <IconButtons links={FALLBACK[surface]} asListItems={asListItems} />
      }
    >
      <LiveSocialIcons surface={surface} asListItems={asListItems} />
    </SocialIconsBoundary>
  );
}
