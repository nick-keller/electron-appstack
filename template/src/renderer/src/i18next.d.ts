import type { resources } from '@shared/i18n'

// Type-checks translation keys: `t('home.title')` is checked against the English JSON files
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: (typeof resources)['en']
  }
}
