import { join } from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { app } from 'electron'
import { migrationsPath } from '../paths'
import * as schema from './schema'

/** SQLite database file, in the user data folder. */
export const databasePath = join(app.getPath('userData'), 'app.db')

/** Opens a SQLite database and applies pending migrations. Tests pass `':memory:'`. */
export function openDatabase(path: string) {
  const sqlite = new Database(path)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  const db = drizzle({ client: sqlite, schema })
  migrate(db, { migrationsFolder: migrationsPath })
  return db
}

export type AppDatabase = ReturnType<typeof openDatabase>

let db: AppDatabase | undefined

/** Opens the database and applies pending migrations on first call. */
export function getDb(): AppDatabase {
  db ??= openDatabase(databasePath)
  return db
}

export function closeDb(): void {
  db?.$client.close()
  db = undefined
}
