/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  turbopack: { root: process.cwd() },
  async rewrites() {
    const backend = process.env.BACKEND_API_URL || 'https://komrez.fleximagepro.com/api'
    return [{ source: '/backend-api/:path*', destination: `${backend}/:path*` }]
  },
}
export default nextConfig
