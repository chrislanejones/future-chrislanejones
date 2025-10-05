"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { SimpleModeToggle } from "../simple-mode-toggle";
import { headerNavLinks, socialLinks, NavLinkComponent } from "../page/links";

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
            {/* Mountain backpack logo */}
            <svg
              width="60"
              height="60"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-90"
              aria-hidden="true"
            >
              <rect
                className="fill-[#38795e]"
                x="89.39"
                y="99.37"
                width="823"
                height="814.67"
                rx="159.83"
                ry="159.83"
              />
              <rect
                className="fill-[#1c5a5e]"
                x="108.79"
                y="119"
                width="781.1"
                height="344"
                rx="137"
                ry="137"
              />
              <rect
                className="fill-[#686128]"
                x="107.89"
                y="548.92"
                width="782"
                height="344"
                rx="137"
                ry="137"
              />
              <path
                className="fill-[#38795e]"
                d="M889.89,673.68l-781.07-13.49-.03-349.64c45.83-3.31,91.67-6.62,137.5-9.93,81.14-5.86,171.91-111.75,253.05-117.61,91.13-6.58,151.53,36.58,242.66,30,42.26-3.05,105.62.05,147.89-3v463.68Z"
              />
              <path
                className="fill-[#727d49]"
                d="M889.89,741.89l-781.07-12.05-.03-312.13c45.83-2.96,91.67-5.91,137.5-8.87,81.14-5.23,171.91-99.76,253.05-104.99,91.13-5.88,151.53,32.66,242.66,26.78,42.26-2.73,105.62.05,147.89-2.68v413.94Z"
              />
              <path
                className="fill-[#256439] stroke-[#76ea38] stroke-[12px]"
                d="M861,662l13,47c0,13.09,5.39,87.09-7.62,87.17H132.56c-13.11.07-23.77-86.62-23.77-99.81l12.81-48.47c0-5.29,27.33-19.16,30.56-23.34l82.21-140.87c2.12-2.74,121.36-73.24,124.43-74.83l56.72-83.96c2.41-1.24,4.59-2.89,6.44-4.87l66.76-71.37c9.63-10.3,26.01-9.91,35.16.82l24.5,66.43c2.53,2.97,44.43,58.35,48.05,59.76l38.18,55.57c3.18,1.25,9.69,62.81,13.1,62.61l79.68-37.34c6.84-.42,41.81,1.57,46.6,6.51l40,55.67c2.84,2.92,5.64,48.39,6.69,52.33l33.31,50c.54,2.01,7,38.92,7,41Z"
              />
              <path
                className="fill-[#0e4a34]"
                d="M820,716c8.06,11.19-56.82,45.89-71.37,45.89H178.39c-10.14.06-18.51-63.26-19.48-79.95-.09-1.63.08-3.26.49-4.84l9.96-37.87c0-3.48,14.19-11.43,21.37-16.28,2.21-1.49,4.03-3.42,5.32-5.65l64.27-110.63c1.36-2.34,3.3-4.35,5.66-5.87,16.19-10.39,79.53-48.08,95.23-57.29,2.31-1.36,4.26-3.18,5.71-5.33l42.45-63.12c1.14-1.7,2.61-3.2,4.33-4.42c1.09-.77,2.1-1.65,3.01-2.63l54.98-59.04c.25-.27.5-.52.76-.77,9.32-8.98,25.75-5.2,30.07,6.57l17.4,47.41c.57,1.56,1.39,3.03,2.43,4.38,6.62,8.56,31.35,41.16,37.06,46.7.85.82,1.61,1.71,2.27,2.67l30.14,44.07c2.62,1.03,7.98,51.96,10.79,51.79,0,0,74.41,134.2,147.41,127.2s70,77,70,77Z"
              />
              <path
                className="fill-[#686128]"
                d="M108.79,785c19.3,62.9,70.92,107.92,131.57,107.92h517.95c60.66,0,112.28-45.02,131.57-107.92H108.79Z"
              />
              <circle
                className="fill-[#f36e21]"
                cx="756.69"
                cy="241.17"
                r="64"
              />
            </svg>
          </div>
          <span className="font-bold text-xl whitespace-nowrap">
            Chris Lane Jones
          </span>
        </Link>

        {/* Push everything else to the right */}
        <div className="hidden lg:flex items-center gap-4 ms-auto">
          {/* Links */}
          <div className="flex items-center gap-3 text-sm text-muted">
            {headerNavLinks.map((link) => (
              <NavLinkComponent
                key={link.href}
                link={link}
                className="nav-link text-center whitespace-nowrap"
              />
            ))}
          </div>

          {/* Buttons */}
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
                  {headerNavLinks.map((link) => (
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
