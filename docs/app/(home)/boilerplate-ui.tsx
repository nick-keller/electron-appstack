import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  type Boilerplate,
  dataUrl,
  type FeatureKey,
  featureDefinitions,
  featureGroups,
  formatDate,
  primaryUrl,
  type StackKey,
  type Support,
  selfId,
  stackDefinitions,
  stackValue,
  updatedAt
} from '../../lib/boilerplates'
import styles from './boilerplates.module.css'
import landing from './landing.module.css'
import { Icon } from './lucide-icon'
import { SiteFooter, SiteHeader } from './site'

const supportLabels: Record<Support, string> = {
  yes: 'Included',
  partial: 'Partial or manual setup',
  no: 'Not included'
}

const supportGlyphs: Record<Support, string> = { yes: '✓', partial: '–', no: '×' }

// Text glyphs rather than SVG icons: the feature matrix renders hundreds of them
export function SupportIcon({ support, note }: { support: Support; note?: string }) {
  const label = note ? `${supportLabels[support]}: ${note}` : supportLabels[support]
  return (
    <span
      className={styles.support}
      data-support={support}
      role="img"
      aria-label={label}
      title={label}
    >
      {supportGlyphs[support]}
    </span>
  )
}

export function SupportLegend() {
  return (
    <p className={styles.legend}>
      {(['yes', 'partial', 'no'] as Support[]).map((support) => (
        <span key={support}>
          <SupportIcon support={support} />
          {supportLabels[support]}
        </span>
      ))}
      <span>Hover a cell for details.</span>
    </p>
  )
}

function ColumnHead({ boilerplate }: { boilerplate: Boilerplate }) {
  return (
    <th scope="col" data-self={boilerplate.id === selfId || undefined}>
      <a href={primaryUrl(boilerplate)}>{boilerplate.name}</a>
    </th>
  )
}

export function FeatureMatrix({
  columns,
  features = featureDefinitions.map((f) => f.key)
}: {
  columns: Boilerplate[]
  features?: FeatureKey[]
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Feature</th>
            {columns.map((b) => (
              <ColumnHead key={b.id} boilerplate={b} />
            ))}
          </tr>
        </thead>
        {featureGroups.map((group) => {
          const rows = featureDefinitions.filter(
            (f) => f.group === group && features.includes(f.key)
          )
          if (!rows.length) return null
          return (
            <tbody key={group}>
              <tr className={styles.group}>
                <th scope="rowgroup" colSpan={columns.length + 1}>
                  {group}
                </th>
              </tr>
              {rows.map((feature) => (
                <tr key={feature.key}>
                  <th scope="row">
                    {feature.label}
                    <small>{feature.description}</small>
                  </th>
                  {columns.map((b) => (
                    <td key={b.id} data-self={b.id === selfId || undefined}>
                      <SupportIcon support={b.features[feature.key]} note={b.notes[feature.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}

export function StackTable({
  columns,
  rows = stackDefinitions.map((s) => s.key)
}: {
  columns: Boilerplate[]
  rows?: StackKey[]
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.tableLeft}`}>
        <thead>
          <tr>
            <th scope="col">Stack</th>
            {columns.map((b) => (
              <ColumnHead key={b.id} boilerplate={b} />
            ))}
          </tr>
        </thead>
        <tbody>
          {stackDefinitions
            .filter((s) => rows.includes(s.key))
            .map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                {columns.map((b) => (
                  <td key={b.id} className={styles.text} data-self={b.id === selfId || undefined}>
                    {stackValue(b, row.key) ?? '–'}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.bar}>
      <span>{label}</span>
      <span className={styles.track}>
        <span style={{ width: `${value}%` }} />
      </span>
      <span>{value}</span>
    </div>
  )
}

export function BoilerplateLinks({ boilerplate }: { boilerplate: Boilerplate }) {
  return (
    <p className={styles.cardLinks}>
      {boilerplate.github && (
        <a href={`https://github.com/${boilerplate.github}`}>
          GitHub <Icon name="arrow" size={14} />
        </a>
      )}
      {boilerplate.website && (
        <a href={boilerplate.website}>
          Website <Icon name="arrow" size={14} />
        </a>
      )}
      {boilerplate.docs && boilerplate.docs !== boilerplate.website && (
        <a href={boilerplate.docs}>
          Docs <Icon name="arrow" size={14} />
        </a>
      )}
    </p>
  )
}

export function UpdatedNote() {
  return (
    <p className={styles.updated}>
      Data updated on {formatDate(updatedAt)}, generated from{' '}
      <a href={dataUrl}>an open data file</a>. Spotted a mistake? Open a pull request.
    </p>
  )
}

export function BoilerplatePage({ jsonLd, children }: { jsonLd: object; children: ReactNode }) {
  return (
    <div className={`${landing.page} ${styles.page}`}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}

export function SectionHead({
  eyebrow,
  title,
  id,
  children
}: {
  eyebrow: string
  title: string
  id: string
  children?: ReactNode
}) {
  return (
    <div className={landing.sectionHead}>
      <p className={landing.eyebrow}>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {children && <p className={landing.lead}>{children}</p>}
    </div>
  )
}

export function Cta({ title, text }: { title: string; text: string }) {
  return (
    <section className={`${landing.tile} ${styles.cta}`} data-accent="lime" aria-label={title}>
      <h2>{title}</h2>
      <p>{text}</p>
      <div className={styles.ctaActions}>
        <Link href="/doc/getting-started">
          Get started <Icon name="arrow" size={18} />
        </Link>
        <Link href="/">See all features</Link>
      </div>
    </section>
  )
}
