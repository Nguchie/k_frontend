import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Hashed JS/CSS can sit on Cloudflare. HTML and RSC payloads cannot:
        // Cloudflare often ignores Vary, so a cached HTML document can be
        // served to a client-side navigation (or the reverse) and the page
        // goes blank.
        source: "/((?!_next/static|_next/image).*)",
        headers: [
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
