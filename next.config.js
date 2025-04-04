/** @type {import('next').NextConfig} */
const nextConfig = {
  // Default configuration for Vercel
  ...(process.env.VERCEL
    ? {}
    : {
        // GitHub Pages configuration
        output: 'export',
        images: { unoptimized: true },
        basePath: '/Assignment',
        assetPrefix: '/Assignment/',
      }),
}

module.exports = nextConfig
