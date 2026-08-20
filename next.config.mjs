import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

/** @param {string} phase @returns {import('next').NextConfig} */
const nextConfig = (phase) => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  agentRules: false,
  async headers() {
    return [{ source: '/sounds/notification.mp3', headers: [{ key: 'Content-Type', value: 'audio/wav' }, { key: 'Cache-Control', value: 'public, max-age=3600' }] }]
  },
  async rewrites() {
    const backend = process.env.BACKEND_API_URL || 'https://komrez.fleximagepro.com/api'
    return [{ source: '/backend-api/:path*', destination: `${backend}/:path*` }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
})

export default nextConfig
