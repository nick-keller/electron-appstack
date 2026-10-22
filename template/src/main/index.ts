import { app, BrowserWindow, nativeTheme } from 'electron'
import { config } from './config'
import { closeDb, getDb } from './db/client'
import { appEvents } from './events'
import { isLicenseActive, setupLicense, waitForLicense } from './license'
import { updateMenu } from './menu'
import { setupAutoUpdater } from './updater'
import { focusAppWindow, showAppWindow } from './window'

// Only one instance of the app can run at a time: focus the existing window instead
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => focusAppWindow())

  app.whenReady().then(async () => {
    // Apply pending database migrations before anything can query the database
    getDb()

    // `themeSource` also drives `prefers-color-scheme` in the renderer
    nativeTheme.themeSource = config.get('theme')
    for (const key of ['theme', 'language'] as const) {
      config.onChange(key, () => {
        nativeTheme.themeSource = config.get('theme')
        updateMenu()
      })
    }
    config.onAnyChange((data) => appEvents.emit('configChanged', data))

    updateMenu()

    // Open the main window if the license is active, the activation window otherwise. Without a
    // stored token, validating online can take a while: after a short wait, the activation window
    // shows that the license is being checked, and is replaced once it is.
    setupLicense()
    await waitForLicense(1500)
    showAppWindow()
    let unlocked = isLicenseActive()
    appEvents.on('licenseChanged', () => {
      if (isLicenseActive() === unlocked) return
      unlocked = isLicenseActive()
      showAppWindow()
    })

    // On macOS, re-create a window when the dock icon is clicked and no windows are open
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) showAppWindow()
    })

    setupAutoUpdater()
  })

  // Quit when all windows are closed, except on macOS
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('will-quit', () => closeDb())
}
