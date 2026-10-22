// Deletes the development database. It is recreated and migrated on the next app start.
//
// Resolves the same folder as `app.getPath('userData')` in src/main/db/client.ts: the platform
// app data folder followed by `productName` (or `name`) from package.json.

import { readFileSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const pkg = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8'))

function appDataPath() {
  switch (process.platform) {
    case 'darwin':
      return join(homedir(), 'Library', 'Application Support')
    case 'win32':
      return process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming')
    default:
      return process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config')
  }
}

const databasePath = join(appDataPath(), pkg.productName ?? pkg.name, 'app.db')

// WAL mode keeps two extra files next to the database
for (const suffix of ['', '-wal', '-shm']) {
  rmSync(databasePath + suffix, { force: true })
}

console.log(`Deleted ${databasePath}`)
