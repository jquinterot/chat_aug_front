/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Azure Static Web Apps
  output: 'export',
  
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  
  // Optional: Change the output directory to 'out' for compatibility
  distDir: 'out',
  
  // Disable image optimization if not using next/image
  images: {
    unoptimized: true,
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
