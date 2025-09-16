/** @type {import('next').NextConfig} */
const nextConfig = {
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