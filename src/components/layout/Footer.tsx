"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  footerSocialLinks,
  SiteLogo,
  footerNavLinks,
  NavLinkComponent,
} from "../page/links";
import dynamic from "next/dynamic";
import WireframeTerrain from "../page/wireframe-terrain";

// Dynamically import the 3D component (client-side only)
const Bighorn3D = dynamic(() => import("./Bighorn3D"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export default function Footer() {
  return (
    <>
      <motion.footer className="relative site-container pt-5 pb-10 overflow-hidden">
        <WireframeTerrain variant="left" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 md:items-start">
          {/* Branding */}
          <div className="flex flex-col gap-4 max-w-sm md:col-span-2 md:h-full md:justify-between">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <div className="grid place-content-center">
                  <SiteLogo />
                </div>
                <span className="whitespace-nowrap site-title">
                  Chris Lane Jones
                </span>
              </Link>
            </div>

            <p
              className="text-foreground"
              style={{
                fontSize: "var(--step-0)",
                fontWeight: "var(--weight-regular)",
              }}
            >
              I Consult, Design, and Develop Web Interfaces for Businesses and
              Government Agencies.
            </p>

            {/* Social Icons - will align to bottom on desktop */}
            <div className="flex items-center gap-3 pt-3 md:mt-auto">
              {footerSocialLinks.map((social) => (
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
                  >
                    {social.icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          <div
            className="grid grid-cols-2 gap-8 text-foreground md:col-span-3 md:grid-cols-3"
            style={{
              fontSize: "var(--step--1)",
              fontWeight: "var(--weight-regular)",
            }}
          >
            {footerNavLinks.map((section, index) => (
              <div
                key={section.title}
                className={`justify-self-end text-right ${index === 2 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <h3 className="mb-4 block whitespace-nowrap text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li className="nav-link" key={link.href}>
                      <NavLinkComponent
                        link={link}
                        className="hover:text-foreground"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright Statement */}
        <div className="mt-8 pt-6 text-center relative z-10">
          <p
            className="text-foreground"
            style={{
              fontSize: "var(--step--1)",
              fontWeight: "var(--weight-regular)",
            }}
          >
            © {new Date().getFullYear()} Chris Lane Jones. All rights reserved.
          </p>
        </div>
      </motion.footer>

      {/* 3D Bighorn Sheep - Full width below copyright */}
      {/* <div className="w-screen h-[20vh] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
        <Bighorn3D />
      </div> */}
    </>
  );
}
