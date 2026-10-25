import { tmpdir } from 'node:os'
import { vi } from 'vitest'

// Unit tests run in Node.js, where the `electron` module is only the path of the Electron binary.
// Modules that use Electron APIs when they are imported get this stub instead. Mock any other API
// a test needs in the test file itself.
vi.mock('electron', () => ({
  app: {
    isPackaged: false,
    getAppPath: () => process.cwd(),
    getPath: () => tmpdir(),
    on: () => {}
  }
}))

// The app config is kept in memory, so tests never read or write a config file
vi.mock('electron-store', () => ({
  default: class {
    store: Record<string, unknown> = {}
    path = ''
    set(key: string, value: unknown) {
      this.store[key] = value
    }
  }
}))
