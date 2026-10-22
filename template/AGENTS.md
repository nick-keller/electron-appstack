# Agent guide

Desktop app built with Electron AppStack. Read this file before changing the code.

## Stack

- **Electron** (main process, Node.js) + **electron-vite** (build, hot reload)
- **Renderer**: React 19, TanStack Router (file-based, hash history), TanStack Query, shadcn/ui, Tailwind CSS v4
- **IPC**: tRPC v11 over Electron IPC (`trpc-electron`), inputs validated with **zod**, superjson transformer
- **Database**: SQLite (`better-sqlite3`) with **Drizzle ORM**, migrations applied on startup
- **Config**: `electron-store` wrapped with a zod schema (`src/main/config`)
- **i18n**: i18next + react-i18next, JSON files in `src/shared/locales`
- **Tooling**: TypeScript (strict), Biome (lint + format), Changesets (versioning), electron-builder (packaging, auto update)
- **Source protection**: production builds compile the main process to V8 bytecode and lock the app down with Electron fuses + ASAR integrity (`build.bytecode` in `electron.vite.config.ts`, `electronFuses` in `electron-builder.ts`). Do not remove either; keep sensitive logic in the main process (the renderer is not bytecode)

## Commands

| Command | Use |
| --- | --- |
| `npm run dev` | Start the app. Renderer is hot reloaded, main and preload restart the app |
| `npm run check` / `npm run check:fix` | Lint and format check / fix (Biome) |
| `npm run typecheck` | Type check main, preload and renderer |
| `npm run db:generate` | Generate a SQL migration after editing `src/main/db/schema.ts` |
| `npm run db:reset` | Delete the development database. Quit the app first, it is recreated on next start |
| `npm run changeset` | Describe a user-facing change for the changelog |
| `npm run dist:dir` | Package the app locally (unsigned) into `dist/` |

Before finishing a task, run `npm run check:fix` then `npm run typecheck` and fix every error.

## Folder map

```
src/main/            Main process (Node.js)
  index.ts           App lifecycle
  window.ts menu.ts  Windows (main, activation, About), native menu
  updater.ts         Auto updater, gated by the license
  license/           License activation with licensemanager.dev (`config.ts` holds the product id)
  events.ts          Typed event bus, forwarded to the renderer by tRPC subscriptions
  config/            zod-validated electron-store (`config.get/set/onChange`)
  db/                Drizzle schema and client
  trpc/              tRPC setup (`trpc.ts`), root router (`router.ts`), one file per router in `routers/`
src/preload/         Only exposes tRPC. Do not add anything here
src/shared/          Code imported by both main and renderer: zod schemas, types, translations
src/renderer/src/    React app
  routes/            TanStack Router file routes (`routeTree.gen.ts` is generated, never edit it)
  components/ui/     shadcn/ui components (added with the shadcn CLI)
  lib/               tRPC client, i18n, theme, helpers
src/renderer/public/ Static files, referenced with `publicUrl('images/x.png')`
drizzle/             Generated SQL migrations. Never edit a migration that has been released
build/               Packaging assets: app icon, DMG background, entitlements (not shipped in the app)
resources/           Files used at runtime by the main process, read with `resourcePath()`
scripts/             Development scripts (not shipped in the app)
```

## Rules

- The renderer never uses Node.js or Electron APIs. Everything goes through a tRPC procedure.
  Do not expose new globals from the preload script.
- Validate every procedure input with zod. Put schemas used by both sides in `src/shared/`.
- Renderer data fetching uses TanStack Query with the tRPC options proxy:
  `useQuery(trpc.todos.list.queryOptions())`, `useMutation(trpc.todos.create.mutationOptions())`.
  Invalidate with `queryClient.invalidateQueries({ queryKey: trpc.todos.list.queryKey() })`.
- Procedures behind the license use `licensedProcedure` instead of `publicProcedure`: they refuse to
  run while the license is not active. Never send the full license key to the renderer.
- Subscriptions must not return a bare async generator: use `appEventSubscription()` or wrap the
  generator with `ipcIterable()` (see `src/main/trpc/trpc.ts`).
- Every user-visible string in the renderer goes through `t()`; add keys to **every** locale in
  `src/shared/locales/<lang>/`. Native menu labels live in `menu.json`.
- Use shadcn/ui components and Tailwind classes; do not write custom CSS unless necessary.
  Colors come from the theme variables (`bg-background`, `text-muted-foreground`…) so dark mode works.
- Imports: `@renderer/*` (renderer), `@shared/*` (both). The renderer may import **types only** from `@main/*`.
- Code style is enforced by Biome: single quotes, no semicolons, 2 spaces, 100 columns.
- Every user-facing change needs a changeset. Create it yourself, without being asked, as part of the
  task: write `.changeset/<name>.md` directly (`npm run changeset` is interactive). See the `release`
  skill for the format. Never edit `version` in `package.json` or `CHANGELOG.md` by hand.

## Skills

Step-by-step guides for common tasks are in `.claude/skills/`:
`add-trpc-procedure`, `add-db-table`, `add-route`, `add-translation`, `add-ui-component`,
`add-config-key`, `release`.
