const jiti = require('jiti')(__filename);

// Import env here to validate during build. Using jiti we can import .ts files in .js
jiti('./src/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
  // Configure image domains if you use next/image
  images: {
    domains: [],
  },
  // Configure redirects, rewrites, headers as needed
};

module.exports = nextConfig;
