import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import meta from '../../content/_meta'

// llms.txt (https://llmstxt.org): a Markdown index of the site for AI assistants, generated at
// build time from the docs frontmatter, in sidebar order
export const dynamic = 'force-static'

const siteUrl = 'https://electron-appstack.com'

function frontmatter(slug: string) {
  const source = readFileSync(join(process.cwd(), 'content', `${slug}.mdx`), 'utf8')
  const block = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
  const field = (name: string) => {
    const value = block.match(new RegExp(`^${name}: (.*)$`, 'm'))?.[1]
    return value ? (JSON.parse(value) as string) : ''
  }
  return { title: field('title'), description: field('description') }
}

export function GET() {
  const sections: string[] = []
  let current: string[] = []
  let heading = 'Docs'

  for (const [slug, item] of Object.entries(meta)) {
    if (typeof item === 'object' && 'type' in item && item.type === 'separator') {
      sections.push(`## ${heading}\n\n${current.join('\n')}`)
      heading = item.title
      current = []
    } else if (typeof item === 'string') {
      const { title, description } = frontmatter(slug)
      const path = slug === 'index' ? '/doc' : `/doc/${slug}`
      current.push(`- [${title}](${siteUrl}${path}): ${description}`)
    }
  }
  sections.push(`## ${heading}\n\n${current.join('\n')}`)

  const body = `# Electron AppStack

> Free, production-ready Electron boilerplate: React 19, TypeScript, tRPC, SQLite with Drizzle, auto update, code signing and notarization, license keys with Stripe and V8 bytecode source protection. Open source (MIT): free to use, modify, redistribute and build commercial apps.

Create an app: \`npx degit nick-keller/electron-appstack/template my-app\`

${sections.join('\n\n')}

## Comparisons

- [Best Electron boilerplates](${siteUrl}/best-electron-boilerplate): ranking of maintained Electron boilerplates on features, Electron version, maintenance and popularity
- [Electron AppStack vs other Electron boilerplates](${siteUrl}/compare): feature by feature comparison

## Optional

- [GitHub repository](https://github.com/nick-keller/electron-appstack)
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
