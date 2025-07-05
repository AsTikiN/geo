import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude problematic directories from webpack scanning
    config.watchOptions = {
      ignored: [
        "**/node_modules",
        "**/.git",
        "**/dist",
        "**/build",
        "**/.next",
        "**/C:/Users/**/Cookies",
        "**/C:/Users/**/AppData",
        "**/C:/Users/**/Local",
        "**/C:/Users/**/Roaming",
        "**/C:/Windows",
        "**/C:/Program Files",
        "**/C:/Program Files (x86)",
      ],
    };

    // Add fallback for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    return config;
  },
  // Disable telemetry
  telemetry: false,
  // Set output to standalone for better compatibility
  output: "standalone",
};

export default nextConfig;