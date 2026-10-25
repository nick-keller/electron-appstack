import Link from 'next/link'
import styles from './landing.module.css'
import { Icon } from './lucide-icon'

export const githubUrl = 'https://github.com/nick-keller/electron-appstack'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandMark} aria-hidden>
          <Icon name="layers" size={18} />
        </span>
        Electron AppStack
      </Link>
      <nav className={styles.nav} aria-label="Main">
        <Link href="/#features">Features</Link>
        <Link href="/compare">Compare</Link>
        <Link href="/#faq">FAQ</Link>
        <Link href="/doc">Docs</Link>
        <a href={githubUrl}>GitHub</a>
        <Link href="/doc/getting-started" className={styles.navCta}>
          Get started
        </Link>
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <strong className={styles.brand}>
            <span className={styles.brandMark} aria-hidden>
              <Icon name="layers" size={18} />
            </span>
            Electron AppStack
          </strong>
          <p>The free, production-ready fullstack Electron boilerplate.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/doc/getting-started">Getting started</Link>
          <Link href="/doc">Documentation</Link>
          <Link href="/doc/licensing">Licensing</Link>
          <Link href="/doc/releasing">Releasing</Link>
          <Link href="/compare">Comparison</Link>
          <Link href="/best-electron-boilerplate">Best Electron boilerplates</Link>
          <Link href="/doc/license">License</Link>
          <a href={githubUrl}>GitHub</a>
        </nav>
      </div>
      <p className={styles.copyright}>© {new Date().getFullYear()} Electron AppStack</p>
    </footer>
  )
}
