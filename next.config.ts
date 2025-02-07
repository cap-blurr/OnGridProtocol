import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pbs.twimg.com", "hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
};

export default nextConfig;