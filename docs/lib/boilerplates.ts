// Types, scores and rankings derived from data/boilerplates.json. The comparison and ranking pages
// only render what this module computes, so updating the JSON updates both pages.

import data from '../data/boilerplates.json'

export type Support = 'yes' | 'partial' | 'no'

export type FeatureKey =
  | 'typescript'
  | 'hotReload'
  | 'router'
  | 'uiComponents'
  | 'darkMode'
  | 'i18n'
  | 'typedIpc'
  | 'database'
  | 'appConfig'
  | 'autoUpdate'
  | 'ciRelease'
  | 'codeSigning'
  | 'secureDefaults'
  | 'sourceProtection'
  | 'licensing'
  | 'payments'
  | 'linting'
  | 'unitTests'
  | 'e2eTests'
  | 'documentation'
  | 'aiAgents'
  | 'frameworkChoice'

export type StackKey =
  | 'language'
  | 'build'
  | 'ui'
  | 'styling'
  | 'components'
  | 'routing'
  | 'state'
  | 'ipc'
  | 'database'
  | 'config'
  | 'packaging'
  | 'updates'
  | 'testing'
  | 'linting'
  | 'i18n'

export type Boilerplate = {
  id: string
  name: string
  description: string
  github?: string
  packageJson?: string
  website?: string
  docs?: string
  create?: string
  // In USD, 0 when free
  price: number
  license: string
  scope: 'minimal' | 'full'
  archived: boolean
  stars?: number
  forks?: number
  lastCommit: string
  // Version range from the template's package.json, or "latest" when installed at creation
  electron: string
  stack: Partial<Record<StackKey, string | string[]>>
  features: Record<FeatureKey, Support>
  notes: Partial<Record<FeatureKey | 'lastCommit', string>>
}

export const updatedAt = data.updatedAt
export const updatedYear = Number(data.updatedAt.slice(0, 4))
export const latestElectron = data.latestElectron
export const latestElectronMajor = Number(data.latestElectron.split('.')[0])
export const boilerplates = data.boilerplates as Boilerplate[]

export const selfId = 'electron-appstack'
export const self = boilerplates.find((b) => b.id === selfId) as Boilerplate
export const others = boilerplates.filter((b) => b.id !== selfId)

export const dataUrl =
  'https://github.com/nick-keller/electron-appstack/blob/main/docs/data/boilerplates.json'

export type FeatureGroup = 'Developer experience' | 'Frontend' | 'Backend' | 'Shipping' | 'Selling'

// `weight` is how much a feature counts in the feature score: the more work it saves, the higher
export const featureDefinitions: {
  key: FeatureKey
  label: string
  description: string
  group: FeatureGroup
  weight: number
}[] = [
  {
    key: 'typescript',
    label: 'TypeScript',
    description: 'Main, preload and renderer written in TypeScript.',
    group: 'Developer experience',
    weight: 2
  },
  {
    key: 'hotReload',
    label: 'Hot reload',
    description: 'Renderer reloads and main process restarts on change.',
    group: 'Developer experience',
    weight: 2
  },
  {
    key: 'linting',
    label: 'Linting and formatting',
    description: 'A linter and a formatter configured.',
    group: 'Developer experience',
    weight: 1
  },
  {
    key: 'unitTests',
    label: 'Unit tests',
    description: 'A unit test runner set up with example tests.',
    group: 'Developer experience',
    weight: 1
  },
  {
    key: 'e2eTests',
    label: 'End-to-end tests',
    description: 'Tests that launch the packaged app.',
    group: 'Developer experience',
    weight: 1
  },
  {
    key: 'documentation',
    label: 'Documentation',
    description: 'Guides written for the boilerplate, beyond a README.',
    group: 'Developer experience',
    weight: 2
  },
  {
    key: 'aiAgents',
    label: 'AI agent instructions',
    description: 'AGENTS.md or rules so coding agents follow the conventions.',
    group: 'Developer experience',
    weight: 1
  },
  {
    key: 'frameworkChoice',
    label: 'Choice of UI framework',
    description: 'Several renderer frameworks to pick from.',
    group: 'Frontend',
    weight: 1
  },
  {
    key: 'router',
    label: 'Routing',
    description: 'A client-side router with example pages.',
    group: 'Frontend',
    weight: 1
  },
  {
    key: 'uiComponents',
    label: 'UI components',
    description: 'A component library or design system.',
    group: 'Frontend',
    weight: 2
  },
  {
    key: 'darkMode',
    label: 'Dark mode',
    description: 'Light, dark and system themes with a switcher.',
    group: 'Frontend',
    weight: 1
  },
  {
    key: 'i18n',
    label: 'Translations',
    description: 'An i18n library with translation files.',
    group: 'Frontend',
    weight: 1
  },
  {
    key: 'typedIpc',
    label: 'Typed IPC',
    description: 'Calls from the renderer to the main process are typed end to end.',
    group: 'Backend',
    weight: 3
  },
  {
    key: 'database',
    label: 'Local database',
    description: 'An embedded database with migrations.',
    group: 'Backend',
    weight: 3
  },
  {
    key: 'appConfig',
    label: 'Persistent settings',
    description: 'A store for user preferences that survives restarts.',
    group: 'Backend',
    weight: 1
  },
  {
    key: 'autoUpdate',
    label: 'Auto update',
    description: 'The app downloads and installs new versions.',
    group: 'Shipping',
    weight: 3
  },
  {
    key: 'ciRelease',
    label: 'Release workflow',
    description: 'CI builds and publishes installers for every platform.',
    group: 'Shipping',
    weight: 3
  },
  {
    key: 'codeSigning',
    label: 'Code signing',
    description: 'Signing and notarization wired into the build.',
    group: 'Shipping',
    weight: 3
  },
  {
    key: 'secureDefaults',
    label: 'Secure defaults',
    description: 'Context isolation, sandboxed renderer, no Node.js in the renderer.',
    group: 'Shipping',
    weight: 2
  },
  {
    key: 'sourceProtection',
    label: 'Source code protection',
    description: 'Bytecode compilation, Electron fuses or ASAR integrity.',
    group: 'Selling',
    weight: 2
  },
  {
    key: 'licensing',
    label: 'License keys',
    description: 'Activation, validation and offline use of license keys.',
    group: 'Selling',
    weight: 3
  },
  {
    key: 'payments',
    label: 'Payments',
    description: 'Checkout connected to license creation.',
    group: 'Selling',
    weight: 2
  }
]

export const featureGroups: FeatureGroup[] = [
  'Developer experience',
  'Frontend',
  'Backend',
  'Shipping',
  'Selling'
]

export const stackDefinitions: { key: StackKey; label: string }[] = [
  { key: 'language', label: 'Language' },
  { key: 'build', label: 'Build tool' },
  { key: 'ui', label: 'UI framework' },
  { key: 'styling', label: 'Styling' },
  { key: 'components', label: 'Components' },
  { key: 'routing', label: 'Routing' },
  { key: 'state', label: 'Data and state' },
  { key: 'ipc', label: 'IPC' },
  { key: 'database', label: 'Database' },
  { key: 'config', label: 'Settings store' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'updates', label: 'Updates' },
  { key: 'testing', label: 'Testing' },
  { key: 'linting', label: 'Linting' },
  { key: 'i18n', label: 'Translations' }
]

export function stackValue(boilerplate: Boilerplate, key: StackKey) {
  const value = boilerplate.stack[key]
  if (Array.isArray(value)) return value.length ? value.join(', ') : undefined
  return value
}

const supportValue: Record<Support, number> = { yes: 1, partial: 0.5, no: 0 }

const totalWeight = featureDefinitions.reduce((sum, f) => sum + f.weight, 0)

export function featureScore(boilerplate: Boilerplate) {
  const points = featureDefinitions.reduce(
    (sum, f) => sum + f.weight * supportValue[boilerplate.features[f.key]],
    0
  )
  return Math.round((points / totalWeight) * 100)
}

export function featureCount(boilerplate: Boilerplate, support: Support = 'yes') {
  return featureDefinitions.filter((f) => boilerplate.features[f.key] === support).length
}

export function electronMajor(boilerplate: Boilerplate) {
  if (boilerplate.electron === 'latest') return latestElectronMajor
  return Number(boilerplate.electron.match(/\d+/)?.[0])
}

export function majorsBehind(boilerplate: Boilerplate) {
  return Math.max(0, latestElectronMajor - electronMajor(boilerplate))
}

const day = 24 * 60 * 60 * 1000

export function daysSinceCommit(boilerplate: Boilerplate) {
  return Math.max(0, Math.floor((Date.parse(updatedAt) - Date.parse(boilerplate.lastCommit)) / day))
}

// Electron ships a major version every 8 weeks and supports the latest 3, so each major behind
// costs 20 points
export function freshnessScore(boilerplate: Boilerplate) {
  return Math.max(0, 100 - majorsBehind(boilerplate) * 20)
}

// Full score when updated in the last 90 days, zero after two years or when archived
export function activityScore(boilerplate: Boilerplate) {
  if (boilerplate.archived) return 0
  const days = daysSinceCommit(boilerplate)
  if (days <= 90) return 100
  return Math.max(0, Math.round(100 - ((days - 90) / (730 - 90)) * 100))
}

const maxStars = Math.max(...boilerplates.map((b) => b.stars ?? 0))

// Logarithmic, so 1,000 stars already scores well against the most popular boilerplate
export function popularityScore(boilerplate: Boilerplate) {
  if (!boilerplate.stars) return 0
  return Math.round((Math.log10(boilerplate.stars + 1) / Math.log10(maxStars + 1)) * 100)
}

export const scoreWeights = { features: 0.6, freshness: 0.2, activity: 0.1, popularity: 0.1 }

export type Scored = Boilerplate & {
  scores: {
    features: number
    freshness: number
    activity: number
    popularity: number
    overall: number
  }
}

export function score(boilerplate: Boilerplate): Scored {
  const scores = {
    features: featureScore(boilerplate),
    freshness: freshnessScore(boilerplate),
    activity: activityScore(boilerplate),
    popularity: popularityScore(boilerplate)
  }
  const overall = Math.round(
    scores.features * scoreWeights.features +
      scores.freshness * scoreWeights.freshness +
      scores.activity * scoreWeights.activity +
      scores.popularity * scoreWeights.popularity
  )
  return { ...boilerplate, scores: { ...scores, overall } }
}

export const ranking: Scored[] = boilerplates
  .map(score)
  .sort((a, b) => b.scores.overall - a.scores.overall || (b.stars ?? 0) - (a.stars ?? 0))

export function rankOf(id: string) {
  return ranking.findIndex((b) => b.id === id) + 1
}

// Outdated: archived, or more than 3 majors behind, which is out of Electron's support window
export function isOutdated(boilerplate: Boilerplate) {
  return boilerplate.archived || majorsBehind(boilerplate) > 3
}

export function supportedBy(key: FeatureKey, list: Boilerplate[] = boilerplates) {
  return list.filter((b) => b.features[key] === 'yes')
}

// Features `a` has fully and `b` does not
export function advantages(a: Boilerplate, b: Boilerplate) {
  return featureDefinitions.filter(
    (f) => supportValue[a.features[f.key]] > supportValue[b.features[f.key]]
  )
}

// Lowercases a label for use mid-sentence, keeping acronyms and names: "Typed IPC" becomes
// "typed IPC", "TypeScript" stays
export function inSentence(label: string) {
  return label.replace(/^[A-Z][a-z]+\b/, (word) => word.toLowerCase())
}

// "a, b and c"
export function listToText(items: string[], conjunction = 'and') {
  if (items.length < 2) return items.join('')
  return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(iso))
}

export function formatPrice(price: number) {
  return price === 0 ? 'Free' : `$${price}`
}

export function primaryUrl(boilerplate: Boilerplate) {
  return boilerplate.github
    ? `https://github.com/${boilerplate.github}`
    : (boilerplate.website as string)
}

function weightedSupport(boilerplate: Boilerplate, keys: FeatureKey[]) {
  return featureDefinitions
    .filter((f) => keys.includes(f.key))
    .reduce((sum, f) => sum + f.weight * supportValue[boilerplate.features[f.key]], 0)
}

const sellingKeys: FeatureKey[] = [
  'licensing',
  'payments',
  'sourceProtection',
  'autoUpdate',
  'codeSigning'
]

const frameworks = ['React', 'Vue', 'Angular', 'Next.js', 'Svelte']

export type Pick = { title: string; reason: string; boilerplate: Scored }

// Category winners for the ranking page. Categories won by the overall winner are folded into its
// card instead of repeating it
export function topPicks() {
  const current = ranking.filter((b) => !isOutdated(b))
  const best = (list: Scored[], by: (b: Scored) => number) =>
    [...list].sort((a, b) => by(b) - by(a) || b.scores.overall - a.scores.overall)[0]

  const candidates: (Pick | undefined)[] = [
    (() => {
      const pick = best(current, (b) => b.stars ?? 0)
      return {
        title: 'Most popular',
        reason: `${formatNumber(pick.stars ?? 0)} GitHub stars, the most of any boilerplate.`,
        boilerplate: pick
      }
    })(),
    (() => {
      const pick = best(current, (b) => weightedSupport(b, sellingKeys))
      const names = featureDefinitions
        .filter((f) => sellingKeys.includes(f.key) && pick.features[f.key] === 'yes')
        .map((f) => inSentence(f.label))
      return {
        title: 'Best for selling your app',
        reason: `Ships ${listToText(names)}.`,
        boilerplate: pick
      }
    })(),
    (() => {
      const pick = best(current, (b) => electronMajor(b) * 10000 - daysSinceCommit(b))
      return {
        title: 'Most up to date',
        reason: `Electron ${electronMajor(pick)}, last commit ${formatDate(pick.lastCommit)}.`,
        boilerplate: pick
      }
    })(),
    (() => {
      const minimal = current.filter((b) => b.scope === 'minimal')
      if (!minimal.length) return undefined
      return {
        title: 'Best minimal starter',
        reason: `Highest score among the minimal templates, ${minimal[0].scores.overall}/100.`,
        boilerplate: minimal[0]
      }
    })(),
    ...frameworks.map((framework) => {
      // Prefer boilerplates dedicated to the framework over multi-framework templates
      const list = current.filter((b) => (b.stack.ui as string[]).includes(framework))
      const dedicated = list.filter((b) => (b.stack.ui as string[]).length === 1)
      const pick = (dedicated.length ? dedicated : list)[0]
      if (!pick) return undefined
      return {
        title: `Best for ${framework}`,
        reason: `Highest score among the ${framework} boilerplates, ${pick.scores.overall}/100.`,
        boilerplate: pick
      }
    }),
    (() => {
      const paid = current.filter((b) => b.price > 0)
      if (!paid.length) return undefined
      return {
        title: 'Best paid boilerplate',
        reason: `${formatPrice(paid[0].price)}, highest score among the paid boilerplates.`,
        boilerplate: paid[0]
      }
    })()
  ]

  const winner = current[0]
  const picks = candidates.filter((p): p is Pick => !!p)
  return {
    winner,
    alsoWon: picks.filter((p) => p.boilerplate.id === winner.id).map((p) => p.title),
    picks: picks.filter((p) => p.boilerplate.id !== winner.id)
  }
}
