import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { todos } from '../../db/schema'
import { publicProcedure, router } from '../trpc'

export const todosRouter = router({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.select().from(todos).orderBy(desc(todos.createdAt)).all()
  ),

  create: publicProcedure
    .input(z.object({ title: z.string().trim().min(1).max(200) }))
    .mutation(({ ctx, input }) => ctx.db.insert(todos).values(input).returning().get()),

  setDone: publicProcedure
    .input(z.object({ id: z.number().int(), done: z.boolean() }))
    .mutation(({ ctx, input }) => {
      ctx.db.update(todos).set({ done: input.done }).where(eq(todos.id, input.id)).run()
    }),

  delete: publicProcedure.input(z.object({ id: z.number().int() })).mutation(({ ctx, input }) => {
    ctx.db.delete(todos).where(eq(todos.id, input.id)).run()
  })
})
