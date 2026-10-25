import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { CodeBlock } from './code-block'
import { CopyButton } from './copy-button'
import { Dock } from './dock'
import styles from './landing.module.css'

const githubUrl = 'https://github.com/nick-keller/electron-appstack'

const createCommand = 'npx degit nick-keller/electron-appstack/template my-app'

const title = 'Electron Boilerplate – Production-ready, Fullstack and Free'
const description =
  'Free, production-ready fullstack Electron boilerplate with React, TypeScript, tRPC, SQLite, auto update, signed releases, V8 bytecode protection and license keys with Stripe. Create and sell your desktop app in days, not months.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    'electron boilerplate',
    'fullstack electron boilerplate',
    'electron starter',
    'electron template',
    'electron react typescript',
    'electron vite boilerplate',
    'electron trpc',
    'electron sqlite',
    'electron licensing',
    'sell desktop app'
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Electron AppStack',
    title,
    description
  },
  twitter: { card: 'summary_large_image', title, description }
}

type Tech = {
  name: string
  description: string
  url: string
  // Path of a colored logo in public/logos. Monochrome logos are tinted with the text color
  logo?: string
  mono?: boolean
}

const stack: { category: string; techs: Tech[] }[] = [
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
        name: 'Claude Code',
        description: 'AGENTS.md and skills included',
        url: 'https://claude.com/claude-code',
        logo: '/logos/claude.svg'
      }
    ]
  }
]

const heroLogos = [
  'Electron',
  'React',
  'TypeScript',
  'Vite',
  'tRPC',
  'SQLite',
  'Drizzle ORM',
  'Tailwind CSS',
  'shadcn/ui',
  'TanStack Router',
  'GitHub Actions',
  'LicenseManager.dev',
  'Stripe',
  'Biome'
]

const allTechs = stack.flatMap((group) => group.techs)

type Accent = 'lime' | 'pink' | 'violet' | 'cyan' | 'orange'

// Lucide icon paths, drawn inline so the landing page has no icon dependency
const icons = {
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </>
  ),
  dollar: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </>
  ),
  shield: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  ),
  braces: (
    <>
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
      <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
    </>
  ),
  zap: (
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  ),
  book: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1" />
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
    </>
  ),
  palette: (
    <>
      <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </>
  ),
  settings: (
    <>
      <path d="M14 17H5" />
      <path d="M19 7h-9" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </>
  ),
  exchange: (
    <>
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  key: (
    <>
      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
    </>
  ),
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  languages: (
    <>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </>
  ),
  image: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </>
  ),
  sparkles: (
    <>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  arrow: (
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  layers: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  )
}

type IconName = keyof typeof icons

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {icons[name]}
    </svg>
  )
}

// Wide pillars fill their tile with the accent color and show a big figure, the others show the
// accent on their icon
const pillars: {
  title: string
  description: string
  href: string
  icon: IconName
  accent: Accent
  figure?: string
}[] = [
  {
    title: '100% free',
    description:
      'No license fee, no subscription, no paid tier. Copy the template once, change every line of code and sell the apps you build with it.',
    href: '/doc/license',
    icon: 'gift',
    accent: 'lime',
    figure: '$0'
  },
  {
    title: 'Ready to sell',
    description:
      'License keys with licensemanager.dev and payments with Stripe: activation window, offline use and updates gated by license.',
    href: '/doc/licensing',
    icon: 'dollar',
    accent: 'pink'
  },
  {
    title: 'Secure',
    description:
      'Main process shipped as V8 bytecode, Electron fuses, ASAR integrity, sandboxed renderer and a strict Content Security Policy.',
    href: '/doc/source-protection',
    icon: 'shield',
    accent: 'cyan'
  },
  {
    title: 'Fully typed',
    description:
      'TypeScript from the database to the UI: Drizzle schema, tRPC procedures, zod inputs, routes, config and translation keys.',
    href: '/doc/ipc',
    icon: 'braces',
    accent: 'violet'
  },
  {
    title: 'Great DX',
    description:
      'Instant hot reload, one command to start, Biome for linting and formatting, and AGENTS.md so AI agents follow the conventions.',
    href: '/doc/development',
    icon: 'zap',
    accent: 'orange'
  },
  {
    title: 'Great documentation',
    description:
      'A guide for every feature, from the first run to signing, notarizing and selling your app, written for this exact template.',
    href: '/doc',
    icon: 'book',
    accent: 'violet',
    figure: '16 guides'
  }
]

// Features with an accent take a double-width colored tile in the bento grid
const features: {
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
    title: 'Local database',
    description: 'SQLite with Drizzle ORM, migrations applied automatically on startup.',
    href: '/doc/database',
    icon: 'database'
  },
  {
    title: 'Typed app config',
    description: 'electron-store validated by a zod schema, read and written from anywhere.',
    href: '/doc/config',
    icon: 'settings'
  },
  {
    title: 'Typed IPC',
    description: 'tRPC and zod over IPC: fully typed, validated calls to the main process.',
    href: '/doc/ipc',
    icon: 'exchange',
    accent: 'violet'
  },
  {
    title: 'Auto update',
    description: 'electron-updater checks GitHub Releases and installs new versions.',
    href: '/doc/auto-update',
    icon: 'refresh'
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
    title: 'Source code protection',
    description:
      'Main process shipped as V8 bytecode, locked down with Electron fuses and ASAR integrity.',
    href: '/doc/source-protection',
    icon: 'lock'
  },
  {
    title: 'Licensing',
    description:
      'License keys with licensemanager.dev: activation window, offline use and gated updates.',
    href: '/doc/licensing',
    icon: 'key',
    accent: 'pink'
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
    title: 'Icons and images',
    description: 'Conventions for the app icon, DMG background and renderer images.',
    href: '/doc/assets',
    icon: 'image'
  },
  {
    title: 'Ready for AI agents',
    description: 'AGENTS.md and skills so Claude Code and other agents follow the conventions.',
    href: '/doc/ai-agents',
    icon: 'sparkles',
    accent: 'lime'
  },
  {
    title: 'Secure defaults',
    description: 'Sandboxed renderer, context isolation and a strict Content Security Policy.',
    href: '/doc/project-structure',
    icon: 'shieldCheck'
  }
]

const protections = [
  'V8 bytecode main process',
  'Electron fuses',
  'ASAR integrity',
  'Sandboxed renderer',
  'Context isolation',
  'Strict CSP'
]

// Bento placement of the stack groups, by category
const stackLayout: Record<string, string> = {
  Frontend: 'stackFull',
  Desktop: 'stackHalf',
  'Backend and data': 'stackHalf',
  'Shipping and selling': 'stackWide',
  Tooling: 'stackNarrow'
}

const sellSteps = [
  {
    title: 'Customer pays with Stripe',
    description: 'Connect your Stripe account to LicenseManager and share a checkout link.'
  },
  {
    title: 'License key by email',
    description: 'LicenseManager creates the license and emails the key to your customer.'
  },
  {
    title: 'App activates',
    description:
      'The activation window checks the key once, then the app keeps it valid in the background, online or offline.'
  },
  {
    title: 'Updates follow the license',
    description: 'The auto updater only installs the versions the license includes.'
  }
]

const typedExample = `// src/main/trpc/routers/todos.ts (main process)
export const todosRouter = router({
  create: licensedProcedure
    .input(z.object({ title: z.string().trim().min(1).max(200) }))
    .mutation(({ ctx, input }) =>
      ctx.db.insert(todos).values(input).returning().get()
    )
})

// src/renderer/src/routes/index.tsx (renderer)
const create = useMutation(trpc.todos.create.mutationOptions())
create.mutate({ title: 'Ship v1' }) // typed, validated, autocompleted`

const twitterUrl = 'https://x.com/NicolasKa3'

// `answer` is the plain text used in the FAQPage JSON-LD, `content` replaces it on the page when
// the answer has links
const faq: { question: string; answer: string; content?: ReactNode }[] = [
  {
    question: 'Is Electron AppStack really free?',
    answer:
      'Yes. The boilerplate is free, with no paid tier. LicenseManager is free up to 100 active licenses, and Stripe only charges a fee on the payments you receive.'
  },
  {
    question: 'What does the license allow?',
    answer:
      'Electron AppStack is free, source-available software. You can use and modify it to build commercial apps, and sell those apps and their installers. You cannot sell the boilerplate itself as a template, or publish a repackaged or lightly modified version of it as a competing starter kit.',
    content: (
      <>
        Electron AppStack is free, source-available software. You can use and modify it to build
        commercial apps, and sell those apps and their installers. You cannot sell the boilerplate
        itself as a template, or publish a repackaged or lightly modified version of it as a
        competing starter kit. Read the <Link href="/doc/license">full license</Link>.
      </>
    )
  },
  {
    question: 'What is a fullstack Electron boilerplate?',
    answer:
      'A starting point that covers both sides of a desktop app: the React interface in the renderer, and the Node.js backend in the main process with a SQLite database, typed IPC with tRPC, auto update, releases and licensing, already wired together.'
  },
  {
    question: 'Can I sell the app I build with it?',
    answer:
      'Yes, that is what it is made for. Licensing with LicenseManager and Stripe is built in, and your main process ships as V8 bytecode so your code is not readable in the packaged app. Licensing stays disabled until you configure it, so free apps work too.'
  },
  {
    question: 'How do I sell an Electron app?',
    answer:
      'Customers pay through a Stripe checkout link, LicenseManager creates a license and emails the key, and the app asks for it in its activation window. Perpetual licenses, subscriptions, a maximum number of computers per license and updates for a limited time are all set in your LicenseManager policy, without changing the code.'
  },
  {
    question: 'How do I add license keys to an Electron app?',
    answer:
      'They are already there. Set your LicenseManager product id and API key, and the app shows an activation window, validates the key, stores it in the system keychain, keeps working offline for as long as your policy allows and only installs the updates the license includes.'
  },
  {
    question: 'How do I protect the source code of an Electron app?',
    answer:
      'JavaScript in a packaged Electron app is easy to read, so the main process, where the licensing and business logic live, is compiled to V8 bytecode. Electron fuses block running the app as plain Node.js or with inspector flags, and ASAR integrity stops the app from starting if its files were modified.'
  },
  {
    question: 'How do I auto update an Electron app?',
    answer:
      'electron-updater is set up to read GitHub Releases. The app checks for a new version on startup and every 4 hours, downloads it in the background, then offers to restart or installs it when the app quits, on macOS, Windows and Linux (AppImage).'
  },
  {
    question: 'How do I code sign and notarize an Electron app?',
    answer:
      'Add your certificates as GitHub secrets: the release workflow signs and notarizes macOS builds with an Apple Developer ID (99 USD per year) and signs Windows builds with Azure Artifact Signing (from 9.99 USD per month). Without the secrets, it still builds unsigned installers.'
  },
  {
    question: 'Which platforms are supported?',
    answer:
      'macOS (dmg, arm64 and x64), Windows (NSIS installer, x64 and arm64) and Linux (AppImage and deb). Merging a pull request is enough for the GitHub Actions workflow to build, sign, notarize and publish installers for every platform.'
  },
  {
    question: 'Can I keep my source code private?',
    answer:
      'Yes. Build from a private repository and publish the releases to a second, public repository that only contains the installers, so auto update keeps working without exposing your code.'
  },
  {
    question: 'Why Electron and not Tauri?',
    answer:
      'Electron ships the same Chromium on every platform, so your React app looks and behaves the same everywhere, and the backend is Node.js, with the whole npm ecosystem and one language for the whole app. Tauri makes smaller installers, but uses a different webview per platform and a Rust backend.'
  },
  {
    question: 'How is it different from electron-vite or Electron Forge templates?',
    answer:
      'Those templates give you a window and a build. Electron AppStack starts where they stop: a typed backend with tRPC and SQLite, routing, a design system, translations, auto update, a release pipeline, source code protection and licensing, all wired together and documented.'
  },
  {
    question: 'Is it a framework I depend on?',
    answer:
      'No. You copy the template once with degit and the code is yours. There is no package to update and nothing to eject.'
  },
  {
    question: 'Does it work with AI coding agents?',
    answer:
      'Yes. The template ships an AGENTS.md and skills, so Claude Code and other agents follow the project conventions when they add routes, procedures or tables.'
  },
  {
    question: 'Why is it free?',
    answer:
      'I built RabbitGUI, a desktop app made with Electron, and setting everything up took me months: typed IPC, a local database, auto update, code signing on every platform, source code protection, license keys. None of it had anything to do with the app itself. Once it all worked, I turned it into this template and gave it away, so other developers can skip that part and spend their time on their own app.',
    content: (
      <>
        I built <a href="https://rabbitgui.com">RabbitGUI</a>, a desktop app made with Electron, and
        setting everything up took me months: typed IPC, a local database, auto update, code signing
        on every platform, source code protection, license keys. None of it had anything to do with
        the app itself. Once it all worked, I turned it into this template and gave it away, so
        other developers can skip that part and spend their time on their own app.
      </>
    )
  },
  {
    question: 'How can I report an issue?',
    answer:
      'Open an issue on GitHub with the steps to reproduce it, your platform and what you expected to happen.',
    content: (
      <>
        Open an <a href={`${githubUrl}/issues/new?template=bug_report.yml`}>issue on GitHub</a> with
        the steps to reproduce it, your platform and what you expected to happen.
      </>
    )
  },
  {
    question: 'How can I suggest an improvement?',
    answer:
      'Open an issue on GitHub describing your idea and the problem it solves. Feature ideas, better defaults and missing documentation are all welcome.',
    content: (
      <>
        Open an <a href={`${githubUrl}/issues/new?template=feature_request.yml`}>issue on GitHub</a>{' '}
        describing your idea and the problem it solves. Feature ideas, better defaults and missing
        documentation are all welcome.
      </>
    )
  },
  {
    question: 'How can I contribute?',
    answer:
      'Pull requests are welcome on GitHub, from typo fixes to new features. For a big change, open an issue first so we can agree on the approach before you write the code.',
    content: (
      <>
        <a href={`${githubUrl}/pulls`}>Pull requests</a> are welcome, from typo fixes to new
        features. For a big change, open an issue first so we can agree on the approach before you
        write the code.
      </>
    )
  },
  {
    question: 'How can I say thank you and help the project?',
    answer:
      'Spread the word: star the repository on GitHub and share Electron AppStack on social media, mentioning @NicolasKa3 on X. It helps more developers find it, and it makes my day.',
    content: (
      <>
        Spread the word: star the <a href={githubUrl}>repository on GitHub</a> and share Electron
        AppStack on social media, mentioning <a href={twitterUrl}>@NicolasKa3</a> on X. It helps
        more developers find it, and it makes my day.
      </>
    )
  },
  {
    question: 'I built an app with Electron AppStack, can I showcase it here?',
    answer:
      'Of course! Open an issue on GitHub with your app name, a link and a screenshot. Mention Electron AppStack on social media and your showcase gets a dofollow backlink to your website.',
    content: (
      <>
        Of course! Open an{' '}
        <a href={`${githubUrl}/issues/new?template=showcase.yml`}>issue on GitHub</a> with your app
        name, a link and a screenshot. Mention Electron AppStack on social media and your showcase
        gets a dofollow backlink to your website.
      </>
    )
  }
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'Electron AppStack',
    description,
    codeRepository: githubUrl,
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'Electron',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  }
]

function TechLogo({ tech, size = 32 }: { tech: Tech; size?: number }) {
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

function GetStartedActions() {
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

function CreateCommand() {
  return (
    <div className={styles.command}>
      <code>
        <span className={styles.prompt}>$</span> {createCommand}
      </code>
      <CopyButton text={createCommand} className={styles.copy} />
    </div>
  )
}

function SectionHead({
  id,
  eyebrow,
  title,
  children
}: {
  id: string
  eyebrow: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className={styles.sectionHead}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {children && <p className={styles.lead}>{children}</p>}
    </div>
  )
}

// Flat mock of the template app, until a real screenshot is added
function AppMock() {
  return (
    <div className={styles.mock} aria-hidden>
      <div className={styles.mockBar}>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.mockBody}>
        <div className={styles.mockSide}>
          <i data-active />
          <i />
          <i />
          <i />
        </div>
        <div className={styles.mockMain}>
          <b />
          {['lime', 'pink', 'violet', 'cyan'].map((accent, index) => (
            <div key={accent} className={styles.mockRow} data-accent={accent}>
              <span data-done={index < 2 || undefined} />
              <em style={{ width: `${70 - index * 12}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden>
            <Icon name="layers" size={18} />
          </span>
          Electron AppStack
        </Link>
        <nav className={styles.nav} aria-label="Main">
          <a href="#features">Features</a>
          <a href="#stack">Stack</a>
          <a href="#faq">FAQ</a>
          <Link href="/doc">Docs</Link>
          <a href={githubUrl}>GitHub</a>
          <Link href="/doc/getting-started" className={styles.navCta}>
            Get started
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Production-ready <span className={styles.highlight}>Electron</span> boilerplate
          </h1>
          <p className={styles.tagline}>
            Create and sell your desktop app in <span className={styles.days}>days</span>,{' '}
            <span className={styles.notMonths}>not months</span>.
          </p>
          <p className={styles.subtitle}>
            A fullstack Electron starter with React, TypeScript, tRPC and SQLite, plus everything
            you need to ship: auto update, signed releases, source code protection and license keys.
          </p>
          <GetStartedActions />
          <CreateCommand />
        </section>

        <div className={styles.bento}>
          <div className={`${styles.tile} ${styles.heroShot}`}>
            <AppMock />
          </div>
          <div className={`${styles.tile} ${styles.heroSide}`} data-accent="cyan">
            <span className={styles.figure}>V8</span>
            <p>Main process shipped as bytecode, so your code stays unreadable.</p>
          </div>
          <div className={`${styles.tile} ${styles.heroSide}`} data-accent="pink">
            <span className={styles.osLogos} role="img" aria-label="macOS, Windows and Linux">
              {['apple', 'windows', 'linux'].map((os) => (
                <span key={os} style={{ '--logo': `url(/logos/${os}.svg)` } as CSSProperties} />
              ))}
            </span>
            <p>Signed installers for macOS, Windows and Linux from one workflow.</p>
          </div>
          <Dock
            label="Built with"
            items={heroLogos.flatMap((name) => {
              const tech = allTechs.find((t) => t.name === name)
              return tech ? [{ name, icon: <TechLogo tech={tech} size={26} /> }] : []
            })}
          />
        </div>

        {/* Value pillars */}
        <section className={styles.section} aria-labelledby="why">
          <SectionHead
            id="why"
            eyebrow="Why Electron AppStack"
            title="Skip months of setup. Ship the app."
          >
            Every desktop app needs the same foundation before the first feature. It is already
            built, tested and documented here.
          </SectionHead>
          <div className={styles.pillars}>
            {pillars.map((pillar) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className={`${styles.tile} ${styles.pillar}`}
                data-accent={pillar.figure ? pillar.accent : undefined}
                data-wide={pillar.figure ? true : undefined}
              >
                <span className={styles.icon} data-accent={pillar.accent}>
                  <Icon name={pillar.icon} />
                </span>
                {pillar.figure && <span className={styles.figure}>{pillar.figure}</span>}
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <span className={styles.go} aria-hidden>
                  <Icon name="arrow" size={18} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Ready to sell, secure, fully typed */}
        <section className={styles.bento} aria-label="Highlights">
          <article className={`${styles.tile} ${styles.sell}`}>
            <div>
              <p className={styles.eyebrow} data-accent="lime">
                Ready to sell
              </p>
              <h2 id="sell">Get paid for your desktop app from day one</h2>
              <p className={styles.lead}>
                Licensing is wired into the app, the updater and the IPC layer. Connect{' '}
                <a href="https://licensemanager.dev">licensemanager.dev</a> to Stripe and start
                selling license keys: perpetual or subscription, per computer, with offline use.
              </p>
              <Link href="/doc/licensing" className={styles.link} data-accent="lime">
                Read the licensing guide <Icon name="arrow" size={18} />
              </Link>
            </div>
            <ol className={styles.steps}>
              {sellSteps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </article>

          <article className={`${styles.tile} ${styles.secure}`}>
            <p className={styles.eyebrow} data-accent="cyan">
              Secure
            </p>
            <h2 id="secure">Your code stays yours</h2>
            <p className={styles.lead}>
              Production builds compile the main process to V8 bytecode, so your business logic is
              not readable in the app archive. Electron fuses and ASAR integrity make the app refuse
              to run modified code. All on by default, nothing to configure.
            </p>
            <ul className={styles.checks}>
              {protections.map((item) => (
                <li key={item}>
                  <Icon name="check" size={16} />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/doc/source-protection" className={styles.link} data-accent="cyan">
              How source code protection works <Icon name="arrow" size={18} />
            </Link>
          </article>

          <article className={`${styles.tile} ${styles.typed}`}>
            <p className={styles.eyebrow} data-accent="violet">
              Fully typed
            </p>
            <h2 id="typed">One type system, from the database to the UI</h2>
            <p className={styles.lead}>
              Define a table with Drizzle, expose it with a tRPC procedure, call it from React:
              inputs are validated with zod and every call is autocompleted.
            </p>
            <CodeBlock code={typedExample} className={styles.code} />
            <Link href="/doc/ipc" className={styles.link} data-accent="violet">
              Explore typed IPC with tRPC <Icon name="arrow" size={18} />
            </Link>
          </article>
        </section>

        {/* Features */}
        <section id="features" className={styles.section} aria-labelledby="features-title">
          <SectionHead
            id="features-title"
            eyebrow="Features"
            title="Everything a production desktop app needs"
          >
            Each feature is set up, working together, and documented.
          </SectionHead>
          <div className={styles.features}>
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className={`${styles.tile} ${styles.feature}`}
                data-accent={feature.accent}
              >
                <span className={styles.icon} data-accent={feature.accent}>
                  <Icon name={feature.icon} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section id="stack" className={styles.section} aria-labelledby="stack-title">
          <SectionHead
            id="stack-title"
            eyebrow="Modern stack"
            title="Built with the tools you already love"
          >
            Electron, React, TypeScript and Vite at the core, with the best libraries of the
            ecosystem around them, on their latest versions.
          </SectionHead>
          <div className={styles.bento}>
            {stack.map((group) => (
              <div
                key={group.category}
                className={`${styles.tile} ${styles[stackLayout[group.category] ?? 'stackNarrow']}`}
              >
                <h3 className={styles.stackTitle}>{group.category}</h3>
                <ul className={styles.stack}>
                  {group.techs.map((tech) => (
                    <li key={tech.name}>
                      <a href={tech.url} className={styles.tech}>
                        <TechLogo tech={tech} size={28} />
                        <span>
                          <strong>{tech.name}</strong>
                          <small>{tech.description}</small>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Documentation and DX */}
        <section className={`${styles.tile} ${styles.dx}`} aria-labelledby="docs">
          <div>
            <p className={styles.eyebrow} data-accent="orange">
              Great DX and documentation
            </p>
            <h2 id="docs">From npm run dev to your first sale</h2>
            <p className={styles.lead}>
              One command starts the app with hot reload. The documentation then walks you through
              every step: building screens, storing data, translating, releasing, signing,
              notarizing, updating and selling. AI agents get their own instructions too.
            </p>
            <Link href="/doc" className={styles.link} data-accent="orange">
              Browse the documentation <Icon name="arrow" size={18} />
            </Link>
          </div>
          <CodeBlock
            code={`${createCommand}\ncd my-app\nnpm install\nnpm run dev`}
            lang="bash"
            className={styles.code}
          />
        </section>

        {/* FAQ */}
        <section id="faq" className={styles.section} aria-labelledby="faq-title">
          <SectionHead id="faq-title" eyebrow="FAQ" title="Frequently asked questions" />
          <div className={styles.faq}>
            {faq.map((item) => (
              <details key={item.question} className={styles.tile}>
                <summary>{item.question}</summary>
                <p>{item.content ?? item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          className={`${styles.tile} ${styles.cta}`}
          data-accent="lime"
          aria-labelledby="cta"
        >
          <h2 id="cta">Start building your desktop app today</h2>
          <p>Free, production-ready, and yours from the first command.</p>
          <GetStartedActions />
          <CreateCommand />
        </section>
      </main>

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
            <Link href="/doc/license">License</Link>
            <a href={githubUrl}>GitHub</a>
          </nav>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} Electron AppStack</p>
      </footer>
    </div>
  )
}
