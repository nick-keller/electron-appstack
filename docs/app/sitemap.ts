import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { MetadataRoute } from 'next'

// Generated at build time into out/sitemap.xml
export const dynamic = 'force-static'

const baseUrl = 'https://electron-appstack.com'
const contentDir = join(process.cwd(), 'content')

// Date of the last commit touching these files, or nothing outside a git checkout
function lastModified(...files: string[]) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], {
      encoding: 'utf8'
    }).trim()
    return date ? new Date(date) : undefined
  } catch {
    return undefined
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '/', files: ['app/(home)/page.tsx'] },
    { path: '/best-electron-boilerplate', files: ['app/(home)/best-electron-boilerplate', 'data'] },
    { path: '/compare', files: ['app/(home)/compare', 'data'] }
  ]

  const docs = readdirSync(contentDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      return { path: slug === 'index' ? '/doc' : `/doc/${slug}`, files: [`content/${file}`] }
    })

  return [...pages, ...docs].map(({ path, files }) => ({
    url: path === '/' ? baseUrl : `${baseUrl}${path}`,
    lastModified: lastModified(...files)
  }))
}
