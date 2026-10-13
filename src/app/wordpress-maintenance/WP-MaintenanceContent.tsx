import { MaintenancePage } from "@/components/coastal/maintenance-page";

const services = [
  {
    title: "Website Consulting & Design Edits",
    description:
      "Three hours of site changes (copy, images, SEO edits, e-commerce additions, and videos) and/or website consulting a month.",
    details:
      "Whether it's refreshing content or reimagining layouts; improving the design increases engagement.",
  },
  {
    title: "Security, Maintenance & Backups",
    description:
      "Your website's security isn't just about protection—it's about peace of mind.",
    details:
      "Monthly security scans, vulnerability testing, updating plugins/themes, Disaster recovery plan – daily WordPress offsite backups on secure servers.",
  },
  {
    title: "Technical Support & Troubleshooting",
    description:
      "Fixing broken links and images, resolving website errors and bugs, and troubleshooting plugin and theme conflicts.",
    details:
      "We also resolve uptime problems. This also includes an initial review of the hosting web panel setup.",
  },
  {
    title: "Site Performance Optimization",
    description:
      "Improving performance bottlenecks by crushing Google's PageSpeed Insights score.",
    details:
      "Image optimization, JavaScript / CSS minification, caching implementation, and server optimization make up the majority of performance issues. Faster sites improve SEO Rankings.",
  },
  {
    title: "Quarterly SEO Reviews",
    description:
      "Stay ahead of the curve and capture new opportunities with data-driven insights.",
    details:
      "Improvements to meta tags and page-level content help boost rankings.",
  },
  {
    title: "Based in the USA",
    description: "Our skilled US-based professionals handle every project.",
    details:
      "We understand your market and share a similar time zone. We take pride in our work.",
  },
];

export default function ServicesPage() {
  return (
    <MaintenancePage
      kind="WordPress"
      plus="SEO"
      image="/wordpress-maintenance-hero.webp"
      title="Keep your website running well."
      services={services}
      basicFeatures={[
        "Three hours of site changes and consulting monthly",
        "99.9% website uptime",
        "Monthly security scans & vulnerability testing",
        "Plugin/theme updates",
        "Daily WordPress offsite backups",
        "Fix broken links and images",
        "Resolve errors and conflicts",
        "Performance optimization",
      ]}
      plusFeatures={[
        "Everything in the basic plan",
        "Quarterly SEO Reviews",
        "SEO improvements to meta tags",
        "Page-level content optimization",
        "Keyword research and implementation",
        "Competitor analysis",
        "Search ranking monitoring",
        "Analytics reporting",
      ]}
    />
  );
}
