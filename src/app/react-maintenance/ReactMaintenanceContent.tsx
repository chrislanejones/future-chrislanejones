"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import Card from "@/components/page/card";
import { Button } from "@/components/ui/button";
import ClientSliderBox from "@/components/main/client-slider-box";

const actionPlanItems = [
  {
    icon: "⚛️",
    title: "React App Consulting & Feature Updates",
    description:
      "Three hours of application changes (components, UI/UX updates, API integrations, routing improvements, and performance tweaks) and/or React consulting a month.",
    details:
      "Whether it's refactoring components or modernizing the UI; improving the user experience increases engagement and retention.",
  },
  {
    icon: "🛡️",
    title: "Security, Maintenance & Code Backups",
    description:
      "Your application's security isn't just about protection—it's about peace of mind and reliability.",
    details:
      "Monthly security audits, vulnerability testing, updating npm dependencies, React version migrations, and automated Git-based backups with disaster recovery plans.",
  },
  {
    icon: "🚑",
    title: "Technical Support & Bug Fixes",
    description:
      "Fixing runtime errors, resolving hooks conflicts, debugging component lifecycles, and troubleshooting third-party library integration issues.",
    details:
      "We also resolve deployment and hosting issues. This includes an initial review of your build pipeline and hosting environment.",
  },
  {
    icon: "⚡",
    title: "App Performance Optimization",
    description:
      "Improving performance bottlenecks by crushing 💪 Google's Core Web Vitals and Lighthouse scores.",
    details:
      "Bundle optimization, code splitting, lazy loading, image optimization, Vite/Webpack tuning, and server-side rendering improvements make up the majority of performance wins. Faster apps improve SEO and user retention.",
  },
  {
    icon: "📊",
    title: "Quarterly Performance Reviews",
    description:
      "Stay ahead of the curve and capture new opportunities with data-driven insights and metrics.",
    details:
      "Improvements to bundle size, runtime performance, and Lighthouse scores through strategic React optimizations and dependency management.",
  },
  {
    icon: "🇺🇸",
    title: "Based in the USA",
    description: "Our skilled US-based professionals handle every project.",
    details:
      "We understand modern JavaScript ecosystems and share a similar time zone. We take pride in our work and your app's success.",
  },
];

export default function ReactServicesPage() {
  return (
    <>
      {/* Hero Image Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mb-16 rounded-3xl overflow-hidden h-[500px] mt-8"
      >
        <Image
          src="/gallery/Whiteboard-Notes.webp"
          alt="React Maintenance Planning"
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
            <h2 className="text-white">
              Provides comprehensive React application maintenance, including
              regular updates, dependency management, performance optimization,
              and technical support.
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
        <h2 className="text-center mb-12">
          The Full Maintenance Action Plan 🎯
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {actionPlanItems.map((item, index) => (
            <Card
              key={index}
              size="page-full"
              shadow="soft"
              border="thin"
              hover="lift"
              delay={index * 0.1}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="mb-2">{item.title}</h3>
                  <p className="mb-2">{item.description}</p>
                  <p className="opacity-80">{item.details}</p>
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
        <h2 className="text-center mb-12">Monthly Costs</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Plan Card */}
          <Card
            size="page-half"
            shadow="soft"
            border="thin"
            className="flex flex-col"
          >
            <h3 className="mb-6">The Action Plan</h3>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">
                  Three hours of app changes and consulting monthly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">99.9% application uptime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">
                  Monthly security audits & vulnerability testing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">
                  npm dependency updates & React migrations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">Daily Git repository backups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">Fix broken features & API integrations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">Resolve dependency conflicts & bugs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">Bundle optimization & code splitting</span>
              </li>
            </ul>

            <div className="text-center mt-auto pt-6 border-t border-[color:var(--color-border)]">
              <div className="text-accent mb-6">$200 / month</div>
              <Button asChild variant="base" size="lg" className="w-full">
                <Link href="#contact">Start the Action Plan</Link>
              </Button>
            </div>
          </Card>

          {/* Performance Plan Card */}
          <Card
            size="page-half"
            shadow="soft"
            border="thin"
            className="flex flex-col"
          >
            <h3 className="mb-6">The Action Plan (With Performance)</h3>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">Everything in the basic plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">Quarterly Performance Reviews</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">
                  Lighthouse score improvements & Core Web Vitals
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">
                  Bundle size analysis & dependency optimization
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">SSR/SSG implementation guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">State management optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">Performance monitoring setup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="">Analytics & RUM reporting</span>
              </li>
            </ul>

            <div className="text-center mt-auto pt-6 border-t border-[color:var(--color-border)]">
              <div className="text-accent mb-6">$250 / month</div>
              <Button asChild variant="base" size="lg" className="w-full">
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
        <h2 className="text-center mb-12">Present and Past React Clients</h2>
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
        <h2 className="text-center mb-12">Contact Us to Get Started</h2>

        <Card size="hero" shadow="soft" border="thin">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">First Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)]"
                />
              </div>
              <div>
                <label className="block mb-2">Last Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Email *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)]"
              />
            </div>

            <div>
              <label className="block mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)]"
              />
            </div>

            <div>
              <label className="block mb-2">Choose An Action Plan</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    value="basic"
                    className="text-accent"
                  />
                  <span className="">The Action Plan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    value="performance"
                    className="text-accent"
                  />
                  <span className="">The Action Plan (With Performance)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-2">GitHub Repository</label>
              <input
                type="url"
                className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)]"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <label className="block mb-2">Additional Info</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-[color:var(--color-base)] border border-[color:var(--color-border)] resize-none"
                placeholder="Tell us about your React app, current stack, or specific challenges..."
              ></textarea>
            </div>

            <Button type="submit" variant="base" size="lg" className="w-full">
              Submit
            </Button>
          </form>
        </Card>
      </motion.section>
    </>
  );
}
