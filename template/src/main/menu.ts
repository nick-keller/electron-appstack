import { resolveLanguage, resources } from '@shared/i18n'
import { app, Menu, type MenuItemConstructorOptions, shell } from 'electron'
import { config } from './config'
import { appEvents } from './events'
import { checkForUpdates } from './updater'

const isMac = process.platform === 'darwin'

/** Builds the native menu. Call it again when the theme or language changes. */
export function updateMenu(): void {
  const language = resolveLanguage(config.get('language'), app.getLocale())
  const t = resources[language].menu
  const theme = config.get('theme')

  const openSettings: MenuItemConstructorOptions = {
    label: t.settings,
    accelerator: 'CmdOrCtrl+,',
    click: () => appEvents.emit('navigate', '/settings')
  }
  const checkUpdates: MenuItemConstructorOptions = {
    label: t.checkForUpdates,
    click: () => checkForUpdates(true)
  }

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              checkUpdates,
              { type: 'separator' },
              openSettings,
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          } satisfies MenuItemConstructorOptions
        ]
      : []),
    {
      label: t.file,
      submenu: isMac
        ? [{ role: 'close' }]
        : [openSettings, checkUpdates, { type: 'separator' }, { role: 'quit' }]
    },
    { label: t.edit, role: 'editMenu' },
    {
      label: t.view,
      submenu: [
        {
          label: t.appearance,
          submenu: (['system', 'light', 'dark'] as const).map((value) => ({
            label: t[value],
            type: 'radio',
            checked: theme === value,
            click: () => config.set('theme', value)
          }))
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    { label: t.window, role: 'windowMenu' },
    {
      label: t.help,
      role: 'help',
      submenu: [
        {
          label: t.learnMore,
          click: () => shell.openExternal('https://electron-appstack.com')
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
