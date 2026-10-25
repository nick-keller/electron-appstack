import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import type { ReactNode } from 'react'
import { Analytics } from '../analytics'
import 'nextra-theme-docs/style.css'
import '../globals.css'
import './code.css'
import './callout.css'
import './typography.css'

export { metadata } from '../metadata'

// Same mark as the landing page: Lucide "layers" on a lime tile
const logo = (
  <span className="inline-flex items-center gap-2.5">
    <span
      className="grid size-7 place-items-center rounded-[9px] bg-[#c8ff2e] text-[#09090b]"
      aria-hidden
    >
      <svg
        aria-hidden="true"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
        <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
        <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
      </svg>
    </span>
    <b>Electron AppStack</b>
  </span>
)

const navbar = <Navbar logo={logo} projectLink="https://github.com/nick-keller/electron-appstack" />
const banner = (
  <Banner storageKey="star-on-github">
    <a href="https://github.com/nick-keller/electron-appstack" target="_blank" rel="noreferrer">
      Enjoying Electron AppStack? Give it a ⭐ on GitHub →
    </a>
  </Banner>
)
const footer = <Footer>© {new Date().getFullYear()} Electron AppStack</Footer>

export default async function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap('/doc')}
          docsRepositoryBase="https://github.com/nick-keller/electron-appstack/tree/main/docs"
        >
          {children}
        </Layout>
        <Analytics />
      </body>
    </html>
  )
}
