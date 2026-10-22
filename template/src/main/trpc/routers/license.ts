import { z } from 'zod'
import {
  activateLicense,
  copyLicenseKey,
  getLicenseInfo,
  openLicensePortal,
  openPurchasePage,
  refreshLicense
} from '../../license'
import { appEventSubscription, publicProcedure, router } from '../trpc'

export const licenseRouter = router({
  info: publicProcedure.query(() => getLicenseInfo()),

  /** Emits the license info every time it changes (state, key, offline time left…). */
  onChange: appEventSubscription('licenseChanged'),

  /** Returns `{ ok: false, code }` instead of throwing, so the renderer gets the error code. */
  activate: publicProcedure
    .input(z.string().max(1000))
    .mutation(({ input }) => activateLicense(input)),

  refresh: publicProcedure.mutation(() => refreshLicense()),

  copyKey: publicProcedure.mutation(() => copyLicenseKey()),

  openPortal: publicProcedure.mutation(() => openLicensePortal()),

  openPurchasePage: publicProcedure.mutation(() => openPurchasePage())
})
