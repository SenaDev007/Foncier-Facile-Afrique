/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/notre-expertise', destination: '/services', permanent: true },
      { source: '/simulateur', destination: '/contact', permanent: true },
      { source: '/simulateurs', destination: '/contact', permanent: true },
    ]
  },
  output: 'standalone',
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.foncierfacileafrique.fr' },
      { protocol: 'https', hostname: 'foncierfacileafrique.fr' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['www.foncierfacileafrique.fr', 'foncierfacileafrique.fr', 'localhost:3000'],
    },
  },
  // En dev, désactive le cache disque Webpack pour éviter ENOENT sur vendor-chunks
  // (framer-motion, motion-*, sonner) et les 404 sur _next/static après recompilations.
  webpack: (config, { dev }) => {
    if (dev) config.cache = false
    return config
  },
}

module.exports = nextConfig
