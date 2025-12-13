"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimpleModeToggle } from "../simple-mode-toggle";
import { useHeaderNavItems, socialLinks, SiteLogo } from "../page/links";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const headerNavItems = useHeaderNavItems();

  // Prevent hydration mismatch with Radix UI NavigationMenu
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Active nav state
  const isActive = (item: (typeof headerNavItems)[0]) => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  return (
    <>
      {/* Accessibility Skip Links */}
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="absolute top-0 left-10 z-[9999] bg-(--color-accent) text-(--color-on-accent) px-4 py-2 rounded-br-lg"
        >
          Skip to main content
        </a>
      </div>

      <motion.header className="site-container pt-10 pb-6" role="banner">
        <nav
          id="main-navigation"
          className="flex items-center gap-4"
          aria-label="Main navigation"
        >
          {/* Left side – Logo */}
          <Link
            href="/"
            className="group inline-flex items-center gap-3"
            aria-label="Chris Lane Jones - Home"
          >
            <div className="grid place-content-center">
              <SiteLogo />
            </div>
            <span className="whitespace-nowrap site-title">
              Chris Lane Jones
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 ms-auto">
            {isMounted && (
              <NavigationMenu>
                <NavigationMenuList className="flex items-center gap-3">
                  {headerNavItems.map((item) => (
                    <NavigationMenuItem key={item.label}>
                      {item.children ? (
                        <>
                          <NavigationMenuTrigger>
                            {item.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="w-56 p-2">
                              <ul className="space-y-1">
                                {item.children.map((child) => (
                                  <li key={child.href}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        href={child.href!}
                                        className={`block w-full rounded-md px-3 py-2 hover:bg-(--color-surface-hover) focus-ring ${
                                          pathname === child.href
                                            ? "bg-(--color-surface-hover)"
                                            : ""
                                        }`}
                                        target={
                                          child.isExternal ? "_blank" : undefined
                                        }
                                        rel={
                                          child.isExternal
                                            ? "noopener noreferrer"
                                            : undefined
                                        }
                                      >
                                        {child.label}
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href!}
                            className={cn(
                              buttonVariants({ variant: "neutral", size: "sm" }),
                              isActive(item) && "bg-(--color-surface-hover)"
                            )}
                            target={item.isExternal ? "_blank" : undefined}
                            rel={
                              item.isExternal ? "noopener noreferrer" : undefined
                            }
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* Social buttons (desktop) */}
            <div className="flex items-center gap-3" role="list">
              {socialLinks.map((social) => (
                <div key={social.href} role="listitem">
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
                      aria-label={social.label}
                      rel="noopener noreferrer"
                    >
                      {social.icon}
                    </a>
                  </Button>
                </div>
              ))}
              <SimpleModeToggle />
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="lg:hidden ms-auto flex items-center gap-3">
            <SimpleModeToggle />
            <Button
              variant="neutral"
              size="icon"
              round={true}
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X width={24} /> : <Menu width={24} />}
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* MOBILE MENU — FULL SCREEN OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-base/80 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Fullscreen Menu */}
            <motion.div
              id="mobile-menu"
              className="fixed inset-0 z-50 lg:hidden flex flex-col bg-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal="true"
            >
              {/* Close button top-right */}
              <div className="flex justify-end p-6">
                <Button
                  variant="neutral"
                  size="icon"
                  round={true}
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <X width={24} />
                </Button>
              </div>

              {/* SCROLLABLE MENU CONTENT */}
              <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-10">
                {/* Social links at TOP */}
                <div className="space-y-4">
                  <h2 className="text-foreground font-semibold px-1">
                    Social Links
                  </h2>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <Button
                        key={social.href}
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
                    ))}
                  </div>
                </div>

                {/* NAVIGATION */}
                <nav className="space-y-4 pt-4" aria-label="Mobile navigation">
                  {headerNavItems.map((item) => (
                    <div key={item.label}>
                      {item.children ? (
                        <>
                          <h3 className="py-2 px-1 text-foreground font-semibold">
                            {item.label}
                          </h3>

                          <div className="ml-2 space-y-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href!}
                                className={`block nav-link text-md py-2 px-3 rounded-lg ${
                                  pathname === child.href
                                    ? "bg-(--color-surface-hover)"
                                    : ""
                                }`}
                                onClick={closeMobileMenu}
                                target={child.isExternal ? "_blank" : undefined}
                                rel={
                                  child.isExternal
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link
                          href={item.href!}
                          className={`block nav-link py-3 px-3 rounded-lg ${
                            isActive(item) ? "bg-(--color-surface-hover)" : ""
                          }`}
                          onClick={closeMobileMenu}
                          target={item.isExternal ? "_blank" : undefined}
                          rel={
                            item.isExternal ? "noopener noreferrer" : undefined
                          }
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
