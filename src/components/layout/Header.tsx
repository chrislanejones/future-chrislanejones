"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { SimpleModeToggle } from "../simple-mode-toggle";
import { headerNavItems, socialLinks, SiteLogo } from "../page/links";
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

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Skip Links - Only visible when focused */}
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="absolute top-0 left-0 z-[9999] bg-accent text-white px-4 py-2 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-accent-alt"
        >
          Skip to main content
        </a>
        <a
          href="#main-navigation"
          className="absolute top-0 left-32 z-[9999] bg-accent text-white px-4 py-2 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-accent-alt"
        >
          Skip to navigation
        </a>
      </div>

      <motion.header className="site-container pt-10 pb-6" role="banner">
        <nav
          id="main-navigation"
          className="flex items-center gap-4"
          aria-label="Main navigation"
        >
          {/* Brand: icon left, text right */}
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

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4 ms-auto">
            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-3">
                {headerNavItems.map((item) => (
                  <NavigationMenuItem key={item.label} className="relative">
                    {item.children ? (
                      <>
                        {/* Trigger styled like a button (via buttonVariants in ui/navigation-menu) */}
                        <NavigationMenuTrigger>
                          {item.label}
                        </NavigationMenuTrigger>

                        {/* IMPORTANT: let the Viewport position this; no absolute/left/top here */}
                        <NavigationMenuContent>
                          <div className="w-56 p-2">
                            {" "}
                            {/* ← no bg/border/shadow here */}
                            <ul className="space-y-1">
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={child.href}
                                      className="block w-full rounded-md px-3 py-2 text-foreground/90 hover:bg-[color:var(--color-surface-hover)] focus-ring"
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
                          className="h-9 px-4 py-2 bg-panel card shadow-passive hover:shadow-glow focus-ring transition hover:bg-[color:var(--color-surface-hover)] inline-flex items-center justify-center rounded-lg"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Social Buttons */}
            <div
              className="flex items-center gap-3"
              role="list"
              aria-label="Social media links"
            >
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
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  </Button>
                </div>
              ))}
              <SimpleModeToggle />
            </div>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="lg:hidden ms-auto flex items-center gap-3">
            <SimpleModeToggle />
            <Button
              variant="neutral"
              size="icon"
              round={true}
              onClick={toggleMobileMenu}
              aria-label={
                isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X width="24" height="24" aria-hidden="true" />
              ) : (
                <Menu width="24" height="24" aria-hidden="true" />
              )}
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-base/80 backdrop-blur-sm z-40 lg:hidden"
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Mobile Menu */}
            <motion.div
              id="mobile-menu"
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-panel card shadow-2xl z-50 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <Button
                    variant="neutral"
                    size="icon"
                    round={true}
                    onClick={closeMobileMenu}
                    aria-label="Close mobile menu"
                  >
                    <X width="24" height="24" aria-hidden="true" />
                  </Button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-4" aria-label="Mobile navigation">
                  {headerNavItems.map((item) => (
                    <div key={item.label}>
                      {item.children ? (
                        <div>
                          <div className="py-2 px-4 text-foreground">
                            {item.label}
                          </div>
                          <div className="ml-4 space-y-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block nav-link text-md py-2 px-4"
                                onClick={closeMobileMenu}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href!}
                          className="block nav-link py-3 px-4"
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Mobile Social Links */}
                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <h2 className="text-muted px-4 mb-3">Social Links</h2>
                    {socialLinks.map((social) => (
                      <Button
                        key={social.href}
                        asChild
                        variant="neutral"
                        size="lg"
                        className="w-full shadow-passive hover:shadow-glow focus-ring justify-start"
                      >
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeMobileMenu}
                          aria-label={social.label}
                        >
                          {social.icon}
                          <span>{social.label}</span>
                        </a>
                      </Button>
                    ))}
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
