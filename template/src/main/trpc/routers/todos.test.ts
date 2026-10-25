import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AppDatabase } from '../../db/client'
import { todos as todosTable } from '../../db/schema'
import { isLicenseActive } from '../../license'
import { createTestContext } from '../../test/context'
import { todosRouter } from './todos'

// Replaces the license module, so each test can choose whether the license is active
vi.mock('../../license', () => ({ isLicenseActive: vi.fn(() => true) }))

describe('todos router', () => {
  let db: AppDatabase
  let todos: ReturnType<typeof todosRouter.createCaller>

  beforeEach(() => {
    const ctx = createTestContext()
    db = ctx.db
    todos = todosRouter.createCaller(ctx)
  })

  it('creates a todo with a trimmed title', async () => {
    const todo = await todos.create({ title: '  Buy milk  ' })

    expect(todo).toMatchObject({ title: 'Buy milk', done: false })
    expect(todo.createdAt).toBeInstanceOf(Date)
  })

  it('refuses an empty title', async () => {
    await expect(todos.create({ title: '   ' })).rejects.toThrow()
    expect(await todos.list()).toEqual([])
  })

  it('lists the newest todos first', async () => {
    // Rows can also be written to the database directly, e.g. to set columns the procedures don't
    db.insert(todosTable)
      .values([
        { title: 'First', createdAt: new Date('2026-01-01') },
        { title: 'Second', createdAt: new Date('2026-01-02') }
      ])
      .run()

    const titles = (await todos.list()).map((todo) => todo.title)
    expect(titles).toEqual(['Second', 'First'])
  })

  it('marks a todo as done', async () => {
    const { id } = await todos.create({ title: 'Buy milk' })

    await todos.setDone({ id, done: true })

    expect(await todos.list()).toMatchObject([{ id, done: true }])
  })

  it('deletes a todo', async () => {
    const { id } = await todos.create({ title: 'Buy milk' })

    await todos.delete({ id })

    expect(await todos.list()).toEqual([])
  })

  it('refuses to run while the license is not active', async () => {
    vi.mocked(isLicenseActive).mockReturnValueOnce(false)

    await expect(todos.list()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})
