// next.config.mjs

// Report-only for now: violations log to the browser console but nothing is
// blocked. Once a few weeks of browsing show no legit violations, switch the
// header name to Content-Security-Policy to enforce it.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://www.googletagmanager.com https://*.posthog.com https://challenges.cloudflare.com https://va.vercel-scripts.com",
  "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.convex.site https://*.clerk.accounts.dev https://*.clerk.com https://*.posthog.com https://*.google-analytics.com https://*.googletagmanager.com https://*.uploadthing.com https://utfs.io https://*.ufs.sh https://vitals.vercel-insights.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "frame-src 'self' https://fast.wistia.com https://www.youtube.com https://www.youtube-nocookie.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Pin the workspace root to this repo. Without it, Turbopack walks up and
  // picks a stray lockfile in a parent directory as the root.
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      {
        source: "/career",
        destination: "/career-and-resume",
        permanent: true,
      },
      {
        source: "/projects/apps",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/projects/websites",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
      // uploadthing v7 serves per-app subdomains via ufsUrl (<appId>.ufs.sh),
      // which an exact "ufs.sh" host would miss. Match the apex and subdomains.
      {
        protocol: "https",
        hostname: "ufs.sh",
        port: "",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;