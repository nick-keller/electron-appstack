---
name: add-db-table
description: Add or change a SQLite table or column with Drizzle ORM and generate the migration. Use for any change to the database schema.
---

# Change the database schema

1. Edit `src/main/db/schema.ts` (Drizzle `sqliteTable`). Column names are inferred from the keys.
   Booleans: `integer({ mode: 'boolean' })`, dates: `integer({ mode: 'timestamp_ms' })`.
2. Run `npm run db:generate -- --name <short_description>`. It writes a SQL file and a snapshot in `drizzle/`.
3. Review the SQL. SQLite cannot alter some columns: drizzle-kit may recreate the table, check the
   data copy is correct.
4. Restart `npm run dev`: migrations are applied automatically on startup (`src/main/db/client.ts`).
5. Expose the data with tRPC procedures (see the `add-trpc-procedure` skill).

Rules:
- Never edit or delete a migration that has been released: users already applied it. Create a new one.
- Commit the `drizzle/` folder, including `meta/`.
- The database file is `app.db` in the user data folder (`app.getPath('userData')`).
  Delete it to start from scratch in development.
