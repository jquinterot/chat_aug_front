/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables to expose to the client side
  env: {
    PROD_API_URL: process.env.PROD_API_URL,
  },
  // Enable static exports for Azure Static Web Apps when not in standalone mode
  output: process.env.NEXT_STANDALONE ? undefined : 'export',
  
  // Add a trailing slash to all paths for better compatibility
  trailingSlash: true,
  
  // Change the output directory based on build type
  distDir: process.env.NEXT_STANDALONE ? '.next' : 'out',
  
  // Disable image optimization for static export
  images: {
    unoptimized: process.env.NEXT_STANDALONE ? false : true,
  },
  
  // Enable React StrictMode for development
  reactStrictMode: process.env.NODE_ENV === 'development',
  
  // Enable standalone output for Docker
  output: process.env.NEXT_STANDALONE ? 'standalone' : 'export',
};

module.exports = nextConfig;
