import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd12eu00glpdtk2.cloudfront.net',
        pathname: '/public/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },

  // Experimental features for Next.js 15
  experimental: {
    // Enable server actions by default in Next.js 15
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
