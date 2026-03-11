/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.foncierfacileafrique.fr' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['www.foncierfacileafrique.fr', 'localhost:3000'] },
  },
}

module.exports = nextConfig
