// next.config.mjs

const isDev = process.env.NODE_ENV !== "production";
// Vercel sets VERCEL_ENV at build time; preview builds get the Vercel Toolbar.
const isPreview = process.env.VERCEL_ENV === "preview";

function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

// Clerk's publishable key is "pk_<env>_" + base64("<frontend api host>$"),
// the same decoding @clerk/nextjs does. Without a key, allow the dev instance
// from convex/auth.config.ts and the production domain it documents.
function clerkOrigins() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const host = key
    ? Buffer.from(key.split("_")[2] ?? "", "base64").toString().replace(/\$$/, "")
    : "";
  return /^[a-z0-9.-]+$/i.test(host)
    ? [`https://${host}`]
    : ["https://amazed-akita-72.clerk.accounts.dev", "https://clerk.chrislanejones.com"];
}

// The Convex client opens a websocket to its deployment; fall back to any
// deployment when the URL isn't known at build time.
const convexOrigin = originOf(process.env.NEXT_PUBLIC_CONVEX_URL);
const convex = convexOrigin
  ? [convexOrigin, convexOrigin.replace(/^https:/, "wss:")]
  : ["https://*.convex.cloud", "wss://*.convex.cloud"];

const clerk = clerkOrigins();
// Clerk's own defaults in @clerk/nextjs server/content-security-policy:
// Cloudflare Turnstile for bot protection, and its fraud-protection hosts.
const clerkProtect = ["https://challenges.cloudflare.com", "https://*.protect.clerk.com"];

// PostHog's US/EU ingest and asset hosts (posthog-js derives one from the
// other), plus a custom NEXT_PUBLIC_POSTHOG_HOST if one is set.
const posthogHost = originOf(process.env.NEXT_PUBLIC_POSTHOG_HOST);
const posthog = [
  "https://*.i.posthog.com",
  ...(posthogHost && !/\.i\.posthog\.com$/.test(posthogHost) ? [posthogHost] : []),
];

// Vercel Toolbar on preview deployments only (vercel.com/docs/vercel-toolbar).
const vercelToolbar = isPreview ? ["https://vercel.live"] : [];

const scriptHosts = [
  ...clerk,
  ...clerkProtect,
  // Google Analytics 4, per Google's tag CSP guide.
  "https://*.googletagmanager.com",
  ...posthog,
  ...vercelToolbar,
];

const directives = {
  "default-src": ["'self'"],
  // Next.js and React need eval only for dev tooling; production builds don't.
  "script-src": ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : []), ...scriptHosts],
  "style-src": ["'self'", "'unsafe-inline'", ...vercelToolbar],
  "connect-src": [
    "'self'",
    ...convex,
    ...clerk,
    "https://clerk-telemetry.com",
    "https://*.clerk-telemetry.com",
    "https://*.protect.clerk.com:*",
    ...posthog,
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
    // UploadThing: the browser PUTs files to <region>.ingest.uploadthing.com.
    "https://*.uploadthing.com",
    ...(isPreview ? ["https://vercel.live", "wss://ws-us3.pusher.com"] : []),
  ],
  // Favicons on /browser-tabs and the link page come from whatever site each
  // admin-entered link points at, so images stay open to any https host.
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "media-src": ["'self'"],
  "font-src": ["'self'", ...(isPreview ? ["https://vercel.live", "https://assets.vercel.com"] : [])],
  "frame-src": ["https://fast.wistia.com", ...clerkProtect, ...vercelToolbar],
  // Clerk runs a blob: worker.
  "worker-src": ["'self'", "blob:"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
};

const serialize = (policy) =>
  Object.entries(policy)
    .map(([name, sources]) => [name, ...sources].join(" "))
    .join("; ");

// Enforced. Inline scripts and styles stay allowed: blocking them needs a
// per-request nonce, which would make every static and ISR page dynamic.
const contentSecurityPolicy = serialize(directives);

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
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
      ...[
        ["/wordpress-maintenance-hero.jpg", "/wordpress-maintenance-hero.webp"],
        ["/Repo-Cover.jpg", "/Repo-Cover.webp"],
        ["/Repo-Cover-V2.jpg", "/Repo-Cover-V2.webp"],
        ["/conferences/All-Things-Open-2024-Smaller.png", "/conferences/All-Things-Open-2024-Smaller.webp"],
        ["/conferences/That-Conference-Logo-LowRes.png", "/conferences/That-Conference-Logo-LowRes.webp"],
        ["/conferences/RenderATL-2024-Logo-Green.png", "/conferences/RenderATL-2024-Logo-Green.webp"],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
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
    qualities: [60, 75],
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
