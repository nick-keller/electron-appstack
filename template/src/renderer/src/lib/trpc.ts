import type { AppRouter } from '@main/trpc/router'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import superjson from 'superjson'
import { ipcLink } from 'trpc-electron/renderer'

export const queryClient = new QueryClient({
  defaultOptions: {
    // IPC calls do not fail because of the network: retrying would only delay errors
    queries: { retry: false },
    mutations: { retry: false }
  }
})

/** Plain tRPC client, for calls outside React (e.g. before the first render). */
export const trpcClient = createTRPCClient<AppRouter>({
  links: [ipcLink({ transformer: superjson })]
})

/** TanStack Query helpers: `useQuery(trpc.todos.list.queryOptions())`. */
export const trpc = createTRPCOptionsProxy<AppRouter>({ client: trpcClient, queryClient })
