"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { SimpleModeToggle } from "../simple-mode-toggle";
import {
  navLinks,
  socialLinks,
  NavLinkComponent,
  SiteLogo,
} from "../page/links";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header className="max-w-6xl mx-auto px-5 pt-10 pb-6">
      <nav className="flex items-center gap-4">
        {/* Brand: icon left, text right */}
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="grid place-content-center">
            <SiteLogo />
          </div>
          <span className="font-bold text-xl whitespace-nowrap">
            Chris Lane Jones
          </span>
        </Link>

        {/* Push everything else to the right */}
        <div className="hidden lg:flex items-center gap-4 ms-auto">
          {/* Links */}
          <div className="flex items-center gap-3 text-sm text-muted">
            {navLinks.map((link) => (
              <NavLinkComponent
                key={link.href}
                link={link}
                className="nav-link text-center whitespace-nowrap"
              />
            ))}
          </div>

          {/* Social Buttons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <Button
                key={social.href}
                asChild
                variant="neutral"
                size="icon"
                round={true}
                title={social.label}
              >
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.icon}
                </a>
              </Button>
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
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X width="24" height="24" />
            ) : (
              <Menu width="24" height="24" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-base/80 backdrop-blur-sm z-40 lg:hidden"
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-panel card shadow-2xl z-50 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
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
                    <X width="24" height="24" />
                  </Button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-4">
                  {navLinks.map((link) => (
                    <NavLinkComponent
                      key={link.href}
                      link={link}
                      className="block text-lg font-medium py-3 px-4 rounded-lg hover:bg-base/60 transition-colors"
                      onClick={closeMobileMenu}
                    />
                  ))}

                  {/* Mobile Social Links */}
                  <div className="pt-6 border-t border-white/10 space-y-3">
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
    </motion.header>
  );
}
