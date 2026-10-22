import type { UpdateStatus } from '@shared/updater'
import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import { appEvents } from './events'

// Updates are downloaded from the `publish` provider set in electron-builder.yml (GitHub
// Releases by default). On macOS, auto update only works for signed apps.

let status: UpdateStatus = { state: 'idle' }
let interactive = false

function setStatus(next: UpdateStatus): void {
  status = next
  appEvents.emit('updateStatus', next)
}

export function getUpdateStatus(): UpdateStatus {
  return status
}

export function setupAutoUpdater(): void {
  if (!app.isPackaged) return

  autoUpdater.autoDownload = true
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
  autoUpdater.on('update-not-available', () => {
    setStatus({ state: 'not-available' })
    if (interactive) {
      dialog.showMessageBox({ message: `${app.getName()} ${app.getVersion()} is up to date.` })
    }
  })
  autoUpdater.on('error', (error) => setStatus({ state: 'error', message: error.message }))

  void checkForUpdates()
  // Check again every 4 hours
  setInterval(() => void checkForUpdates(), 4 * 60 * 60 * 1000)
}

/** Checks for updates. When `fromUser` is true, a dialog tells the user if there is none. */
export async function checkForUpdates(fromUser = false): Promise<void> {
  interactive = fromUser
  if (!app.isPackaged) {
    if (fromUser) dialog.showMessageBox({ message: 'Updates are disabled in development.' })
    return
  }
  try {
    await autoUpdater.checkForUpdates()
  } catch {
    // Already reported through the `error` event
  }
}

export function installUpdate(): void {
  if (status.state === 'downloaded') autoUpdater.quitAndInstall()
}
