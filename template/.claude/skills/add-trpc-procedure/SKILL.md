---
name: add-trpc-procedure
description: Add a query, mutation or subscription that the renderer can call in the main process (tRPC over Electron IPC). Use whenever the renderer needs data or an action from Node.js, Electron, the database or the file system.
---

# Add a tRPC procedure

1. Pick the router in `src/main/trpc/routers/` (or create `<name>.ts` and register it in
   `src/main/trpc/router.ts`).
2. Add the procedure. Validate input with zod; reuse or add schemas in `src/shared/` if the
   renderer also needs them.

   ```ts
   import { z } from 'zod'
   import { publicProcedure, router } from '../trpc'

   export const notesRouter = router({
     byId: publicProcedure
       .input(z.object({ id: z.number().int() }))
       .query(({ ctx, input }) => ctx.db.query.notes.findFirst({ where: (n, { eq }) => eq(n.id, input.id) })),
     rename: publicProcedure
       .input(z.object({ id: z.number().int(), title: z.string().min(1) }))
       .mutation(({ ctx, input }) => { /* … */ })
   })
   ```

   `ctx` contains `db` (Drizzle) and `config` (typed store). Throw `TRPCError` for expected errors.
3. Subscriptions: emit an event on `appEvents` (`src/main/events.ts`, add it to `AppEvents`) and
   expose it with `appEventSubscription('eventName')`. For custom async generators, return
   `ipcIterable(generator)`: a bare async generator breaks with trpc-electron on Node.js 24.
4. Use it in the renderer:

   ```ts
   const { data } = useQuery(trpc.notes.byId.queryOptions({ id }))
   const rename = useMutation(trpc.notes.rename.mutationOptions({
     onSuccess: () => queryClient.invalidateQueries({ queryKey: trpc.notes.byId.queryKey({ id }) })
   }))
   useSubscription(trpc.app.onNavigate.subscriptionOptions(undefined, { onData: (to) => {} }))
   ```

5. Run `npm run typecheck`: the renderer types come from `AppRouter`, no codegen needed.
