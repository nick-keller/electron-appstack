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

export default withNextra({})
