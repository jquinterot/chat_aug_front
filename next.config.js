/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Azure Static Web Apps
  output: 'export',
  
  // Add a trailing slash to all paths for better compatibility
  trailingSlash: true,
  
  // Change the output directory to 'out' for compatibility
  distDir: 'out',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable React StrictMode for static export
  reactStrictMode: false,
};

module.exports = nextConfig;
