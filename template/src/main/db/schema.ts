import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// After changing this file, run `npm run db:generate` to create a migration.
// Migrations are applied automatically when the app starts.

export const todos = sqliteTable('todos', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  done: integer({ mode: 'boolean' }).notNull().default(false),
  createdAt: integer({ mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch('subsec') * 1000)`)
})
