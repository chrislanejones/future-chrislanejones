"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import ClientSliderBox from "@/components/main/client-slider-box";

const actionPlanItems = [
  {
    icon: "⚛️",
    title: "React Consulting & Component Updates",
    description:
      "Three hours of React application changes (components, state management, hooks, routing updates, and performance optimization) and/or consulting a month.",
    details:
      "Whether it's refactoring components or optimizing renders; improving architecture increases maintainability and performance.",
  },
  {
    icon: "🛡️",
    title: "Security, Dependencies & Monitoring",
    description:
      "Your React application's security isn't just about protection—it's about confidence in production.",
    details:
      "Monthly dependency audits, npm security scans, package updates, error monitoring setup, and daily automated backups on secure cloud infrastructure.",
  },
  {
    icon: "🚑",
    title: "Technical Support & Debugging",
    description:
      "Fixing console errors and warnings, resolving state management issues, and troubleshooting build and deployment conflicts.",
    details:
      "We also resolve production incidents and runtime errors. This includes initial review of CI/CD pipeline configuration and deployment setup.",
  },
  {
    icon: "⚡",
    title: "Performance Optimization",
    description:
      "Improving React performance bottlenecks by crushing 💪 Lighthouse and Core Web Vitals scores.",
    details:
      "Code splitting, lazy loading, bundle size optimization, React.memo usage, and server-side rendering implementation. Faster apps improve user retention and SEO.",
  },
  {
    icon: "🔍",
    title: "Quarterly Code Reviews",
    description:
      "Stay ahead of technical debt and capture optimization opportunities with expert code analysis.",
    details:
      "Component architecture reviews, accessibility audits, and best practice implementations help maintain code quality.",
  },
  {
    icon: "🇺🇸",
    title: "Based in the USA",
    description: "Our skilled US-based React specialists handle every project.",
    details:
      "We understand modern web standards and share a similar time zone. We take pride in our work.",
  },
];

export default function ReactMaintenanceContent() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="React Application Maintenance"
        breadcrumbPage="React Maintenance"
        description="A Monthly Action Plan That Makes Sense - Comprehensive React app maintenance, including dependency updates, security monitoring, performance optimization, and technical support."
      />

      {/* Hero Image Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mb-16 rounded-3xl overflow-hidden h-[500px] mt-8"
      >
        <Image
          src="/gallery/Whiteboard-Notes-edited.webp"
          alt="React Application Maintenance Planning"
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
              Provides comprehensive React application maintenance, including
              dependency updates, security monitoring, performance optimization,
              and technical support.
            </h2>
          </motion.div>
        </div>
      </motion.section>

      {/* Action Plan Section with Animation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          The Full Maintenance Action Plan 🎯
        </h2>

        <Card size="page-full" className="bg-custom-dark-purple">
          <div className="grid md:grid-cols-2 gap-4 p-6">
            {actionPlanItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">
                      {item.description}
                    </p>
                    <p className="text-gray-400 text-xs">{item.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.section>

      {/* Pricing Section with proper 1/2 + 1/2 cards */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          Monthly Costs
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Plan Card */}
          <Card size="page-half" className="flex flex-col">
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-secondary mb-6">
                The Action Plan
              </h3>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Three hours of React app changes and consulting monthly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    99.9% application uptime*
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Monthly dependency audits & security scans
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Package updates & vulnerability patches
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Daily automated cloud backups
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Fix console errors and warnings
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Resolve state management and runtime issues
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Performance optimization & code splitting
                  </span>
                </li>
              </ul>

              <div className="text-center mt-auto">
                <div className="text-3xl font-bold text-primary mb-4">
                  $250 / month
                </div>
                <p className="text-xs text-gray-400 mb-6">
                  *Recommended hosting required for uptime guarantee
                </p>
                <Link
                  href="#contact"
                  className="inline-block bg-gradient-to-r from-primary to-secondary text-base px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Start the Action Plan
                </Link>
              </div>
            </div>
          </Card>

          {/* Performance Plan Card */}
          <Card size="page-half" className="flex flex-col">
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-secondary mb-6">
                The Action Plan (With Performance)
              </h3>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Everything in the basic plan
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Quarterly code reviews & architecture analysis
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Advanced performance optimization
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Bundle size optimization & tree shaking
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    React.memo and useMemo implementation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Lighthouse & Core Web Vitals optimization
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Accessibility audits & improvements
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-gray-200 text-sm">
                    Performance monitoring & analytics
                  </span>
                </li>
              </ul>

              <div className="text-center mt-auto">
                <div className="text-3xl font-bold text-primary mb-4">
                  $300 / month
                </div>
                <p className="text-xs text-gray-400 mb-6">
                  *Recommended hosting required for uptime guarantee
                </p>
                <Link
                  href="#contact"
                  className="inline-block bg-gradient-to-r from-primary to-secondary text-base px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Start the Action Plan
                </Link>
              </div>
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
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          Present and Past React Clients
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
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
          Contact Us to Get Started
        </h2>

        <Card
          size="page-full"
          className="max-w-2xl mx-auto bg-custom-dark-purple"
        >
          <form className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary mb-2 text-sm">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-secondary mb-2 text-sm">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-secondary mb-2 text-sm">
                Email *
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-secondary mb-2 text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-secondary mb-2 text-sm">
                Choose An Action Plan
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    value="basic"
                    className="text-primary"
                  />
                  <span className="text-gray-200">The Action Plan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    value="performance"
                    className="text-primary"
                  />
                  <span className="text-gray-200">
                    The Action Plan (With Performance)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-secondary mb-2 text-sm">
                Application URL
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-secondary mb-2 text-sm">
                Additional Info
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-gray-400 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-base px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Submit
            </button>
          </form>
        </Card>
      </motion.section>
    </main>
  );
}
