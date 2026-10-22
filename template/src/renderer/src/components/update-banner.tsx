import { Button } from '@renderer/components/ui/button'
import { useLicense } from '@renderer/lib/license'
import { trpc } from '@renderer/lib/trpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSubscription } from '@trpc/tanstack-react-query'
import { useTranslation } from 'react-i18next'

/**
 * Shown when an update has been downloaded and is ready to install, or when a newer version exists
 * but the license does not include it.
 */
export function UpdateBanner() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const license = useLicense()
  const { data: status } = useQuery(trpc.updater.status.queryOptions())
  const install = useMutation(trpc.updater.install.mutationOptions())
  const openPortal = useMutation(trpc.license.openPortal.mutationOptions())
  const openPurchasePage = useMutation(trpc.license.openPurchasePage.mutationOptions())

  useSubscription(
    trpc.updater.onStatus.subscriptionOptions(undefined, {
      onData: (next) => queryClient.setQueryData(trpc.updater.status.queryKey(), next)
    })
  )

  if (status?.state === 'not-allowed') {
    const canPurchase = license?.enabled && license.purchaseUrl
    return (
      <div className="flex items-center justify-between gap-4 border-b bg-muted px-4 py-2 text-sm">
        <span>{t('update.notAllowed', { version: status.version })}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => (canPurchase ? openPurchasePage.mutate() : openPortal.mutate())}
        >
          {canPurchase ? t('license.upgrade') : t('license.manage')}
        </Button>
      </div>
    )
  }

  if (status?.state !== 'downloaded') return null

  return (
    <div className="flex items-center justify-between gap-4 border-b bg-muted px-4 py-2 text-sm">
      <span>{t('update.downloaded', { version: status.version })}</span>
      <Button size="sm" onClick={() => install.mutate()}>
        {t('update.restart')}
      </Button>
    </div>
  )
}
