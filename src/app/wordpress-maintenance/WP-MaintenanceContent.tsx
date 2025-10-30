"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { Button } from "@/components/ui/button";
import ClientSliderBox from "@/components/main/client-slider-box";

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
    <main className="site-container py-12">
      <Banner
        title="WordPress Site Maintenance"
        breadcrumbPage="WordPress Services"
        description="A Monthly Action Plan That Makes Sense - Comprehensive website maintenance, including regular updates, security scans, performance optimization, and technical support."
      />

      {/* Hero Image Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Provides comprehensive website maintenance, including regular
              updates, security scans, performance optimization, and technical
              support.
            </h2>
          </motion.div>
        </div>
      </motion.section>

      {/* Action Plan Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          The Full Maintenance Action Plan 🎯
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {WPactionPlanItems.map((item, index) => (
            <Card
              key={index}
              size="page-full"
              padding="medium"
              shadow="soft"
              border="thin"
              hover="lift"
              delay={index * 0.1}
              style={{ minHeight: "auto" }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-[color:var(--color-muted)] text-sm mb-2">
                    {item.description}
                  </p>
                  <p className="text-[color:var(--color-muted)] text-xs opacity-80">
                    {item.details}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Monthly Costs
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Plan Card */}
          <Card
            size="page-half"
            padding="large"
            shadow="soft"
            border="thin"
            className="flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-6">The Action Plan</h3>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">
                  Three hours of site changes and consulting monthly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">99.9% website uptime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">
                  Monthly security scans & vulnerability testing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Plugin/theme updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Daily WordPress offsite backups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Fix broken links and images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Resolve errors and conflicts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Performance optimization</span>
              </li>
            </ul>

            <div className="text-center mt-auto pt-6 border-t border-[color:var(--color-border)]">
              <div className="text-3xl font-bold text-accent mb-6">
                $200 / month
              </div>
              <Button asChild variant="accent" size="lg" className="w-full">
                <Link href="#contact">Start the Action Plan</Link>
              </Button>
            </div>
          </Card>

          {/* SEO Plan Card */}
          <Card
            size="page-half"
            padding="large"
            shadow="soft"
            border="thin"
            className="flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-6">
              The Action Plan (With SEO)
            </h3>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Everything in the basic plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Quarterly SEO Reviews</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">SEO improvements to meta tags</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Page-level content optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">
                  Keyword research and implementation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Competitor analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Search ranking monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">Analytics reporting</span>
              </li>
            </ul>

            <div className="text-center mt-auto pt-6 border-t border-[color:var(--color-border)]">
              <div className="text-3xl font-bold text-accent mb-6">
                $250 / month
              </div>
              <Button asChild variant="accent" size="lg" className="w-full">
                <Link href="#contact">Start the Action Plan</Link>
              </Button>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Client Logos Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Present and Past WordPress Clients
        </h2>
        <ClientSliderBox size="page-full" delay={0} />
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Contact Us to Get Started
        </h2>

        <Card
          size="page-full"
          padding="large"
          shadow="soft"
          border="thin"
          className="max-w-2xl mx-auto"
        >
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)] text-[color:var(--color-ink)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)] text-[color:var(--color-ink)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)] text-[color:var(--color-ink)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)] text-[color:var(--color-ink)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Choose An Action Plan
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    value="basic"
                    className="text-accent"
                  />
                  <span className="text-sm">The Action Plan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    value="seo"
                    className="text-accent"
                  />
                  <span className="text-sm">The Action Plan (With SEO)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)] text-[color:var(--color-ink)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Info
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] resize-none"
              ></textarea>
            </div>

            <Button type="submit" variant="accent" size="lg" className="w-full">
              Submit
            </Button>
          </form>
        </Card>
      </motion.section>
    </main>
  );
}
