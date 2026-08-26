import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.waltonplaza.com.bd" },
    ],
  },
};

export default nextConfig;
