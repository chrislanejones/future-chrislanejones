// src/app/wordpress-maintenance/WP-MaintenanceContent.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import Card from "@/components/page/card";
import { Button } from "@/components/ui/button";
import ClientSliderContent from "@/components/main/client-slider-content";
import ContactForm from "@/components/page/contact-form";
import { cardVariants, fadeUpVariants } from "@/lib/animations";

const WPactionPlanItems = [
  {
    icon: "🎨",
    title: "Website Consulting & Design Edits",
    description:
      "Three hours of site changes (copy, images, SEO edits, e-commerce additions, and videos) and/or website consulting a month.",
    details:
      "Whether it's refreshing content or reimagining layouts; improving the design increases engagement.",
  },
  {
    icon: "🛡️",
    title: "Security, Maintenance & Backups",
    description:
      "Your website's security isn't just about protection—it's about peace of mind.",
    details:
      "Monthly security scans, vulnerability testing, updating plugins/themes, Disaster recovery plan – daily WordPress offsite backups on secure servers.",
  },
  {
    icon: "🚑",
    title: "Technical Support & Troubleshooting",
    description:
      "Fixing broken links and images, resolving website errors and bugs, and troubleshooting plugin and theme conflicts.",
    details:
      "We also resolve uptime problems. This also includes an initial review of the hosting web panel setup.",
  },
  {
    icon: "⚡",
    title: "Site Performance Optimization",
    description:
      "Improving performance bottlenecks by crushing 💪 Google's PageSpeed Insights score.",
    details:
      "Image optimization, JavaScript / CSS minification, caching implementation, and server optimization make up the majority of performance issues. Faster sites improve SEO Rankings.",
  },
  {
    icon: "📊",
    title: "Quarterly SEO Reviews",
    description:
      "Stay ahead of the curve and capture new opportunities with data-driven insights.",
    details:
      "Improvements to meta tags and page-level content help boost rankings.",
  },
  {
    icon: "🇺🇸",
    title: "Based in the USA",
    description: "Our skilled US-based professionals handle every project.",
    details:
      "We understand your market and share a similar time zone. We take pride in our work.",
  },
];

export default function WordPressServicesPage() {
  return (
    <>
      {/* Hero Image Section */}
      <motion.section
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0.05}
        className="relative mb-16 rounded-3xl overflow-hidden h-[500px] mt-8"
      >
        <Image
          src="/wordpress-maintenance-hero.jpg"
          alt="WordPress Maintenance Planning"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl"
          >
            <h2 className="text-white">
              Provides comprehensive website maintenance, including regular
              updates, security scans, performance optimization, and technical
              support.
            </h2>
          </motion.div>
        </div>
      </motion.section>

      {/* Action Plan Section */}
      <section className="mb-16">
        <h2 className="text-center mb-12">
          The Full Maintenance Action Plan 🎯
        </h2>

        <div className="grid md:grid-cols-12 gap-4">
          {WPactionPlanItems.map((item, index) => (
            <Card
              key={index}
              size="full"
              delay={index * 0.05}
              style={{ minHeight: "auto" }}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0">{item.icon}</div>
                <div>
                  <h3 className="mb-2">{item.title}</h3>
                  <p className="mb-2">{item.description}</p>
                  <p className="opacity-80">{item.details}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mb-16">
        <h2 className="text-center mb-12">Choose Your Plan</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Plan Card */}
          <Card size="small" delay={0.1} className="flex flex-col">
            <h3 className="mb-6">The Action Plan</h3>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Three hours of site changes and consulting monthly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>99.9% website uptime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Monthly security scans & vulnerability testing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Plugin/theme updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Daily WordPress offsite backups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Fix broken links and images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Resolve errors and conflicts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Performance optimization</span>
              </li>
            </ul>

            <div className="text-center mt-auto pt-6 border-t border-(--color-border)">
              <div className="text-accent mb-6">$200 / month</div>
              <Button asChild variant="base" size="lg" className="w-full">
                <Link href="#contact">Start the Action Plan</Link>
              </Button>
            </div>
          </Card>

          {/* SEO Plan Card */}
          <Card size="small" delay={0.15} className="flex flex-col">
            <h3 className="mb-6">The Action Plan Plus (With SEO)</h3>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Everything in the basic plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Quarterly SEO Reviews</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>SEO improvements to meta tags</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Page-level content optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Keyword research and implementation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Competitor analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Search ranking monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Analytics reporting</span>
              </li>
            </ul>

            <div className="text-center mt-auto pt-6 border-t border-(--color-border)">
              <div className="text-accent mb-6">$250 / month</div>
              <Button asChild variant="base" size="lg" className="w-full">
                <Link href="#contact">Start the Action Plan</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="mb-16">
        <Card size="hero" height="large" delay={0.1}>
          <ClientSliderContent />
        </Card>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <h2 className="text-center mb-12">Contact Us to Get Started</h2>
        <ContactForm
          id="contact"
          variant="maintenance"
          serviceType="WordPress"
          plusPlanLabel="SEO"
        />
      </section>
    </>
  );
}
