// @ts-nocheck
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  // Add memory optimization for server issues
  experimental: {
    serverComponentsExternalPackages: ['@wagmi/core'],
  },
  // Add webpack configuration for better memory handling
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'bufferutil', 'utf-8-validate'];
    }
    
    // Optimize bundle size
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Handle viem test utilities that may be missing
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /setIntervalMining\.js$/,
      })
    );

    // Additional ignore for test directories in viem
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\/test\//,
        contextRegExp: /viem/,
      })
    );
    
    return config;
  },
  // Add headers for CORS if needed
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig; 