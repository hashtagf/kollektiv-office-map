/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  experimental: {
    // Use optimized CSS
    optimizeCss: true,
  },
  // Image optimization
  images: {
    domains: [],
    unoptimized: false,
  },
  // Compress responses
  compress: true,
  // Generate static files
  trailingSlash: false,
  // PoweredByHeader disabled for security
  poweredByHeader: false,
  // React strict mode
  reactStrictMode: true,
  // SWC minification
  swcMinify: true,
}

module.exports = nextConfig