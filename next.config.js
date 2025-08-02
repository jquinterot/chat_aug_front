/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables are automatically exposed to the browser if they start with NEXT_PUBLIC_
  // No need to manually specify them here
  
  // Enable React StrictMode for development
  reactStrictMode: process.env.NODE_ENV === 'development',
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Enable production optimizations
  swcMinify: true,
  
  // Enable proper image optimization
  images: {
    unoptimized: false,
  },
};

module.exports = nextConfig;
