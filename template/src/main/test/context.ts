import { config } from '../config'
import { openDatabase } from '../db/client'
import type { Context } from '../trpc/trpc'

/**
 * A tRPC context for unit tests, with a fresh in-memory database (all migrations applied).
 * Call a router with it: `todosRouter.createCaller(createTestContext())`.
 */
export function createTestContext(): Context {
  return { db: openDatabase(':memory:'), config }
}
