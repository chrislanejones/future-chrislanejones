import { MaintenancePage } from "@/components/coastal/maintenance-page";

const services = [
  {
    title: "React App Consulting & Feature Updates",
    description:
      "Three hours of application changes (components, UI/UX updates, API integrations, routing improvements, and performance tweaks) and/or React consulting a month.",
    details:
      "Whether it's refactoring components or modernizing the UI; improving the user experience increases engagement and retention.",
  },
  {
    title: "Security, Maintenance & Code Backups",
    description:
      "Your application's security isn't just about protection—it's about peace of mind and reliability.",
    details:
      "Monthly security audits, vulnerability testing, updating npm dependencies, React version migrations, and automated Git-based backups with disaster recovery plans.",
  },
  {
    title: "Technical Support & Bug Fixes",
    description:
      "Fixing runtime errors, resolving hooks conflicts, debugging component lifecycles, and troubleshooting third-party library integration issues.",
    details:
      "We also resolve deployment and hosting issues. This includes an initial review of your build pipeline and hosting environment.",
  },
  {
    title: "App Performance Optimization",
    description:
      "Improving performance bottlenecks by crushing Google's Core Web Vitals and Lighthouse scores.",
    details:
      "Bundle optimization, code splitting, lazy loading, image optimization, Vite/Webpack tuning, and server-side rendering improvements make up the majority of performance wins. Faster apps improve SEO and user retention.",
  },
  {
    title: "Quarterly Performance Reviews",
    description:
      "Stay ahead of the curve and capture new opportunities with data-driven insights and metrics.",
    details:
      "Improvements to bundle size, runtime performance, and Lighthouse scores through strategic React optimizations and dependency management.",
  },
  {
    title: "Based in the USA",
    description: "Our skilled US-based professionals handle every project.",
    details:
      "We understand modern JavaScript ecosystems and share a similar time zone. We take pride in our work and your app's success.",
  },
];

export default function ServicesPage() {
  return (
    <MaintenancePage
      kind="React"
      plus="Performance"
      image="/gallery/Whiteboard-Notes.webp"
      title="Keep your React app moving."
      services={services}
      basicFeatures={[
        "Three hours of app changes and consulting monthly",
        "99.9% application uptime",
        "Monthly security audits & vulnerability testing",
        "npm dependency updates & React migrations",
        "Daily Git repository backups",
        "Fix broken features & API integrations",
        "Resolve dependency conflicts & bugs",
        "Bundle optimization & code splitting",
      ]}
      plusFeatures={[
        "Everything in the basic plan",
        "Quarterly Performance Reviews",
        "Lighthouse score improvements & Core Web Vitals",
        "Bundle size analysis & dependency optimization",
        "SSR/SSG implementation guidance",
        "State management optimization",
        "Performance monitoring setup",
        "Analytics & RUM reporting",
      ]}
    />
  );
}
