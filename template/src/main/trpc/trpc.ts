import { on } from 'node:events'
import { initTRPC, TRPCError, type TRPCSubscriptionProcedure } from '@trpc/server'
import superjson from 'superjson'
import { config } from '../config'
import { getDb } from '../db/client'
import { type AppEvents, appEvents } from '../events'
import { isLicenseActive } from '../license'

export function createContext() {
  return Promise.resolve({ db: getDb(), config })
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  // superjson keeps Dates, Maps, Sets… intact between main and renderer
  transformer: superjson,
  isServer: true
})

export const router = t.router
export const publicProcedure = t.procedure

/**
 * A procedure that only runs while the license is active (or licensing is disabled). Use it for
 * the features of the app: the main window is closed when the license is refused, but this also
 * stops any other window from calling them.
 */
export const licensedProcedure = t.procedure.use(({ next }) => {
  if (!isLicenseActive()) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'The license is not active' })
  }
  return next()
})

/**
 * Wraps an async generator so it can be returned from a subscription.
 *
 * trpc-electron fails on native async iterators, which have `Symbol.asyncDispose` since
 * Node.js 24 ("Symbol.asyncDispose already exists"). A plain object iterator does not.
 */
export function ipcIterable<T>(source: AsyncIterable<T>): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]() {
      const iterator = source[Symbol.asyncIterator]()
      return {
        next: () => iterator.next(),
        return: async (value?: unknown) =>
          (await iterator.return?.(value)) ?? { done: true, value: undefined }
      }
    }
  }
}

/** A subscription that forwards every `event` emitted on `appEvents` to the renderer. */
export function appEventSubscription<E extends keyof AppEvents>(
  event: E
): TRPCSubscriptionProcedure<{
  // biome-ignore lint/suspicious/noConfusingVoidType: tRPC uses `void` for procedures without input
  input: void
  output: AsyncIterable<AppEvents[E][0], void, unknown>
  meta: object
}> {
  return publicProcedure.subscription(({ signal }) =>
    ipcIterable(
      (async function* () {
        for await (const [value] of on(appEvents, event, { signal })) {
          yield value as AppEvents[E][0]
        }
      })()
    )
  )
}
