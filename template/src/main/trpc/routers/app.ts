import { app } from 'electron'
import { appEventSubscription, publicProcedure, router } from '../trpc'

export const appRouter = router({
  info: publicProcedure.query(() => ({
    name: app.getName(),
    version: app.getVersion(),
    locale: app.getLocale(),
    platform: process.platform,
    versions: {
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node
    }
  })),

  onNavigate: appEventSubscription('navigate')
})
