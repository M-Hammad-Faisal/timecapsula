export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // no indexing of API routes
          '/capsule/', // private capsule pages
          '/dashboard', // private user dashboard
          '/auth/', // auth callback
        ],
      },
    ],
    sitemap: 'https://timecapsula.website/sitemap.xml',
    host: 'https://timecapsula.website',
  }
}
