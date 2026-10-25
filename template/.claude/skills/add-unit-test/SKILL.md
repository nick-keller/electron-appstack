---
name: add-unit-test
description: Write or update Vitest unit tests for main process or shared code (tRPC procedures, database queries, helpers). Use when adding tests, when changing logic that has tests, or when a test fails.
---

# Write a unit test

Tests use [Vitest](https://vitest.dev/) and run in Node.js, not Electron. Example:
`src/main/trpc/routers/todos.test.ts`.

1. Create `<file>.test.ts` next to the file under test (`todos.ts` -> `todos.test.ts`). Only
   `src/**/*.test.ts` files are run (`vitest.config.ts`).
2. Import the test API explicitly: `import { beforeEach, describe, expect, it, vi } from 'vitest'`.
3. Test a tRPC router through a caller, with a fresh in-memory database (all migrations applied)
   for each test:

   ```ts
   import { createTestContext } from '../../test/context'
   import { todosRouter } from './todos'

   let todos: ReturnType<typeof todosRouter.createCaller>
   beforeEach(() => {
     todos = todosRouter.createCaller(createTestContext())
   })

   it('creates a todo', async () => {
     expect(await todos.create({ title: 'Buy milk' })).toMatchObject({ title: 'Buy milk' })
   })
   ```

   Keep `ctx.db` from `createTestContext()` to insert rows or read them back directly with Drizzle,
   e.g. to set a column the procedures do not expose. Invalid input rejects:
   `await expect(todos.create({ title: '' })).rejects.toThrow()`.
4. Plain functions (helpers, zod schemas in `src/shared/`) are tested by calling them, no context needed.
5. Run `npm test` (or `npm run test:watch` while working) and fix every failure.

## Electron APIs

`src/main/test/setup.ts` runs before every test file. It replaces:
- `electron` with a stub that only has `app.isPackaged`, `app.getAppPath()`, `app.getPath()`, `app.on()`
- `electron-store` with an in-memory store, so `config` works and never touches the disk

When the code under test needs another Electron API (`shell`, `dialog`, `BrowserWindow`…), or a
module should behave differently, mock it in the test file. `vi.mock` is hoisted above the imports:

```ts
import { isLicenseActive } from '../../license'

vi.mock('../../license', () => ({ isLicenseActive: vi.fn(() => true) }))

it('refuses to run while the license is not active', async () => {
  vi.mocked(isLicenseActive).mockReturnValueOnce(false)
  await expect(todos.list()).rejects.toMatchObject({ code: 'FORBIDDEN' })
})
```

Add a stub to `setup.ts` instead only when many test files need it.

Rules:
- Tests must not depend on each other or on their order: create the data each test needs.
- Never open the real database (`getDb()`) or call the network in a test.
- Renderer code (React components) is not covered by this setup: it would need a DOM environment
  (`jsdom`) and React Testing Library. Keep logic out of components, in `src/shared/` or the main
  process, so it can be tested here.
- Tests run in CI (`.github/workflows/ci.yml`) on every pull request.
