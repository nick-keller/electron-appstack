import { z } from 'zod'

// App config schema, shared by the main process (storage) and the renderer (types).
// Every key must have a default: it is used on first launch and when a stored value is invalid.

export const themeSchema = z.enum(['system', 'light', 'dark'])
export type Theme = z.infer<typeof themeSchema>

export const languages = ['en', 'fr'] as const
export type Language = (typeof languages)[number]

export const languageSettingSchema = z.enum(['system', ...languages])
export type LanguageSetting = z.infer<typeof languageSettingSchema>

export const windowBoundsSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().min(400),
  height: z.number().min(300),
  maximized: z.boolean().default(false)
})

export const configSchema = z.object({
  theme: themeSchema.default('system'),
  language: languageSettingSchema.default('system'),
  windowBounds: windowBoundsSchema.default({ width: 1000, height: 700, maximized: false })
})
export type Config = z.infer<typeof configSchema>
