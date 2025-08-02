/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables to expose to the client side
  env: {
    NEXT_PUBLIC_PROD_API_URL: process.env.PROD_API_URL,
  },
  
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
