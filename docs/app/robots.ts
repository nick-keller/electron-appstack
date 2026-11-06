import type { MetadataRoute } from 'next'

// Generated at build time into out/robots.txt. Cloudflare may prepend its managed content signals
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://electron-appstack.com/sitemap.xml'
  }
}
