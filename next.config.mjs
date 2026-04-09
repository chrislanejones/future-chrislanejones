// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  async redirects() {
    return [
      {
        source: "/links",
        destination: "/link-page",
        permanent: true,
      },
      {
        source: "/docs/",
        destination: "/career",
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
    ],
  },
};

export default nextConfig;