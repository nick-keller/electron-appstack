import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  type Boilerplate,
  electronMajor,
  type FeatureKey,
  featureCount,
  featureDefinitions,
  isOutdated,
  others,
  ranking,
  rankOf,
  self,
  updatedYear
} from '../../lib/boilerplates'
import { peersOf, type StackPage, stackPages } from '../../lib/stacks'
import { author, JsonLd, organization, siteUrl } from '../structured-data'
import { FeatureMatrix, SupportLegend } from './boilerplate-ui'
import { CodeBlock } from './code-block'
import { Dock } from './dock'
import styles from './landing.module.css'
import {
  type Accent,
  allTechs,
  CreateCommand,
  createCommand,
  features,
  GetStartedActions,
  guideCount,
  TechLogo
} from './landing-shared'
import { Icon, type IconName } from './lucide-icon'
import { githubUrl, SiteFooter, SiteHeader } from './site'

// The selling, security and typing highlights of the home page, as feature tiles, so the "much
// more" grid shows everything the stack page does not focus on
const extraFeatures: (typeof features)[number][] = [
  {
    title: 'Typed IPC with tRPC',
    description: 'Call the main process from React with typed, zod-validated procedures.',
    href: '/doc/ipc',
    icon: 'exchange'
  },
  {
    title: 'License keys and Stripe',
    description:
      'Activation window, offline use and updates gated by license, with LicenseManager and Stripe.',
    href: '/doc/licensing',
    icon: 'key',
    accent: 'pink'
  },
  {
    title: 'Source code protection',
    description: 'V8 bytecode main process, Electron fuses and ASAR integrity, on by default.',
    href: '/doc/source-protection',
    icon: 'lock'
  }
]

const comparedFeatures: FeatureKey[] = [
  'uiComponents',
  'typedIpc',
  'database',
  'autoUpdate',
  'ciRelease',
  'codeSigning',
  'sourceProtection',
  'licensing',
  'aiAgents'
]

const generalFaq = [
  {
    question: 'Is it really free?',
    answer:
      'Yes. Electron AppStack is open source under the MIT License, with no paid tier. Use it for commercial apps and sell them. LicenseManager is free up to 100 active licenses, and Stripe only charges a fee on the payments you receive.'
  },
  {
    question: 'Is it a framework I depend on?',
    answer:
      'No. You copy the template once with degit and the code is yours. There is no package to update and nothing to eject.'
  }
]

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

// "an Electron…", every keyword starts with "Electron"
function withArticle(keyword: string) {
  return `${/^[AEIOU]/i.test(keyword) ? 'an' : 'a'} ${keyword}`
}

export function StackLanding({ page }: { page: StackPage }) {
  const { landing } = page
  const total = featureDefinitions.length
  const selfCount = featureCount(self)

  // Top maintained rivals of the stack, by rank, for the comparison teaser
  const rivals = ranking
    .filter((b) => b.id !== self.id && page.match(b) && !isOutdated(b))
    .slice(0, 3) as Boilerplate[]
  const rivalsAverage = rivals.length
    ? Math.round(rivals.reduce((sum, b) => sum + featureCount(b), 0) / rivals.length)
    : 0

  // Accented tiles take two cells of the 4-column grid: drop accents from the end until the last
  // row is full
  const more = [
    ...extraFeatures.filter((f) => !landing.highlights.some((h) => h.href === f.href)),
    ...features.filter((f) => !landing.skipFeatures.includes(f.title))
  ].map((f) => ({ ...f }))
  let cells = more.reduce((sum, f) => sum + (f.accent ? 2 : 1), 0)
  for (let i = more.length - 1; i >= 0 && cells % 4 !== 0; i--) {
    if (more[i].accent) {
      more[i].accent = undefined
      cells--
    }
  }

  const faq = [...landing.faq, ...generalFaq]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: `Electron AppStack, ${withArticle(page.keyword)}`,
      description: landing.description,
      url: `${siteUrl}${page.path}`,
      image: `${siteUrl}/opengraph-image.png`,
      codeRepository: githubUrl,
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'Electron',
      license: 'https://opensource.org/license/mit',
      author: { '@id': author['@id'] },
      publisher: { '@id': organization['@id'] },
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

  return (
    <div className={styles.page}>
      <JsonLd data={jsonLd} />
      <SiteHeader />

      <main>
        <section className={styles.hero}>
          <p className={styles.badge}>
            <span className={styles.dot} />
            {landing.eyebrow} · free and open source
          </p>
          <h1 className={styles.title}>
            {landing.h1[0]}
            <span className={styles.highlight}>{landing.h1[1]}</span>
            {landing.h1[2]}
          </h1>
          <p className={styles.tagline}>{landing.tagline}</p>
          <p className={styles.subtitle}>{landing.subtitle}</p>
          <GetStartedActions />
          <CreateCommand />
        </section>

        <div className={styles.bento}>
          <Dock
            label="Built with"
            items={page.logos.flatMap((name) => {
              const tech = allTechs.find((t) => t.name === name)
              return tech ? [{ name, icon: <TechLogo tech={tech} size={26} /> }] : []
            })}
          />
        </div>

        {/* What the stack page is about */}
        <section className={styles.section} aria-labelledby="highlights">
          <SectionHead
            id="highlights"
            eyebrow={`${page.name} setup`}
            title={landing.highlightsTitle}
          >
            {landing.highlightsLead}
          </SectionHead>
          <div className={styles.features}>
            {landing.highlights.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`${styles.tile} ${styles.feature}`}
              >
                <span className={styles.icon}>
                  <Icon name={item.icon as IconName} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${styles.tile} ${styles.dx}`} aria-labelledby="code">
          <div>
            <p className={styles.eyebrow} data-accent="violet">
              {landing.code.eyebrow}
            </p>
            <h2 id="code">{landing.code.title}</h2>
            <p className={styles.lead}>{landing.code.text}</p>
            <Link href={landing.code.href} className={styles.link} data-accent="violet">
              {landing.code.link} <Icon name="arrow" size={18} />
            </Link>
          </div>
          <CodeBlock code={landing.code.code} lang={landing.code.lang} className={styles.code} />
        </section>

        {/* Everything else: the point of the page is that the stack is only the start */}
        <section id="features" className={styles.section} aria-labelledby="more">
          <SectionHead
            id="more"
            eyebrow="And much more"
            title={`Much more than ${withArticle(page.keyword)}`}
          >
            {page.name} is only the start. Electron AppStack includes {selfCount} of the {total}{' '}
            features we compare boilerplates on
            {rivals.length > 0 &&
              `, where the most popular other ${peersOf(page)} average ${rivalsAverage}`}
            : a typed backend, a database, auto update, signed releases, source code protection and
            license keys, all wired together and documented.
          </SectionHead>
          <div className={styles.pillars}>
            {[
              {
                figure: `${selfCount}/${total}`,
                title: 'Features included',
                text: 'Set up, working together and tested in a shipped commercial app.',
                href: '/compare',
                accent: 'lime' as Accent
              },
              {
                figure: `${guideCount} guides`,
                title: 'Documentation',
                text: 'From the first run to signing, notarizing, updating and selling your app.',
                href: '/doc',
                accent: 'violet' as Accent
              },
              {
                figure: `v${electronMajor(self)}`,
                title: 'Latest Electron',
                text: 'The latest Electron, React, Vite and TypeScript, kept current.',
                href: '/best-electron-boilerplate',
                accent: 'cyan' as Accent
              },
              {
                figure: '$0',
                title: 'MIT License',
                text: 'No paid tier. Build commercial apps and sell them.',
                href: '/doc/license',
                accent: 'orange' as Accent
              }
            ].map((pillar) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className={`${styles.tile} ${styles.pillar}`}
                data-accent={pillar.accent}
              >
                <span className={styles.figure}>{pillar.figure}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </Link>
            ))}
          </div>
          <div className={styles.features} style={{ marginTop: 'var(--gap)' }}>
            {more.map((feature) => (
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

        {rivals.length > 0 && (
          <section id="compare" className={styles.section} aria-labelledby="compare-title">
            <SectionHead
              id="compare-title"
              eyebrow="Compare"
              title={`Electron AppStack vs other ${peersOf(page).replace(/^Electron /, '')}`}
            >
              The most popular maintained {peersOf(page)}, side by side. Electron AppStack is #
              {rankOf(self.id)} of {ranking.length} in our ranking.
            </SectionHead>
            <FeatureMatrix columns={[self, ...rivals]} features={comparedFeatures} />
            <SupportLegend />
            <div className={styles.compareLinks}>
              <Link href={page.rankingPath} className={styles.link}>
                {page.ranking.title} in {updatedYear} <Icon name="arrow" size={18} />
              </Link>
              <Link href="/compare" className={styles.link} data-accent="pink">
                Compare with {others.length} Electron boilerplates <Icon name="arrow" size={18} />
              </Link>
            </div>
          </section>
        )}

        <section className={`${styles.tile} ${styles.dx}`} aria-labelledby="start">
          <div>
            <p className={styles.eyebrow} data-accent="orange">
              One command
            </p>
            <h2 id="start">Create your {page.name} Electron app</h2>
            <p className={styles.lead}>
              Copy the template, install, run. Hot reload starts with the example app: a todo list
              stored in SQLite and a settings page with light and dark themes.
            </p>
            <Link href="/doc/getting-started" className={styles.link} data-accent="orange">
              Read the getting started guide <Icon name="arrow" size={18} />
            </Link>
          </div>
          <CodeBlock
            code={`${createCommand}\ncd my-app\nnpm install\nnpm run dev`}
            lang="bash"
            className={styles.code}
          />
        </section>

        <section id="faq" className={styles.section} aria-labelledby="faq-title">
          <SectionHead id="faq-title" eyebrow="FAQ" title="Frequently asked questions" />
          <div className={styles.faq}>
            {faq.map((item) => (
              <details key={item.question} className={styles.tile}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="other-stacks"
          style={{ paddingTop: 0 }}
        >
          <SectionHead id="other-stacks" eyebrow="Same template" title="Looking for another stack?">
            One boilerplate covers all of them: pick the page that matches your search.
          </SectionHead>
          <div className={styles.compareLinks}>
            {stackPages
              .filter((s) => s.id !== page.id)
              .map((s) => (
                <Link key={s.id} href={s.path} className={styles.link}>
                  {s.keyword} <Icon name="arrow" size={18} />
                </Link>
              ))}
            <Link href="/" className={styles.link} data-accent="pink">
              Fullstack Electron boilerplate <Icon name="arrow" size={18} />
            </Link>
          </div>
        </section>

        <section
          className={`${styles.tile} ${styles.cta}`}
          data-accent="lime"
          aria-labelledby="cta"
        >
          <h2 id="cta">Start your {page.name} desktop app today</h2>
          <p>Free, production-ready, and yours from the first command.</p>
          <GetStartedActions />
          <CreateCommand />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
