import type { NextConfig } from "next";
import { withBaml } from '@boundaryml/baml-nextjs-plugin';
  
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
  // Add Tailwind configuration
  experimental: {
    optimizeCss: true,
  },
  // Add custom Tailwind configuration
  tailwindConfig: {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        keyframes: {
          'fade-in': {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          }
        },
        animation: {
          'fade-in': 'fade-in 0.5s ease-out forwards',
        }
      },
    },
  },
};

export default withBaml()(nextConfig);
