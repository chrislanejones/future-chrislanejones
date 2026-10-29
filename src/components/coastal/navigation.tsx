"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Waves } from "lucide-react";
import {
  useHeaderNavItems,
  useFooterNavSections,
} from "@/components/page/links";
import { SocialIconRow } from "@/components/page/social-icon-row";
import { SimpleModeToggle } from "@/components/simple-mode-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MobileNavigation } from "./mobile-navigation";
import styles from "./coastal.module.css";

function Brand() {
  return (
    <Link
      href="/"
      className={styles.brand}
      aria-label="Chris Lane Jones - Home"
    >
      <Waves aria-hidden="true" strokeWidth={1.5} />
      <span>
        Chris Lane Jones
        <span className={styles.brandRole}>Senior web engineer</span>
      </span>
    </Link>
  );
}

export function CoastalHeader() {
  const pathname = usePathname();
  const items = useHeaderNavItems();
  // Desktop dropdowns open on hover as well as click; a short grace period
  // lets the pointer cross the gap between the trigger and the menu.
  const [hovered, setHovered] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A menu opened by hover must not steal or hand back keyboard focus, or the
  // trigger shows a focus ring after the pointer leaves.
  const viaHover = useRef(false);
  const hoverIn = (label: string) => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    viaHover.current = true;
    setHovered(label);
  };
  const hoverOut = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHovered(null), 150);
  };
  return (
    <header className={`${styles.container} ${styles.header}`}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <Brand />
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={styles.desktopNav}
      >
        {items.map((item) =>
          item.children ? (
            <DropdownMenu
              key={item.label}
              modal={false}
              open={hovered === item.label || undefined}
              onOpenChange={(next) => { if (!next) setHovered(null); }}
            >
              <DropdownMenuTrigger
                className={`${styles.navLink} ${item.children.some((child) => child.href === pathname) ? styles.activeNav : ""}`}
                onPointerEnter={() => hoverIn(item.label)}
                onPointerLeave={hoverOut}
                onKeyDown={() => { viaHover.current = false; }}
              >
                {item.label}
                <ChevronDown size={13} aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                data-coastal-theme
                className={styles.dropdown}
                align="start"
                sideOffset={12}
                onPointerEnter={() => hoverIn(item.label)}
                onPointerLeave={hoverOut}
                onCloseAutoFocus={(event: Event) => { if (viaHover.current) event.preventDefault(); }}
              >
                {item.children.map((child) => (
                  <DropdownMenuItem asChild key={child.href}>
                    <Link
                      href={child.href!}
                      aria-current={
                        pathname === child.href ? "page" : undefined
                      }
                      target={child.isExternal ? "_blank" : undefined}
                      rel={child.isExternal ? "noopener noreferrer" : undefined}
                    >
                      {child.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              key={item.label}
              href={item.href!}
              className={`${styles.navLink} ${item.href === pathname ? styles.activeNav : ""} ${item.href === "/contact" ? styles.contactNav : ""}`}
              aria-current={item.href === pathname ? "page" : undefined}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
            >
              {item.label}
              {item.href === "/contact" && (
                <ArrowUpRight size={16} aria-hidden="true" />
              )}
            </Link>
          ),
        )}
      </nav>
      <div className={styles.headerActions}>
        <SimpleModeToggle />
        <MobileNavigation items={items} pathname={pathname} />
      </div>
    </header>
  );
}

export function CoastalFooter() {
  const sections = useFooterNavSections();
  return (
    <footer className={`${styles.container} ${styles.footer}`}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <Brand />
          <p>
            I consult, design, and develop web interfaces for businesses and
            government agencies.
          </p>
          <div className={styles.socials}>
            <SocialIconRow surface="footer" />
          </div>
        </div>
        <div className={styles.footerLinks}>
          {sections.map((section) => (
            <div key={section.title}>
              <h3>{section.title}</h3>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  // The 404 Music Lounge is the not-found page: a prefetch of it always returns 404.
                  prefetch={link.href === "/404" ? false : undefined}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>
          © {new Date().getFullYear()} Chris Lane Jones. All rights reserved.
        </span>
        <a href="#main-content">
          Back to top <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
