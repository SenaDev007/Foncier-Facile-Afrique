/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.foncierfacileafrique.fr' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['www.foncierfacileafrique.fr', 'localhost:3000'] },
  },
}

module.exports = nextConfig
