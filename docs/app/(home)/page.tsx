import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import {
  type Boilerplate,
  boilerplates,
  type FeatureKey,
  others,
  self,
  updatedYear
} from '../../lib/boilerplates'
import { openGraphImages } from '../metadata'
import { author, JsonLd, organization, siteUrl, website } from '../structured-data'
import { FeatureMatrix, SupportLegend } from './boilerplate-ui'
import { CodeBlock } from './code-block'
import { CopyButton } from './copy-button'
import { Dock } from './dock'
import styles from './landing.module.css'
import { Icon, type IconName } from './lucide-icon'
import { githubUrl, SiteFooter, SiteHeader } from './site'

const createCommand = 'npx degit nick-keller/electron-appstack/template my-app'

const title = 'Electron Boilerplate – Production-ready, Fullstack and Free'
const description =
  'Free, production-ready Electron boilerplate: React, TypeScript, tRPC, SQLite, auto update, code signing and Stripe license keys. Ship your desktop app in days.'

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
    description,
    images: openGraphImages
  },
  twitter: { card: 'summary_large_image', title, description, images: openGraphImages }
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

// Every docs page except the introduction and the license text, counted at build time
const guideCount = readdirSync(join(process.cwd(), 'content')).filter(
  (file) => file.endsWith('.mdx') && !['index.mdx', 'license.mdx'].includes(file)
).length

// Selling, security and typing have their own highlight tiles below, so the pillars only carry
// what is not shown anywhere else
const pillars: {
  title: string
  description: string
  href: string
  icon: IconName
  accent: Accent
  figure: string
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
    title: 'Great documentation',
    description:
      'A guide for every feature, from the first run to signing, notarizing and selling your app, written for this exact template.',
    href: '/doc',
    icon: 'book',
    accent: 'violet',
    figure: `${guideCount} guides`
  }
]

// Boilerplates shown in the comparison teaser, next to Electron AppStack: the most popular ones
const comparedIds = ['electron-react-boilerplate', 'electron-vite', 'electron-forge']
const comparedColumns = [
  self,
  ...comparedIds.flatMap((id) => boilerplates.filter((b) => b.id === id))
] as Boilerplate[]
const comparedFeatures: FeatureKey[] = [
  'aiAgents',
  'uiComponents',
  'i18n',
  'typedIpc',
  'database',
  'autoUpdate',
  'ciRelease',
  'codeSigning',
  'sourceProtection',
  'licensing'
]

// Features with an accent take a double-width colored tile in the bento grid. Typed IPC, source
// protection, licensing and secure defaults are left out: the highlight tiles cover them
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

// Community links, kept out of the FAQ (and its JSON-LD) so the FAQ only answers product questions
const community: { title: string; description: string; href: string }[] = [
  {
    title: 'Report an issue',
    description:
      'Open an issue with the steps to reproduce it, your platform and what you expected.',
    href: `${githubUrl}/issues/new?template=bug_report.yml`
  },
  {
    title: 'Suggest an improvement',
    description:
      'Feature ideas, better defaults and missing documentation are all welcome. Describe the problem it solves.',
    href: `${githubUrl}/issues/new?template=feature_request.yml`
  },
  {
    title: 'Contribute',
    description:
      'Pull requests are welcome, from typo fixes to new features. For a big change, open an issue first.',
    href: `${githubUrl}/pulls`
  },
  {
    title: 'Showcase your app',
    description:
      'Built an app with it? Share its name, link and a screenshot, mention Electron AppStack on social media and get a dofollow backlink.',
    href: `${githubUrl}/issues/new?template=showcase.yml`
  },
  {
    title: 'Spread the word',
    description:
      'Star the repository and share Electron AppStack on social media, mentioning @NicolasKa3 on X.',
    href: 'https://x.com/NicolasKa3'
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
      'Electron AppStack is open source under the MIT License. You can use, modify, fork and redistribute it, build commercial apps with it and sell those apps and their installers. Just keep the copyright notice and license text in copies of the source code.',
    content: (
      <>
        Electron AppStack is open source under the MIT License. You can use, modify, fork and
        redistribute it, build commercial apps with it and sell those apps and their installers.
        Just keep the copyright notice and license text in copies of the source code. Read the{' '}
        <Link href="/doc/license">full license</Link>.
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
      'Yes, that is what it is made for. Licensing with LicenseManager and Stripe is built in, and your main process ships as V8 bytecode, which makes your code much harder to read and modify in the packaged app. Licensing stays disabled until you configure it, so free apps work too.'
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
      'Yes. The template ships an AGENTS.md, a CLAUDE.md and skills, so Claude Code, Cursor, Codex and GitHub Copilot follow the project conventions when they add routes, procedures or tables, and run the lint, type check and tests before they finish.'
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
  }
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      organization,
      author,
      {
        '@type': 'SoftwareSourceCode',
        name: 'Electron AppStack',
        description,
        url: siteUrl,
        image: `${siteUrl}/opengraph-image.png`,
        codeRepository: githubUrl,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Electron',
        license: 'https://opensource.org/license/mit',
        author: { '@id': author['@id'] },
        publisher: { '@id': organization['@id'] },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }
    ]
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
      <CopyButton text={createCommand} event="copy_create_command" className={styles.copy} />
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
      <JsonLd data={jsonLd} />

      <SiteHeader />

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
            <span className={`${styles.figure} ${styles.secured}`}>
              <Icon name="lock" />
              Secured
            </span>
            <p>Bytecode, Electron fuses and ASAR integrity guard your code, on by default.</p>
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

        {/* Maker: the template comes from a shipped commercial app */}
        <section className={styles.makerSection} aria-labelledby="maker">
          <article className={`${styles.tile} ${styles.maker}`}>
            <div>
              <p className={styles.eyebrow} data-accent="orange">
                Battle-tested
              </p>
              <h2 id="maker">Extracted from RabbitGUI, a commercial Electron app</h2>
              <p className={styles.lead}>
                <a href="https://rabbitgui.com">RabbitGUI</a> is a RabbitMQ client for macOS,
                Windows and Linux, sold with license keys. Electron AppStack is its foundation: the
                same typed IPC, database, updater, release pipeline and licensing that ship in
                RabbitGUI today.
              </p>
              <blockquote className={styles.quote}>
                <p>
                  “Setting all of this up took me months, and none of it had anything to do with the
                  app itself. I turned it into a template so you can skip that part and spend your
                  time on your own app.”
                </p>
                <footer className={styles.author}>
                  <Image
                    src="/images/nicolas-keller.jpg"
                    alt="Nicolas Keller"
                    width={56}
                    height={56}
                    className={styles.avatar}
                  />
                  <span>
                    <strong>Nicolas Keller</strong>
                    <small>
                      Maker of RabbitGUI and Electron AppStack ·{' '}
                      <a href={twitterUrl}>@NicolasKa3</a>
                    </small>
                  </span>
                </footer>
              </blockquote>
            </div>
            <a href="https://rabbitgui.com" className={styles.makerShot} style={{ borderRadius: 6}}>
              <Image
                src="/images/rabbitgui-electron-app.webp"
                alt="RabbitGUI, the Electron app Electron AppStack was extracted from, showing the messages of a dead letter queue"
                width={1352}
                height={720}
              />
            </a>
          </article>
        </section>

        {/* Value pillars */}
        <section className={styles.section} aria-labelledby="why">
          <SectionHead
            id="why"
            eyebrow="Skip months of setup"
            title="A free Electron boilerplate, documented end to end"
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
                data-accent={pillar.accent}
                data-wide
              >
                <span className={styles.icon} data-accent={pillar.accent}>
                  <Icon name={pillar.icon} />
                </span>
                <span className={styles.figure}>{pillar.figure}</span>
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
              <h2 id="sell">Sell your Electron app with Stripe and license keys</h2>
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
            <h2 id="secure">Protect your Electron app source code</h2>
            <p className={styles.lead}>
              Production builds compile the main process to V8 bytecode, so your business logic is
              not shipped as readable JavaScript and is much harder to reverse engineer. Electron
              fuses and ASAR integrity make the app refuse to run modified code. All on by default,
              nothing to configure.
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
            <h2 id="typed">Type-safe Electron IPC with tRPC, from database to UI</h2>
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
            title="Every feature a production Electron app needs"
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

        {/* Comparison teaser, the full tables are on /compare */}
        <section id="compare" className={styles.section} aria-labelledby="compare-title">
          <SectionHead
            id="compare-title"
            eyebrow="Compare"
            title="Electron AppStack vs other Electron boilerplates"
          >
            Most Electron templates give you a window and a build. Here is what the most popular
            ones include, out of the box.
          </SectionHead>
          <FeatureMatrix columns={comparedColumns} features={comparedFeatures} />
          <SupportLegend />
          <div className={styles.compareLinks}>
            <Link href="/compare" className={styles.link}>
              Compare with {others.length} Electron boilerplates <Icon name="arrow" size={18} />
            </Link>
            <Link href="/best-electron-boilerplate" className={styles.link} data-accent="pink">
              Best Electron boilerplates in {updatedYear} <Icon name="arrow" size={18} />
            </Link>
          </div>
        </section>

        {/* Tech stack */}
        <section id="stack" className={styles.section} aria-labelledby="stack-title">
          <SectionHead
            id="stack-title"
            eyebrow="Modern stack"
            title="The Electron, React and TypeScript stack"
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
            <h2 id="docs">Create an Electron app in one command</h2>
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

        {/* Community */}
        <section id="community" className={styles.section} aria-labelledby="community-title">
          <SectionHead id="community-title" eyebrow="Community" title="Help make it better" />
          <div className={styles.community}>
            {community.map((item) => (
              <a key={item.title} href={item.href} className={`${styles.tile} ${styles.feature}`}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          className={`${styles.tile} ${styles.cta}`}
          data-accent="lime"
          aria-labelledby="cta"
        >
          <h2 id="cta">Start building your Electron app today</h2>
          <p>Free, production-ready, and yours from the first command.</p>
          <GetStartedActions />
          <CreateCommand />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
