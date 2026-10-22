import { join } from 'node:path'
import { app, BrowserWindow, type Rectangle, screen, shell } from 'electron'
import { config } from './config'
import { resourcePath } from './paths'

let mainWindow: BrowserWindow | null = null

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

/** True if the rectangle is at least partly visible on a connected display. */
function isVisible(bounds: Partial<Rectangle>): boolean {
  if (bounds.x === undefined || bounds.y === undefined) return false
  const { x, y } = bounds
  return screen.getAllDisplays().some(({ workArea }) => {
    return (
      x < workArea.x + workArea.width &&
      x + (bounds.width ?? 0) > workArea.x &&
      y < workArea.y + workArea.height &&
      y + (bounds.height ?? 0) > workArea.y
    )
  })
}

export function createMainWindow(): BrowserWindow {
  const { maximized, ...bounds } = config.get('windowBounds')

  const window = new BrowserWindow({
    ...(isVisible(bounds) ? bounds : { width: bounds.width, height: bounds.height }),
    minWidth: 400,
    minHeight: 300,
    show: false,
    // Window icon on Linux. macOS and Windows use the icon of the app bundle.
    ...(process.platform === 'linux' ? { icon: resourcePath('icon.png') } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })
  mainWindow = window

  if (maximized) window.maximize()
  window.on('ready-to-show', () => window.show())

  // Save the window size and position for the next launch
  window.on('close', () => {
    config.set('windowBounds', { ...window.getNormalBounds(), maximized: window.isMaximized() })
  })
  window.on('closed', () => {
    mainWindow = null
  })

  // Open external links in the default browser instead of a new Electron window
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // In development, load the Vite dev server URL to get hot reload.
  // In production, load the built HTML file.
  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    window.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return window
}
