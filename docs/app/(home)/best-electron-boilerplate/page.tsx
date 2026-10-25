import type { Metadata } from 'next'
import {
  electronMajor,
  featureCount,
  featureDefinitions,
  formatDate,
  formatNumber,
  formatPrice,
  inSentence,
  isOutdated,
  latestElectron,
  latestElectronMajor,
  listToText,
  majorsBehind,
  ranking,
  type Scored,
  scoreWeights,
  selfId,
  stackValue,
  topPicks,
  updatedAt,
  updatedYear
} from '../../../lib/boilerplates'
import {
  BoilerplateLinks,
  BoilerplatePage,
  Cta,
  ScoreBar,
  SectionHead,
  UpdatedNote
} from '../boilerplate-ui'
import styles from '../boilerplates.module.css'
import landing from '../landing.module.css'
import { Icon } from '../lucide-icon'
import { openGraphImages } from '../../metadata'

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

const weightLabels: Record<keyof typeof scoreWeights, string> = {
  features: 'Features',
  freshness: 'Electron version',
  activity: 'Maintenance',
  popularity: 'Popularity'
}

const scoreKeys = Object.keys(scoreWeights) as (keyof typeof scoreWeights)[]

function outdatedReason(b: Scored) {
  const reasons = [
    ...(b.archived ? ['archived'] : []),
    ...(majorsBehind(b) > 3
      ? [`Electron ${electronMajor(b)}, ${majorsBehind(b)} major versions behind`]
      : [])
  ]
  return reasons.join(', ')
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: title,
  description,
  dateModified: updatedAt,
  numberOfItems: current.length,
  itemListElement: current.map((b, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'SoftwareSourceCode',
      name: b.name,
      description: b.description,
      ...(b.github ? { codeRepository: `https://github.com/${b.github}` } : {}),
      ...(b.website ? { url: b.website } : {}),
      programmingLanguage: b.stack.language,
      runtimePlatform: 'Electron',
      offers: { '@type': 'Offer', price: String(b.price), priceCurrency: 'USD' }
    }
  }))
}

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
        <div className={styles.tableWrap}>
          <table className={`${styles.table} ${styles.tableLeft}`}>
            <thead>
              <tr>
                <th scope="col">Boilerplate</th>
                <th scope="col">Score</th>
                <th scope="col">Features</th>
                <th scope="col">Electron</th>
                <th scope="col">UI</th>
                <th scope="col">Build</th>
                <th scope="col">Stars</th>
                <th scope="col">Last update</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {current.map((b, index) => (
                <tr key={b.id}>
                  <th scope="row" data-self={b.id === selfId || undefined}>
                    <a href={`#${b.id}`}>
                      {index + 1}. {b.name}
                    </a>
                  </th>
                  <td className={styles.numeric}>{b.scores.overall}</td>
                  <td className={styles.numeric}>
                    {featureCount(b)}/{featureDefinitions.length}
                  </td>
                  <td className={styles.numeric}>{electronMajor(b)}</td>
                  <td className={styles.text}>{stackValue(b, 'ui')}</td>
                  <td className={styles.text}>{stackValue(b, 'build')}</td>
                  <td className={styles.numeric}>
                    {b.stars === undefined ? '–' : formatNumber(b.stars)}
                  </td>
                  <td className={styles.numeric}>{formatDate(b.lastCommit)}</td>
                  <td>{formatPrice(b.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ranking">
        <SectionHead eyebrow="Ranking" title="The full ranking" id="ranking">
          Each score is out of 100. See the methodology below for how it is computed.
        </SectionHead>
        <ol className={styles.ranking}>
          {current.map((b, index) => {
            const included = featureDefinitions.filter((f) => b.features[f.key] === 'yes')
            const stack = (['build', 'ui', 'styling', 'ipc', 'database', 'packaging'] as const)
              .map((key) => stackValue(b, key))
              .filter((value): value is string => !!value)
            return (
              <li
                key={b.id}
                id={b.id}
                className={`${landing.tile} ${styles.rankItem}`}
                data-accent={index === 0 ? 'lime' : undefined}
              >
                <span className={styles.rank}>#{index + 1}</span>
                <div className={styles.rankBody}>
                  <h3>{b.name}</h3>
                  <p>{b.description}</p>
                  <p className={styles.meta}>
                    {b.stars !== undefined && (
                      <span>
                        <Icon name="star" size={14} /> {formatNumber(b.stars)} stars
                      </span>
                    )}
                    <span>Electron {b.electron === 'latest' ? 'latest' : b.electron}</span>
                    <span>Updated {formatDate(b.lastCommit)}</span>
                    <span>{formatPrice(b.price)}</span>
                    <span>{b.license}</span>
                  </p>
                  <div className={styles.chips}>
                    {stack.map((value) => (
                      <span key={value} className={styles.chip}>
                        {value}
                      </span>
                    ))}
                  </div>
                  <p className={styles.meta}>
                    <span>
                      Includes {included.length} of {featureDefinitions.length} features:{' '}
                      {listToText(included.map((f) => inSentence(f.label)))}.
                    </span>
                  </p>
                  {b.create && (
                    <code className={styles.meta} style={{ fontFamily: 'var(--mono)' }}>
                      {b.create}
                    </code>
                  )}
                  <BoilerplateLinks boilerplate={b} />
                </div>
                <div className={styles.scorePanel}>
                  <span className={styles.overall}>
                    {b.scores.overall}
                    <small>/100</small>
                  </span>
                  {scoreKeys.map((key) => (
                    <ScoreBar key={key} label={weightLabels[key]} value={b.scores[key]} />
                  ))}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {outdated.length > 0 && (
        <section className={styles.section} aria-labelledby="outdated">
          <SectionHead eyebrow="Avoid" title="Outdated boilerplates" id="outdated">
            Still popular in search results, but archived or stuck on an Electron version that no
            longer receives security fixes. Electron supports its latest three major versions.
          </SectionHead>
          <div className={styles.cards}>
            {outdated.map((b) => (
              <article key={b.id} id={b.id} className={`${landing.tile} ${styles.card}`}>
                <h3>{b.name}</h3>
                <p>{b.description}</p>
                <p className={styles.meta}>
                  {b.stars !== undefined && (
                    <span>
                      <Icon name="star" size={14} /> {formatNumber(b.stars)}
                    </span>
                  )}
                  <span>Updated {formatDate(b.lastCommit)}</span>
                </p>
                <p className={styles.verdict}>Outdated: {outdatedReason(b)}.</p>
                <BoilerplateLinks boilerplate={b} />
              </article>
            ))}
          </div>
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
