import type { Metadata } from 'next'
import Link from 'next/link'
import {
  advantages,
  type Boilerplate,
  electronMajor,
  featureCount,
  featureDefinitions,
  formatDate,
  formatNumber,
  formatPrice,
  inSentence,
  isOutdated,
  latestElectronMajor,
  listToText,
  others,
  ranking,
  rankOf,
  self,
  supportedBy,
  updatedAt
} from '../../../lib/boilerplates'
import {
  BoilerplateLinks,
  BoilerplatePage,
  Cta,
  FeatureMatrix,
  SectionHead,
  StackTable,
  SupportLegend,
  UpdatedNote
} from '../boilerplate-ui'
import styles from '../boilerplates.module.css'
import landing from '../landing.module.css'
import { Icon } from '../lucide-icon'

const title = 'How does Electron AppStack compare to other boilerplates?'
const description = `Electron AppStack compared to ${others.length} Electron boilerplates, including ${others
  .slice()
  .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
  .slice(0, 3)
  .map((b) => b.name)
  .join(
    ', '
  )}: ${featureDefinitions.length} features, tech stack, Electron version and maintenance, side by side.`

export const metadata: Metadata = {
  title: { absolute: `${title} – Electron AppStack` },
  description,
  alternates: { canonical: '/compare' },
  openGraph: {
    type: 'article',
    url: '/compare',
    siteName: 'Electron AppStack',
    title,
    description
  },
  twitter: { card: 'summary_large_image', title, description }
}

const total = featureDefinitions.length
const selfCount = featureCount(self)
const current = others.filter((b) => !isOutdated(b))
const averageCount =
  Math.round((current.reduce((sum, b) => sum + featureCount(b), 0) / current.length) * 10) / 10
const runnerUp = ranking.find((b) => b.id !== self.id) as Boilerplate

// Columns of the tables: Electron AppStack first, then the others by rank
const columns = ranking.map((b) => b as Boilerplate)

// Features Electron AppStack includes that at most one other boilerplate fully includes
const exclusive = featureDefinitions
  .filter((f) => self.features[f.key] === 'yes')
  .map((f) => ({ ...f, others: supportedBy(f.key, others) }))
  .filter((f) => f.others.length <= 1)
  .sort((a, b) => a.others.length - b.others.length || b.weight - a.weight)

// Features Electron AppStack does not fully include, with the boilerplates that do
const missing = featureDefinitions
  .filter((f) => self.features[f.key] !== 'yes')
  .map((f) => ({ ...f, others: supportedBy(f.key, others) }))
  .filter((f) => f.others.length > 0)

// Head to head cards, for the boilerplates still maintained, by rank
const rivals = ranking.filter((b) => b.id !== self.id && !isOutdated(b))

function verdict(rival: Boilerplate) {
  const ui = (rival.stack.ui as string[])
    .filter((name) => name !== 'React')
    .map((name) => (name === 'Vanilla' ? 'no UI framework' : name))
  const needs = advantages(rival, self)
    .filter((f) => f.key !== 'frameworkChoice')
    .map((f) => inSentence(f.label))
  const reasons = [
    ...(ui.length ? [`you want ${listToText(ui, 'or')}`] : []),
    ...(needs.length ? [`you need ${listToText(needs)} out of the box`] : [])
  ]
  if (!reasons.length) return `Electron AppStack covers everything ${rival.name} does.`
  return `Pick ${rival.name} if ${listToText(reasons, 'or')}.`
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  dateModified: updatedAt,
  author: { '@type': 'Organization', name: 'Electron AppStack' },
  about: [self, ...others].map((b) => ({
    '@type': 'SoftwareSourceCode',
    name: b.name,
    ...(b.github ? { codeRepository: `https://github.com/${b.github}` } : { url: b.website })
  }))
}

export default function ComparePage() {
  return (
    <BoilerplatePage jsonLd={jsonLd}>
      <section className={styles.hero}>
        <p className={landing.eyebrow}>Comparison</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>
          Electron AppStack side by side with {others.length} other Electron boilerplates and
          templates: {total} features, the tech stack, the Electron version and how actively each
          one is maintained.
        </p>
        <UpdatedNote />
      </section>

      <div className={styles.stats}>
        <div className={`${landing.tile} ${styles.stat}`} data-accent="lime">
          <span className={styles.statValue}>
            {selfCount}
            <small>/{total}</small>
          </span>
          <p>
            Features included
            <span>
              {averageCount} on average for the other maintained boilerplates,{' '}
              {featureCount(runnerUp)} for {runnerUp.name}.
            </span>
          </p>
        </div>
        <div className={`${landing.tile} ${styles.stat}`}>
          <span className={styles.statValue}>#{rankOf(self.id)}</span>
          <p>
            In our ranking
            <span>
              Out of {ranking.length}.{' '}
              <Link href="/best-electron-boilerplate" style={{ textDecoration: 'underline' }}>
                See the ranking
              </Link>
            </span>
          </p>
        </div>
        <div className={`${landing.tile} ${styles.stat}`}>
          <span className={styles.statValue}>{electronMajor(self)}</span>
          <p>
            Electron version
            <span>
              {electronMajor(self) >= latestElectronMajor
                ? 'The latest major release.'
                : `${latestElectronMajor - electronMajor(self)} behind the latest.`}{' '}
              {others.filter((b) => electronMajor(b) >= latestElectronMajor).length} of{' '}
              {others.length} others are on it.
            </span>
          </p>
        </div>
        <div className={`${landing.tile} ${styles.stat}`}>
          <span className={styles.statValue}>{formatPrice(self.price)}</span>
          <p>
            Price
            <span>
              {others.filter((b) => b.price === 0).length} of the {others.length} others are free
              too.
            </span>
          </p>
        </div>
      </div>

      <section className={styles.section} aria-labelledby="differences">
        <SectionHead eyebrow="Key differences" title="What sets it apart" id="differences">
          The features below are computed from the comparison data: where Electron AppStack is
          ahead, and where other boilerplates are.
        </SectionHead>
        <div className={styles.split}>
          <div className={landing.tile}>
            <h3>Only in Electron AppStack</h3>
            <p>Fully included by at most one other boilerplate.</p>
            <ul className={styles.featureList}>
              {exclusive.map((f) => (
                <li key={f.key}>
                  <strong>{f.label}</strong>
                  <span>
                    {self.notes[f.key] ?? f.description}{' '}
                    {f.others.length
                      ? `Also in ${f.others.map((b) => b.name).join(', ')}.`
                      : 'No other boilerplate includes it.'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={landing.tile}>
            <h3>Where others are ahead</h3>
            <p>Not fully included in Electron AppStack, available elsewhere.</p>
            <ul className={styles.featureList}>
              {missing.map((f) => (
                <li key={f.key}>
                  <strong>{f.label}</strong>
                  <span>
                    {f.description} Included in {f.others.length} boilerplate
                    {f.others.length > 1 ? 's' : ''}:{' '}
                    {f.others
                      .slice(0, 4)
                      .map((b) => b.name)
                      .join(', ')}
                    {f.others.length > 4 ? ` and ${f.others.length - 4} more` : ''}.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="features">
        <SectionHead eyebrow="Features" title="Feature by feature" id="features">
          {total} features across development, frontend, backend, shipping and selling, for every
          boilerplate, ordered by their rank.
        </SectionHead>
        <FeatureMatrix columns={columns} />
        <SupportLegend />
      </section>

      <section className={styles.section} aria-labelledby="stack">
        <SectionHead eyebrow="Tech stack" title="The libraries behind each boilerplate" id="stack">
          Read from each template's package.json and source code.
        </SectionHead>
        <StackTable columns={columns} />
      </section>

      <section className={styles.section} aria-labelledby="head-to-head">
        <SectionHead
          eyebrow="Head to head"
          title={`Electron AppStack vs the ${rivals.length} maintained alternatives`}
          id="head-to-head"
        >
          What each one adds over the other, and when to pick the alternative.
        </SectionHead>
        <div className={styles.cards}>
          {rivals.map((rival) => {
            const ours = advantages(self, rival)
            const theirs = advantages(rival, self)
            return (
              <article key={rival.id} id={rival.id} className={`${landing.tile} ${styles.card}`}>
                <p className={landing.eyebrow}>vs #{rankOf(rival.id)}</p>
                <h3>{rival.name}</h3>
                <p className={styles.meta}>
                  {rival.stars !== undefined && (
                    <span>
                      <Icon name="star" size={14} /> {formatNumber(rival.stars)}
                    </span>
                  )}
                  <span>Electron {electronMajor(rival)}</span>
                  <span>{formatPrice(rival.price)}</span>
                  <span>Updated {formatDate(rival.lastCommit)}</span>
                </p>
                <div>
                  <h4>Electron AppStack adds ({ours.length})</h4>
                  <div className={styles.chips}>
                    {ours.map((f) => (
                      <span key={f.key} className={styles.chip}>
                        {f.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4>
                    {rival.name} adds ({theirs.length})
                  </h4>
                  <div className={styles.chips}>
                    {theirs.length ? (
                      theirs.map((f) => (
                        <span key={f.key} className={styles.chip}>
                          {f.label}
                        </span>
                      ))
                    ) : (
                      <span className={styles.chip}>Nothing</span>
                    )}
                  </div>
                </div>
                <p className={styles.verdict}>{verdict(rival)}</p>
                <BoilerplateLinks boilerplate={rival} />
              </article>
            )
          })}
        </div>
      </section>

      <Cta
        title="Start with everything included"
        text={`${selfCount} of ${total} features, ready on the first npm run dev.`}
      />
    </BoilerplatePage>
  )
}
