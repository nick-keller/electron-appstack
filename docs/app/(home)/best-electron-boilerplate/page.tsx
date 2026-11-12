import type { Metadata } from 'next'
import Link from 'next/link'
import {
  featureCount,
  featureDefinitions,
  isOutdated,
  latestElectron,
  latestElectronMajor,
  ranking,
  scoreWeights,
  selfId,
  topPicks,
  updatedAt,
  updatedYear
} from '../../../lib/boilerplates'
import { stackPages } from '../../../lib/stacks'
import { openGraphImages } from '../../metadata'
import { BoilerplatePage, Cta, SectionHead, UpdatedNote } from '../boilerplate-ui'
import styles from '../boilerplates.module.css'
import landing from '../landing.module.css'
import { Icon } from '../lucide-icon'
import {
  OutdatedList,
  RankingList,
  RankingTable,
  rankingJsonLd,
  scoreKeys,
  weightLabels
} from '../ranking-ui'

const current = ranking.filter((b) => !isOutdated(b))
const outdated = ranking.filter(isOutdated)
const { winner, alsoWon, picks } = topPicks()

const title = `Best Electron boilerplates in ${updatedYear}`
const description = `The ${current.length} best Electron boilerplates of ${updatedYear}, ranked on ${featureDefinitions.length} features, Electron version, maintenance and popularity: ${current
  .slice(0, 3)
  .map((b) => b.name)
  .join(', ')} and more.`

export const metadata: Metadata = {
  title: { absolute: `${title}: ${current.length} starters compared` },
  description,
  keywords: [
    `best electron boilerplate ${updatedYear}`,
    'best electron boilerplate',
    'electron boilerplate',
    'electron starter',
    'electron template',
    'electron react boilerplate',
    'electron vite template'
  ],
  alternates: { canonical: '/best-electron-boilerplate' },
  openGraph: {
    type: 'article',
    url: '/best-electron-boilerplate',
    siteName: 'Electron AppStack',
    title,
    description,
    images: openGraphImages
  },
  twitter: { card: 'summary_large_image', title, description, images: openGraphImages }
}

const jsonLd = rankingJsonLd({ name: title, description, dateModified: updatedAt, list: current })

export default function BestBoilerplatePage() {
  return (
    <BoilerplatePage jsonLd={jsonLd}>
      <section className={styles.hero}>
        <p className={landing.eyebrow}>Ranking {updatedYear}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>
          {ranking.length} Electron boilerplates and templates scored on {featureDefinitions.length}{' '}
          features, their Electron version, how recently they were updated and their GitHub stars.
          The latest Electron release is {latestElectron}.
        </p>
        <UpdatedNote />
      </section>

      <section aria-labelledby="picks">
        <h2 id="picks" className="sr-only">
          Top picks
        </h2>
        <div className={styles.cards}>
          <article className={`${landing.tile} ${styles.card}`} data-accent="lime">
            <p className={landing.eyebrow} style={{ color: 'var(--on-accent)' }}>
              <Icon name="trophy" size={14} /> Best overall
            </p>
            <h3>{winner.name}</h3>
            <p>
              {winner.scores.overall}/100, with {featureCount(winner)} of{' '}
              {featureDefinitions.length} features included.
            </p>
            {alsoWon.length > 0 && (
              <div className={styles.chips}>
                {alsoWon.map((label) => (
                  <span key={label} className={styles.chip}>
                    {label}
                  </span>
                ))}
              </div>
            )}
            <p className={styles.cardLinks}>
              <a href={`#${winner.id}`}>See details</a>
            </p>
          </article>
          {picks.map((pick) => (
            <article key={pick.title} className={`${landing.tile} ${styles.card}`}>
              <p className={landing.eyebrow}>{pick.title}</p>
              <h3>{pick.boilerplate.name}</h3>
              <p>{pick.reason}</p>
              <p className={styles.cardLinks}>
                <a href={`#${pick.boilerplate.id}`}>See details</a>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="overview">
        <SectionHead eyebrow="At a glance" title="Quick comparison" id="overview">
          Every boilerplate still maintained, by overall score.
        </SectionHead>
        <RankingTable list={current} />
      </section>

      <section className={styles.section} aria-labelledby="ranking">
        <SectionHead eyebrow="Ranking" title="The full ranking" id="ranking">
          Each score is out of 100. See the methodology below for how it is computed.
        </SectionHead>
        <RankingList list={current} />
      </section>

      {outdated.length > 0 && (
        <section className={styles.section} aria-labelledby="outdated">
          <SectionHead eyebrow="Avoid" title="Outdated boilerplates" id="outdated">
            Still popular in search results, but archived or stuck on an Electron version that no
            longer receives security fixes. Electron supports its latest three major versions.
          </SectionHead>
          <OutdatedList list={outdated} />
        </section>
      )}

      <section className={styles.section} aria-labelledby="methodology">
        <SectionHead eyebrow="Methodology" title="How the score is computed" id="methodology" />
        <div className={styles.methodology}>
          <p>
            The overall score is a weighted average of four scores out of 100:{' '}
            {scoreKeys
              .map((key) => `${weightLabels[key]} (${scoreWeights[key] * 100}%)`)
              .join(', ')}
            .
          </p>
          <p>
            <strong>Features</strong> sums the weight of every feature included, half of it when the
            feature is partial or needs manual setup. <strong>Electron version</strong> starts at
            100 on Electron {latestElectronMajor} and loses 20 points per major version behind.{' '}
            <strong>Maintenance</strong> is 100 when the repository was updated in the last 90 days,
            and decreases to 0 after two years or when it is archived. <strong>Popularity</strong>{' '}
            is logarithmic in GitHub stars, relative to the most starred boilerplate.
          </p>
          <div className={styles.tableWrap}>
            <table className={`${styles.table} ${styles.tableLeft}`}>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Group</th>
                  <th scope="col">Weight</th>
                  <th scope="col">Included in</th>
                </tr>
              </thead>
              <tbody>
                {featureDefinitions.map((f) => (
                  <tr key={f.key}>
                    <th scope="row">
                      {f.label}
                      <small>{f.description}</small>
                    </th>
                    <td className={styles.text}>{f.group}</td>
                    <td className={styles.numeric}>{f.weight}</td>
                    <td className={styles.numeric}>
                      {current.filter((b) => b.features[f.key] === 'yes').length}/{current.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            This page is published by Electron AppStack, which is part of the ranking. To keep it
            fair, every number on this page is computed from the same data file, and stars, last
            commits and Electron versions are refreshed from GitHub with a script. Features are
            checked by hand against each template's source code.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="by-stack">
        <SectionHead eyebrow="By stack" title="Rankings by stack" id="by-stack">
          The same scores, filtered on the stack you want to build with.
        </SectionHead>
        <div className={landing.compareLinks}>
          {stackPages.map((page) => (
            <Link key={page.id} href={page.rankingPath} className={landing.link}>
              {page.ranking.title} <Icon name="arrow" size={18} />
            </Link>
          ))}
        </div>
      </section>

      <Cta
        title={
          winner.id === selfId
            ? `Try the #1 Electron boilerplate of ${updatedYear}`
            : 'Try Electron AppStack'
        }
        text="Free, production-ready, and yours from the first command."
      />
    </BoilerplatePage>
  )
}
