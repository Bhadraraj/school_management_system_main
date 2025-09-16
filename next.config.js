/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Remove basePath and assetPrefix - they're causing the 404s
  // basePath: '/school_management_system',
  // assetPrefix: '/school_management_system',
  
  images: { 
    unoptimized: true 
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  swcMinify: true,
};

module.exports = nextConfig;