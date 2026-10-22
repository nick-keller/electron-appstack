import { join } from 'node:path'
import {
  app,
  BrowserWindow,
  type BrowserWindowConstructorOptions,
  type Rectangle,
  screen,
  shell
} from 'electron'
import { createIPCHandler } from 'trpc-electron/main'
import { config } from './config'
import { isLicenseActive } from './license'
import { resourcePath } from './paths'
import { appRouter } from './trpc/router'
import { createContext } from './trpc/trpc'

let mainWindow: BrowserWindow | null = null
let activationWindow: BrowserWindow | null = null
let aboutWindow: BrowserWindow | null = null
let ipcHandler: ReturnType<typeof createIPCHandler> | null = null

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

/**
 * Creates a window that loads a route of the renderer (e.g. `/about`) and can call tRPC.
 * It is shown once its content is rendered.
 */
function createWindow(route: string, options: BrowserWindowConstructorOptions): BrowserWindow {
  const window = new BrowserWindow({
    ...options,
    show: false,
    // Window icon on Linux. macOS and Windows use the icon of the app bundle.
    ...(process.platform === 'linux' ? { icon: resourcePath('icon.png') } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  ipcHandler ??= createIPCHandler({ router: appRouter, createContext })
  ipcHandler.attachWindow(window)

  window.once('ready-to-show', () => window.show())

  // Open external links in the default browser instead of a new Electron window
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // In development, load the Vite dev server URL to get hot reload.
  // In production, load the built HTML file.
  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    window.loadURL(`${process.env.ELECTRON_RENDERER_URL}#${route}`)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'), { hash: route })
  }

  return window
}

function focus(window: BrowserWindow): void {
  if (window.isMinimized()) window.restore()
  window.focus()
}

function createMainWindow(): BrowserWindow {
  const { maximized, ...bounds } = config.get('windowBounds')

  const window = createWindow('/', {
    ...(isVisible(bounds) ? bounds : { width: bounds.width, height: bounds.height }),
    minWidth: 400,
    minHeight: 300
  })
  mainWindow = window

  if (maximized) window.maximize()

  // Save the window size and position for the next launch
  window.on('close', () => {
    config.set('windowBounds', { ...window.getNormalBounds(), maximized: window.isMaximized() })
  })
  window.on('closed', () => {
    mainWindow = null
  })

  return window
}

/** Asks for a license key, or explains why the license is not active. */
function createActivationWindow(): BrowserWindow {
  const window = createWindow('/activate', {
    width: 440,
    height: 600,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    title: app.getName()
  })
  activationWindow = window
  window.on('closed', () => {
    activationWindow = null
  })
  return window
}

/**
 * Shows the main window when the license is active (or licensing is disabled), and the activation
 * window otherwise. Called on launch, and every time the license state changes: the app locks
 * itself when the license is refused, and unlocks once it is activated.
 */
export function showAppWindow(): void {
  // The new window is created before the old one is closed, so the app does not quit in between
  if (isLicenseActive()) {
    focus(mainWindow ?? createMainWindow())
    activationWindow?.close()
  } else {
    focus(activationWindow ?? createActivationWindow())
    mainWindow?.close()
  }
}

/** Focuses the main or activation window, e.g. when a second instance of the app is launched. */
export function focusAppWindow(): void {
  const window = mainWindow ?? activationWindow
  if (window) focus(window)
  else showAppWindow()
}

/** Shows the About window: app version and license details. */
export function showAboutWindow(): void {
  if (aboutWindow) {
    focus(aboutWindow)
    return
  }
  aboutWindow = createWindow('/about', {
    width: 400,
    height: 620,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    title: `About ${app.getName()}`
  })
  aboutWindow.on('closed', () => {
    aboutWindow = null
  })
}
