import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.foncierfacileafrique.fr' },
      { protocol: 'https', hostname: 'foncierfacileafrique.fr' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['www.foncierfacileafrique.fr', 'foncierfacileafrique.fr', 'localhost:3000'],
    },
  },
}

export default nextConfig
