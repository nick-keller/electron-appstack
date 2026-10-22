import { languageSettingSchema, themeSchema } from '@shared/config'
import { appEventSubscription, publicProcedure, router } from '../trpc'

export const configRouter = router({
  get: publicProcedure.query(({ ctx }) => ctx.config.getAll()),

  setTheme: publicProcedure.input(themeSchema).mutation(({ ctx, input }) => {
    ctx.config.set('theme', input)
  }),

  setLanguage: publicProcedure.input(languageSettingSchema).mutation(({ ctx, input }) => {
    ctx.config.set('language', input)
  }),

  /** Emits the whole config every time it changes, wherever the change comes from. */
  onChange: appEventSubscription('configChanged')
})
