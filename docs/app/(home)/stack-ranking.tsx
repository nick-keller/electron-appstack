import Link from 'next/link'
import {
  featureDefinitions,
  isOutdated,
  ranking,
  rankingDescription,
  scoreWeights,
  selfId,
  updatedAt,
  updatedYear
} from '../../lib/boilerplates'
import { peersOf, type StackPage, stackPages } from '../../lib/stacks'
import {
  BoilerplatePage,
  Cta,
  FeatureMatrix,
  SectionHead,
  SupportLegend,
  UpdatedNote
} from './boilerplate-ui'
import styles from './boilerplates.module.css'
import landing from './landing.module.css'
import { Icon } from './lucide-icon'
import {
  OutdatedList,
  RankingList,
  RankingTable,
  rankingJsonLd,
  scoreKeys,
  weightLabels
} from './ranking-ui'

// Maintained boilerplates of the stack, ranked like /best-electron-boilerplate
export function stackRanking(page: StackPage) {
  const list = ranking.filter(page.match)
  return { current: list.filter((b) => !isOutdated(b)), outdated: list.filter(isOutdated) }
}

export function stackRankingMeta(page: StackPage) {
  const { current } = stackRanking(page)
  const title = `${page.ranking.title} in ${updatedYear}`
  const description = rankingDescription(
    `The ${current.length} best Electron ${page.ranking.shortTitle} boilerplates of ${updatedYear}, ranked on features, maintenance and popularity`,
    current.map((b) => b.name)
  )
  return { title, description }
}

export function StackRanking({ page }: { page: StackPage }) {
  const { current, outdated } = stackRanking(page)
  const { title, description } = stackRankingMeta(page)
  const winner = current[0]
  const total = featureDefinitions.length
  // The matrix lists the stack's focus features first, then the rest
  const matrixColumns = current.slice(0, 8)

  return (
    <BoilerplatePage
      jsonLd={rankingJsonLd({ name: title, description, dateModified: updatedAt, list: current })}
    >
      <section className={styles.hero}>
        <p className={landing.eyebrow}>
          {page.name} ranking {updatedYear}
        </p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>
          {page.ranking.intro} {current.length} are still maintained
          {outdated.length > 0 && `, ${outdated.length} are outdated`}.
        </p>
        <UpdatedNote />
      </section>

      <div className={styles.cards}>
        {page.ranking.howToChoose.map((tip) => (
          <article key={tip.title} className={`${landing.tile} ${styles.card}`}>
            <p className={landing.eyebrow}>How to choose</p>
            <h3>{tip.title}</h3>
            <p>{tip.text}</p>
          </article>
        ))}
      </div>

      <section className={styles.section} aria-labelledby="overview">
        <SectionHead eyebrow="At a glance" title="Quick comparison" id="overview">
          {peersOf(page)} still maintained, by overall score.
        </SectionHead>
        <RankingTable list={current} columns={page.ranking.columns} />
      </section>

      <section className={styles.section} aria-labelledby="ranking">
        <SectionHead eyebrow="Ranking" title={`The full ${page.name} ranking`} id="ranking">
          Each score is out of 100, computed like in{' '}
          <Link href="/best-electron-boilerplate#methodology">our main ranking</Link>.
        </SectionHead>
        <RankingList list={current} />
      </section>

      <section className={styles.section} aria-labelledby="features">
        <SectionHead eyebrow="Features" title="Feature by feature" id="features">
          The {matrixColumns.length === current.length ? '' : `top ${matrixColumns.length} `}
          {peersOf(page)} on all {total} features.
        </SectionHead>
        <FeatureMatrix
          columns={matrixColumns}
          features={[
            ...page.ranking.focus,
            ...featureDefinitions.map((f) => f.key).filter((k) => !page.ranking.focus.includes(k))
          ]}
        />
        <SupportLegend />
      </section>

      {outdated.length > 0 && (
        <section className={styles.section} aria-labelledby="outdated">
          <SectionHead eyebrow="Avoid" title="Outdated boilerplates" id="outdated">
            Still found in search results, but archived or stuck on an Electron version that no
            longer receives security fixes.
          </SectionHead>
          <OutdatedList list={outdated} />
        </section>
      )}

      <section className={styles.section} aria-labelledby="methodology">
        <SectionHead eyebrow="Methodology" title="How this ranking is made" id="methodology">
          This page is published by Electron AppStack, which is part of the ranking. Every number
          comes from the same open data file and the same formula as{' '}
          <Link href="/best-electron-boilerplate">the ranking of all Electron boilerplates</Link>:{' '}
          {scoreKeys.map((key) => `${weightLabels[key]} ${scoreWeights[key] * 100}%`).join(', ')}.
        </SectionHead>
        <div className={landing.compareLinks}>
          {stackPages
            .filter((s) => s.id !== page.id)
            .map((s) => (
              <Link key={s.id} href={s.rankingPath} className={landing.link}>
                {s.ranking.title} <Icon name="arrow" size={18} />
              </Link>
            ))}
        </div>
      </section>

      <Cta
        title={
          winner.id === selfId
            ? `Try the #1 Electron ${page.name} boilerplate`
            : `Try Electron AppStack with ${page.name}`
        }
        text={`${page.name} is only the start: typed IPC, SQLite, auto update, signed releases and license keys are included too.`}
      />
      <p className={styles.updated} style={{ textAlign: 'center', marginBottom: 64 }}>
        <Link href={page.path}>See the {page.keyword}</Link>
      </p>
    </BoilerplatePage>
  )
}
