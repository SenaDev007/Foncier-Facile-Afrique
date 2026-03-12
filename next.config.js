/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  basePath: '/Foncier-Facile-Afrique',

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.foncierfacileafrique.fr' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
}

module.exports = nextConfig
