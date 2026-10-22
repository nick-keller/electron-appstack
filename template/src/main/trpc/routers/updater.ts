import { checkForUpdates, getUpdateStatus, installUpdate } from '../../updater'
import { appEventSubscription, publicProcedure, router } from '../trpc'

export const updaterRouter = router({
  status: publicProcedure.query(() => getUpdateStatus()),

  onStatus: appEventSubscription('updateStatus'),

  check: publicProcedure.mutation(() => checkForUpdates(true)),

  install: publicProcedure.mutation(() => installUpdate())
})
