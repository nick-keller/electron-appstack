// Ranking blocks shared by /best-electron-boilerplate and the stack rankings
// (/best-electron-react-boilerplate...)

import {
  electronMajor,
  featureCount,
  featureDefinitions,
  formatDate,
  formatNumber,
  formatPrice,
  inSentence,
  listToText,
  majorsBehind,
  type Scored,
  scoreWeights,
  selfId,
  stackValue
} from '../../lib/boilerplates'
import { BoilerplateLinks, ScoreBar } from './boilerplate-ui'
import styles from './boilerplates.module.css'
import landing from './landing.module.css'
import { Icon } from './lucide-icon'

export const weightLabels: Record<keyof typeof scoreWeights, string> = {
  features: 'Features',
  freshness: 'Electron version',
  activity: 'Maintenance',
  popularity: 'Popularity'
}

export const scoreKeys = Object.keys(scoreWeights) as (keyof typeof scoreWeights)[]

export function outdatedReason(b: Scored) {
  const reasons = [
    ...(b.archived ? ['archived'] : []),
    ...(majorsBehind(b) > 3
      ? [`Electron ${electronMajor(b)}, ${majorsBehind(b)} major versions behind`]
      : [])
  ]
  return reasons.join(', ')
}

export function rankingJsonLd({
  name,
  description,
  dateModified,
  list
}: {
  name: string
  description: string
  dateModified: string
  list: Scored[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    dateModified,
    numberOfItems: list.length,
    itemListElement: list.map((b, index) => ({
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
}

type Column = 'ui' | 'components' | 'styling' | 'build' | 'ipc'

const columnLabels: Record<Column, string> = {
  ui: 'UI',
  components: 'Components',
  styling: 'Styling',
  build: 'Build',
  ipc: 'IPC'
}

export function RankingTable({
  list,
  columns = ['ui', 'build']
}: {
  list: Scored[]
  columns?: Column[]
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.tableLeft}`}>
        <thead>
          <tr>
            <th scope="col">Boilerplate</th>
            <th scope="col">Score</th>
            <th scope="col">Features</th>
            <th scope="col">Electron</th>
            {columns.map((column) => (
              <th key={column} scope="col">
                {columnLabels[column]}
              </th>
            ))}
            <th scope="col">Stars</th>
            <th scope="col">Last update</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {list.map((b, index) => (
            <tr key={b.id} data-self={b.id === selfId || undefined}>
              <th scope="row">
                <a href={`#${b.id}`}>
                  {index + 1}. {b.name}
                </a>
              </th>
              <td className={styles.numeric}>{b.scores.overall}</td>
              <td className={styles.numeric}>
                {featureCount(b)}/{featureDefinitions.length}
              </td>
              <td className={styles.numeric}>{electronMajor(b)}</td>
              {columns.map((column) => (
                <td key={column} className={styles.text}>
                  {stackValue(b, column) ?? '–'}
                </td>
              ))}
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
  )
}

export function RankingList({ list }: { list: Scored[] }) {
  return (
    <ol className={styles.ranking}>
      {list.map((b, index) => {
        const included = featureDefinitions.filter((f) => b.features[f.key] === 'yes')
        const stack = (
          ['build', 'ui', 'styling', 'components', 'ipc', 'database', 'packaging'] as const
        )
          .map((key) => stackValue(b, key))
          .filter((value, i, all): value is string => !!value && all.indexOf(value) === i)
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
  )
}

export function OutdatedList({ list }: { list: Scored[] }) {
  return (
    <div className={styles.cards}>
      {list.map((b) => (
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
  )
}
