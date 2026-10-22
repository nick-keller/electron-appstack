import Store from 'electron-store'
import type { z } from 'zod'

type Listener<T> = (value: T, previous: T) => void

/**
 * A zod-validated wrapper around electron-store.
 *
 * - Every key of the schema must have a `.default()`.
 * - Values are validated on write; invalid stored values (e.g. after a schema change) are reset
 *   to their default on load instead of crashing the app.
 * - Values are cached in memory, reads never hit the disk.
 */
export function createTypedStore<Schema extends z.ZodObject>(
  schema: Schema,
  options: { name?: string } = {}
) {
  type Data = z.infer<Schema>
  type Key = keyof Data & string

  const shape = schema.shape as Record<Key, z.ZodType>
  const store = new Store<Record<string, unknown>>({ name: options.name ?? 'config' })
  const listeners = new Map<Key, Set<Listener<never>>>()
  const anyListeners = new Set<(data: Data) => void>()

  // Throws at startup if a key has no default
  const defaults = schema.parse({}) as Data

  function load(): Data {
    const raw = store.store
    const result = schema.safeParse(raw)
    if (result.success) return result.data as Data

    // Keep valid keys, reset invalid ones to their default
    const repaired = { ...defaults }
    for (const key of Object.keys(shape) as Key[]) {
      const value = shape[key].safeParse(raw[key])
      if (value.success) repaired[key] = value.data as Data[Key]
    }
    store.store = repaired
    return repaired
  }

  let data = load()

  return {
    get<K extends Key>(key: K): Data[K] {
      return data[key]
    },

    getAll(): Data {
      return data
    },

    set<K extends Key>(key: K, value: Data[K]): void {
      const previous = data[key]
      const parsed = shape[key].parse(value) as Data[K]
      data = { ...data, [key]: parsed }
      store.set(key, parsed)
      for (const listener of listeners.get(key) ?? []) {
        ;(listener as Listener<Data[K]>)(parsed, previous)
      }
      for (const listener of anyListeners) listener(data)
    },

    reset<K extends Key>(key: K): void {
      this.set(key, defaults[key])
    },

    /** Calls `listener` every time `key` is set. Returns an unsubscribe function. */
    onChange<K extends Key>(key: K, listener: Listener<Data[K]>): () => void {
      const set = listeners.get(key) ?? new Set()
      set.add(listener as Listener<never>)
      listeners.set(key, set)
      return () => set.delete(listener as Listener<never>)
    },

    /** Calls `listener` with the whole config every time any key is set. */
    onAnyChange(listener: (data: Data) => void): () => void {
      anyListeners.add(listener)
      return () => anyListeners.delete(listener)
    },

    /** Absolute path of the JSON file. */
    path: store.path
  }
}
