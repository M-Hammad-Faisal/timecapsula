export default function sitemap() {
  const base = 'https://timecapsula.website'

  const staticRoutes = ['', '/login', '/privacy', '/terms', '/write'].map(path => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1.0 : path === '/write' ? 0.9 : 0.6,
  }))

  // Individual template landing pages would go here if we had them
  // Capsule /capsule/[id] pages are private and excluded (X-Robots-Tag: noindex in next.config.js)

  return staticRoutes
}
