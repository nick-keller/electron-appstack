---
name: add-translation
description: Add or change user-visible text, or add a new language. Use whenever UI text, menu labels or languages change.
---

# Translations

Translations are JSON files in `src/shared/locales/<language>/`:
- `common.json`: renderer UI, used with `const { t } = useTranslation()` then `t('home.title')`
- `menu.json`: native menu labels, used in `src/main/menu.ts`

## Add a string

1. Add the key to `src/shared/locales/en/common.json` (English is the reference, keys are typed from it).
2. Add the same key to **every** other locale (`fr`, …).
3. Use it: `t('section.key')`, with values `t('update.downloaded', { version })`, plurals with
   `_one` / `_other` suffixes and `t('home.remaining', { count })`.

## Add a language

1. Copy `src/shared/locales/en/` to `src/shared/locales/<code>/` and translate.
2. Add the code to `languages` in `src/shared/config.ts`.
3. Import the files and add them to `resources` in `src/shared/i18n.ts`.
4. Add the language name to `language` in every `common.json`.
