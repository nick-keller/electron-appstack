import { EventEmitter } from 'node:events'
import type { Config } from '@shared/config'
import type { UpdateStatus } from '@shared/updater'

export type AppEvents = {
  /** Asks the renderer to navigate to a route, e.g. from the native menu. */
  navigate: [to: string]
  configChanged: [config: Config]
  updateStatus: [status: UpdateStatus]
}

/** Main process events, forwarded to the renderer with tRPC subscriptions. */
export const appEvents = new EventEmitter<AppEvents>()
