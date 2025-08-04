/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables are automatically exposed to the browser if they start with NEXT_PUBLIC_
  
  // Enable React StrictMode for development
  reactStrictMode: process.env.NODE_ENV === 'development',
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Enable proper image optimization
  images: {
    unoptimized: false,
  },
  
  // Enable SWC for faster builds
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { 
      exclude: ['error'] 
    } : false,
  },
  
  // Configure webpack to handle Babel only for tests
  webpack: (config, { isServer, dev, isServer: _isServer }) => {
    // Only use Babel for tests
    if (process.env.NODE_ENV === 'test') {
      const babelLoader = {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
          },
        },
      };
      
      config.module.rules.push(babelLoader);
    }
    
    return config;
  },
};

module.exports = nextConfig;
