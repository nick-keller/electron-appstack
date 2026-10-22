import { LicenseBanner } from '@renderer/components/license-banner'
import { UpdateBanner } from '@renderer/components/update-banner'
import { i18n } from '@renderer/lib/i18n'
import { trpc } from '@renderer/lib/trpc'
import { resolveLanguage } from '@shared/i18n'
import type { QueryClient } from '@tanstack/react-query'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useMatches,
  useNavigate
} from '@tanstack/react-router'
import { useSubscription } from '@trpc/tanstack-react-query'
import { useTranslation } from 'react-i18next'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    /** Rendered without the navigation, in its own window (e.g. activation, About) */
    standalone?: boolean
  }
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout
})

function RootLayout() {
  const queryClient = useQueryClient()
  const { data: info } = useQuery(trpc.app.info.queryOptions())
  const standalone = useMatches({
    select: (matches) => matches.some((match) => match.staticData.standalone)
  })

  // Config changed (from the menu or this window): update the cache and the language
  useSubscription(
    trpc.config.onChange.subscriptionOptions(undefined, {
      onData: (config) => {
        queryClient.setQueryData(trpc.config.get.queryKey(), config)
        i18n.changeLanguage(resolveLanguage(config.language, info?.locale ?? 'en'))
      }
    })
  )

  return standalone ? <Outlet /> : <MainLayout />
}

function MainLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Navigation requested by the main process (e.g. "Settings…" in the native menu)
  useSubscription(
    trpc.app.onNavigate.subscriptionOptions(undefined, { onData: (to) => navigate({ to }) })
  )

  return (
    <div className="flex h-screen flex-col">
      <nav className="flex items-center gap-4 border-b px-4 py-2 text-sm">
        <Link
          to="/"
          className="text-muted-foreground [&.active]:font-medium [&.active]:text-foreground"
        >
          {t('nav.home')}
        </Link>
        <Link
          to="/settings"
          className="text-muted-foreground [&.active]:font-medium [&.active]:text-foreground"
        >
          {t('nav.settings')}
        </Link>
      </nav>
      <LicenseBanner />
      <UpdateBanner />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
