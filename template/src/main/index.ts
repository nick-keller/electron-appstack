import { app, BrowserWindow, nativeTheme } from 'electron'
import { createIPCHandler } from 'trpc-electron/main'
import { config } from './config'
import { closeDb, getDb } from './db/client'
import { appEvents } from './events'
import { updateMenu } from './menu'
import { appRouter } from './trpc/router'
import { createContext } from './trpc/trpc'
import { setupAutoUpdater } from './updater'
import { createMainWindow, getMainWindow } from './window'

// Only one instance of the app can run at a time: focus the existing window instead
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const window = getMainWindow()
    if (!window) return
    if (window.isMinimized()) window.restore()
    window.focus()
  })

  app.whenReady().then(() => {
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

    const ipcHandler = createIPCHandler({ router: appRouter, createContext })
    ipcHandler.attachWindow(createMainWindow())

    // On macOS, re-create a window when the dock icon is clicked and no windows are open
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) ipcHandler.attachWindow(createMainWindow())
    })

    setupAutoUpdater()
  })

  // Quit when all windows are closed, except on macOS
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('will-quit', () => closeDb())
}
