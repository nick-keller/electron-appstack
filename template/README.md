# Electron App

A desktop app created from [Electron AppStack](https://electron-appstack.com).

## Getting started

Requires Node.js 22.12 or later.

```sh
npm install
npm run dev
```

`npm install` also downloads the Electron binary for your platform and prepares native modules (see the `postinstall` script).

## Stack

- [Electron](https://www.electronjs.org/) and [electron-vite](https://electron-vite.org/), with hot reload of the renderer and automatic restart of the main process
- [React](https://react.dev/), [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query), [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/)
- [tRPC](https://trpc.io/) over Electron IPC with [zod](https://zod.dev/) validation
- [SQLite](https://github.com/WiseLibs/better-sqlite3) with [Drizzle ORM](https://orm.drizzle.team/), migrations applied on startup
- App config with [electron-store](https://github.com/sindresorhus/electron-store), validated by zod
- Light, dark and system themes, from the menu or the settings page
- Translations with [i18next](https://www.i18next.com/)
- [Biome](https://biomejs.dev/) for linting and formatting
- [Changesets](https://github.com/changesets/changesets) for versions and changelog
- [electron-builder](https://www.electron.build/) with GitHub Actions to build, sign, notarize and publish, and auto update
- License keys with [licensemanager.dev](https://licensemanager.dev): activation window, offline use, license details in the About window, and updates limited to the versions the license includes. Disabled until you set your product id in `src/main/license/config.ts` (see [Licensing](https://electron-appstack.com/doc/licensing))
- Source code protection: main process shipped as V8 bytecode, locked down with Electron fuses and ASAR integrity
- `AGENTS.md` and skills in `.claude/skills/` so coding agents follow the conventions

## Scripts

| Script                  | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Start the app in development mode                        |
| `npm run build`         | Type check and build the app into `out/`                 |
| `npm run preview`       | Run the production build locally                         |
| `npm run typecheck`     | Type check the main, preload and renderer code           |
| `npm run check`         | Lint and check formatting (`check:fix` to fix)           |
| `npm run db:generate`   | Generate a SQL migration from `src/main/db/schema.ts`    |
| `npm run db:reset`      | Delete the development database (quit the app first)     |
| `npm run dist`          | Build installers for the current platform into `dist/`   |
| `npm run dist:dir`      | Build an unpacked app into `dist/` (faster, for testing) |
| `npm run changeset`     | Describe a change for the next release                   |

## Project structure

```
├── .changeset/           # Pending changelog entries
├── .claude/skills/       # Guides for coding agents
├── .github/workflows/    # CI and release
├── build/                # Icons, DMG background, entitlements (packaging only)
├── drizzle/              # SQL migrations (generated)
├── resources/            # Runtime files for the main process
├── scripts/              # Development scripts
└── src/
    ├── main/             # Main process: windows, menu, tRPC routers, database, config, updater, license
    ├── preload/          # Exposes tRPC to the renderer
    ├── shared/           # Code and translations shared by main and renderer
    └── renderer/         # React app (routes, components, public/images)
```

## Next steps

- Rename the app: `name` and `productName` in `package.json`, `appId` and `publish` in `electron-builder.ts`, `<title>` in `src/renderer/index.html`
- Replace `build/icon.png` and `build/background*.png`
- Set up the release secrets (see the [release documentation](https://electron-appstack.com/releasing))
- Read the documentation at [electron-appstack.com](https://electron-appstack.com)
