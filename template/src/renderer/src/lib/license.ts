import { trpc } from '@renderer/lib/trpc'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSubscription } from '@trpc/tanstack-react-query'
import type { TFunction } from 'i18next'

/**
 * The license info, kept up to date with the main process. Refetched every minute too, since the
 * offline time left decreases without any event.
 */
export function useLicense() {
  const queryClient = useQueryClient()
  const query = useQuery({ ...trpc.license.info.queryOptions(), refetchInterval: 60_000 })

  useSubscription(
    trpc.license.onChange.subscriptionOptions(undefined, {
      onData: (info) => queryClient.setQueryData(trpc.license.info.queryKey(), info)
    })
  )

  return query.data
}

/** A duration for people: "3 days", "5 hours", "20 minutes". */
export function formatDuration(ms: number, t: TFunction): string {
  const minutes = Math.max(0, Math.floor(ms / 60_000))
  if (minutes >= 2 * 24 * 60) return t('duration.days', { count: Math.floor(minutes / (24 * 60)) })
  if (minutes >= 2 * 60) return t('duration.hours', { count: Math.floor(minutes / 60) })
  return t('duration.minutes', { count: minutes })
}
