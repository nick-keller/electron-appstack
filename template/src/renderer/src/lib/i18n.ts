import { defaultLanguage, resources } from '@shared/i18n'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export function initI18n(language: string) {
  return i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: defaultLanguage,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false } // React already escapes values
  })
}

export { i18n }
