// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
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