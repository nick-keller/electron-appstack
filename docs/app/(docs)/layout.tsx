import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import type { ReactNode } from 'react'
import 'nextra-theme-docs/style.css'
import '../globals.css'
import './code.css'
import './callout.css'
import './typography.css'

export { metadata } from '../metadata'

const navbar = (
  <Navbar
    logo={<b>Electron AppStack</b>}
    projectLink="https://github.com/nick-keller/electron-appstack"
  />
)
const footer = <Footer>© {new Date().getFullYear()} Electron AppStack</Footer>

export default async function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap('/doc')}
          docsRepositoryBase="https://github.com/nick-keller/electron-appstack/tree/main/docs"
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
