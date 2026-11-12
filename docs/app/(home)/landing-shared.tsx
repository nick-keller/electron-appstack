// Pieces shared by the home page and the stack landing pages (/electron-react-boilerplate...)

import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { CopyButton } from './copy-button'
import styles from './landing.module.css'
import { Icon, type IconName } from './lucide-icon'
import { githubUrl } from './site'

export const createCommand = 'npx degit nick-keller/electron-appstack/template my-app'

export type Tech = {
  name: string
  description: string
  url: string
  // Path of a colored logo in public/logos. Monochrome logos are tinted with the text color
  logo?: string
  mono?: boolean
}

export const stack: { category: string; techs: Tech[] }[] = [
  {
    category: 'Desktop',
    techs: [
      {
        name: 'Electron',
        description: 'Cross-platform desktop runtime',
        url: 'https://www.electronjs.org',
        logo: '/logos/electron.svg',
        mono: true
      },
      {
        name: 'electron-vite',
        description: 'Build tool and dev server',
        url: 'https://electron-vite.org'
      },
      {
        name: 'Node.js',
        description: 'Main process runtime',
        url: 'https://nodejs.org',
        logo: '/logos/nodejs.svg'
      },
      {
        name: 'V8 bytecode',
        description: 'Compiled main process',
        url: 'https://v8.dev',
        logo: '/logos/v8.svg'
      }
    ]
  },
  {
    category: 'Frontend',
    techs: [
      {
        name: 'React',
        description: 'UI library, version 19',
        url: 'https://react.dev',
        logo: '/logos/react.svg'
      },
      {
        name: 'TypeScript',
        description: 'Strict types everywhere',
        url: 'https://www.typescriptlang.org',
        logo: '/logos/typescript.svg'
      },
      {
        name: 'Vite',
        description: 'Instant hot reload',
        url: 'https://vite.dev',
        logo: '/logos/vite.svg'
      },
      {
        name: 'TanStack Router',
        description: 'Type-safe file-based routing',
        url: 'https://tanstack.com/router',
        logo: '/logos/tanstack.svg',
        mono: true
      },
      {
        name: 'TanStack Query',
        description: 'Data fetching and caching',
        url: 'https://tanstack.com/query',
        logo: '/logos/reactquery.svg'
      },
      {
        name: 'Tailwind CSS',
        description: 'Utility-first styling, v4',
        url: 'https://tailwindcss.com',
        logo: '/logos/tailwindcss.svg'
      },
      {
        name: 'shadcn/ui',
        description: 'Accessible components',
        url: 'https://ui.shadcn.com',
        logo: '/logos/shadcnui.svg',
        mono: true
      },
      {
        name: 'Radix UI',
        description: 'Headless primitives',
        url: 'https://www.radix-ui.com',
        logo: '/logos/radixui.svg',
        mono: true
      },
      {
        name: 'Lucide',
        description: 'Icon set',
        url: 'https://lucide.dev',
        logo: '/logos/lucide.svg'
      },
      {
        name: 'i18next',
        description: 'Typed translations',
        url: 'https://www.i18next.com',
        logo: '/logos/i18next.svg'
      }
    ]
  },
  {
    category: 'Backend and data',
    techs: [
      {
        name: 'tRPC',
        description: 'End-to-end typed IPC',
        url: 'https://trpc.io',
        logo: '/logos/trpc.svg'
      },
      {
        name: 'Zod',
        description: 'Runtime validation',
        url: 'https://zod.dev',
        logo: '/logos/zod.svg'
      },
      {
        name: 'SQLite',
        description: 'Embedded local database',
        url: 'https://sqlite.org',
        logo: '/logos/sqlite.svg'
      },
      {
        name: 'Drizzle ORM',
        description: 'Typed queries and migrations',
        url: 'https://orm.drizzle.team',
        logo: '/logos/drizzle.svg'
      },
      {
        name: 'electron-store',
        description: 'Typed app config',
        url: 'https://github.com/sindresorhus/electron-store'
      }
    ]
  },
  {
    category: 'Shipping and selling',
    techs: [
      {
        name: 'electron-builder',
        description: 'Installers for every platform',
        url: 'https://www.electron.build',
        logo: '/logos/electronbuilder.svg',
        mono: true
      },
      {
        name: 'electron-updater',
        description: 'Automatic updates',
        url: 'https://www.electron.build/auto-update',
        logo: '/logos/electronbuilder.svg',
        mono: true
      },
      {
        name: 'GitHub Actions',
        description: 'Build, sign and publish',
        url: 'https://github.com/features/actions',
        logo: '/logos/github.svg',
        mono: true
      },
      {
        name: 'Changesets',
        description: 'Versions and changelog',
        url: 'https://github.com/changesets/changesets'
      },
      {
        name: 'LicenseManager.dev',
        description: 'License keys and activation',
        url: 'https://licensemanager.dev',
        logo: '/logos/licensemanager.svg'
      },
      {
        name: 'Stripe',
        description: 'Payments',
        url: 'https://stripe.com',
        logo: '/logos/stripe.svg'
      }
    ]
  },
  {
    category: 'Tooling',
    techs: [
      {
        name: 'Biome',
        description: 'Linting and formatting',
        url: 'https://biomejs.dev',
        logo: '/logos/biome.svg'
      },
      {
        name: 'Vitest',
        description: 'Unit tests',
        url: 'https://vitest.dev',
        logo: '/logos/vitest.svg'
      },
      {
        name: 'Claude Code',
        description: 'AGENTS.md and skills included',
        url: 'https://claude.com/claude-code',
        logo: '/logos/claude.svg'
      }
    ]
  }
]

export const allTechs = stack.flatMap((group) => group.techs)

export type Accent = 'lime' | 'pink' | 'violet' | 'cyan' | 'orange'

// Every docs page except the introduction and the license text, counted at build time
export const guideCount = readdirSync(join(process.cwd(), 'content')).filter(
  (file) => file.endsWith('.mdx') && !['index.mdx', 'license.mdx'].includes(file)
).length

// Features with an accent take a double-width colored tile in the bento grid. Typed IPC, source
// protection, licensing and secure defaults are left out: the highlight tiles cover them
export const features: {
  title: string
  description: string
  href: string
  icon: IconName
  accent?: Accent
}[] = [
  {
    title: 'Hot reload',
    description:
      'electron-vite reloads the renderer instantly and restarts the main process on change.',
    href: '/doc/development',
    icon: 'zap',
    accent: 'orange'
  },
  {
    title: 'Modern React stack',
    description:
      'React 19 with type-safe file-based routing from TanStack Router and TanStack Query.',
    href: '/doc/ui',
    icon: 'atom'
  },
  {
    title: 'Design system',
    description:
      'shadcn/ui components and Tailwind CSS v4, with system, light and dark themes built in.',
    href: '/doc/ui',
    icon: 'palette'
  },
  {
    title: 'Typed app config',
    description: 'electron-store validated by a zod schema, read and written from anywhere.',
    href: '/doc/config',
    icon: 'settings'
  },
  {
    title: 'Local database',
    description:
      'SQLite with Drizzle ORM: typed queries, generated migrations applied automatically on startup.',
    href: '/doc/database',
    icon: 'database',
    accent: 'violet'
  },
  {
    title: 'Auto update',
    description: 'electron-updater checks GitHub Releases and installs new versions.',
    href: '/doc/auto-update',
    icon: 'refresh'
  },
  {
    title: 'Dark mode',
    description: 'System, light or dark theme, from the native menu or the settings.',
    href: '/doc/theming',
    icon: 'moon'
  },
  {
    title: 'Translations',
    description: 'i18next with typed keys, shared by the renderer and the native menu.',
    href: '/doc/i18n',
    icon: 'languages'
  },
  {
    title: 'Signed releases',
    description:
      'Changesets and GitHub Actions to build, sign, notarize and publish for every platform.',
    href: '/doc/releasing',
    icon: 'rocket',
    accent: 'cyan'
  },
  {
    title: 'Icons and images',
    description: 'Conventions for the app icon, DMG background and renderer images.',
    href: '/doc/assets',
    icon: 'image'
  },
  {
    title: 'Ready for AI agents',
    description:
      'AGENTS.md, CLAUDE.md and skills so Claude Code, Cursor, Codex and Copilot follow the conventions.',
    href: '/doc/ai-agents',
    icon: 'sparkles',
    accent: 'lime'
  },
  {
    title: 'Unit tests',
    description: 'Vitest tests for the main process, on an in-memory database, without Electron.',
    href: '/doc/testing',
    icon: 'flask'
  }
]

export function TechLogo({ tech, size = 32 }: { tech: Tech; size?: number }) {
  if (!tech.logo) {
    // Placeholder until a logo is added to public/logos
    return (
      <span className={styles.logoPlaceholder} style={{ width: size, height: size }} aria-hidden>
        {tech.name[0]}
      </span>
    )
  }
  if (tech.mono) {
    return (
      <span
        className={styles.logoMono}
        style={{ width: size, height: size, '--logo': `url(${tech.logo})` } as CSSProperties}
        aria-hidden
      />
    )
  }
  return <Image src={tech.logo} alt="" width={size} height={size} className={styles.logoImg} />
}

export function GetStartedActions() {
  return (
    <div className={styles.actions}>
      <Link href="/doc/getting-started" className={styles.primary}>
        Get started
        <Icon name="arrow" size={18} />
      </Link>
      <a href={githubUrl} className={styles.secondary}>
        View on GitHub
      </a>
    </div>
  )
}

export function CreateCommand() {
  return (
    <div className={styles.command}>
      <code>
        <span className={styles.prompt}>$</span> {createCommand}
      </code>
      <CopyButton text={createCommand} event="copy_create_command" className={styles.copy} />
    </div>
  )
}
