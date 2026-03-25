/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove "X-Powered-By: Next.js" header — minor security win
  poweredByHeader: false,

  // Enable gzip compression (explicit)
  compress: true,

  // Security headers applied to every route
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Strict referrer for privacy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Basic XSS protection (belt-and-suspenders)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Disallow camera/mic/geo access from iframes
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Capsule preview pages: private content — no indexing
        source: '/capsule/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

module.exports = nextConfig
