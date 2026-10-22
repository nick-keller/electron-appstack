---
name: add-config-key
description: Add a persisted app setting (user preference) stored with electron-store and validated by zod. Use for settings, preferences and small app state that must survive restarts.
---

# Add a config key

Config is a JSON file (`config.json` in the user data folder) validated by the zod schema in
`src/shared/config.ts`. Use the database instead for lists or large data.

1. Add the key to `configSchema` in `src/shared/config.ts`. **It must have a `.default()`**: it is
   used on first launch and when the stored value is invalid.

   ```ts
   sidebarOpen: z.boolean().default(true)
   ```

2. Main process: `config.get('sidebarOpen')`, `config.set('sidebarOpen', false)`,
   `config.onChange('sidebarOpen', (value, previous) => {})`.
3. To change it from the renderer, add a mutation in `src/main/trpc/routers/config.ts`:

   ```ts
   setSidebarOpen: publicProcedure.input(z.boolean()).mutation(({ ctx, input }) => {
     ctx.config.set('sidebarOpen', input)
   })
   ```

4. Read it in the renderer with `useSuspenseQuery(trpc.config.get.queryOptions())`. It stays up
   to date: every change is pushed to the renderer by the `config.onChange` subscription.
