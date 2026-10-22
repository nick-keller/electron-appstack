import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { compareVersions } from '@shared/license'
import type { UpdateStatus } from '@shared/updater'
import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import { appEvents } from './events'
import {
  checkVersionAllowed,
  isLicenseActive,
  openLicensePortal,
  openPurchasePage
} from './license'
import { PURCHASE_URL } from './license/config'

// Updates are downloaded from the `publish` provider set in electron-builder.ts (GitHub
// Releases by default). On macOS, auto update only works for signed apps.
//
// With licensing enabled, updates are checked only while the license is active, and a new version
// is downloaded only if the license includes it. Otherwise, the latest version the license
// includes is downloaded instead, when it is newer than the running one (GitHub provider only).

let status: UpdateStatus = { state: 'idle' }
let running: Promise<void> | null = null
let pinned = false

function setStatus(next: UpdateStatus): void {
  status = next
  appEvents.emit('updateStatus', next)
}

export function getUpdateStatus(): UpdateStatus {
  return status
}

export function setupAutoUpdater(): void {
  if (!app.isPackaged) return

  // Downloads are started by `checkForUpdates`, once the license allows the version
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => setStatus({ state: 'checking' }))
  autoUpdater.on('update-available', (info) =>
    setStatus({ state: 'available', version: info.version })
  )
  autoUpdater.on('download-progress', (progress) =>
    setStatus({ state: 'downloading', percent: progress.percent })
  )
  autoUpdater.on('update-downloaded', (info) =>
    setStatus({ state: 'downloaded', version: info.version })
  )
  autoUpdater.on('update-not-available', () => setStatus({ state: 'not-available' }))
  autoUpdater.on('error', (error) => setStatus({ state: 'error', message: error.message }))

  // Check as soon as the license is activated, renewed or fixed
  appEvents.on('licenseChanged', (info) => {
    if (info.enabled && info.state === 'ACTIVE' && status.state === 'license-required') {
      void checkForUpdates()
    }
  })

  void checkForUpdates()
  // Check again every 4 hours
  setInterval(() => void checkForUpdates(), 4 * 60 * 60 * 1000)
}

/** Checks for updates. When `fromUser` is true, a dialog tells the user the outcome. */
export function checkForUpdates(fromUser = false): Promise<void> {
  if (!app.isPackaged) {
    if (fromUser) dialog.showMessageBox({ message: 'Updates are disabled in development.' })
    return Promise.resolve()
  }
  // A check is already running (e.g. the periodic one): wait for it instead of starting another
  running ??= check(fromUser).finally(() => {
    running = null
  })
  return running
}

async function check(fromUser: boolean): Promise<void> {
  if (!isLicenseActive()) {
    setStatus({ state: 'license-required' })
    if (fromUser) dialog.showMessageBox({ message: 'Activate your license to get updates.' })
    return
  }

  try {
    if (pinned) restoreFeed()
    const result = await autoUpdater.checkForUpdates()
    if (!result?.isUpdateAvailable) {
      if (fromUser) {
        dialog.showMessageBox({ message: `${app.getName()} ${app.getVersion()} is up to date.` })
      }
      return
    }

    const { version } = result.updateInfo
    const allowed = await checkVersionAllowed(version)
    if (allowed.allowed === null) {
      throw new Error(
        `Could not check that your license includes version ${version} (${allowed.reason}).`
      )
    }
    if (allowed.allowed) {
      await autoUpdater.downloadUpdate()
      return
    }

    // Not included: fall back to the latest version the license includes, if newer than this one
    const latest = allowed.latestAllowedVersion
    if (latest && compareVersions(latest, app.getVersion()) > 0 && pinFeed(latest)) {
      const pinnedResult = await autoUpdater.checkForUpdates()
      if (
        pinnedResult?.isUpdateAvailable &&
        compareVersions(pinnedResult.updateInfo.version, latest) === 0
      ) {
        await autoUpdater.downloadUpdate()
        return
      }
    }

    setStatus({ state: 'not-allowed', version, latestAllowedVersion: latest })
    if (fromUser) await showNotAllowedDialog(version, latest)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    setStatus({ state: 'error', message })
    if (fromUser)
      dialog.showMessageBox({ type: 'error', message: 'Update failed', detail: message })
  }
}

async function showNotAllowedDialog(version: string, latest: string | null): Promise<void> {
  const included =
    latest && compareVersions(latest, app.getVersion()) <= 0
      ? `Your license includes updates up to version ${latest}.`
      : 'Your license does not include it.'
  const buttons = ['OK', 'Manage License', ...(PURCHASE_URL ? ['Upgrade License'] : [])]
  const { response } = await dialog.showMessageBox({
    message: `${app.getName()} ${version} is available`,
    detail: `${included} Upgrade your license to get the latest version.`,
    buttons,
    defaultId: 0,
    cancelId: 0
  })
  if (response === 1) openLicensePortal()
  if (response === 2) openPurchasePage()
}

/** The `publish` options of electron-builder.ts, written to app-update.yml at packaging. */
function readPublishConfig(): Record<string, string | boolean> | null {
  try {
    const text = readFileSync(join(process.resourcesPath, 'app-update.yml'), 'utf8')
    const entries = text.split('\n').flatMap((line) => {
      const match = line.match(/^(\w+):\s*['"]?(.*?)['"]?\s*$/)
      // Nested values (e.g. the `publisherName` list) are skipped: only flat options are needed
      if (!match?.[2]) return []
      const value = match[2] === 'true' ? true : match[2] === 'false' ? false : match[2]
      return [[match[1], value] as const]
    })
    return Object.fromEntries(entries)
  } catch {
    return null
  }
}

/**
 * Points the updater at the files of one GitHub release, to download that version instead of the
 * latest. Returns false when it is not possible (another provider, or a private repository).
 */
function pinFeed(version: string): boolean {
  const config = readPublishConfig()
  if (config?.provider !== 'github' || config.private === true) return false
  const host = typeof config.host === 'string' && config.host ? config.host : 'github.com'
  const tag = config.vPrefixedTagName === false ? version : `v${version}`
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: `https://${host}/${config.owner}/${config.repo}/releases/download/${tag}`
  })
  pinned = true
  return true
}

function restoreFeed(): void {
  const config = readPublishConfig()
  if (!config) return
  // biome-ignore lint/suspicious/noExplicitAny: the options come from electron-builder as is
  autoUpdater.setFeedURL(config as any)
  pinned = false
}

export function installUpdate(): void {
  if (status.state === 'downloaded') autoUpdater.quitAndInstall()
}
