import { defineConfig } from 'drizzle-kit'

// Only used by `npm run db:generate` to create SQL migrations in `drizzle/`.
// Migrations are applied automatically when the app starts (see src/main/db/client.ts).
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/main/db/schema.ts',
  out: './drizzle'
})
