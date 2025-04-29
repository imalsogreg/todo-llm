import type { NextConfig } from "next";
  
const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // This prevents attempting to process .node binary files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
      // OR exclude them from processing
      // test: /\.node$/,
      // loader: 'ignore-loader',
    });

    // Prevent webpack from attempting to bundle the native modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@boundaryml/baml': false
      };
    }
    
    return config;
  },
};

export default nextConfig;
