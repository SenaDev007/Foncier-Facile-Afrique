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
  // En dev, désactive le cache disque Webpack pour éviter ENOENT sur vendor-chunks
  // (framer-motion, motion-*, sonner) et les 404 sur _next/static après recompilations.
  webpack: (config, { dev }) => {
    if (dev) config.cache = false
    return config
  },
}

module.exports = nextConfig
