/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Needed for @react-pdf/renderer
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
