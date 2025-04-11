import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pbs.twimg.com", "images.unsplash.com"],
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  eslint: {
    // // Warning: This allows production builds to successfully complete even if
    // // your project has ESLint errors.
    // //Temporary, to be reomved during production
    // ignoreDuringBuilds: true,
  },
};

export default nextConfig;