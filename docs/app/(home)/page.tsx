import Link from 'next/link'
import { CopyButton } from './copy-button'
import styles from './landing.module.css'

const githubUrl = 'https://github.com/nick-keller/electron-appstack'

const createCommand = 'npx degit nick-keller/electron-appstack/template my-app'

const features = [
  {
    title: 'Hot reload',
    description:
      'electron-vite reloads the renderer instantly and restarts the main process on change.',
    href: '/doc/development'
  },
  {
    title: 'Modern React stack',
    description: 'TanStack Router, TanStack Query, shadcn/ui and Tailwind CSS in the renderer.',
    href: '/doc/ui'
  },
  {
    title: 'Typed IPC',
    description: 'tRPC and zod over IPC: fully typed, validated calls to the main process.',
    href: '/doc/ipc'
  },
  {
    title: 'Local database',
    description: 'SQLite with Drizzle ORM, migrations applied automatically on startup.',
    href: '/doc/database'
  },
  {
    title: 'Signed releases',
    description:
      'Changesets and GitHub Actions to build, sign, notarize and publish for every platform.',
    href: '/doc/releasing'
  },
  {
    title: 'Auto update',
    description: 'electron-updater checks GitHub Releases and installs new versions.',
    href: '/doc/auto-update'
  },
  {
    title: 'Dark mode and translations',
    description: 'System, light or dark theme and i18next, in the renderer and the native menu.',
    href: '/doc/theming'
  },
  {
    title: 'Ready for AI agents',
    description: 'AGENTS.md and skills so Claude Code and other agents follow the conventions.',
    href: '/doc/ai-agents'
  },
  {
    title: 'Secure defaults',
    description: 'Sandboxed renderer, context isolation and a strict Content Security Policy.',
    href: '/doc/project-structure'
  }
]

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Electron AppStack
        </Link>
        <nav className={styles.nav}>
          <Link href="/doc">Documentation</Link>
          <a href={githubUrl}>GitHub</a>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Ship desktop apps with <span className={styles.accent}>Electron</span> and TypeScript
          </h1>
          <p className={styles.subtitle}>
            A complete starter with React, tRPC, SQLite, auto update and signed releases. Not a
            framework: copy the template once and the code is yours.
          </p>
          <div className={styles.actions}>
            <Link href="/doc/getting-started" className={styles.primary}>
              Get started
            </Link>
            <a href={githubUrl} className={styles.secondary}>
              View on GitHub
            </a>
          </div>
          <div className={styles.command}>
            <code>
              <span className={styles.prompt}>$</span> {createCommand}
            </code>
            <CopyButton text={createCommand} className={styles.copy} />
          </div>
        </section>

        <section className={styles.features}>
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href} className={styles.card}>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </Link>
          ))}
        </section>

        <section className={styles.cta}>
          <h2>Start building in minutes</h2>
          <pre className={styles.code}>
            <code>{`${createCommand}\ncd my-app\nnpm install\nnpm run dev`}</code>
          </pre>
          <Link href="/doc" className={styles.primary}>
            Read the documentation
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>© {new Date().getFullYear()} Electron AppStack</footer>
    </div>
  )
}
