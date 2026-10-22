import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/doc',
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      // Same theme in light and dark mode so code examples always render dark
      theme: { light: 'github-dark', dark: 'github-dark' }
    }
  }
})

export default withNextra({
  // Fully static site, served by Cloudflare Workers Static Assets
  output: 'export',
  // No image optimizer in a static export
  images: { unoptimized: true }
})
