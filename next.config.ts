import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pbs.twimg.com", "images.unsplash.com"],
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
};

export default nextConfig;