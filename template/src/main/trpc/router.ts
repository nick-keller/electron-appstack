import { appRouter as app } from './routers/app'
import { configRouter } from './routers/config'
import { licenseRouter } from './routers/license'
import { todosRouter } from './routers/todos'
import { updaterRouter } from './routers/updater'
import { router } from './trpc'

export const appRouter = router({
  app,
  config: configRouter,
  license: licenseRouter,
  todos: todosRouter,
  updater: updaterRouter
})

/** Imported (type only) by the renderer to get a fully typed client. */
export type AppRouter = typeof appRouter
