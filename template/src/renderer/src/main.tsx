import './styles.css'
import { resolveLanguage } from '@shared/i18n'
import { QueryClientProvider } from '@tanstack/react-query'
import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initI18n } from './lib/i18n'
import { syncColorScheme } from './lib/theme'
import { queryClient, trpc, trpcClient } from './lib/trpc'
import { routeTree } from './routeTree.gen'

// Hash history: the production build is loaded from a file:// URL, where paths cannot be used
const router = createRouter({
  routeTree,
  history: createHashHistory(),
  context: { queryClient },
  defaultPreload: 'intent',
  // Loaders use TanStack Query, which has its own cache
  defaultPreloadStaleTime: 0,
  scrollRestoration: true
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

syncColorScheme()

// Load the config before the first render, so the UI starts in the right language
const [config, info] = await Promise.all([
  trpcClient.config.get.query(),
  trpcClient.app.info.query()
])
queryClient.setQueryData(trpc.config.get.queryKey(), config)
queryClient.setQueryData(trpc.app.info.queryKey(), info)
await initI18n(resolveLanguage(config.language, info.locale))

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
