// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  async headers() {
    return [
      {
        // Prevent the *.vercel.app deployment domains from being indexed as
        // duplicates of the canonical www.chrislanejones.com site. This kills
        // "Alternate page with proper canonical tag" and "Duplicate, Google
        // chose different canonical" reports.
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
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
      {
        protocol: "https",
        hostname: "ufs.sh",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;